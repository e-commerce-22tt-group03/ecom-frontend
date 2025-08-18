import api from './axiosConfig';

export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch categories.';
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add category.';
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.patch(`/categories/${categoryId}`, categoryData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update category.';
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete category.';
  }
};

export const addCategoryToProduct = async (productId, categoryId) => {
  try {
    const response = await api.post(`/products/${productId}/categories/${categoryId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add category to product.';
  }
};

export const removeCategoryFromProduct = async (productId, categoryId) => {
  try {
    const response = await api.delete(`/products/${productId}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to remove category from product.';
  }
};