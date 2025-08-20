import api from './axiosConfig';

export const createPaymentUrl = async ({ order_id, return_url }) => {
  const res = await api.post('/vnpay/create-payment-url', { order_id, return_url });
  // Backend returns data which is the payment URL (string) or object; return it directly
  return res.data?.data || res.data;
};

export const confirmPayment = async ({ order_id, transaction_no, pay_date }) => {
  const res = await api.post('/vnpay/confirm-payment', { order_id, transaction_no, pay_date });
  return res.data;
};
