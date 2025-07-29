import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URL - temporarily
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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

            const response = await fetch(`${API_BASE_URL}/api/v1/products?${queryParams}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
);

// Fetch product details by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Product not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch product details');
        }
    }  
);

// Fetch list of categories
export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async (_, { rejectWithValue}) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/categories`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch categories');
        }
    }
);

// Fetch search suggestions
export const fetchSuggestions = createAsyncThunk(
    'products/fetchSuggestions',
    async ({ prefix, limit = SUGGESTIONS_LIMIT }, { rejectWithValue }) => {
        try {
            if (!prefix || prefix.trim().length < 2) {
                return { products: [] };
            }

            const response = await fetch(`${API_BASE_URL}/api/v1/suggestions?limit=${limit}&prefix=${encodeURIComponent(prefix)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch search suggestions');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        // Products listing
        items: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            limit: 24
        },

        // Categories from API
        categories: {
            flower_type: [],
            occasion: []
        },

        // Current product (for detail page)
        currentProduct: null,

        // Search suggestions
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

        // Filters - matching API parameters
        filters: {
            q: '',                      // Search term
            minPrice: null,             // Minimum price
            maxPrice: null,             // Maximum price
            condition: '',              // 'New Flower', 'Old Flower', 
                                        // 'Low Stock'
            categoryIds: '',            // Comma-separated category IDs
            sortBy: 'best_selling',     // 'sortBy' options: 'price_asc',
                                        // 'price_desc', 'name_asc', 'name_desc',
                                        // 'newest', 'best_selling'
            page: 1,
            limit: 24,                  // Items per page
        },

        // UI state management
        viewMode: 'grid',               // 'grid' or 'list'
        showFilters: false,             // Whether to show filters sidebar
    },

    reducers: {
        // Search and filter actions
        // Always reset to first page on new search/filter

        setSearchTerm: (state, action) => {
            state.filters.q = action.payload;
            state.filters.page = 1;
        },

        setPriceRange: (state, action) => {
            const [min, max] = action.payload;
            state.filters.minPrice = min >= 0 ? min : null; // Ensure valid number
            state.filters.maxPrice = max >= 0 ? max : null; // Ensure valid number
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

        // UI state actions
        setViewMode: (state, action) => {
            state.viewMode = action.payload; // 'grid' or 'list'
        },

        setShowFilters: (state, action) => {
            state.showFilters = action.payload; // true or false
        },

        // Reset filters to default values
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

        clearError: (state) => {
            state.error = null;
        },

        clearProductError: (state) => {
            state.productError = null;
        },

        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.productError = null;
        },

        clearSuggestions: (state) => {
            state.suggestions = [];
        },

        clearCategoriesError: (state) => {
            state.categoriesError = null;
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
                state.items = action.payload.products || [];
                state.pagination = action.payload.pagination || state.pagination;
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
                if (action.payload.data) {
                    state.categories = action.payload.data;
                }
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.categoriesLoading = false;
                state.categoriesError = action.payload;
            })

            // Fetch search suggestions
            .addCase(fetchSuggestions.pending, (state) => {
                state.suggestionsLoading = true;
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.suggestionsLoading = false;
                state.suggestions = action.payload.products || [];
            })
            .addCase(fetchSuggestions.rejected, (state, action) => {
                state.suggestionsLoading = false;
                state.suggestions = [];
            });
    }
});

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductLoading = (state) => state.products.productLoading;
export const selectCategoriesLoading = (state) => state.products.categoriesLoading;
export const selectSuggestionsLoading = (state) => state.products.suggestionsLoading;
export const selectProductsError = (state) => state.products.error;
export const selectProductError = (state) => state.products.productError;
export const selectCategoriesError = (state) => state.products.categoriesError;
export const selectCategories = (state) => state.products.categories;
export const selectSuggestions = (state) => state.products.suggestions;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = (state) => state.products.pagination;
export const selectViewMode = (state) => state.products.viewMode;
export const selectShowFilters = (state) => state.products.showFilters;

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
    clearError,
    clearProductError,
    clearCurrentProduct,
    clearSuggestions,
    clearCategoriesError
} = productsSlice.actions;

export default productsSlice.reducer;
