import api from './axiosConfig';

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
