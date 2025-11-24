from django.test import TestCase
from django.test import TransactionTestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from bookings.models import Booking, BookingStatus
from properties.models import Property, Category, PropertyStatus
from bookings.services import create_booking
from concurrent.futures import ThreadPoolExecutor

User = get_user_model()

class BookingServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.property = Property.objects.create(
            title='Test Property', slug='test-property', category=self.category, price=100.00, is_available=True, status=PropertyStatus.ACTIVE
        )

    def test_create_booking_success(self):
        """
        Test that a booking is successfully created for an available property.
        """
        booking = create_booking(self.user, self.property.id)
        
        self.assertEqual(booking.user, self.user)
        self.assertEqual(booking.property, self.property)
        self.assertEqual(booking.status, BookingStatus.PENDING)
        self.assertEqual(booking.total_amount, self.property.price)
        
        # Verify property is now unavailable
        self.property.refresh_from_db()
        self.assertFalse(self.property.is_available)

    def test_create_booking_unavailable(self):
        """
        Test that creating a booking for an unavailable property raises ValidationError.
        """
        self.property.is_available = False
        self.property.save()
        
        with self.assertRaisesMessage(ValidationError, "Property is not available for booking."):
            create_booking(self.user, self.property.id)

    def test_create_booking_inactive(self):
        """
        Test that creating a booking for an inactive property raises ValidationError.
        """
        self.property.status = PropertyStatus.INACTIVE
        self.property.save()
        
        with self.assertRaisesMessage(ValidationError, "Property is not active."):
            create_booking(self.user, self.property.id)

    def test_double_booking_prevention(self):
        """
        Test that a property cannot be booked twice.
        """
        # First booking succeeds
        create_booking(self.user, self.property.id)
        
        # Second booking fails
        user2 = User.objects.create_user(username='testuser2', password='password')
        with self.assertRaisesMessage(ValidationError, "Property is not available for booking."):
            create_booking(user2, self.property.id)


class BookingConcurrencyTests(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        self.user = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.category = Category.objects.create(name='Concurrency', slug='concurrency')
        self.property = Property.objects.create(
            title='Concurrent Property',
            slug='concurrent-property',
            category=self.category,
            price=200.00,
            is_available=True,
            status=PropertyStatus.ACTIVE,
        )

    def test_concurrent_bookings_only_creates_one(self):
        def attempt_booking(user):
            try:
                booking = create_booking(user, self.property.id)
                return booking.id
            except ValidationError:
                return None

        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(executor.map(attempt_booking, [self.user, self.user2]))

        successful = [r for r in results if r is not None]
        self.assertEqual(len(successful), 1)
        self.assertEqual(Booking.objects.count(), 1)
        # Property should be marked unavailable after the successful booking
        self.property.refresh_from_db()
        self.assertFalse(self.property.is_available)
