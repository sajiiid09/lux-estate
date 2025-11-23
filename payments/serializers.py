from rest_framework import serializers
from .models import Payment, PaymentProvider
from .services import initiate_payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'booking', 'provider', 'status', 'transaction_id', 'raw_response', 'created_at', 'updated_at']

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
