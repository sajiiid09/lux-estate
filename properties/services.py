from django.core.cache import cache
from .models import Category, Property

CACHE_TIMEOUT = 60 * 5  # 5 minutes

def _dfs_category_ids(root_category):
    """
    Helper function to perform DFS and return all category IDs in the subtree.
    """
    stack = [root_category]
    visited_ids = []

    while stack:
        node = stack.pop()
        visited_ids.append(node.id)
        # Add children to stack. Note: depending on order desired, you might reverse list
        children = list(node.children.all())
        stack.extend(children)
import logging

logger = logging.getLogger(__name__)

def _dfs_category_ids(category_id, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(category_id)
    
    # Get direct children
    children = Category.objects.filter(parent_id=category_id).values_list('id', flat=True)
    
    for child_id in children:
        if child_id not in visited:
            _dfs_category_ids(child_id, visited)
            
    return visited

def get_category_subtree_property_ids(root_category_id):
    cache_key = f"category_subtree:{root_category_id}"
    cached_ids = cache.get(cache_key)
    
    if cached_ids:
        logger.info("Cache hit for key %s", cache_key)
        return cached_ids
        
    logger.info("Cache miss for key %s. Computing DFS for category %s", cache_key, root_category_id)
    subtree_ids = _dfs_category_ids(root_category_id)
    
    # Get all active properties in these categories
    property_ids = list(
        Property.objects.filter(
            category_id__in=subtree_ids,
            is_available=True
        ).values_list('id', flat=True)
    )
    
    cache.set(cache_key, property_ids, timeout=3600)  # Cache for 1 hour
    logger.info("DFS finished for category %s. Found %d properties.", root_category_id, len(property_ids))
    return property_ids

def get_recommended_properties(category_id):
    if not category_id:
        return Property.objects.none()
        
    property_ids = get_category_subtree_property_ids(category_id)
    return Property.objects.filter(id__in=property_ids)
