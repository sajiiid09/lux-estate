from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'provider', 'status', 'created_at')
    list_filter = ('status', 'provider', 'created_at')
    search_fields = ('booking__id', 'transaction_id')
