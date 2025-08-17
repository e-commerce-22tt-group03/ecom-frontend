import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategories as fetchCategoriesApi,
  addCategory as addCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from '../../api/categoryApi';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await fetchCategoriesApi();
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const addCategory = createAsyncThunk('categories/addCategory', async (data, { rejectWithValue }) => {
  try {
    return await addCategoryApi(data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateCategoryApi(id, data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await deleteCategoryApi(id);
    return id;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    flower_types: [],
    occasions: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.flower_types = action.payload.flower_type;
        state.occasions = action.payload.occasion;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        const newCategory = action.payload;
        console.log(action.payload);
        if (newCategory.category_type === 'Flower Type') {
          state.flower_types.push(newCategory);
        } else {
          state.occasions.push(newCategory);
        }
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const list = updatedCategory.category_type === 'Flower Type' ? state.flower_types : state.occasions;
        const index = list.findIndex(c => c.category_id === updatedCategory.category_id);
        if (index !== -1) {
          list[index] = updatedCategory;
        } else { // when user change the category type
          if (updatedCategory.category_type === 'Flower Type') {
            state.occasions = state.occasions.filter(c => c.category_id !== updatedCategory.category_id);
            state.flower_types.push(updatedCategory);
          } else {
            state.flower_types = state.flower_types.filter(c => c.category_id !== updatedCategory.category_id);
            state.occasions.push(updatedCategory);
          }
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.flower_types = state.flower_types.filter(c => c.category_id !== action.payload);
        state.occasions = state.occasions.filter(c => c.category_id !== action.payload);
      });
  }
});

export default categoriesSlice.reducer;
