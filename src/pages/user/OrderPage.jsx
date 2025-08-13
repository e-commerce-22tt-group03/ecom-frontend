import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, fetchOrderItems, clearOrderError } from '../../features/orders/ordersSlice';
import ProfileSidebar from '../../features/profile/ProfileSidebar';

const OrderPage = () => {
  const dispatch = useDispatch();
  const { orders, orderItems, loading, error, itemsLoading } = useSelector(state => state.orders);
  const { token, user } = useSelector(state => state.auth);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Debug logging
  console.log('OrderPage - Auth state:', { token: !!token, user: !!user });
  console.log('OrderPage - Orders state:', { orders, loading, error });

  useEffect(() => {
    if (token) {
      console.log('Dispatching fetchOrders...');
      dispatch(fetchOrders());
    } else {
      console.log('No token available, cannot fetch orders');
    }
  }, [dispatch, token]);

  const handleExpandOrder = (orderId) => {
    console.log('Expanding order:', orderId);
    console.log('Current expandedOrder:', expandedOrder);
    console.log('Current orderItems:', orderItems);
    console.log('ItemsLoading state:', itemsLoading);
    
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      // Fetch order items if not already loaded
      if (!orderItems[orderId]) {
        console.log('Fetching order items for order:', orderId);
        dispatch(fetchOrderItems(orderId));
      } else {
        console.log('Order items already loaded:', orderItems[orderId]);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'badge-warning';
      case 'Delivering':
        return 'badge-info';
      case 'Completed':
        return 'badge-success';
      case 'Cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-base-200">
      <ProfileSidebar />
      
      <div className="w-full md:w-4/5 flex items-start justify-start h-full md:h-screen">
        <div className="w-full max-w-4xl ml-0 mt-10 md:ml-24">
          <div className="w-full p-3">
            <div className="mb-10 flex flex-col items-start">
              <h2 className="text-lg font-semibold text-base-content">My Orders</h2>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}

            {!token && (
              <div className="alert alert-warning mb-4">
                <span>Please log in to view your orders</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            {!loading && token && orders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-base-content/70">No orders found</p>
              </div>
            )}

            {/* Header Bar */}
            {orders.length > 0 && (
              <div className="bg-base-300 rounded-lg p-4 mb-4">
                <div className="grid gap-4 font-semibold text-base-content" style={{gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.5fr'}}>
                  <div>Order Date</div>
                  <div>Payment Method</div>
                  <div className="text-right">Amount</div>
                  <div className="text-center">Status</div>
                  <div></div> {/* Smaller column for arrow */}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.order_id} className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <div 
                      className="grid gap-4 items-center cursor-pointer"
                      style={{gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr 0.5fr'}}
                      onClick={() => handleExpandOrder(order.order_id)}
                    >
                      {/* Order Date */}
                      <div>
                        <p className="font-semibold">Order #{order.order_id}</p>
                        <p className="text-sm text-base-content/70">
                          {formatDate(order.order_date)}
                        </p>
                      </div>
                      
                      {/* Payment Method */}
                      <div>
                        <p className="text-sm font-medium">{order.payment_method}</p>
                      </div>
                      
                      {/* Amount */}
                      <div className="text-right">
                        <p className="font-semibold text-lg">${order.total_amount}</p>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center justify-center">
                        <div className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <svg 
                          className={`w-5 h-5 transition-transform ${expandedOrder === order.order_id ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded order details */}
                    {expandedOrder === order.order_id && (
                      <div className="mt-4 pt-4 border-t border-base-300">
                        <h4 className="font-semibold mb-3">Order Items</h4>
                        
                        {itemsLoading[order.order_id] && (
                          <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-md"></span>
                          </div>
                        )}

                        {orderItems[order.order_id] && (
                          <div className="space-y-2">
                            {orderItems[order.order_id].map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-2 px-3 bg-base-200 rounded">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-medium">{item.product_name || item.name || `Product #${item.product_id}`}</p>
                                    <p className="text-sm text-base-content/70">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">${item.price_at_purchase}</p>
                                  <p className="text-sm text-base-content/70">
                                     Total: ${(item.price_at_purchase * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {!itemsLoading[order.order_id] && !orderItems[order.order_id] && (
                          <div className="alert alert-info">
                            <span>Failed to load order items</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;