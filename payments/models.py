from django.db import models
from bookings.models import Booking

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

    def __str__(self):
        return f"Payment #{self.id} - {self.provider} - {self.status}"
