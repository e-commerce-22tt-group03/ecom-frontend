import { Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';

const AdminRoute = () => {
    const isAdmin = true; // TODO: Replace with real auth

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    // If the user is an admin, render the AdminLayout.
    // The specific admin page will be rendered inside the layout's <Outlet />
    return <AdminLayout />;
};

export default AdminRoute;