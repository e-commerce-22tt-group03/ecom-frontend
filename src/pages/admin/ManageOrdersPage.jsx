import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminOrdersTable from '../../features/orders/components/AdminOrdersTable';
import { fetchOrders } from '../../features/orders/ordersSlice';

const ManageOrdersPage = () => {
  const dispatch = useDispatch();
  const { items: orders, pagination, loading, error } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    // This will run whenever the filters or page number change
    const params = {
      page: currentPage,
      limit,
      q: searchTerm || undefined,
      status: statusFilter || undefined,
    };
    dispatch(fetchOrders(params));
  }, [dispatch, currentPage, searchTerm, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      {/* Filter and Search Controls */}
      <div className="card bg-base-100 shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="form-control flex-grow">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search by Order ID or Customer Name"
                value={searchTerm}
                onChange={handleSearchChange}
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
              <option>Pending</option>
              <option>Processing</option>
              <option>Out for Delivery</option>
              <option>Completed</option>
              <option>Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading && <div className="text-center p-4"><span className="loading loading-lg loading-spinner"></span></div>}
      {error && <div className="alert alert-error"><span>Error: {error}</span></div>}
      {!loading && !error && (
        <div className="card bg-base-100 shadow-xl p-6">
          {orders.length > 0 ? (
            <>
              <AdminOrdersTable orders={orders} />
              {pagination.totalPages > 1 && (
                <div className="join mt-6 self-center">
                  <button onClick={() => handlePageChange(currentPage - 1)} className="join-item btn" disabled={currentPage === 1}>«</button>
                  <button className="join-item btn">Page {currentPage} of {pagination.totalPages}</button>
                  <button onClick={() => handlePageChange(currentPage + 1)} className="join-item btn" disabled={currentPage === pagination.totalPages}>»</button>
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
