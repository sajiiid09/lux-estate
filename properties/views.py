from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Property
from .serializers import CategorySerializer, PropertySerializer
from .services import get_recommended_properties

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class PropertyListView(generics.ListAPIView):
    queryset = Property.objects.all().select_related("category")
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category", "status"]

class PropertyDetailView(generics.RetrieveAPIView):
    queryset = Property.objects.all().select_related("category")
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

class RecommendedPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        category_id = self.request.query_params.get("category_id")
        if category_id is None:
            raise ValidationError("category_id query parameter is required.")

        try:
            category_id_int = int(category_id)
        except ValueError:
            raise ValidationError("category_id must be an integer.")

        return get_recommended_properties(category_id_int)
