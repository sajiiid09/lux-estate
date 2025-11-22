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

    return visited_ids

def get_category_subtree_property_ids(root_category_id: int):
    """
    Returns a list of property IDs for the given category and all its descendants.
    Results are cached.
    """
    cache_key = f"category_subtree:{root_category_id}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        root_category = Category.objects.get(id=root_category_id)
    except Category.DoesNotExist:
        return []

    category_ids = _dfs_category_ids(root_category)
    
    # Assuming 'status' field exists and 'ACTIVE' is a valid value.
    # If using TextChoices, it would be PropertyStatus.ACTIVE
    property_ids = list(
        Property.objects.filter(
            category_id__in=category_ids,
            status="ACTIVE" 
        ).values_list("id", flat=True)
    )

    cache.set(cache_key, property_ids, CACHE_TIMEOUT)
    return property_ids

def get_recommended_properties(root_category_id: int):
    """
    Returns a QuerySet of properties belonging to the category subtree.
    """
    property_ids = get_category_subtree_property_ids(root_category_id)
    # Return queryset to allow further filtering/pagination if needed in view
    return Property.objects.filter(id__in=property_ids)
