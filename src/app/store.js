import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import ordersReducer from '../features/orders/ordersSlice'; // Updated to use merged slice
import usersReducer from '../features/users/usersSlice';
import productsReducer from '../features/products/productsSlice';
import pricingRulesReducer from '../features/pricingRules/pricingRulesSlice';
import cartReducer from '../features/cart/cartSlice';
import addressReducer from '../features/address/addressSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        orders: ordersReducer,
        cart: cartReducer,
        auth: authReducer,
        users: usersReducer,
        profile: profileReducer,
        pricingRules: pricingRulesReducer,
        address: addressReducer,
        checkout: checkoutReducer
    },
});