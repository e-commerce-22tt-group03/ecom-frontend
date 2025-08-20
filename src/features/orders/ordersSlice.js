import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  fetchOrderById as fetchOrderByIdApi,
  fetchOrders as fetchOrdersApi,
  updateOrderStatus as updateOrderStatusApi,
  updateShippingInfo as updateShippingInfoApi
} from '../../api/orderApi';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchOrdersApi(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.toString());
    }
  }
);

// Fetch order items for a specific order
export const fetchOrderItems = createAsyncThunk(
  'orders/fetchItems',
  async (orderId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      // Use the existing getOrderById endpoint which includes items
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { orderId, items: res.data.data.items };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order items');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      return await fetchOrderByIdApi(orderId);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      return await updateOrderStatusApi(orderId, status);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);


export const updateShippingInfo = createAsyncThunk(
  'orders/updateShippingInfo',
  async ({ orderId, shippingData }, { rejectWithValue }) => {
    try {
      return await updateShippingInfoApi(orderId, shippingData);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    // Combined state from both slices
    items: [],
    orderItems: {}, // Store items by order_id
    selectedOrder: null, // For admin order details
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_orders: 0,
    },
    loading: false,
    error: null,
    itemsLoading: {} // Track loading state for individual order items
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Cases for fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cases for fetchOrderItems
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
      })
      // Cases for fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cases for updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (state.selectedOrder && state.selectedOrder.order_id === action.payload.order_id) {
          state.selectedOrder.status = action.payload.status;
        }
      })
      // Cases for updateShippingInfo
      .addCase(updateShippingInfo.fulfilled, (state, action) => {
        if (state.selectedOrder && state.selectedOrder.order_id === action.payload.order_id) {
          state.selectedOrder = { ...state.selectedOrder, ...action.payload };
        }
      });

  }
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
