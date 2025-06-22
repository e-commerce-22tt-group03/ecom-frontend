import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products (placeholder for future API integration)
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            // TODO: Replace with actual API call
            // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
            // return response.data;
            
            // Mock data for now
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
            });
    }
});

export const { setSearchTerm, setCategoryFilter, setPriceRange, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;