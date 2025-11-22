from django.urls import path
from .views import CategoryListView, PropertyListView, PropertyDetailView, RecommendedPropertiesView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('properties/', PropertyListView.as_view(), name='property-list'),
    path('properties/recommended/', RecommendedPropertiesView.as_view(), name='property-recommended'),
    path('properties/<slug:slug>/', PropertyDetailView.as_view(), name='property-detail'),
]
