import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import ordersReducer from '../features/orders/ordersSlice'; // Updated to use merged slice
import usersReducer from '../features/users/usersSlice';
import productsReducer from '../features/products/productsSlice';
import pricingRulesReducer from '../features/pricingRules/pricingRulesSlice';
import cartReducer from '../features/cart/cartSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        orders: ordersReducer,
        cart: cartReducer,
        auth: authReducer,
        users: usersReducer,
        profile: profileReducer,
        pricingRules: pricingRulesReducer,
        dashboard: dashboardReducer,
    },
});