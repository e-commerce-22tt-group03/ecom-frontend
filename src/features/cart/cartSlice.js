import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice"; // Import logout action to clear auth state on cart actions
import { fetchProductById } from "../products/productsSlice";
import { TruckElectric } from "lucide-react";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
// const getAuthHeaders = (getState) => {
//     const { auth } = getState();
//     const token = auth.token || localStorage.getItem('authToken');
    
//     return {
//         'Content-Type': 'application/json',
//         ...(token && { 'Authorization': `Bearer ${token}` })
//     };
// };

// Debug

const getAuthHeaders = (getState) => {
    const { auth } = getState();
    const tokenFromState = auth.token;
    const tokenFromStorage = localStorage.getItem('authToken');
    
    console.log('🔐 Auth debug:', {
        tokenFromState: tokenFromState ? 'EXISTS' : 'NULL',
        tokenFromStorage: tokenFromStorage ? 'EXISTS' : 'NULL',
        authState: auth,
        isAuthenticated: auth.isAuthenticated
    });
    
    const token = tokenFromState || tokenFromStorage;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('🔐 Final headers:', headers);
    return headers;
};


// Helper function to handle API errors
const handleApiError = (error, rejectWithValue) => {
    if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
        return rejectWithValue(message);
    } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue('Network error - please check your connection');
    } else {
        // Something else happened
        return rejectWithValue('Request failed');
    }
};

// ===== ASYNC THUNKS =====

// Fetch current user's cart
// export const fetchCart = createAsyncThunk(
//     'cart/fetchCart',
//     async (_, { rejectWithValue, getState }) => {
//         try {
//             const headers = getAuthHeaders(getState);

//             const response = await fetch(`${API_BASE_URL}/cart`, {
//                 method: 'GET',
//                 headers,
//             });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in');
//                 }
//                 if (response.status === 404) {
//                     // Empty cart is not an error
//                     return {
//                         user_id: null,
//                         items: [],
//                         cart_total: 0
//                     };
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return data;
//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

// debugging
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue, getState }) => {
        try {
            const headers = getAuthHeaders(getState);
            console.log('🛒 Fetching cart with headers:', headers);
            console.log('🛒 API URL:', `${API_BASE_URL}/cart`);

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'GET',
                headers,
            });

            console.log('🛒 Fetch cart response status:', response.status);
            console.log('🛒 Fetch cart response ok:', response.ok);

            if (!response.ok) {
                if (response.status === 401) {
                    console.log('🛒 Auth error in fetchCart');
                    throw new Error('Authentication required. Please log in');
                }
                if (response.status === 404) {
                    console.log('🛒 Cart not found (404), returning empty cart');
                    // Empty cart is not an error
                    return {
                        user_id: null,
                        items: [],
                        cart_total: 0
                    };
                }
                console.log('🛒 HTTP error in fetchCart:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('🛒 Full response data:', responseData);
            
            // ✅ FIX: Extract the actual cart data from the response structure
            const cartData = responseData.data || responseData;
            console.log('🛒 Extracted cart data:', cartData);
            console.log('🛒 Cart items count:', cartData.items?.length || 0);
            
            // Return the cart data in the expected format
            return {
                user_id: cartData.user_id || null,
                items: cartData.items || [],
                cart_total: cartData.cart_total || 0
            };
            
        } catch (error) {
            console.error('🛒 Fetch cart error:', error);
            return rejectWithValue(error.message);
        }
    }
);


// Since the API response of fetchCart only returns the cart items data without
// product imageURLs, so i temporarily utilize the fetchProductById

