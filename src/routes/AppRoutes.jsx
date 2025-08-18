import { Route, Routes } from "react-router-dom";
import ProductList from "../features/products/components/ProductList";

// Importing the Pages
import HomePage from "../pages/HomePage";
// These pages will be create later:
import AdminRoute from '../components/common/AdminRoute';
import AddProductPage from "../pages/admin/AddProductPage";
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import EditProductPage from "../pages/admin/EditProductPage";
import ManageOrdersPage from "../pages/admin/ManageOrdersPage";
import ManageProductsPage from "../pages/admin/ManageProductsPage";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import OrderDetailsPage from "../pages/admin/OrderDetailsPage";
import LoginPage from '../pages/auth/LoginPage';
import ManagePricingRulesPage from '../pages/admin/ManagePricingRulesPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import OrderPage from "../pages/user/OrderPage";
import ProfilePage from "../pages/user/ProfilePage";
import CartPage from '../pages/cart/CartPage';
import ManageAddressPage from "../pages/user/ManageAddressPage";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/address" element={<ManageAddressPage />} />
            <Route path="/about" element={<h2>About Page</h2>} />
            <Route path="/contact" element={<h2>Contact Page</h2>} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Product Detail Route */}
            <Route path="/products/:id" element={<ProductDetailPage />} />
            
            {/* Cart Route */}
            <Route path="/cart" element={<CartPage />} />

            {/* Future routes - will be implemented later */}
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
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
                <Route path="/admin/pricing-rules" element={<ManagePricingRulesPage />} />
                <Route path="/admin/settings" element={<h2>Admin Settings</h2>} />
            </Route>


            {/* 404 Page */}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
    );
};

export default AppRoutes;
