from django.urls import path
from .views import CategoryListView, PropertyListView, PropertyDetailView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('properties/', PropertyListView.as_view(), name='property-list'),
    path('properties/<slug:slug>/', PropertyDetailView.as_view(), name='property-detail'),
]
