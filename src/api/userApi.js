import api from './axiosConfig';

/**
 * Fetches a paginated list of all users.
 * @param {object} params - Query parameters for filtering and pagination (e.g., { role: 'Admin', page: 1 }).
 * @returns {Promise<object>}
 */
export const fetchUsers = async (params = {}) => {
  try {
    const response = await api.get('/auth/admin/users', { params });
    return response.data.data;
  } catch (error) {
    throw error.message || 'Failed to fetch users.';
  }
};

/**
 * Updates the role of a specific user.
 * @param {string} userId - The ID of the user to update.
 * @param {string} role - The new role for the user.
 * @returns {Promise<object>}
 */
export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/auth/admin/users/${userId}/role`, { role });
    return response.data.data;
  } catch (error) {
    throw error.message || 'Failed to update user role.';
  }
};

/**
 * Deletes a user.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<object>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.message || 'Failed to delete user.';
  }
};
