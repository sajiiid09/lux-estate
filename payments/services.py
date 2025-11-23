from django.core.exceptions import ValidationError
from django.db import transaction

from bookings.models import Booking, BookingStatus
from .models import Payment, PaymentProvider, PaymentStatus
from .strategies import PaymentStrategy, StripePaymentStrategy, BkashPaymentStrategy
import logging

logger = logging.getLogger(__name__)

def get_payment_strategy(provider: str) -> PaymentStrategy:
    if provider == PaymentProvider.STRIPE:
        return StripePaymentStrategy()
    elif provider == PaymentProvider.BKASH:
        return BkashPaymentStrategy()
    else:
        raise ValidationError(f"Unsupported payment provider: {provider}")

def initiate_payment(booking_id: int, provider: str, payload: dict | None = None) -> Payment:
    """
    Initiates a payment process for a booking using the selected provider strategy.
    """
    logger.info("Initiating payment for booking %s with provider %s", booking_id, provider)
    with transaction.atomic():
        try:
            booking = Booking.objects.select_for_update().get(id=booking_id)
        except Booking.DoesNotExist:
            logger.warning("Booking %s not found during payment initiation", booking_id)
            raise ValidationError("Booking not found.")

        if booking.status == BookingStatus.PAID:
            logger.warning("Booking %s is already paid", booking_id)
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

        if status == PaymentStatus.SUCCESS:
            booking.status = BookingStatus.PAID
            booking.save(update_fields=["status"])
            logger.info("Payment success for booking %s. Status updated to PAID.", booking_id)
        
        logger.info("Payment record %s created/updated for booking %s. Status: %s", payment.id, booking_id, status)
        return payment

def handle_stripe_webhook(payload: dict) -> None:
    """
    Simulated Stripe webhook handler.
    """
    logger.info("Received Stripe webhook payload: %s", payload)
    booking_id = payload.get("booking_id")
    status_value = payload.get("status")
    transaction_id = payload.get("transaction_id")

    if booking_id is None or status_value is None:
        logger.warning("Invalid Stripe webhook payload: %s", payload)
        return

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        logger.warning("Stripe webhook for non-existent booking %s", booking_id)
        return

    try:
        payment = booking.payment
    except Payment.DoesNotExist:
        payment = Payment(booking=booking, provider=PaymentProvider.STRIPE)

    payment.transaction_id = transaction_id
    payment.raw_response = payload

    if status_value == PaymentStatus.SUCCESS:
        payment.status = PaymentStatus.SUCCESS
        booking.status = BookingStatus.PAID
        logger.info("Stripe webhook: Payment success for booking %s", booking_id)
    else:
        payment.status = PaymentStatus.FAILED
        booking.status = BookingStatus.CANCELED
        logger.info("Stripe webhook: Payment failed for booking %s", booking_id)

    with transaction.atomic():
        payment.save()
        booking.save()

def handle_bkash_webhook(payload: dict) -> None:
    """
    Simulated bKash webhook handler.
    """
    logger.info("Received bKash webhook payload: %s", payload)
    booking_id = payload.get("booking_id")
    status_value = payload.get("status")
    transaction_id = payload.get("transaction_id")

    if booking_id is None or status_value is None:
        logger.warning("Invalid bKash webhook payload: %s", payload)
        return

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        logger.warning("bKash webhook for non-existent booking %s", booking_id)
        return

    try:
        payment = booking.payment
    except Payment.DoesNotExist:
        payment = Payment(booking=booking, provider=PaymentProvider.BKASH)

    payment.transaction_id = transaction_id
    payment.raw_response = payload

    if status_value == PaymentStatus.SUCCESS:
        payment.status = PaymentStatus.SUCCESS
        booking.status = BookingStatus.PAID
        logger.info("bKash webhook: Payment success for booking %s", booking_id)
    else:
        payment.status = PaymentStatus.FAILED
        booking.status = BookingStatus.CANCELED
        logger.info("bKash webhook: Payment failed for booking %s", booking_id)

    with transaction.atomic():
        payment.save()
        booking.save()
