import { ArrowLeft, CheckCircle, MapPin, Package, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import EditShippingAddressModal from '../../features/orders/components/EditShippingAddressModal';
import { fetchOrderById, updateOrderStatus, updateShippingInfo } from '../../features/orders/ordersSlice';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder: order, loading, error } = useSelector((state) => state.orders);

  // State to manage the success notification
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Shipping edit modal state

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus && newStatus !== order.status) {
      const resultAction = await dispatch(updateOrderStatus({ orderId, status: newStatus }));

      if (updateOrderStatus.fulfilled.match(resultAction)) {
        showSuccessMessage('Order status updated successfully!');
      }
    }
  };

  const handleSaveShipping = async (shippingData) => {
    const resultAction = await dispatch(updateShippingInfo({ orderId, shippingData }));
    if (updateShippingInfo.fulfilled.match(resultAction)) {
      setIsModalOpen(false);
      showSuccessMessage('Shipping address updated successfully!');
    } else {
      alert('Failed to update shipping address.');
    }
  };

  if (loading && !order) { // Show loading spinner only on initial load
    return <div className="text-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return <div className="alert alert-error"><span>Error: {error}</span></div>;
  }

  if (!order) {
    return <div className="text-center p-8">Order not found.</div>;
  }

  return (
    <div>
      <Link to="/admin/orders" className="btn btn-ghost mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="alert alert-success shadow-lg mb-4">
          <div>
            <CheckCircle className="w-6 h-6" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"><Package className="w-5 h-5 mr-2" />Items in Order #{order.order_id}</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-right">Quantity</th>
                      <th className="text-right">Price at Purchase</th>
                      <th className="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.product_id}>
                        <td>{item.product_name}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">${parseFloat(item.price_at_purchase).toFixed(2)}</td>
                        <td className="text-right">${(item.quantity * item.price_at_purchase).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"><MapPin className="w-5 h-5 mr-2" />Shipping Address</h2>
              <p>{order.address_line1}</p>
              {order.address_line2 && <p>{order.address_line2}</p>}
              <p>{order.city}, {order.postal_code}</p>
              <p>{order.country}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(true)}>Edit Address</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {order.payment_method}</p>
              <p className="text-xl font-bold"><strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
              <div className="divider"></div>
              <h3 className="font-bold">Change Status</h3>
              <select
                className="select select-bordered w-full"
                value={order.status}
                onChange={handleStatusChange}
                disabled={loading} // Disable dropdown while an update is in progress
              >
                <option>Processing</option>
                <option>Delivering</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"><User className="w-5 h-5 mr-2" />Customer</h2>
              <p><strong>User ID:</strong> {order.user_id}</p>
            </div>
          </div>
        </div>
      </div>

      <EditShippingAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveShipping}
        order={order}
        isLoading={loading}
      />
    </div>
  );
};

export default OrderDetailsPage;
