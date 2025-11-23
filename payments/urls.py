from django.urls import path
from .views import PaymentInitiateView, StripeWebhookView, BkashWebhookView

urlpatterns = [
    path("initiate/", PaymentInitiateView.as_view(), name="payment-initiate"),
    path("webhook/stripe/", StripeWebhookView.as_view(), name="payment-webhook-stripe"),
    path("webhook/bkash/", BkashWebhookView.as_view(), name="payment-webhook-bkash"),
]
