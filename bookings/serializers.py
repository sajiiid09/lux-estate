from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'property', 'total_amount', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total_amount', 'status', 'created_at', 'updated_at']

class BookingCreateSerializer(serializers.Serializer):
    property_id = serializers.IntegerField()

    def create(self, validated_data):
        from .services import create_booking
        user = self.context["request"].user
        property_id = validated_data["property_id"]
        # The service layer handles validation and creation
        booking = create_booking(user, property_id)
        return booking

    def to_representation(self, instance):
        return BookingSerializer(instance).data
