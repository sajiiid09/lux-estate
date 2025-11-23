from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Payment
from .serializers import PaymentSerializer, PaymentInitiateSerializer
from .services import handle_stripe_webhook, handle_bkash_webhook
import logging

logger = logging.getLogger(__name__)

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
