from django.db import transaction
from django.core.exceptions import ValidationError

from properties.models import Property, PropertyStatus
from .models import Booking, BookingStatus

def create_booking(user, property_id):
    """
    Creates a booking for a property in a concurrency-safe manner.
    Uses select_for_update to lock the property row.
    """
    with transaction.atomic():
        try:
            # Lock the property row to prevent race conditions
            prop = (
                Property.objects
                .select_for_update()
                .get(id=property_id)
            )
        except Property.DoesNotExist:
            raise ValidationError("Property does not exist.")

        if prop.status != PropertyStatus.ACTIVE:
            raise ValidationError("Property is not active.")

        if not prop.is_available:
            raise ValidationError("Property is not available for booking.")

        # Create the booking
        booking = Booking(
            user=user,
            property=prop,
        )
        booking.total_amount = booking.calculate_total()
        booking.status = BookingStatus.PENDING
        booking.save()

        # Update property availability
        prop.is_available = False
        prop.save(update_fields=["is_available"])

        return booking
