import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('profile/update', async (profile, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, profile, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: { data: null, loading: false, error: null, updateSuccess: false },
  reducers: { clearProfileError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; state.updateSuccess = false; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; state.updateSuccess = true; })
      .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.updateSuccess = false; });
  }
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer; 