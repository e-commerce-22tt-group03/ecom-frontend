import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const CheckoutRejectPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get('orderId');
  const code = params.get('code');

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="p-8 rounded-lg shadow bg-base-100 text-center">
        <h1 className="text-2xl font-semibold text-error mb-4">Payment Failed</h1>
        <p className="mb-4">Order #{orderId} could not be processed. Code: {code}</p>
        <div className="flex gap-2 justify-center">
          <Link to="/" className="btn">Back to home</Link>
          <Link to="/orders" className="btn btn-outline">My Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutRejectPage;
