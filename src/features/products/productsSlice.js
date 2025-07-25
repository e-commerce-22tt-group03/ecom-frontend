import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    addProduct as addProductApi,
    deleteProduct as deleteProductApi,
    fetchProducts as fetchProductsApi,
    updateProduct as updateProductApi
} from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params, { rejectWithValue }) => {
        try {
            const data = await fetchProductsApi(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const data = await addProductApi(productData);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ productId, productData }, { rejectWithValue }) => {
        try {
            const data = await updateProductApi(productId, productData);
            return data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await deleteProductApi(productId);
            return productId; // Return the ID on success
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        pagination: {},
        loading: false,
        error: null,
        filters: {
            category: '',
            priceRange: [0, 1000],
            searchTerm: ''
        }
    },
    reducers: {
        setSearchTerm: (state, action) => {
            state.filters.searchTerm = action.payload;
        },
        setCategoryFilter: (state, action) => {
            state.filters.category = action.payload;
        },
        setPriceRange: (state, action) => {
            state.filters.priceRange = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                category: '',
                priceRange: [0, 1000],
                searchTerm: ''
            };
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Product
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Product
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchTerm, setCategoryFilter, setPriceRange, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;