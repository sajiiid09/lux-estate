from abc import ABC, abstractmethod
from typing import Any, Dict
import logging
import os

from bookings.models import Booking
from .models import PaymentStatus, PaymentProvider

logger = logging.getLogger(__name__)

class PaymentStrategy(ABC):
    """
    Strategy interface for payment providers.
    """

    @abstractmethod
    def process_payment(self, booking: Booking, payload: Dict[str, Any] | None = None) -> Dict[str, Any]:
        """
        Process a payment for the given booking.

        Returns a dict with keys:
          - "status": PaymentStatus value (e.g., "INITIATED", "SUCCESS", "FAILED")
          - "transaction_id": str or None
          - "raw_response": arbitrary JSON-serializable dict
        """
        raise NotImplementedError

class StripePaymentStrategy(PaymentStrategy):
    def __init__(self, api_key: str | None = None):
        # In a real implementation, you'd initialize stripe SDK here
        self.api_key = api_key or os.getenv("STRIPE_SECRET_KEY", "test_key")
        # e.g. stripe.api_key = self.api_key

    def process_payment(self, booking: Booking, payload: Dict[str, Any] | None = None) -> Dict[str, Any]:
        logger.info("Processing Stripe payment for booking %s", booking.id)

        # In a real scenario, you'd call Stripe's API to create a PaymentIntent
        # For this assignment phase, simulate a successful initiation:
        fake_transaction_id = f"stripe_test_txn_{booking.id}"

        response = {
            "status": PaymentStatus.INITIATED,
            "transaction_id": fake_transaction_id,
            "raw_response": {
                "message": "Stripe payment initiated (simulated).",
                "booking_id": booking.id,
            },
        }
        return response

class BkashPaymentStrategy(PaymentStrategy):
    def __init__(self, app_key: str | None = None, app_secret: str | None = None):
        self.app_key = app_key or os.getenv("BKASH_APP_KEY", "test_app_key")
        self.app_secret = app_secret or os.getenv("BKASH_APP_SECRET", "test_app_secret")

    def process_payment(self, booking: Booking, payload: Dict[str, Any] | None = None) -> Dict[str, Any]:
        logger.info("Processing bKash payment for booking %s", booking.id)

        fake_transaction_id = f"bkash_test_txn_{booking.id}"

        response = {
            "status": PaymentStatus.INITIATED,
            "transaction_id": fake_transaction_id,
            "raw_response": {
                "message": "bKash payment initiated (simulated).",
                "booking_id": booking.id,
            },
        }
        return response

def create_strategy_for_provider(provider: str) -> PaymentStrategy:
    if provider == PaymentProvider.STRIPE:
        return StripePaymentStrategy()
    elif provider == PaymentProvider.BKASH:
        return BkashPaymentStrategy()
    else:
        raise ValueError(f"Unsupported payment provider: {provider}")
