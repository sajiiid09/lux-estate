## 1. Overall backend architecture

**Django 5.2 + DRF + SimpleJWT**, with these apps:

* `users` – custom User model + registration + JWT login and `/me` endpoint
* `properties` – categories, property model, listing, detail, DFS-based recommendations
* `bookings` – booking model + concurrency-safe booking creation + per-user booking APIs
* `payments` – payment model + strategy pattern (Stripe / bKash simulation) + initiate + webhook handlers
* `core` – currently empty URL set (placeholder)
* Project config: `lux_estate/settings.py`, `lux_estate/urls.py`

Core URL routing (`lux_estate/urls.py`):

```py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/auth/', include('users.urls')),
    path('api/', include('properties.urls')),
    path('api/bookings/', include('bookings.urls')),
    path('api/payments/', include('payments.urls')),
]
```

So the public API surface is:

* `/api/auth/...`
* `/api/properties/...`
* `/api/bookings/...`
* `/api/payments/...`

---

## 2. Auth, users, and tokens

### 2.1 User model

`users/models.py`:

```py
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    def __str__(self):
        return self.username
```

So you use Django’s standard `AbstractUser` (fields: `username`, `email`, `first_name`, `last_name`, etc.), with:

```py
AUTH_USER_MODEL = 'users.User'
```

in `settings.py`.

### 2.2 REST framework & JWT config

In `settings.py`:

```py
INSTALLED_APPS = [
    ...
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
    # Local
    'users',
    'properties',
    'bookings',
    'payments',
    'core',
]
```

DRF & SimpleJWT:

```py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
    ),
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```

So:

* **Default auth**: JWT bearer tokens.
* **Default permission**: you must be authenticated, unless a view explicitly overrides it.
* **Tokens**:

  * Access token: valid for 60 minutes.
  * Refresh token: valid for 1 day.

### 2.3 Auth endpoints

`users/urls.py`:

```py
urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserMeView.as_view(), name='auth-me'),
]
```

#### Register

`RegisterView` (CreateAPIView, `AllowAny`) + `RegisterSerializer`:

```py
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
```

* Public endpoint: `POST /api/auth/register/`

* Payload (example):

  ```json
  {
    "username": "jackdev",
    "email": "jackdev@example.com",
    "password": "jackdev123",
    "first_name": "Jack",
    "last_name": "Dev"
  }
  ```

* Creates a proper Django user with hashed password.

#### Login (get JWT tokens)

You use SimpleJWT’s built-in `TokenObtainPairView`:

* Endpoint: `POST /api/auth/login/`

* Body:

  ```json
  {
    "username": "jackdev",
    "password": "jackdev123"
  }
  ```

* Response on success:

  ```json
  {
    "refresh": "<refresh_token>",
    "access": "<access_token>"
  }
  ```

Front-end must store these and send:

```http
Authorization: Bearer <access_token>
```

on future API calls.

#### Refresh

* `POST /api/auth/refresh/` with `{"refresh": "<refresh_token>"}` → returns new access token.

#### Current user

`UserMeView` (RetrieveAPIView, `IsAuthenticated`):

```py
class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
```

* Endpoint: `GET /api/auth/me/`
* Returns `id, username, email, first_name, last_name` for whoever is authenticated.

### 2.4 “How can a superuser give auth tokens to people?”

There is **no manual token-grant UI** in the backend. Tokens are issued by **logging in** via `/api/auth/login/`.

A superuser can:

* Create users in Django admin or via `/api/auth/register/`.
* Then either:

  * Let them log in themselves to obtain tokens, or
  * Programmatically call `/api/auth/login/` on their behalf (e.g. from a tool) to get tokens.

But there is **no custom endpoint** like “/api/admin/issue-token/”. Tokens are always minted via the login endpoint (TokenObtainPairView) using `username + password`.

`rest_framework.authtoken` is installed but you’re **not** using DRF token auth anywhere; JWT is the actual mechanism.

---

## 3. Properties: models, queries, DFS recommendations

### 3.1 Models

`properties/models.py`:

**Category**

```py
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self',
        null=True, blank=True,
        related_name='children',
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
```

* Hierarchical tree (parent → children).
* Slug auto-generated if missing.

**Property**

```py
class PropertyStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    INACTIVE = "INACTIVE", "Inactive"

class Property(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    category = models.ForeignKey(Category, related_name='properties', on_delete=models.PROTECT)
    amenities = models.JSONField(blank=True, default=list)
    status = models.CharField(max_length=20, choices=PropertyStatus.choices, default=PropertyStatus.ACTIVE)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='properties/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
```

