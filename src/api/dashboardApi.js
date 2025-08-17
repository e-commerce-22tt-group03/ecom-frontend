import api from './axiosConfig';

/**
 * Fetches dashboard data from a specified endpoint.
 * @param {string} endpoint - The specific dashboard endpoint (e.g., 'summary', 'sales-over-time').
 * @param {object} params - Query parameters like startDate, endDate.
 * @returns {Promise<object>}
 */
const fetchDashboardData = async (endpoint, params = {}) => {
  try {
    const response = await api.get(`/dashboard/${endpoint}`, { params });
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || `Failed to fetch ${endpoint} data.`;
  }
};

export const getSummary = (params) => fetchDashboardData('summary', params);
export const getSalesOverTime = (params) => fetchDashboardData('sales-over-time', params);
export const getTopProducts = (params) => fetchDashboardData('top-products', params);
export const getSalesByCategory = (params) => fetchDashboardData('sales-by-category', params);

/**
 * Fetches a report file.
 * @param {string} reportType - The type of report (e.g., 'sales', 'inventory').
 * @param {object} params - Query parameters like startDate, endDate.
 */
export const downloadReport = async (reportType, params) => {
  try {
    const response = await api.get(`/reports/${reportType}`, {
      params,
      responseType: 'blob',
    });

    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    console.log(response);
    link.setAttribute('download', `${reportType}-report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    throw error.response?.data?.message || `Failed to download ${reportType} report.`;
  }
};