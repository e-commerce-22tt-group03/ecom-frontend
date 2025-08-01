import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOrdersTable = ({ orders }) => {
  const navigate = useNavigate();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Processing': return 'badge-info';
      case 'Delivering': return 'badge-primary';
      case 'Completed': return 'badge-success';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} className="hover">
              <td className="font-mono">#{order.order_id}</td>
              <td>{order.user_id}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>${parseFloat(order.total_amount).toFixed(2)}</td>
              <td>
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleViewDetails(order.order_id)}
                  className="btn btn-ghost btn-sm"
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersTable;
