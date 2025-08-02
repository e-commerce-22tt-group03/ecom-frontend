import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AdminOrdersTable from '../../features/orders/components/AdminOrdersTable';
import { fetchOrders } from '../../features/orders/ordersSlice';

const ManageOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { items: orders, pagination, loading, error } = useSelector((state) => state.orders);

  const [userIdFilter, setUserIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      userId: userIdFilter || undefined,
      status: statusFilter || undefined,
    };
    dispatch(fetchOrders(params));
  }, [dispatch, currentPage, userIdFilter, statusFilter]);

  const handleUserIdFilterChange = (e) => {
    setUserIdFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_pages) {
      setCurrentPage(newPage);
    }
  };

  // Handler for the direct Order ID search
  const handleGoToOrder = (e) => {
    e.preventDefault();
    if (orderIdSearch.trim()) {
      navigate(`/admin/orders/${orderIdSearch.trim()}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      {/* Filter and Search Controls */}
      <div className="card bg-base-100 shadow-lg p-4 mb-6 space-y-4">
        {/* Row for filtering the list */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="form-control flex-grow">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Filter by User ID..."
                value={userIdFilter}
                onChange={handleUserIdFilterChange}
              />
              <Search className="w-4 h-4 opacity-70" />
            </label>
          </div>
          <div className="form-control w-full sm:w-auto">
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">All Statuses</option>
              <option>Processing</option>
              <option>Delivering</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="divider">OR</div>

        {/* Row for direct navigation by Order ID */}
        <form onSubmit={handleGoToOrder} className="flex flex-wrap gap-4 items-center">
          <div className="form-control flex-grow">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Find a specific Order ID..."
                value={orderIdSearch}
                onChange={(e) => setOrderIdSearch(e.target.value)}
              />
            </label>
          </div>
          <button type="submit" className="btn btn-secondary">
            Go to Order
          </button>
        </form>
      </div>

      {/* Orders Table */}
      {loading && <div className="text-center p-4"><span className="loading loading-lg loading-spinner"></span></div>}
      {error && <div className="alert alert-error"><span>Error: {error}</span></div>}
      {!loading && !error && (
        <div className="card bg-base-100 shadow-xl p-6">
          {orders.length > 0 ? (
            <>
              <AdminOrdersTable orders={orders} />
              {pagination.total_pages > 1 && (
                <div className="join mt-6 self-center">
                  <button onClick={() => handlePageChange(currentPage - 1)} className="join-item btn" disabled={currentPage === 1}>«</button>
                  <button className="join-item btn">Page {currentPage} of {pagination.total_pages}</button>
                  <button onClick={() => handlePageChange(currentPage + 1)} className="join-item btn" disabled={currentPage === pagination.total_pages}>»</button>
                </div>
              )}
            </>
          ) : (
            <p>No orders found with the current filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageOrdersPage;
