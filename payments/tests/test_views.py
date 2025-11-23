from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from bookings.models import Booking, BookingStatus
from properties.models import Property, Category
from payments.models import Payment, PaymentProvider, PaymentStatus

User = get_user_model()

class PaymentViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.property = Property.objects.create(
            title='Test Property', slug='test-property', category=self.category, price=100.00, is_available=True
        )
        self.booking = Booking.objects.create(
            user=self.user, property=self.property, total_amount=100.00, status=BookingStatus.PENDING
        )
        self.url = reverse('payment-initiate')

    def test_initiate_payment_authenticated(self):
        """
        API-level test: authenticated POST to /api/payments/initiate/ creates a payment and returns serialized data.
        """
        self.client.force_authenticate(user=self.user)
        data = {
            "booking_id": self.booking.id,
            "provider": PaymentProvider.STRIPE
        }
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], PaymentStatus.INITIATED)
        self.assertEqual(response.data['provider'], PaymentProvider.STRIPE)
        
        # Verify DB
        payment = Payment.objects.get(booking=self.booking)
        self.assertEqual(payment.status, PaymentStatus.INITIATED)

    def test_initiate_payment_unauthenticated(self):
        """
        API-level test: anonymous calls are rejected.
        """
        data = {
            "booking_id": self.booking.id,
            "provider": PaymentProvider.STRIPE
        }
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
