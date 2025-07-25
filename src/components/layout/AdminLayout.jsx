import { Outlet } from 'react-router-dom';
import Sidebar from '../admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex gap-8">
      <Sidebar />
      <main className="flex-grow bg-base-100 p-6 rounded-lg shadow-lg">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;