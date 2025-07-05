import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addProduct as addProductApi } from '../../api/productApi';

// Async thunk for fetching products (placeholder for future API integration)
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
            // return response.data;

            // Mock data for now
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            // Not sure what the line of code above for, will examine later.

            return [
                {
                    id: 1,
                    name: "Red Rose Bouquet",
                    price: 45.99,
                    image: "/placeholder-rose.jpg",
                    category: "Romantic",
                    isInStock: true,
                    description: "Beautiful red roses perfect for special occasions"
                },
                {
                    id: 2,
                    name: "Sunflower Arrangement",
                    price: 32.50,
                    image: "/placeholder-sunflower.jpg",
                    category: "Cheerful",
                    isInStock: true,
                    description: "Bright sunflowers to brighten your day"
                }
            ];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

// Async thunk for adding a new product
export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (productData, { rejectWithValue }) => {
        try {
            // The API spec says it returns an object with the added product
            const data = await addProductApi(productData);
            return data.product; // Return the newly created product
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
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
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new product to the list in the state
                state.items.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // The error message from rejectWithValue
            });

    }
});

export const { setSearchTerm, setCategoryFilter, setPriceRange, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;