export const fetchCartWithProductDetails = createAsyncThunk(
    'cart/fetchCartWithProductDetails',
    async (_, { rejectWithValue, getState, dispatch }) => {
        try {
            // Fetch the cart data first
            const cartResult = await dispatch(fetchCart()).unwrap();

            console.log('🛒 Cart data fetched:', cartResult);

            if (!cartResult.items || cartResult.items.length === 0) {
                return cartResult; // Return empty cart if no items
            }

            // Extract unique product IDs from the cart items
            const productIds = [...new Set(cartResult.items.map(item => item.product_id))];
            console.log('🛒 Unique product IDs:', productIds);

            // Fetch product details for each unique product ID
            const productDetailsPromises = productIds.map(async (productId) => {
                try {
                    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
                    if (!response.ok) {
                        console.warn(`Failed to fetch product ${productId}`);
                        return null; // Skip this product if not found
                    }
                    const data = await response.json();
                    return data.status === 'success' && data.data ? data.data.product : null;
                } catch (error) {
                    console.warn(`Error fetching product ${productId}:`, error);
                    return null; // Skip this product if there's an error
                }
            });

            const productDetails = await Promise.all(productDetailsPromises);
            console.log('Fetched product details:', productDetails);

            // Create a map of product details by ID for quick lookup
            const productMap = {};
            productDetails.forEach(product => {
                if (product && product.productId) {
                    productMap[product.productId] = product;
                }
            });

            // Add product details
            const enrichedItems = cartResult.items.map(cartItem => {
                const productDetail = productMap[cartItem.product_id];

                return {
                    ...cartItem,
                    // Add product details if available
                    product_name: productDetail?.name || cartItem.product_name || 'Unknown Product',
                    product_image: productDetail?.imageUrl || '/placeholder-flower.jpg',
                    product_description: productDetail?.description || '',
                    product_condition: productDetail?.condition || 'New Flower',
                    product_base_price: productDetail?.basePrice || cartItem.final_price,
                    product_stock: productDetail?.stockQuantity || 0,
                    // Keep original cart item data
                    cart_item_id: cartItem.cart_item_id,
                    product_id: cartItem.product_id,
                    quantity: cartItem.quantity,
                    final_price: cartItem.final_price,
                    total_price: cartItem.total_price || (cartItem.final_price * cartItem.quantity),
                    created_at: cartItem.created_at,
                    updated_at: cartItem.updated_at
                };
            });

            console.log('Enriched cart items:', enrichedItems);

            return {
                ...cartResult,
                items: enrichedItems,
            };
        } catch (error) {
            console.error('Error fetching cart with product details:', error);
            return rejectWithValue(error.message || 'Failed to fetch cart with product details');
        }
    }
);


// Add item to cart
// export const addToCart = createAsyncThunk(
//     'cart/addToCart',
//     async ({ product_id, quantity }, { rejectWithValue, getState }) => {
//         try {
//             const headers = getAuthHeaders(getState);

//             const response = await fetch(`${API_BASE_URL}/cart`, {
//                 method: 'POST',
//                 headers,
//                 body: JSON.stringify({
//                     product_id,
//                     quantity
//                 }),
//             });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in to add items to cart.');
//                 }
//                 if (response.status === 404) {
//                     throw new Error('Product not found');
//                 }
//                 if (response.status === 400) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'Invalid request');
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return data;

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

