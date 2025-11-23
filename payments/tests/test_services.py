from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from bookings.models import Booking, BookingStatus
from properties.models import Property, Category
from payments.models import Payment, PaymentProvider, PaymentStatus
from payments.services import initiate_payment, handle_stripe_webhook

User = get_user_model()

class PaymentServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.property = Property.objects.create(
            title='Test Property', slug='test-property', category=self.category, price=100.00, is_available=True
        )
        self.booking = Booking.objects.create(
            user=self.user, property=self.property, total_amount=100.00, status=BookingStatus.PENDING
        )

    def test_initiate_payment_success(self):
        """
        Given a pending booking, when initiate_payment is called with STRIPE,
        then a Payment is created/updated with INITIATED status and booking remains pending.
        """
        payment = initiate_payment(self.booking.id, PaymentProvider.STRIPE)
        
        self.assertEqual(payment.booking, self.booking)
        self.assertEqual(payment.provider, PaymentProvider.STRIPE)
        self.assertEqual(payment.status, PaymentStatus.INITIATED)
        self.assertIsNotNone(payment.transaction_id)
        
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, BookingStatus.PENDING)

    def test_initiate_payment_already_paid(self):
        """
        Given a paid booking, when initiate_payment is invoked,
        then a ValidationError is raised and no payment mutation occurs.
        """
        self.booking.status = BookingStatus.PAID
        self.booking.save()

        with self.assertRaisesMessage(ValidationError, "Booking already paid."):
            initiate_payment(self.booking.id, PaymentProvider.STRIPE)

    def test_initiate_payment_unsupported_provider(self):
        """
        Given an unsupported provider, when called, then a clear validation error is returned.
        """
        with self.assertRaisesMessage(ValidationError, "Unsupported payment provider: UNSUPPORTED"):
            initiate_payment(self.booking.id, "UNSUPPORTED")

    def test_handle_stripe_webhook_success(self):
        """
        Given a successful Stripe webhook payload, when handled,
        then Payment status becomes SUCCESS and booking status becomes PAID.
        """
        # First initiate a payment
        payment = initiate_payment(self.booking.id, PaymentProvider.STRIPE)
        
        payload = {
            "booking_id": self.booking.id,
            "status": PaymentStatus.SUCCESS,
            "transaction_id": "txn_success_123"
        }
        
        handle_stripe_webhook(payload)
        
        payment.refresh_from_db()
        self.booking.refresh_from_db()
        
        self.assertEqual(payment.status, PaymentStatus.SUCCESS)
        self.assertEqual(self.booking.status, BookingStatus.PAID)

    def test_handle_stripe_webhook_failure(self):
        """
        Given a failure payload, should set FAILED and CANCELED.
        """
        payment = initiate_payment(self.booking.id, PaymentProvider.STRIPE)
        
        payload = {
            "booking_id": self.booking.id,
            "status": PaymentStatus.FAILED,
            "transaction_id": "txn_fail_123"
        }
        
        handle_stripe_webhook(payload)
        
        payment.refresh_from_db()
        self.booking.refresh_from_db()
        
        self.assertEqual(payment.status, PaymentStatus.FAILED)
        self.assertEqual(self.booking.status, BookingStatus.CANCELED)
