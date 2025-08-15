import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderDetail, selectLastOrderDetail } from '../../features/checkout/checkoutSlice';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectLastOrderDetail);
  const fetchingDetail = useSelector(state => state.checkout.fetchingDetail);

  // page theme
  const theme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';

  useEffect(() => {
    if (!order || String(order.order_id) !== String(orderId) || !order.items) {
      dispatch(fetchOrderDetail(orderId));
    }
  }, [orderId, order, dispatch]);

  if (fetchingDetail && !order) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Order not found.</div>;
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="p-8 rounded-lg shadow bg-base-100">
          <h1 className="text-3xl font-bold mb-4 text-primary">Thank you for your order!</h1>
          <p className="mb-6 text-sm text-base-content/70">Order <span className="font-mono font-semibold">#{order.order_id}</span> is currently <span className="font-semibold">{order.status}</span>.</p>

          <h2 className="text-xl font-semibold mb-2 text-primary">Order Items</h2>
          <ul className="divide-y mb-6">
            {(order.items || []).map((it, idx) => (
              <li key={idx} className="py-3 flex justify-between text-sm">
                <span>{it.product_name} x {it.quantity}</span>
                <span>{it.price_at_purchase * it.quantity}</span>
              </li>
            ))}
          </ul>

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total Amount</span>
              <span>{order.total_amount}</span>
            </div>

          <div className="space-x-4">
              <Link to="/" className="btn btn-primary">Continue Shopping</Link>
              <Link to="/orders" className="btn btn-outline">View My Orders</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