So each property:

* Belongs to a **Category** (which can be nested).
* Has `status` (ACTIVE/INACTIVE) and `is_available` (for booking).
* Has `amenities` as JSON.
* Has an image path.

### 3.2 Serializers

`PropertySerializer`:

* Exposes fields including `image_url`, computed as an absolute URL using `request.build_absolute_uri()` when possible.

```py
class PropertySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    ...
    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        image_url = obj.image.url
        if request is not None:
            return request.build_absolute_uri(image_url)
        return image_url
```

### 3.3 Views & endpoints

`properties/urls.py`:

```py
urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('properties/', PropertyListView.as_view(), name='property-list'),
    path('properties/recommended/', RecommendedPropertiesView.as_view(), name='property-recommended'),
    path('properties/<slug:slug>/', PropertyDetailView.as_view(), name='property-detail'),
]
```

#### Category list

* `GET /api/categories/` – public.

#### Property list (filterable)

`PropertyListView`:

```py
class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all().select_related("category")
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category", "status"]
```

So:

* Public endpoint.
* You can call:

  * `/api/properties/` – all properties
  * `/api/properties/?category=<category_id>`
  * `/api/properties/?status=ACTIVE`
  * Or both together.

No custom search params handled here (e.g. location) – those would require extending `get_queryset`.

#### Property detail

`PropertyDetailView`:

```py
class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.all().select_related("category")
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
```

* `GET /api/properties/<slug>/` – retrieves by slug (not ID).

#### Recommended properties (DFS + cache)

`RecommendedPropertiesView`:

```py
class RecommendedPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        category_id = self.request.query_params.get("category_id")
        if category_id is None:
            raise ValidationError("category_id query parameter is required.")

        try:
            category_id_int = int(category_id)
        except ValueError:
            raise ValidationError("category_id must be an integer.")

        return get_recommended_properties(category_id_int)
```

* Endpoint: `GET /api/properties/recommended/?category_id=<int>`

**Logic in `properties/services.py`:**

* DFS over category tree:

  ```py
  def _dfs_category_ids(category_id, visited=None):
      if visited is None:
          visited = set()
      visited.add(category_id)
      children = Category.objects.filter(parent_id=category_id).values_list('id', flat=True)
      for child_id in children:
          if child_id not in visited:
              _dfs_category_ids(child_id, visited)
      return visited
  ```

* Cached property ID set per root category:

  ```py
  def get_category_subtree_property_ids(root_category_id):
      cache_key = f"category_subtree_properties:{root_category_id}"
      property_ids = cache.get(cache_key)
      if property_ids is not None:
          return property_ids

      category_ids = _dfs_category_ids(root_category_id)
      property_ids = list(
          Property.objects.filter(
              category_id__in=category_ids,
              status=PropertyStatus.ACTIVE,
              is_available=True
          ).values_list('id', flat=True)
      )
      cache.set(cache_key, property_ids, timeout=3600)
      return property_ids
  ```

* And final query:

  ```py
  def get_recommended_properties(category_id):
      if not category_id:
          return Property.objects.none()
      property_ids = get_category_subtree_property_ids(category_id)
      return Property.objects.filter(id__in=property_ids)
  ```

**So the “query story”:**

* A recommendation request:

  1. Reads `category_id`.
  2. DFS through categories to get all child category IDs.
  3. Queries the DB once for all ACTIVE & available properties in any of those categories.
  4. Caches the property IDs for 1 hour to speed up future requests.

---

## 4. Bookings: concurrency-safe creation + per-user views

### 4.1 Model

`bookings/models.py`:

```py
class BookingStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    PAID = 'PAID', 'Paid'
    CANCELED = 'CANCELED', 'Canceled'

class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bookings', on_delete=models.CASCADE)
    property = models.ForeignKey(Property, related_name='bookings', on_delete=models.PROTECT)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_total(self):
        return self.property.price
```

### 4.2 Booking creation service (race-condition safe)

`bookings/services.py`:

