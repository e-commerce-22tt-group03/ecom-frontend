import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reject } from "lodash";
import { clearError } from "../auth/authSlice";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ===== ASYNc THUNKS =====

// Fetch current user's cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers 
                    // 'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add item to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ product_id, quantity }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers 
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id,
                    quantity
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update item quantity in cart
export const updateCartItemQuantity = createAsyncThunk(
    'cart/updateCartItemQuantity',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers 
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { itemId, quantity, ...data };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

// Remove item from cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers 
                    // 'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {itemId, ...data}; // Return itemId to remove it from the state

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Clear cart
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers 
                    // 'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data; // Assuming the API returns an empty cart object

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
        },

        // Clear recently added item
        clearRecentlyAdded: (state) => {
            state.recentlyAdded = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ===== FETCH CART =====
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.user_id = action.payload.user_id;
                state.items = action.payload.items || [];
                state.cart_total = action.payload.cart_total || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ===== ADD TO CART =====
            .addCase(addToCart.pending, (state) => {
                state.addingToCart = true;
                state.addError = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.addingToCart = false;
                state.recentlyAdded = action.payload.item;
                // Refresh cart data by refetching
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.addingToCart = false;
                state.addError = action.payload;
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
                    state.cart_total = state.items.reduce((total, item) => total + item.total_price)
                }
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.updatingItem = false;
                state.updateError = action.payload;
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
            })

            // ===== CLEAR CART =====
            .addCase(clearCart.pending, (state) => {
                state.clearingCart = true;
                state.clearError = null;
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.clearingCart = false;
                state.items = [];
                state.cart_total = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.clearingCart = false;
                state.clearError = action.payload;
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

// Helper selector to check if item is in car
export const selectIsInCart = (productId) => (state) => {
    return state.cart.items.some(item => item.product_id === productId);
}

// Helper selector to get item quantity in cart
export const selectCartItemQuantity = (productId) => (state) => {
    const item = state.cart.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
}

// ===== ACTIONS =====
export const {
    toggleCartDrawer,
    closeCartDrawer,
    openCartDrawer,
    clearErrors,
    clearRecentlyAdded
} = cartSlice.actions;

export default cartSlice.reducer;