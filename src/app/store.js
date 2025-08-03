import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import ordersReducer from '../features/orders/ordersSlice';
import usersReducer from '../features/users/usersSlice';
import productsReducer from '../features/products/productsSlice';

// We will create and import these slices later
// import authReducer from '../features/auth/authSlice';
// import cartReducer from '../features/cart/cartSlice';
export const store = configureStore({
    reducer: {
        products: productsReducer,
        orders: ordersReducer,
        auth: authReducer,
        users: usersReducer,
        profile: profileReducer
    },
});