```py
from django.db import transaction
from django.core.exceptions import ValidationError

from properties.models import Property, PropertyStatus
from .models import Booking, BookingStatus
import logging

logger = logging.getLogger(__name__)

def create_booking(user, property_id):
    logger.info("User %s attempting to book property %s", user.id, property_id)
    with transaction.atomic():
        try:
            prop = (
                Property.objects
                .select_for_update()
                .get(id=property_id)
            )
        except Property.DoesNotExist:
            logger.warning("Property with ID %s does not exist.", property_id)
            raise ValidationError("Property does not exist.")

        if prop.status != PropertyStatus.ACTIVE:
            logger.warning("Property %s is not active (status: %s)", property_id, prop.status)
            raise ValidationError("Property is not active.")

        if not prop.is_available:
            logger.warning("Property %s is not available for booking", property_id)
            raise ValidationError("Property is not available for booking.")

        if Booking.objects.filter(property=prop).exclude(status=BookingStatus.CANCELED).exists():
            logger.warning("Property %s already has an active booking", property_id)
            raise ValidationError("Property is not available for booking.")

        booking = Booking(user=user, property=prop)
        booking.total_amount = booking.calculate_total()
        booking.status = BookingStatus.PENDING
        booking.save()

        prop.is_available = False
        prop.save(update_fields=["is_available"])

        logger.info("Booking %s created for user %s and property %s", booking.id, user.id, property_id)
        return booking
```

Key points:

* `transaction.atomic()` + `select_for_update()` on Property:

  * **Row lock** prevents race conditions where two users try to book the same property simultaneously.
* Double-checks:

  * Property exists.
  * Property is ACTIVE.
  * `is_available` is True.
  * There is no existing non-canceled booking for this property.
* Sets `prop.is_available = False` once a booking is created.

### 4.3 Serializers & views

`BookingCreateSerializer`:

```py
class BookingCreateSerializer(serializers.Serializer):
    property_id = serializers.IntegerField()

    def create(self, validated_data):
        from .services import create_booking
        user = self.context["request"].user
        property_id = validated_data["property_id"]
        booking = create_booking(user, property_id)
        return booking

    def to_representation(self, instance):
        return BookingSerializer(instance).data
```

Views (`bookings/views.py`):

```py
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by("-created_at")

class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
```

URLs (`bookings/urls.py`):

```py
urlpatterns = [
    path("", BookingListView.as_view(), name="booking-list"),
    path("create/", BookingCreateView.as_view(), name="booking-create"),
    path("<int:pk>/", BookingDetailView.as_view(), name="booking-detail"),
]
```

**So endpoints:**

* `POST /api/bookings/create/` – create a booking (JWT required).
* `GET /api/bookings/` – list your bookings.
* `GET /api/bookings/<id>/` – view details of *your own* booking.

---

## 5. Payments: strategy pattern + simulated Stripe/bKash + webhooks

### 5.1 Model

`payments/models.py`:

```py
class PaymentProvider(models.TextChoices):
    STRIPE = 'STRIPE', 'Stripe'
    BKASH = 'BKASH', 'bKash'

class PaymentStatus(models.TextChoices):
    INITIATED = 'INITIATED', 'Initiated'
    SUCCESS = 'SUCCESS', 'Success'
    FAILED = 'FAILED', 'Failed'

class Payment(models.Model):
    booking = models.OneToOneField(Booking, related_name='payment', on_delete=models.CASCADE)
    provider = models.CharField(max_length=20, choices=PaymentProvider.choices)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.INITIATED)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    raw_response = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### 5.2 Strategies (Stripe / bKash)

`payments/strategies.py` defines an abstract `PaymentStrategy` and two concrete implementations:

```py
class PaymentStrategy(ABC):
    @abstractmethod
    def process_payment(self, booking: Booking, payload: Dict[str, Any] | None = None) -> Dict[str, Any]:
        """
        Returns a dict with keys:
          - "status": PaymentStatus value (e.g., "INITIATED", "SUCCESS", "FAILED")
          - "transaction_id": str or None
          - "raw_response": arbitrary JSON-serializable dict
        """
        raise NotImplementedError
```

`StripePaymentStrategy` and `BkashPaymentStrategy`:

* Simulate calling the provider and return:

  ```py
  {
      "status": PaymentStatus.INITIATED,
      "transaction_id": "stripe_fake_123",
      "raw_response": {"message": "Stripe payment initiated (simulated)", ...},
  }
  ```

* Using `STRIPE_SECRET_KEY` env var (if set) but not actually calling Stripe – pure simulation.

### 5.3 Payment initiation service

`payments/services.py`:

```py
def initiate_payment(booking_id: int, provider: str, payload: dict | None = None) -> Payment:
    logger.info("Initiating payment for booking %s with provider %s", booking_id, provider)
    with transaction.atomic():
        try:
            booking = Booking.objects.select_for_update().get(id=booking_id)
        except Booking.DoesNotExist:
            raise ValidationError("Booking not found.")

        if booking.status == BookingStatus.PAID:
            raise ValidationError("Booking already paid.")

        strategy = get_payment_strategy(provider)
        result = strategy.process_payment(booking, payload)

        status = result.get("status", PaymentStatus.INITIATED)
        transaction_id = result.get("transaction_id")
        raw_response = result.get("raw_response")

        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={
                "provider": provider,
                "status": PaymentStatus.INITIATED,
            }
        )

        payment.provider = provider
        payment.status = status
        payment.transaction_id = transaction_id
        payment.raw_response = raw_response
        payment.save()
        return payment
