const fetchOrdersFromApi = async (params = {}) => {
  console.log('Fetching orders with params:', params);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock Data
  const allOrders = [
    { orderId: 'ORD1001', customerName: 'Lê Quốc Huy', orderDate: '2025-07-27T10:30:00Z', totalAmount: 55.99, status: 'Processing' },
    { orderId: 'ORD1002', customerName: 'Nguyễn Vĩnh Khang', orderDate: '2025-07-27T09:15:00Z', totalAmount: 78.50, status: 'Pending' },
    { orderId: 'ORD1003', customerName: 'Huỳnh Đăng Khoa', orderDate: '2025-07-26T18:00:00Z', totalAmount: 120.00, status: 'Completed' },
    { orderId: 'ORD1004', customerName: 'Trương Chí Nhân', orderDate: '2025-07-26T15:45:00Z', totalAmount: 32.75, status: 'Out for Delivery' },
    { orderId: 'ORD1005', customerName: 'Võ Trường Thịnh', orderDate: '2025-07-25T11:20:00Z', totalAmount: 95.20, status: 'Completed' },
    { orderId: 'ORD1006', customerName: 'Lê Quốc Huy', orderDate: '2025-07-24T14:00:00Z', totalAmount: 45.00, status: 'Canceled' },
  ];

  // Simulate filtering
  let filteredOrders = allOrders;
  if (params.status) {
    filteredOrders = filteredOrders.filter(o => o.status === params.status);
  }
  if (params.q) {
    filteredOrders = filteredOrders.filter(o =>
      o.customerName.toLowerCase().includes(params.q.toLowerCase()) ||
      o.orderId.toLowerCase().includes(params.q.toLowerCase())
    );
  }

  // Simulate pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  return {
    pagination: { currentPage: page, totalPages, totalItems, limit },
    orders: paginatedOrders,
  };
};


/**
 * Fetches a paginated and filterable list of orders.
 * @param {object} params - The query parameters for filtering, sorting, and pagination.
 * @returns {Promise<object>} The paginated response from the API.
 */
export const fetchOrders = async (params = {}) => {
  // try {
  //   const response = await api.get('/v1/orders', { params });
  //   return response.data;
  // } catch (error) {
  //   throw error.response?.data?.message || 'Failed to fetch orders.';
  // }
  return await fetchOrdersFromApi(params);
};
