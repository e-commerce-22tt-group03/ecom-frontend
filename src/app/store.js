import { configureStore } from '@reduxjs/toolkit';
// We will create and import these slices later
// import authReducer from '../features/auth/authSlice';
// import productReducer from '../features/products/productsSlice';
// import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
    reducer: {
        // auth: authReducer, // Authentication state management
        // products: productsReducer, // Product listings and details
        // cart: cartReducer, // Shopping cart state management
        // We will add more slices as needed
    },
});