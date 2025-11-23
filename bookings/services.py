import logging

from django.db import transaction
from django.core.exceptions import ValidationError

from properties.models import Property, PropertyStatus
from .models import Booking, BookingStatus


logger = logging.getLogger(__name__)

def create_booking(user, property_id):
    """
    Creates a booking for a property in a concurrency-safe manner.
    Uses select_for_update to lock the property row.
    """
    logger.info("User %s attempting to book property %s", user.id, property_id)
    with transaction.atomic():
        try:
            # Lock the property row to prevent race conditions
            prop = (
                Property.objects
                .select_for_update()
                .get(id=property_id)
            )
        except Property.DoesNotExist:
            logger.warning("Property with ID %s does not exist.", property_id)
            raise ValidationError("Property does not exist.")

        if prop.status != PropertyStatus.ACTIVE:
            logger.warning("Property %s is not active (status: %s)", property_id, prop.status)
            raise ValidationError("Property is not active.")

        if not prop.is_available:
            logger.warning("Property %s is not available for booking", property_id)
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

        logger.info("Booking %s created for user %s and property %s", booking.id, user.id, property_id)
        return booking

