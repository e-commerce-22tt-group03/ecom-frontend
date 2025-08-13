import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { placeOrderApi, fetchOrderDetailApi } from '../../api/checkoutApi';
import { fetchCart } from '../cart/cartSlice';

export const placeOrder = createAsyncThunk('checkout/placeOrder', async ({ shipping_address_id, payment_method }, { dispatch, rejectWithValue }) => {
  try {
    const order = await placeOrderApi({ shipping_address_id, payment_method });
    // Refresh cart (backend clears it on success)
    await dispatch(fetchCart());
    return order;
  } catch (e) {
    return rejectWithValue(e.message || e.toString());
  }
});

export const fetchOrderDetail = createAsyncThunk('checkout/fetchOrderDetail', async (orderId, { rejectWithValue }) => {
  try {
    return await fetchOrderDetailApi(orderId);
  } catch (e) {
    return rejectWithValue(e.message || e.toString());
  }
});

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    placing: 'idle',
    lastOrderId: null,
    lastOrderDetail: null,
    error: null,
    fetchingDetail: false,
  },
  reducers: {
    resetCheckout: (state) => { state.placing = 'idle'; state.lastOrderId = null; state.lastOrderDetail = null; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.placing = 'loading'; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placing = 'succeeded';
        state.lastOrderId = action.payload.order_id;
        state.lastOrderDetail = action.payload; // header only; items fetched separately
      })
      .addCase(placeOrder.rejected, (state, action) => { state.placing = 'failed'; state.error = action.payload; })

      .addCase(fetchOrderDetail.pending, (state) => { state.fetchingDetail = true; state.error = null; })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => { state.fetchingDetail = false; state.lastOrderDetail = action.payload; })
      .addCase(fetchOrderDetail.rejected, (state, action) => { state.fetchingDetail = false; state.error = action.payload; });
  }
});

export const { resetCheckout } = checkoutSlice.actions;
export const selectCheckoutPlacing = (state) => state.checkout.placing;
export const selectLastOrderId = (state) => state.checkout.lastOrderId;
export const selectLastOrderDetail = (state) => state.checkout.lastOrderDetail;
export const selectCheckoutError = (state) => state.checkout.error;

export default checkoutSlice.reducer;
