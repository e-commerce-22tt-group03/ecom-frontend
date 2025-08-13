import api from './axiosConfig';

export const placeOrderApi = async ({ shipping_address_id, payment_method }) => {
  const res = await api.post('/orders', { shipping_address_id, payment_method });
  return res.data?.data || res.data;
};

export const fetchOrderDetailApi = async (orderId) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data?.data || res.data;
};
