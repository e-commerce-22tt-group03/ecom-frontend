import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';

const AdminRoute = () => {
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'Admin';

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <AdminLayout />;
};

export default AdminRoute;