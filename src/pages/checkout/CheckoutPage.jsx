import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, selectCartItems, selectCartTotal } from '../../features/cart/cartSlice';
import { fetchAddresses, selectAddresses, selectDefaultAddressId, setDefaultAddress } from '../../features/address/addressSlice';
import { placeOrder, selectCheckoutPlacing, selectLastOrderId, selectCheckoutError } from '../../features/checkout/checkoutSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const addresses = useSelector(selectAddresses);
  const defaultAddressId = useSelector(selectDefaultAddressId);
  const placing = useSelector(selectCheckoutPlacing);
  const lastOrderId = useSelector(selectLastOrderId);
  const error = useSelector(selectCheckoutError);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (defaultAddressId && !selectedAddressId) {
      setSelectedAddressId(defaultAddressId);
    }
  }, [defaultAddressId, selectedAddressId]);

  useEffect(() => {
    if (cartItems.length === 0) {
      // Avoid redirect loop after placing order (cart will be cleared) by checking lastOrderId
      if (!lastOrderId) navigate('/cart');
    }
  }, [cartItems, navigate, lastOrderId]);

  useEffect(() => {
    if (lastOrderId) {
      navigate(`/order-confirmation/${lastOrderId}`);
    }
  }, [lastOrderId, navigate]);

  const handlePlaceOrder = () => {
    if (!selectedAddressId) return;
    dispatch(placeOrder({ shipping_address_id: selectedAddressId, payment_method: paymentMethod }));
  };

  // Use stored theme for per-page data-theme attribute (falls back to 'light')
  // const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light'));

  // // Keep theme in sync if user changes it elsewhere (storage event)
  // useEffect(() => {
  //   const handler = (e) => {
  //     if (e.key === 'theme') setTheme(e.newValue || 'light');
  //   };
  //   window.addEventListener('storage', handler);
  //   return () => window.removeEventListener('storage', handler);
  // }, []);

  return (
    // Set data-theme so this page respects daisyUI theme tokens
    // <div data-theme={theme} className="min-h-screen bg-base-100 py-8"> // tempo off
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>

        {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Address & Payment */}
          <div className="md:col-span-2 space-y-8">
            <section className="p-6 rounded-lg shadow bg-base-100">
              <h2 className="text-xl font-semibold mb-4 text-primary">Shipping Address</h2>
              {addresses.length === 0 && <p className="text-sm text-gray-500">You have no addresses. Add one in profile page (future inline form).</p>}
              <div className="space-y-3">
                {addresses.map(addr => (
                  <label key={addr.address_id} className={`flex items-start gap-3 p-4 border rounded cursor-pointer ${selectedAddressId === addr.address_id ? 'border-[3px]' : ''}`} style={selectedAddressId === addr.address_id ? { borderColor: 'var(--p)' } : {}}>
                    <input
                      type="radio"
                      name="address"
                      className="radio mt-1"
                      checked={selectedAddressId === addr.address_id}
                      onChange={() => setSelectedAddressId(addr.address_id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{addr.address_line1}</p>
                      <p className="text-sm text-base-content/70">{addr.city}, {addr.country}</p>
                      {addr.is_default && <span className="badge badge-primary">Default</span>}
                    </div>
                    {(!addr.is_default) && (
                      <button type="button" className="text-xs underline" onClick={() => dispatch(setDefaultAddress(addr.address_id))}>Make Default</button>
                    )}
                  </label>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-lg shadow bg-base-100">
              <h2 className="text-xl font-semibold mb-4 text-primary">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded">
                  <input type="radio" name="payment" className="radio" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div>
                    <p className="font-medium">Cash On Delivery (COD)</p>
                    <p className="text-xs text-gray-500">Pay when the order arrives.</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded opacity-50 cursor-not-allowed">
                  <input type="radio" name="payment" className="radio" disabled />
                  <div>
                    <p className="font-medium">Paypal (Coming Soon)</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded opacity-50 cursor-not-allowed">
                  <input type="radio" name="payment" className="radio" disabled />
                  <div>
                    <p className="font-medium">VNPAY (Coming Soon)</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg shadow bg-base-100 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 text-primary">Order Summary</h2>
              <ul className="divide-y">
                {cartItems.map(item => (
                  <li key={item.item_id || item.product_id} className="py-3 flex justify-between text-sm">
                    <span>{item.product_name} x {item.quantity}</span>
                    <span>{(item.final_price || item.price || 0) * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>{cartTotal}</span>
              </div>
              <button
                className="btn w-full mt-6 text-white"
                style={{ backgroundColor: 'var(--p)', borderColor: 'var(--p)' }}
                disabled={!selectedAddressId || placing === 'loading' || cartItems.length === 0}
                onClick={handlePlaceOrder}
              >
                {placing === 'loading' ? 'Placing Order...' : 'Place Order'}
              </button>
              {!selectedAddressId && <p className="text-xs text-error mt-2">Select an address to continue.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
