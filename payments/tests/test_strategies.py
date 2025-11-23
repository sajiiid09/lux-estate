from django.test import SimpleTestCase
from unittest.mock import MagicMock
from bookings.models import Booking
from payments.models import PaymentStatus, PaymentProvider
from payments.strategies import StripePaymentStrategy, BkashPaymentStrategy, create_strategy_for_provider

class PaymentStrategyTests(SimpleTestCase):
    def setUp(self):
        self.booking = MagicMock(spec=Booking)
        self.booking.id = 123

    def test_stripe_strategy(self):
        strategy = StripePaymentStrategy()
        response = strategy.process_payment(self.booking)
        
        self.assertEqual(response["status"], PaymentStatus.INITIATED)
        self.assertIn("stripe_test_txn_123", response["transaction_id"])
        self.assertEqual(response["raw_response"]["booking_id"], 123)

    def test_bkash_strategy(self):
        strategy = BkashPaymentStrategy()
        response = strategy.process_payment(self.booking)
        
        self.assertEqual(response["status"], PaymentStatus.INITIATED)
        self.assertIn("bkash_test_txn_123", response["transaction_id"])
        self.assertEqual(response["raw_response"]["booking_id"], 123)

    def test_factory_function(self):
        stripe_strategy = create_strategy_for_provider(PaymentProvider.STRIPE)
        self.assertIsInstance(stripe_strategy, StripePaymentStrategy)

        bkash_strategy = create_strategy_for_provider(PaymentProvider.BKASH)
        self.assertIsInstance(bkash_strategy, BkashPaymentStrategy)

        with self.assertRaises(ValueError):
            create_strategy_for_provider("INVALID_PROVIDER")
