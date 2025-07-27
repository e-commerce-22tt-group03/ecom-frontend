import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchOrders as fetchOrdersApi } from '../../api/orderApi';

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

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export default ordersSlice.reducer;
