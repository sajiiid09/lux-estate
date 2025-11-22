from django.contrib import admin
from .models import Category, Property

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'status', 'is_available')
    list_filter = ('status', 'is_available', 'category')
    search_fields = ('title', 'location')
    prepopulated_fields = {'slug': ('title',)}
