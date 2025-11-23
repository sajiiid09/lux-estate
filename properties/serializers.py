from rest_framework import serializers
from .models import Category, Property

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'parent')

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = (
            'id', 'title', 'slug', 'description', 'location',
            'price', 'bedrooms', 'bathrooms', 'amenities',
            'status', 'is_available', 'category', 'image', 'created_at', 'updated_at'
        )
