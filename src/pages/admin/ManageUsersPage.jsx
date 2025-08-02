import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminUsersTable from '../../features/users/components/AdminUsersTable';
import { deleteUser, fetchUsers, updateUserRole } from '../../features/users/usersSlice';

const ManageUsersPage = () => {
  const dispatch = useDispatch();
  const { items: users, pagination, loading, error } = useSelector((state) => state.users);

  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      role: roleFilter || undefined,
    };
    dispatch(fetchUsers(params));
  }, [dispatch, currentPage, roleFilter]);

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_pages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditRole = (user) => {
    const newRole = user.role === 'Admin' ? 'Registered Buyer' : 'Admin';
    if (window.confirm(`Change ${user.full_name}'s role to ${newRole}?`)) {
      dispatch(updateUserRole({ userId: user.user_id, role: newRole }));
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 ml-4">Manage Users</h1>

      <div className="card bg-base-100 shadow-lg p-4 mb-6">
        <label className="form-control w-full sm:w-auto">
          <div className="label mr-4">
            <span className="label-text">Filter by Role</span>
          </div>
          <select
            className="select select-bordered"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option value="">All Roles</option>
            <option>Admin</option>
            <option>Registered Buyer</option>
          </select>
        </label>
      </div>

      {loading && <div className="text-center p-4"><span className="loading loading-lg loading-spinner"></span></div>}
      {error && <div className="alert alert-error"><span>Error: {error}</span></div>}
      {!loading && !error && (
        <div className="card bg-base-100 shadow-xl p-6">
          {users.length > 0 ? (
            <>
              <AdminUsersTable users={users} onEditRole={handleEditRole} onDelete={handleDelete} />
              {pagination.total_pages > 1 && (
                <div className="join mt-6 self-center">
                  <button onClick={() => handlePageChange(currentPage - 1)} className="join-item btn" disabled={currentPage === 1}>«</button>
                  <button className="join-item btn">Page {currentPage} of {pagination.total_pages}</button>
                  <button onClick={() => handlePageChange(currentPage + 1)} className="join-item btn" disabled={currentPage === pagination.total_pages}>»</button>
                </div>
              )}
            </>
          ) : (
            <p>No users found with the current filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
