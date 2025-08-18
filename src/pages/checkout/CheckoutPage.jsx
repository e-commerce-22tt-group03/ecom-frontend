import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, selectCartItems, selectCartTotal } from '../../features/cart/cartSlice';
import { fetchAddresses, selectAddresses, selectDefaultAddressId, createAddress } from '../../features/address/addressSlice';
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
  // Inline create address form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: ''
  });

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

  const handleChangeNewAddress = (e) => {
    const { name, value } = e.target;
    setNewAddress((s) => ({ ...s, [name]: value }));
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await dispatch(createAddress(newAddress)).unwrap();
      // If API returned the created address row, select it. Otherwise refetch addresses and pick default/newest.
      if (created && created.address_id) {
        setSelectedAddressId(created.address_id);
      } else {
        // fallback: refetch addresses and pick default or last
        const res = await dispatch(fetchAddresses()).unwrap();
        const def = res.find(a => a.is_default) || res[res.length - 1];
        if (def) setSelectedAddressId(def.address_id);
      }
      setShowAddForm(false);
      setNewAddress({ address_line1: '', address_line2: '', city: '', postal_code: '', country: '' });
    } catch (err) {
      console.error('Failed to create address', err);
      // You can show UI error here later
    }
  };

  return (
    // Do NOT set data-theme here; inherit global document data-theme
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary">Checkout</h1>

        {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Address & Payment */}
          <div className="md:col-span-2 space-y-8">
            <section className="p-6 rounded-lg shadow bg-base-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary">Shipping Address</h2>
                <div className="flex items-center gap-2">
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => setShowAddForm(v => !v)}>
                    {showAddForm ? 'Cancel' : 'Add New Address'}
                  </button>
                </div>
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateAddress} className="space-y-3 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input name="address_line1" value={newAddress.address_line1} onChange={handleChangeNewAddress} required placeholder="Address line 1" className="input input-bordered w-full" />
                    <input name="address_line2" value={newAddress.address_line2} onChange={handleChangeNewAddress} placeholder="Address line 2" className="input input-bordered w-full" />
                    <input name="city" value={newAddress.city} onChange={handleChangeNewAddress} required placeholder="City" className="input input-bordered w-full" />
                    <input name="postal_code" value={newAddress.postal_code} onChange={handleChangeNewAddress} placeholder="Postal Code" className="input input-bordered w-full" />
                    <input name="country" value={newAddress.country} onChange={handleChangeNewAddress} required placeholder="Country" className="input input-bordered w-full" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {addresses.length === 0 && !showAddForm && <p className="text-sm text-base-content/60">You have no addresses. Click "Add New Address" to create one.</p>}

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
                    {/* Default management moved to profile/addresses page; no action here */}
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
                  <div className="flex items-center gap-3">
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" alt="VNPAY" className="w-24 h-16 object-contain" />
                    <div>
                      <p className="font-medium"> (Coming Soon)</p>
                    </div>
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
                    <span>{(item.final_price || item.price || 0) * item.quantity} $</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>{cartTotal} $</span>
              </div>
              <button
                className="btn btn-primary w-full mt-6"
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
