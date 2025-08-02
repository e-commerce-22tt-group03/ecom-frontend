import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
      return rejectWithValue(error.toString());
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
    items: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_orders: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
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

export default ordersSlice.reducer;
