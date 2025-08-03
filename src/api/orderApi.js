import api from './axiosConfig';

/**
 * Fetches a paginated and filterable list of orders from the live API.
 * @param {object} params - The query parameters for filtering and pagination.
 * Example: { user_id: 12, status: 'Processing', page: 1, limit: 20 }
 * @returns {Promise<object>} The paginated response from the API.
 */
export const fetchOrders = async (params = {}) => {
  try {
    // The `params` object will be converted into a query string by axios
    const response = await api.get('/orders', { params });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch orders.';
  }
};


/**
 * Fetches a single order by its ID.
 * @param {string} orderId - The ID of the order to fetch.
 * @returns {Promise<object>}
 */
export const fetchOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || `Failed to fetch order #${orderId}.`;
  }
};

/**
 * Updates the status of an order.
 * @param {string} orderId - The ID of the order.
 * @param {string} status - The new status.
 * @returns {Promise<object>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update order status.';
  }
};

/**
 * Updates the shipping information for an order.
 * @param {string} orderId - The ID of the order.
 * @param {object} shippingData - The new shipping address details.
 * @returns {Promise<object>}
 */
export const updateShippingInfo = async (orderId, shippingData) => {
  try {
    const response = await api.patch(`/orders/${orderId}/shipping`, shippingData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update shipping info.';
  }
};
