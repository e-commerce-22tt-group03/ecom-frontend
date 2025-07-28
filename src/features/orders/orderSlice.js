import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch orders for the current user
export const fetchOrders = createAsyncThunk(
  'orders/fetch', 
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Fetch order items for a specific order
export const fetchOrderItems = createAsyncThunk(
  'orders/fetchItems',
  async (orderId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { orderId, items: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order items');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderItems: {}, // Store items by order_id
    loading: false,
    error: null,
    itemsLoading: {}
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch order items
      .addCase(fetchOrderItems.pending, (state, action) => {
        const orderId = action.meta.arg;
        state.itemsLoading[orderId] = true;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        const { orderId, items } = action.payload;
        state.orderItems[orderId] = items;
        state.itemsLoading[orderId] = false;
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        const orderId = action.meta.arg;
        state.itemsLoading[orderId] = false;
      });
  }
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;