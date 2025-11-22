from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Property
from .serializers import CategorySerializer, PropertySerializer

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
