from django.test import TestCase
from django.core.cache import cache
from properties.models import Category, Property
from properties.services import get_category_subtree_property_ids, get_recommended_properties

class PropertyServiceTests(TestCase):
    def setUp(self):
        # Create category tree
        # A
        # ├── B
        # │   └── D
        # └── C
        self.cat_a = Category.objects.create(name='A', slug='a')
        self.cat_b = Category.objects.create(name='B', slug='b', parent=self.cat_a)
        self.cat_c = Category.objects.create(name='C', slug='c', parent=self.cat_a)
        self.cat_d = Category.objects.create(name='D', slug='d', parent=self.cat_b)

        # Create properties
        self.prop_a = Property.objects.create(title='Prop A', slug='prop-a', category=self.cat_a, price=100, is_available=True)
        self.prop_b = Property.objects.create(title='Prop B', slug='prop-b', category=self.cat_b, price=100, is_available=True)
        self.prop_c = Property.objects.create(title='Prop C', slug='prop-c', category=self.cat_c, price=100, is_available=True)
        self.prop_d = Property.objects.create(title='Prop D', slug='prop-d', category=self.cat_d, price=100, is_available=True)
        
        # Unavailable property
        self.prop_d_unavailable = Property.objects.create(title='Prop D Unavail', slug='prop-d-unavail', category=self.cat_d, price=100, is_available=False)

        cache.clear()

    def test_get_category_subtree_property_ids_root(self):
        """
        Test that querying the root category returns properties from the entire subtree.
        """
        ids = get_category_subtree_property_ids(self.cat_a.id)
        self.assertEqual(len(ids), 4)
        self.assertIn(self.prop_a.id, ids)
        self.assertIn(self.prop_b.id, ids)
        self.assertIn(self.prop_c.id, ids)
        self.assertIn(self.prop_d.id, ids)
        self.assertNotIn(self.prop_d_unavailable.id, ids)

    def test_get_category_subtree_property_ids_leaf(self):
        """
        Test that querying a leaf category returns only its properties.
        """
        ids = get_category_subtree_property_ids(self.cat_d.id)
        self.assertEqual(len(ids), 1)
        self.assertIn(self.prop_d.id, ids)

    def test_get_category_subtree_property_ids_intermediate(self):
        """
        Test that querying an intermediate category returns its properties and its children's.
        """
        ids = get_category_subtree_property_ids(self.cat_b.id)
        self.assertEqual(len(ids), 2)
        self.assertIn(self.prop_b.id, ids)
        self.assertIn(self.prop_d.id, ids)

    def test_caching(self):
        """
        Test that results are cached.
        """
        # First call - cache miss
        ids1 = get_category_subtree_property_ids(self.cat_a.id)
        
        # Manually verify cache is set
        cache_key = f"category_subtree:{self.cat_a.id}"
        self.assertIsNotNone(cache.get(cache_key))
        
        # Second call - cache hit (should return same result)
        ids2 = get_category_subtree_property_ids(self.cat_a.id)
        self.assertEqual(ids1, ids2)