```

* Also uses `select_for_update()` on Booking to avoid conflicting payment updates.
* Ensures booking is not already PAID.
* Creates or updates a single `Payment` per booking.

### 5.4 Webhook handlers

`handle_stripe_webhook(payload: dict)` and `handle_bkash_webhook(payload: dict)`:

* Expect `booking_id`, `status`, `transaction_id` in payload.

* Load the booking and its payment record.

* Update `payment.status` and `booking.status` accordingly:

  * If status == SUCCESS → Payment SUCCESS, Booking PAID.
  * Else → Payment FAILED, Booking CANCELED.

* Wrap saves in `transaction.atomic()`.

### 5.5 Payment API views

`payments/views.py`:

```py
class PaymentInitiateView(generics.CreateAPIView):
    serializer_class = PaymentInitiateSerializer
    permission_classes = [permissions.IsAuthenticated]

class StripeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        payload = request.data
        handle_stripe_webhook(payload)
        return Response({"detail": "ok"}, status=status.HTTP_200_OK)

class BkashWebhookView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        payload = request.data
        handle_bkash_webhook(payload)
        return Response({"detail": "ok"}, status=status.HTTP_200_OK)
```

`payments/serializers.py`:

```py
class PaymentInitiateSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    provider = serializers.ChoiceField(choices=PaymentProvider.choices)
    payload = serializers.JSONField(required=False)

    def create(self, validated_data):
        booking_id = validated_data["booking_id"]
        provider = validated_data["provider"]
        payload = validated_data.get("payload")
        payment = initiate_payment(booking_id, provider, payload)
        return payment

    def to_representation(self, instance):
        return PaymentSerializer(instance).data
```

URLs:

```py
urlpatterns = [
    path("initiate/", PaymentInitiateView.as_view(), name="payment-initiate"),
    path("webhook/stripe/", StripeWebhookView.as_view(), name="payment-webhook-stripe"),
    path("webhook/bkash/", BkashWebhookView.as_view(), name="payment-webhook-bkash"),
]
```

So:

* `POST /api/payments/initiate/` (JWT required) – start a payment for a booking.
* `POST /api/payments/webhook/stripe/` – simulate provider calling back with success/failure.
* `POST /api/payments/webhook/bkash/` – same for bKash.

---

## 6. Infrastructure: DB, cache, CORS

### 6.1 Database

In `settings.py`:

```py
DATABASES = {
    'default': env.db(),
}

import sys
if 'test' in sys.argv:
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
```

* Uses `django-environ` to read DB config from `.env` (`DATABASE_URL` style).
* For tests, falls back to SQLite.

### 6.2 Cache

```py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}
```

* In-memory LocMem cache.
* Currently used by DFS recommendation caching.

### 6.3 CORS

```py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

* Permit your Next.js frontend(s) to call the API.

---

## 7. Summary: what the backend now “offers”

**Auth:**

* Register users with username, email, password.
* Login with username + password → JWT tokens (access + refresh).
* Refresh tokens.
* Get current user profile.
* Superuser can create/manage users via Django admin and indirectly “issue” tokens by logging in.

**Properties:**

* CRUD via admin; API provides:

  * List properties with filters (`category`, `status`).
  * Retrieve property by slug.
  * List categories.
  * Get DFS-based recommended properties for a category subtree, cached.

**Bookings:**

* Create booking for a property (only if ACTIVE and available).
* Concurrency-safe booking via `select_for_update` + transaction.
* One active booking per property at a time.
* Mark property as unavailable once booked.
* Per-user booking list & details.

**Payments:**

* Initiate payment against a booking, selecting provider (Stripe / bKash).
* Strategy pattern for providers – easy to swap actual integrations in later.
* Webhook endpoints to update booking/payment status from provider responses (currently simulated).
* Once webhook marks payment as SUCCESS → booking status becomes PAID.

**Infra:**

* JWT auth as default.
* Global “authenticated by default” DRF policy with explicit `AllowAny` on public views.
* Filter backend built-in via `django-filter`.
* Cached DFS recommendations.
* CORS configured for your local frontend.

