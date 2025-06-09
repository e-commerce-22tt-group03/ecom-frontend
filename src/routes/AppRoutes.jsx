import {Routes, Route} from 'react-router-dom';
// These pages will be create later:
// import HomePage from '../pages/HomePage';
// import ProductsPage from '../pages/ProductsPage';
// import LoginPage from '../pages/LoginPage';
// import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
// import PrivateRoute from '../components/common/PrivateRoute';
// import AdminRoute from '../components/common/AdminRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<h2>Home Page</h2>} /> {/* Placeholder */}
            <Route path="/products" element={<h2>Products Page</h2>} /> {/* Placeholder */}
            <Route path="/login" element={<h2>Login Page</h2>} /> {/* Placeholder */}

            {/* Example Private and Admin Routes (to be implemented) */}
            {/*
            <Route element={<PrivateRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Route>
            */}

            <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
    );
};

export default AppRoutes;
