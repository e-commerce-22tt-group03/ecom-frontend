import { Route, Routes } from "react-router-dom";
import ProductList from "../features/products/components/ProductList";

// Importing the Pages
import HomePage from "../pages/HomePage";
// These pages will be create later:
// import ProductsPage from '../pages/ProductsPage';
import AdminRoute from '../components/common/AdminRoute';
import AddProductPage from "../pages/admin/AddProductPage";
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import EditProductPage from "../pages/admin/EditProductPage";
import ManageOrdersPage from "../pages/admin/ManageOrdersPage";
import ManageProductsPage from "../pages/admin/ManageProductsPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import OrderDetailsPage from "../pages/admin/OrderDetailsPage";
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<h2>About Page</h2>} />
            <Route path="/contact" element={<h2>Contact Page</h2>} />

            {/* Product Detail Route */}
            <Route path="/products/:id" element={<h2>Product Detail Page</h2>} />

            {/* Future routes - will be implemented later */}
            {/* <Route path="/cart" element={<CartPage />} /> */}
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            {/* <Route path="/orders" element={<OrdersPage />} /> */}

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<ManageProductsPage />} />
                <Route path="/admin/products/add" element={<AddProductPage />} />
                <Route path="/admin/products/edit/:productId" element={<EditProductPage />} />
                <Route path="/admin/orders" element={<ManageOrdersPage />} />
                <Route path="/admin/orders/:orderId" element={<OrderDetailsPage />} />
                <Route path="/admin/users" element={<ManageUsersPage />} />
                <Route path="/admin/settings" element={<h2>Admin Settings</h2>} />
            </Route>


            {/* 404 Page */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
    );
};

export default AppRoutes;
