import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";
import api from "../../api/axiosConfig";

// Helper: determine if user has JWT
const hasJwt = (getState) => {
  const { auth } = getState();
  return !!(auth?.token || auth?.isAuthenticated);
};

// Ensure a guest session cookie exists if not logged in
export const getGuestSession = createAsyncThunk(
  'cart/getGuestSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/guest/session');
      return { exists: true, data: res.data?.data };
    } catch (error) {
      if (error.status === 404) {
        return rejectWithValue({ notFound: true });
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

export const startGuestSession = createAsyncThunk(
  'cart/startGuestSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/guest/session', {});
      return { created: true, data: res.data?.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const ensureGuestSession = createAsyncThunk(
  'cart/ensureGuestSession',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      if (hasJwt(getState)) return { skipped: true };
      const res = await dispatch(getGuestSession());
      if (getGuestSession.rejected.match(res) && res.payload?.notFound) {
        const createRes = await dispatch(startGuestSession());
        if (startGuestSession.rejected.match(createRes)) {
          return rejectWithValue(createRes.payload || 'Failed to start guest session');
        }
        return { ensured: true };
      }
      if (getGuestSession.rejected.match(res)) {
        return rejectWithValue(res.payload?.message || 'Failed to get guest session');
      }
      return { ensured: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch cart (works for user or guest)
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!hasJwt(getState)) {
        await dispatch(ensureGuestSession());
      }
      const res = await api.get('/cart');
      const payload = res.data?.data || res.data || {};
      return {
        user_id: payload.user_id || null,
        items: payload.items || [],
        cart_total: payload.cart_total || 0,
        lastFetchedAt: Date.now(),
      };
    } catch (error) {
      // If unauthorized without JWT, ensure session and retry once
      if (error.status === 401 && !hasJwt(getState)) {
        try {
          await dispatch(ensureGuestSession());
          const retry = await api.get('/cart');
          const p = retry.data?.data || retry.data || {};
          return {
            user_id: p.user_id || null,
            items: p.items || [],
            cart_total: p.cart_total || 0,
            lastFetchedAt: Date.now(),
          };
        } catch (e) {
          return rejectWithValue(e.message);
        }
      }
      if (error.status === 404) {
        // Just empty cart if not found
        return { user_id: null, items: [], cart_total: 0, lastFetchedAt: Date.now() };
      }
      return rejectWithValue(error.message);
    }
  }
);

// Add item then refetch
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product_id, quantity }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!hasJwt(getState)) {
        await dispatch(ensureGuestSession());
      }
      const res = await api.post('/cart', { product_id, quantity });
      // Refetch to get enriched totals/pricing
      await dispatch(fetchCart());
      const data = res.data?.data || res.data;
      return { item: data?.item || data, message: res.data?.message || 'Item added to cart' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update quantity then refetch
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ itemId, quantity }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!hasJwt(getState)) {
        await dispatch(ensureGuestSession());
      }
      await api.patch(`/cart/${itemId}`, { quantity });
      await dispatch(fetchCart());
      return { itemId, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove item then refetch
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!hasJwt(getState)) {
        await dispatch(ensureGuestSession());
      }
      await api.delete(`/cart/${itemId}`);
      await dispatch(fetchCart());
      return { itemId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear cart then refetch (will be empty)
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      if (!hasJwt(getState)) {
        await dispatch(ensureGuestSession());
      }
      await api.delete('/cart');
      await dispatch(fetchCart());
      return { cleared: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    user_id: null,
    items: [],
    cart_total: 0,
    isOpen: false,
    loading: false,
    addingToCart: false,
    updatingItem: false,
    removingItem: false,
    clearingCart: false,
    error: null,
    addError: null,
    updateError: null,
    removeError: null,
    clearError: null,
    recentlyAdded: null,
    requiresAuth: false,
    lastFetchedAt: null,
    sessionReady: false,
  },
  reducers: {
    toggleCartDrawer: (state) => { state.isOpen = !state.isOpen; },
    closeCartDrawer: (state) => { state.isOpen = false; },
    openCartDrawer: (state) => { state.isOpen = true; },
    clearErrors: (state) => {
      state.error = null; state.addError = null; state.updateError = null; state.removeError = null; state.clearError = null; state.requiresAuth = false;
    },
    clearRecentlyAdded: (state) => { state.recentlyAdded = null; },
    resetCart: (state) => {
      state.user_id = null; state.items = []; state.cart_total = 0; state.isOpen = false; state.recentlyAdded = null; state.requiresAuth = false; state.lastFetchedAt = null;
    },
    setRequiresAuth: (state, action) => { state.requiresAuth = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // session
      .addCase(ensureGuestSession.fulfilled, (state) => {
        state.sessionReady = true;
      })
      .addCase(ensureGuestSession.rejected, (state) => {
        state.sessionReady = false;
      })

      // fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true; state.error = null; state.requiresAuth = false;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.user_id = action.payload.user_id;
        state.items = action.payload.items || [];
        state.cart_total = action.payload.cart_total || 0;
        state.lastFetchedAt = action.payload.lastFetchedAt || Date.now();
        state.requiresAuth = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        const msg = action.payload || action.error?.message || '';
        state.loading = false;
        // Gracefully degrade on network error: show empty cart without error banner
        if (typeof msg === 'string' && msg.toLowerCase().includes('network error')) {
          state.error = null;
          state.items = state.items || [];
          state.cart_total = state.cart_total || 0;
          return;
        }
        state.error = msg;
        // don't block guests; surface error only otherwise
      })

      // add
      .addCase(addToCart.pending, (state) => { state.addingToCart = true; state.addError = null; state.requiresAuth = false; })
      .addCase(addToCart.fulfilled, (state, action) => { state.addingToCart = false; state.recentlyAdded = action.payload.item; })
      .addCase(addToCart.rejected, (state, action) => { state.addingToCart = false; state.addError = action.payload || action.error?.message; })

      // update quantity
      .addCase(updateCartItemQuantity.pending, (state) => { state.updatingItem = true; state.updateError = null; })
      .addCase(updateCartItemQuantity.fulfilled, (state) => { state.updatingItem = false; })
      .addCase(updateCartItemQuantity.rejected, (state, action) => { state.updatingItem = false; state.updateError = action.payload || action.error?.message; })

      // remove
      .addCase(removeFromCart.pending, (state) => { state.removingItem = true; state.removeError = null; })
      .addCase(removeFromCart.fulfilled, (state) => { state.removingItem = false; })
      .addCase(removeFromCart.rejected, (state, action) => { state.removingItem = false; state.removeError = action.payload || action.error?.message; })

      // clear
      .addCase(clearCart.pending, (state) => { state.clearingCart = true; state.clearError = null; })
      .addCase(clearCart.fulfilled, (state) => { state.clearingCart = false; state.items = []; state.cart_total = 0; })
      .addCase(clearCart.rejected, (state, action) => { state.clearingCart = false; state.clearError = action.payload || action.error?.message; })

      // logout resets cart
      .addCase(logout, (state) => {
        state.user_id = null; state.items = []; state.cart_total = 0; state.isOpen = false; state.recentlyAdded = null; state.requiresAuth = false;
        state.loading = false; state.addingToCart = false; state.updatingItem = false; state.removingItem = false; state.clearingCart = false;
        state.error = null; state.addError = null; state.updateError = null; state.removeError = null; state.clearError = null; state.lastFetchedAt = null;
      });
  }
});

// Selectors
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
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const { toggleCartDrawer, closeCartDrawer, openCartDrawer, clearErrors, clearRecentlyAdded, resetCart, setRequiresAuth } = cartSlice.actions;

export default cartSlice.reducer;