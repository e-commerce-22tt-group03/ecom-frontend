import api from './axiosConfig';

/**
 * Fetches a paginated and filterable list of products.
 * @param {object} params - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<object>} The paginated response from the API.
 */
export const fetchProducts = async (params = {}) => {
  try {
    // The `params` object will be converted into query string like ?page=1&limit=10
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch products.';
  }
};

/**
 * Adds a new flower product by sending a POST request to the server.
 * @param {object} productData - The data for the new product.
 * @returns {Promise<object>} The data returned from the API.
 */
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    // Re-throw the error so it can be caught by the Redux thunk
    throw error.response?.data?.message || 'Failed to add the product.';
  }
};

/**
 * Updates an existing flower product.
 * @param {string} productId - The ID of the product to update.
 * @param {object} productData - The new data for the product.
 * @returns {Promise<object>} The response from the API.
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.patch(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update the product.';
  }
};

/**
 * Deletes a flower product.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<object>} The response from the API.
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete the product.';
  }
};

/**
 * Fetches product recommendations for a given product ID.
 * @param {string} productId - The ID of the product.
 * @param {object} params - Optional query parameters like { limit: 10 }.
 * @returns {Promise<object>} The list of recommended products.
 */
export const fetchRecommendations = async (productId, params = {}) => {
  try {
    const response = await api.get(`/products/${productId}/recommendations`, { params });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch recommendations.';
  }
};

/**
 * Adds a new review for a product.
 * @param {string} productId - The ID of the product to review.
 * @param {object} reviewData - The review data (rating, comment).
 * @returns {Promise<object>} The newly created review.
 */
export const addReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add the review.';
  }
};

/**
 * Checks if the current user can review a product.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<object>} An object with a boolean `canReview` property.
 */
export const checkCanReview = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/reviews/can-review`);
    return response.data;
  } catch (error) {
    // If the user is not logged in, the API will likely return a 401, which we can interpret as cannot review.
    if (error.response?.status === 401) {
      return { canReview: false };
    }
    throw error.response?.data?.message || 'Failed to check review eligibility.';
  }
};
