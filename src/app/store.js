import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';
import productsReducer from '../features/products/productsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        orders: ordersReducer,
        auth: authReducer,
        users: usersReducer,
    },
});