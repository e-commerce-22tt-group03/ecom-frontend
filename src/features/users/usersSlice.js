import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  deleteUser as deleteUserApi,
  fetchUsers as fetchUsersApi,
  updateUserRole as updateUserRoleApi
} from '../../api/userApi';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchUsersApi(params);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      return await updateUserRoleApi(userId, role);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUserApi(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Case fetchUsers
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Case updateUserRole
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.items.findIndex(user => user.user_id === updatedUser.user_id);
        if (index !== -1) {
          state.items[index] = updatedUser;
        }
      })
      // Case deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(user => user.user_id !== action.payload);
      });
  }
});

export default usersSlice.reducer;
