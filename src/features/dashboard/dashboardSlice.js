import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSummary, getSalesOverTime, getTopProducts, getSalesByCategory } from '../../api/dashboardApi';

// --- Async Thunks ---
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (params, { rejectWithValue }) => {
    try {
      // Fetch all data points in parallel
      const [summary, salesOverTime, topProducts, salesByFlowerType, salesByOccasion] = await Promise.all([
        getSummary(params),
        getSalesOverTime(params),
        getTopProducts({ ...params, limit: 5, orderBy: 'quantity' }),
        getSalesByCategory({ ...params, categoryType: 'Flower Type' }),
        getSalesByCategory({ ...params, categoryType: 'Occasion' })
      ]);
      return { summary, salesOverTime, topProducts, salesByFlowerType, salesByOccasion };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// --- Slice Definition ---
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: {},
    salesOverTime: [],
    topProducts: [],
    salesByFlowerType: [], // New state for flower type category sales
    salesByOccasion: [],   // New state for occasion category sales
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.salesOverTime = action.payload.salesOverTime;
        state.topProducts = action.payload.topProducts;
        state.salesByFlowerType = action.payload.salesByFlowerType;
        state.salesByOccasion = action.payload.salesByOccasion;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
