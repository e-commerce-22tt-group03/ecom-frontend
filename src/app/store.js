// import { configureStore } from '@reduxjs/toolkit';
// // We will create and import these slices later
// // import authReducer from '../features/auth/authSlice';
// // import productReducer from '../features/products/productsSlice';
// // import cartReducer from '../features/cart/cartSlice';

// export const store = configureStore({
//     reducer: {
//         // auth: authReducer, // Authentication state management
//         // products: productsReducer, // Product listings and details
//         // cart: cartReducer, // Shopping cart state management
//         // We will add more slices as needed
//     },
// });  Old version of store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
// We will create and import these slices later
// import authReducer from '../features/auth/authSlice';
// import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer, // Add the products reducer
        // auth: authReducer, // Authentication state management
        // cart: cartReducer, // Shopping cart state management
        // We will add more slices as needed
    },
});