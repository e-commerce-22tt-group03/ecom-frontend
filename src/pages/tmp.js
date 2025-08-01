import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URL - temporarily
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

// keyword suggestions limit
const SUGGESTIONS_LIMIT = 5;

// Fetch products with all filtering/sorting options
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params = {}, { rejectWithValue }) => {
        try {
            const {
                q = '',
                minPrice = null,
                maxPrice = null,
                condition = '',
                categoryIds = '',
                sortBy = '',
                page = 1,
                limit = 24
            } = params;

            const queryParams = new URLSearchParams();

            // Add query parameters if they exist
            if (q.trim()) queryParams.append('q', q);
            if (minPrice !== null && minPrice >= 0) queryParams.append('minPrice', minPrice.toString());
            if (maxPrice !== null && maxPrice >= 0) queryParams.append('maxPrice', maxPrice.toString());
            if (condition) queryParams.append('condition', condition);
            if (categoryIds) queryParams.append('categoryIds', categoryIds);
            if (sortBy) queryParams.append('sortBy', sortBy);
            queryParams.append('page', page.toString());
            queryParams.append('limit', limit.toString());

            const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle the new API response structure
            if (data.status === 'success') {
                return {
                    products: data.products || [],
                    pagination: data.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0,
                        limit: 24
                    }
                };
            } else {
                throw new Error(data.message || 'Failed to fetch products');
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch product details by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Product not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle the new API response structure
            if (data.status === 'success' && data.data && data.data.product) {
                return data.data.product;
            } else {
                throw new Error(data.message || 'Failed to fetch product details');
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch list of categories
export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle the API response structure
            if (data.status === 'success' && data.data) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch categories');
            }

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch search suggestions
export const fetchSuggestions = createAsyncThunk(
    'products/fetchSuggestions',
    async ({ prefix, limit = SUGGESTIONS_LIMIT }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                prefix,
                limit: limit.toString()
            });

            const response = await fetch(`${API_BASE_URL}/suggestions?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle the API response structure
            return data.products || [];

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        // Product listing
        items: [],
        totalProducts: 0,
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        
        // Categories
        categories: {
            flower_type: [],
            occasion: []
        },
        
        // Current product (for product detail page)
        currentProduct: null,
        
        // Suggestions
        suggestions: [],
        
        // Loading states
        loading: false,
        productLoading: false,
        categoriesLoading: false,
        suggestionsLoading: false,
        
        // Error states
        error: null,
        productError: null,
        categoriesError: null,
        suggestionsError: null,
        
        // UI states
        viewMode: 'grid',
        showFilters: false,
        
        // Filters
        filters: {
            q: '',
            minPrice: null,
            maxPrice: null,
            condition: '',
            categoryIds: '',
            sortBy: 'best_selling',
            page: 1,
            limit: 24
        }
    },
    reducers: {
        // Filter actions
        setSearchTerm: (state, action) => {
            state.filters.q = action.payload;
            state.filters.page = 1; // Reset to first page when searching
        },
        setPriceRange: (state, action) => {
            const [minPrice, maxPrice] = action.payload;
            state.filters.minPrice = minPrice;
            state.filters.maxPrice = maxPrice;
            state.filters.page = 1;
        },
        setConditionFilter: (state, action) => {
            state.filters.condition = action.payload;
            state.filters.page = 1;
        },
        setCategoryFilter: (state, action) => {
            state.filters.categoryIds = action.payload;
            state.filters.page = 1;
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
            state.filters.page = 1;
        },
        setPage: (state, action) => {
            state.filters.page = action.payload;
        },
        setLimit: (state, action) => {
            state.filters.limit = action.payload;
            state.filters.page = 1;
        },
        
        // UI actions
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
        setShowFilters: (state, action) => {
            state.showFilters = action.payload;
        },
        
        // Clear actions
        clearFilters: (state) => {
            state.filters = {
                q: '',
                minPrice: null,
                maxPrice: null,
                condition: '',
                categoryIds: '',
                sortBy: 'best_selling',
                page: 1,
                limit: 24
            };
        },
        clearSuggestions: (state) => {
            state.suggestions = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        clearProductError: (state) => {
            state.productError = null;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.productError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.products;
                
                // Update pagination
                const pagination = action.payload.pagination;
                state.totalProducts = pagination.totalItems;
                state.currentPage = pagination.currentPage;
                state.totalPages = pagination.totalPages;
                state.hasNextPage = pagination.currentPage < pagination.totalPages;
                state.hasPreviousPage = pagination.currentPage > 1;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.productLoading = true;
                state.productError = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.productLoading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.productLoading = false;
                state.productError = action.payload;
            })
            
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.categoriesLoading = true;
                state.categoriesError = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categoriesLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload;
            })
            
            // Fetch suggestions
            .addCase(fetchSuggestions.pending, (state) => {
                state.suggestionsLoading = true;
                state.suggestionsError = null;
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.suggestionsLoading = false;
                state.suggestions = action.payload;
            })
            .addCase(fetchSuggestions.rejected, (state, action) => {
                state.suggestionsLoading = false;
                state.suggestionsError = action.payload;
            });
    }
});

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductLoading = (state) => state.products.productLoading;
export const selectProductsError = (state) => state.products.error;
export const selectProductError = (state) => state.products.productError;
export const selectCategories = (state) => state.products.categories;
export const selectCategoriesLoading = (state) => state.products.categoriesLoading;
export const selectSuggestions = (state) => state.products.suggestions;
export const selectSuggestionsLoading = (state) => state.products.suggestionsLoading;
export const selectFilters = (state) => state.products.filters;
export const selectViewMode = (state) => state.products.viewMode;
export const selectShowFilters = (state) => state.products.showFilters;
export const selectPagination = (state) => ({
    currentPage: state.products.currentPage,
    totalPages: state.products.totalPages,
    totalItems: state.products.totalProducts,
    hasNextPage: state.products.hasNextPage,
    hasPreviousPage: state.products.hasPreviousPage
});

export const { 
    setSearchTerm, 
    setPriceRange, 
    setConditionFilter,
    setCategoryFilter, 
    setSortBy,
    setPage,
    setLimit,
    setViewMode,
    setShowFilters,
    clearFilters,
    clearSuggestions,
    clearError,
    clearProductError,
    clearCurrentProduct
} = productsSlice.actions;

export default productsSlice.reducer;