import api from './axiosConfig';

/**
 * Fetches all dynamic pricing rules.
 * @returns {Promise<object>}
 */
export const fetchPricingRules = async () => {
  try {
    const response = await api.get('/pricing-rules');
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch pricing rules.';
  }
};

/**
 * Adds a new dynamic pricing rule.
 * @param {object} ruleData - The data for the new rule.
 * @returns {Promise<object>}
 */
export const addPricingRule = async (ruleData) => {
  try {
    const response = await api.post('/pricing-rules', ruleData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add pricing rule.';
  }
};

/**
 * Updates an existing dynamic pricing rule.
 * @param {string} ruleId - The ID of the rule to update.
 * @param {object} ruleData - The new data for the rule.
 * @returns {Promise<object>}
 */
export const updatePricingRule = async (ruleId, ruleData) => {
  try {
    const response = await api.patch(`/pricing-rules/${ruleId}`, ruleData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update pricing rule.';
  }
};

/**
 * Deletes a dynamic pricing rule.
 * @param {string} ruleId - The ID of the rule to delete.
 * @returns {Promise<object>}
 */
export const deletePricingRule = async (ruleId) => {
  try {
    // Assuming the DELETE endpoint is /pricing-rules/{ruleId}
    const response = await api.delete(`/pricing-rules/${ruleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete pricing rule.';
  }
};
