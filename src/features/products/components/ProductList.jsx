import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Search,
    Filter,
    Grid,
    List,
    SlidersHorizontal,
    X
} from 'lucide-react';
import { debounce} from 'lodash';

import ProductCard from './ProductCard';
import {
    fetchProducts,
    fetchCategories,
    fetchSuggestions,
    // fetchProductById,
    setSearchTerm,
    setPriceRange,
    setConditionFilter,
    setCategoryFilter,
    setSortBy,
    setPage,
    // setLimit,
    setViewMode,
    setShowFilters,
    clearFilters,
    clearSuggestions,
    selectAllProducts,
    selectProductsLoading,
    selectProductsError,
    selectCategories,
    selectCategoriesLoading,
    selectSuggestions,
    selectSuggestionsLoading,
    selectFilters,
    selectPagination,
    selectViewMode,
    selectShowFilters,
} from '../productsSlice';

const MINPRICE = 0;
const MAXPRICE = 1000;

const ProductList = () => {
    const dispatch = useDispatch();

    // Redux state 
    const products = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const categories = useSelector(selectCategories);
    const categoriesLoading = useSelector(selectCategoriesLoading);
    const suggestions = useSelector(selectSuggestions);
    const suggestionsLoading = useSelector(selectSuggestionsLoading);
    const filters = useSelector(selectFilters);
    const pagination = useSelector(selectPagination);
    const viewMode = useSelector(selectViewMode);
    const showFilters = useSelector(selectShowFilters);

    // Local state for UI controls
    const [searchInput, setSearchInput] = useState(filters.q);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [priceRangeLocal, setPriceRangeLocal] = useState([
        filters.minPrice || MINPRICE,
        filters.maxPrice || MAXPRICE 
    ]);

    ///////////////////////////////// Debounced Handlers /////////////////////////////////

    // Debounced search input handler
    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            dispatch(setSearchTerm(searchTerm));
            if (searchTerm.trim().length >= 2) {
                dispatch(fetchSuggestions({ prefix: searchTerm }));
                setShowSuggestions(true);
            }
            else {
                dispatch(clearSuggestions());
                setShowSuggestions(false);
            }
        }, 300),
        [dispatch]
    );

    // Debounced price range filter handler
    const debouncedPriceChange = useCallback(
        debounce((range) => {
            dispatch(setPriceRange(range));
        }, 500),
        [dispatch]
    );

    ///////////////////////////////// Effect Hooks /////////////////////////////////

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProducts(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        debouncedSearch(searchInput);
    }, [searchInput, debouncedSearch]);

    useEffect(() => {
        debouncedPriceChange(priceRangeLocal);
    }, [priceRangeLocal, debouncedPriceChange]);

    ///////////////////////////////// Local State Handlers /////////////////////////////////

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchInput(suggestion);
        dispatch(setSearchTerm(suggestion));
        setShowSuggestions(false);
        dispatch(clearSuggestions());
    };

    const handlePriceRangeChange = (index, value) => {
        const newRange = [...priceRangeLocal];
        newRange[index] = parseInt(value);

        // Ensure min is less than max
        if (index === 0 && newRange[0] > newRange[1]) {
            newRange[0] = newRange[1];
        }
        if (index === 1 && newRange[1] < newRange[0]) {
            newRange[1] = newRange[0];
        }

        setPriceRangeLocal(newRange);
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setSearchInput('');
        setPriceRangeLocal([MINPRICE, MAXPRICE]);
        setShowSuggestions(false);
        // dispatch(clearSuggestions()); // ????????????????? Should this be here?     
    };

    const conditionOptions = [
        { value: '', label: 'All Conditions' },
        { value: 'New Flower', label: 'New Flower' },
        { value: 'Old Flower', label: 'Old Flower' },
        { value: 'Low Stock', label: 'Low Stock' },
    ];

    const sortOptions = [
        { value: 'best_selling', label: 'Best Selling' },
        { value: 'newest', label: 'Newest' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A-Z' },
        { value: 'name_desc', label: 'Name: Z-A' },
    ];

    if (loading && products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Our Products</h1>
                <p className="text-lg text-base-content/70">
                    Discover our beautiful collection of fresh flowers, and arrangements
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="card bg-base-100 shadow-lg mb-8">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        { /* Search with Autocomplete */ }
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                            <input 
                                type="text" 
                                placeholder="Search flowers..."
                                className="input input-bordered w-full pl-10"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click on suggestion
                            />

                            {/* Search Suggestions */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 mt-1">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            className="w-full text-left px-4 py-2 hover:bg-base-200 first:rounded-t-lg last:rounded-b-lg"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <Search className="inline-block w-4 h-4 mr-2 text-base-content/40" />
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Sort Dropdown */}
                        <select 
                            className="select select-bordered w-full lg:w-auto min-w-48"
                            value={filters.sortBy}
                            onChange={(e) => dispatch(setSortBy(e.target.value))}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        { /* Advanced Filters Toggle */ }
                        <button
                            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => dispatch(setShowFilters(!showFilters))}
                        >
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                            {(filters.condition || filters.categoryIds || filters.minPrice || filters.maxPrice) && (
                                <span className="badge badge-error badge-sm ml-1">•</span>        
                            )}
                        </button>

                        { /* View Mode Toggle */ }
                        <div className="join">
                            <button
                                className={`btn join-item ${viewMode === 'grid' ? 'btn-active' : ''}`}
                                onClick={() => dispatch(setViewMode('grid'))}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                className={`btn join-item ${viewMode === 'list' ? 'btn-active' : ''}`}
                                onClick={() => dispatch(setViewMode('list'))}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    { /* Advanced Filters */ }
                    {showFilters && (
                        <div className="mt-6 p-6 bg-base-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Price Range - Dual Range */}
                                <div className="lg:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Price Range</span>
                                    </label>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="label">
                                                    <span className="label-text-alt">Min Price</span>
                                                </label>
                                                <input 
                                                    type="range"
                                                    min={MINPRICE}
                                                    max={MAXPRICE}
                                                    value={priceRangeLocal[0]}
                                                    onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                                                    className="range range-primary range-sm" 
                                                />
                                                <div className="text-center text-sm font-semibold">${priceRangeLocal[0]}</div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="label">
                                                    <span className="label-text-alt">Max Price</span>
                                                </label>
                                                <input 
                                                    type="range"
                                                    min={MINPRICE}
                                                    max={MAXPRICE}
                                                    value={priceRangeLocal[1]}
                                                    onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                                                    className="range range-primary range-sm"
                                                />
                                                <div className="text-center text-sm font-semibold">${priceRangeLocal[1]}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-xs text-base-content/70">
                                            <span>${MINPRICE}</span>
                                            <span>${MAXPRICE}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Condition Filter */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Condition</span>
                                    </label>
                                    <select 
                                        className="select select-bordered w-full"
                                        value={filters.condition}
                                        onChange={(e) => dispatch(setConditionFilter(e.target.value))}
                                    >
                                        {conditionOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category Filters */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Categories</span>
                                    </label>
                                    {categoriesLoading ? (
                                        <div className="skeleton h-10 w-full"></div>
                                    ) : (
                                        <details className="dropdown w-full">
                                            <summary className="m-1 btn btn-outline w-full justify-between">
                                                Select Categories
                                            </summary>
                                            <div className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
                                                <div className="space-y-3">
                                                    {/* Flower Types */}
                                                    {categories.flower_type?.length > 0 && (
                                                        <div>
                                                            <div className="font-semibold text-sm text-base-content/70 mb-2">Flower Types</div>
                                                            {categories.flower_type.map(category => (
                                                                <label key={category.category_id} className="cursor-pointer label justify-start gap-2">
                                                                    <input 
                                                                        type="checkbox"
                                                                        className="checkbox checkbox-sm checkbox-primary"
                                                                        checked={filters.categoryIds.includes(category.category_id.toString())}
                                                                        onChange={(e) => {
                                                                            const currentIds = filters.categoryIds.split(',').filter(id => id);
                                                                            const categoryId = category.category_id.toString();

                                                                            if (e.target.checked) {
                                                                                const newIds = [...currentIds, categoryId];
                                                                                dispatch(setCategoryFilter(newIds.join(',')));
                                                                            } else {
                                                                                const newIds = currentIds.filter(id => id !== categoryId);
                                                                                dispatch(setCategoryFilter(newIds.join(',')));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="label-text text-sm">{category.name}</span>
                                                                </label>                                      
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Occasions */}
                                                    {categories.occasion?.length > 0 && (
                                                        <div>
                                                            <div className="font-semibold text-sm text-base-content/70 mb-2">Occasions</div>
                                                            {categories.occasion.map(category => (
                                                                <label key={category.category_id} className="cursor-pointer label justify-start gap-2">
                                                                    <input 
                                                                        type="checkbox"
                                                                        className="checkbox checkbox-sm checkbox-primary"
                                                                        checked={filters.categoryIds.includes(category.category_id.toString())} 
                                                                        onChange={(e) => {
                                                                            const currentIds = filters.categoryIds.split(',').filter(id => id);
                                                                            const categoryId = category.category_id.toString();

                                                                            if (e.target.checked) {
                                                                                const newIds = [...currentIds, categoryId];
                                                                                dispatch(setCategoryFilter(newIds.join(',')));
                                                                            } else {
                                                                                const newIds = currentIds.filter(id => id !== categoryId);
                                                                                dispatch(setCategoryFilter(newIds.join(',')));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="label-text text-sm">{category.name}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </details>
                                    )}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleClearFilters}
                                    className="btn btn-outline btn-sm"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Active Filters Display */}
            {(filters.q || filters.condition || filters.categoryIds || filters.minPrice || filters.maxPrice) && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {filters.q && (
                        <div className="badge badge-primary gap-2">
                            Search: "{filters.q}"
                            <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                // dispatch(setSearchTerm(''));
                                setSearchInput('');
                                dispatch(setSearchTerm(''));
                            }} />
                        </div>
                    )}
                    {filters.condition && (
                        <div className="badge badge-secondary gap-2">
                            {filters.condition}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => dispatch(setConditionFilter(''))} />
                        </div>
                    )}
                    {(filters.minPrice || filters.maxPrice) && (
                        <div className="badge badge-accent gap-2">
                            ${filters.minPrice || MINPRICE} - ${filters.maxPrice || MAXPRICE}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => {
                                dispatch(setPriceRange([null, null]));
                                setPriceRangeLocal([0, 200]);
                            }} />
                        </div>
                    )}
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="alert alert-error mb-6">
                    <span>Error loading products: {error}</span>
                </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-lg font-semibold">
                        {pagination.totalItems} products found
                    </span>
                    {filters.q && (
                        <span className="text-base-content/70 ml-2">
                            for "{filters.q}"
                        </span>
                    )}
                </div>
                {loading && (
                    <span className="loading loading-spinner loading-sm"></span>
                )}
            </div>

            {/* Products Grid/List */}
            <div className={`${
                viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}>
                {products.map(product => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                        viewMode={viewMode}
                    />
                ))}
            </div>

            {/* No Results */}
            {!loading && products.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌸</div>
                    <h3 className="text-2xl font-bold mb-2">No products found</h3>
                    <p className="text-base-content/70 mb-4">
                        Try adjusting your search or filter settings.
                    </p>
                    <button
                        onClick={handleClearFilters}
                        className="btn btn-primary"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <div className="join">
                        <button
                            className="join-item btn"
                            disabled={pagination.currentPage === 1}
                            onClick={() => dispatch(setPage(pagination.currentPage - 1))}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const page = pagination.currentPage <= 3
                                ? i + 1
                                : pagination.currentPage + i - 2;
                            
                            if (page > pagination.totalPages) return null;

                            return (
                                <button
                                    key={page}
                                    className={`join-item btn ${pagination.currentPage === page ? 'btn-active' : ''}`}
                                    onClick={() => dispatch(setPage(page))}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button 
                            className="join-item btn"
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => dispatch(setPage(pagination.currentPage + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;