import { Edit, Trash2 } from 'lucide-react';

const AdminUsersTable = ({ users, onEditRole, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined On</th>
            <th className="pl-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="hover">
              <td className="font-mono">{user.user_id}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`whitespace-nowrap badge ${user.role === 'Admin' ? 'badge-secondary' :
                  user.role === 'Registered Buyer' ? 'badge-primary' : 'badge-ghost'
                  }`}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <div className="flex gap-2">
                  <button onClick={() => onEditRole(user)} className="btn btn-ghost btn-xs">
                    <Edit className="w-4 h-4" /> Change Role
                  </button>
                  <button onClick={() => onDelete(user.user_id)} className="btn btn-ghost btn-xs text-error">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
