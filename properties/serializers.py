from rest_framework import serializers
from .models import Category, Property

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'parent')

class PropertySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            'id', 'title', 'slug', 'description', 'location',
            'price', 'bedrooms', 'bathrooms', 'amenities',
            'status', 'is_available', 'category', 'image', 'image_url', 'created_at', 'updated_at'
        )

    def get_image_url(self, obj):
        """Return an absolute URL for the property's image when available."""
        if not obj.image:
            return None

        request = self.context.get("request")
        image_url = obj.image.url
        if request is not None:
            return request.build_absolute_uri(image_url)
        return image_url