// for debugging

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ product_id, quantity }, { rejectWithValue, getState }) => {
        try {
            const headers = getAuthHeaders(getState);
            console.log('🛒 Adding to cart:', { product_id, quantity });

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    product_id,
                    quantity
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in to add items to cart.');
                }
                if (response.status === 404) {
                    throw new Error('Product not found');
                }
                if (response.status === 400) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Invalid request');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('🛒 Add to cart response:', responseData);
            
            // ✅ FIX: Extract the actual data from the response structure
            const data = responseData.data || responseData;
            
            return {
                item: data.item || data,
                message: data.message || responseData.message || 'Item added to cart'
            };

        } catch (error) {
            console.error('🛒 Add to cart error:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Update item quantity in cart
// export const updateCartItemQuantity = createAsyncThunk(
//     'cart/updateCartItemQuantity',
//     async ({ itemId, quantity }, { rejectWithValue, getState }) => {
//         try {
//             const headers = getAuthHeaders(getState);

//             const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
//                 method: 'PATCH',
//                 headers,
//                 body: JSON.stringify({ quantity }),
//             });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in');
//                 }
//                 if (response.status === 404) {
//                     throw new Error('Cart item not found');
//                 }
//                 if (response.status === 400) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'Invalid request');
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return { itemId, quantity, ...data };

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );


// Remove item from cart
// export const removeFromCart = createAsyncThunk(
//     'cart/removeFromCart',
//     async (itemId, { rejectWithValue, getState }) => {
//         try {
//             const headers = getAuthHeaders(getState);

//             const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
//                 method: 'DELETE',
//                 headers,
//             });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in');
//                 }
//                 if (response.status === 404) {
//                     throw new Error('Cart item not found');
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return { itemId, ...data }; // Return itemId to remove it from the state

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

// Clear cart
// export const clearCart = createAsyncThunk(
//     'cart/clearCart',
//     async (_, { rejectWithValue, getState }) => {
//         try {
//             const headers = getAuthHeaders(getState);

//             const response = await fetch(`${API_BASE_URL}/cart`, {
//                 method: 'DELETE',
//                 headers,
//             });

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Authentication required. Please log in');
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             return data;

//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

// Off the 3 above for debugging

// src/features/cart/cartSlice.js - Update other functions too

// Update updateCartItemQuantity
export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async ({ itemId, quantity }, { rejectWithValue, getState }) => {
        try {
            const headers = getAuthHeaders(getState);

            const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in');
                }
                if (response.status === 404) {
                    throw new Error('Cart item not found');
                }
                if (response.status === 400) {
                    const errorData = await response.json();
                    const errorMessage = errorData.data?.message || errorData.message || 'Invalid request';
                    throw new Error(errorMessage);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const data = responseData.data || responseData;
            
            return { itemId, quantity, ...data };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update removeFromCart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue, getState }) => {
        try {
            const headers = getAuthHeaders(getState);

            const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in');
                }
                if (response.status === 404) {
                    throw new Error('Cart item not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const data = responseData.data || responseData;
            
            return { itemId, ...data };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update clearCart
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue, getState }) => {
        try {
            const headers = getAuthHeaders(getState);

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required. Please log in');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            const data = responseData.data || responseData;
            
            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ==== CART SLICE =====

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        // Cart data from API
        user_id: null,
        items: [],
        cart_total: 0,

        // UI states
        isOpen: false, // For cart drawer/modal visibility

        // Loading states
        loading: false,
        addingToCart: false,
        updatingItem: false,
        removingItem: false,
        clearingCart: false,
        
        // Error states
        error: null,
        addError: null,
        updateError: null,
        removeError: null,
        clearError: null,
        
        // Local UI helpers
        recentlyAdded: null, // For showing success messages
        requiresAuth: false, // Flag to show login prompt
    },
    reducers: {
        // UI actions 
        toggleCartDrawer: (state) => {
            state.isOpen = !state.isOpen;
        },
        closeCartDrawer: (state) => {
            state.isOpen = false;
        },
        openCartDrawer: (state) => {
            state.isOpen = true;
        },

        // Clear errors
        clearErrors: (state) => {
            state.error = null;
            state.addError = null;
            state.updateError = null;
            state.removeError = null;
            state.clearError = null;
            state.requiresAuth = false;
        },

        // Clear recently added item
        clearRecentlyAdded: (state) => {
            state.recentlyAdded = null;
        },

        // Temporary reset cart state (on logout)
        resetCart: (state) => {
            state.user_id = null;
            state.items = [];
            state.cart_total = 0;
            state.isOpen = false;
            state.recentlyAdded = null;
            state.requiresAuth = false;
        },

        // Set requiresAuth flag
        setRequiresAuth: (state, action) => {
            state.requiresAuth = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // ===== FETCH CART =====  Temporarily disabled for debugging
            // Wait for API cart response with imageUrl
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.requiresAuth = false;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.user_id = action.payload.user_id;
                state.items = action.payload.items || [];
                state.cart_total = action.payload.cart_total || 0;
                state.requiresAuth = false;
            
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // Check if error is auth-related
                if (action.payload?.includes('Authentication required')) {
                    state.requiresAuth = true;
                }
            })
            // ===== FETCH CART WITH PRODUCT DETAILS ===== temporary version
            .addCase(fetchCartWithProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.requiresAuth = false;
            })
            .addCase(fetchCartWithProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.user_id = action.payload.user_id;
                state.items = action.payload.items || [];
                state.cart_total = action.payload.cart_total || 0;
                state.requiresAuth = false;
                console.log('Cart state updated with enriched items:', state.items);
            })
            .addCase(fetchCartWithProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                if (action.payload?.includes('Authentication required')) {
                    state.requiresAuth = true;
                }
            })

            // ===== ADD TO CART =====
            .addCase(addToCart.pending, (state) => {
                state.addingToCart = true;
                state.addError = null;
                state.requiresAuth = false;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.addingToCart = false;
                state.recentlyAdded = action.payload.item;
                state.requiresAuth = false;
                // Note: We'll refresh cart data to get updated totals
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.addingToCart = false;
                state.addError = action.payload;
                // Check if error is auth-related
                if (action.payload?.includes('Authentication required')) {
                    state.requiresAuth = true;
                }
            })

            // ===== UPDATE CART ITEM QUANTITY =====
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.updatingItem = true;
                state.updateError = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.updatingItem = false;
                // Find the item in the cart and update its quantity
                const { itemId, quantity } = action.payload;
                const item = state.items.find(item => item.cart_item_id === itemId);
                if (item) {
                    item.quantity = quantity;
                    item.total_price = item.final_price * quantity;
                    // Recalculate cart total
                    state.cart_total = state.items.reduce((total, item) => total + item.total_price, 0);
                }
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.updatingItem = false;
                state.updateError = action.payload;
                if (action.payload?.includes('Authentication required')) {
                    state.requiresAuth = true;
                }
            })

            // ===== REMOVE FROM CART =====
            .addCase(removeFromCart.pending, (state) => {
                state.removingItem = true;
                state.removeError = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.removingItem = false;
                // Remove item from local state
                const { itemId } = action.payload;
                state.items = state.items.filter(item => item.cart_item_id !== itemId);
                // Recalculate cart total
                state.cart_total = state.items.reduce((total, item) => total + item.total_price, 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.removingItem = false;
                state.removeError = action.payload;
                if (action.payload?.includes('Authentication required')) {
                    state.requiresAuth = true;
                }
            })

            // ===== CLEAR CART =====
            .addCase(clearCart.pending, (state) => {
                state.clearingCart = true;
                state.clearError = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.clearingCart = false;
                state.items = [];
                state.cart_total = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.clearingCart = false;
                state.clearError = action.payload;
                if (action.payload?.includes('Authentication required')) {
                    state.requiresAuth = true;
                }
            })

            // ===== LOGOUT HANDLER =====
            .addCase(logout, (state) => {
                // Reset cart when user logs out
                state.user_id = null;
                state.items = [];
                state.cart_total = 0;
                state.isOpen = false;
                state.recentlyAdded = null;
                state.requiresAuth = false;
                // Clear all loading states
                state.loading = false;
                state.addingToCart = false;
                state.updatingItem = false;
                state.removingItem = false;
                state.clearingCart = false;
                // Clear all errors
                state.error = null;
                state.addError = null;
                state.updateError = null;
                state.removeError = null;
                state.clearError = null;
            });
    }
});

// ===== SELECTORS =====
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.cart_total;
export const selectCartItemCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectAddingToCart = (state) => state.cart.addingToCart;
export const selectUpdatingItem = (state) => state.cart.updatingItem;
export const selectRemovingItem = (state) => state.cart.removingItem;
export const selectClearingCart = (state) => state.cart.clearingCart;
export const selectCartDrawerOpen = (state) => state.cart.isOpen;
export const selectRecentlyAdded = (state) => state.cart.recentlyAdded;
export const selectCartRequiresAuth = (state) => state.cart.requiresAuth;

// Helper selector to check if item is in car
export const selectIsInCart = (productId) => (state) => {
    return state.cart.items.some(item => item.product_id === productId);
};

// Helper selector to get item quantity in cart
export const selectCartItemQuantity = (productId) => (state) => {
    const item = state.cart.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
};

// Selector to check if user is authenticated (from auth slice)
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// ===== ACTIONS =====
export const {
    toggleCartDrawer,
    closeCartDrawer,
    openCartDrawer,
    clearErrors,
    clearRecentlyAdded,
    resetCart,
    setRequiresAuth,
} = cartSlice.actions;


export default cartSlice.reducer;