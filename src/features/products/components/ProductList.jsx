import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductList = () => {
    const minPrice = 0;
    const maxPrice = 200;
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc',
    //  'rating-asc', 'rating-desc', 'name-asc', 'name-desc', 'newest', 'latest'
    const [filterCategory, setFilterCategory] = useState('all'); //
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice])
    const [showFilters, setShowFilters] = useState(false);

//     // This will later connect to Redux store
//     // const { products, loading, error } = useSelector(state => state.products);
    
//     // Mock data for now - will be replaced with Redux state
//     const mockProducts = [
//         {
//             id: 1,
//             name: "Red Rose Bouquet",
//             price: 45.99,
//             image: "/placeholder-rose.jpg",
//             category: "Romantic",
//             isInStock: true
//         },
//         {
//             id: 2,
//             name: "Sunflower Arrangement",
//             price: 32.50,
//             image: "/placeholder-sunflower.jpg",
//             category: "Cheerful",
//             isInStock: true
//         },
//         {
//             id: 3,
//             name: "Wedding White Lilies",
//             price: 78.00,
//             image: "/placeholder-lily.jpg",
//             category: "Wedding",
//             isInStock: false
//         }
//     ];

//     const loading = false;
//     const error = null;

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-64">
//                 <span className="loading loading-spinner loading-lg"></span>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="alert alert-error">
//                 <span>Error loading products: {error}</span>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {mockProducts.map(product => (
//                     <ProductCard key={product.id} product={product} />
//                 ))}
//             </div>
//             {mockProducts.length === 0 && (
//                 <div className="text-center py-12">
//                     <p className="text-lg text-base-content/70">No products found</p>
//                 </div>
//             )}
//         </div>
//     );
// }; The older version of ProductList.jsx

    // TODO: Connect to Redux store to fetch products
    // const { products, loading, error, categories } = useSelector(state => state.products);
    // Mock data - enhanced product structure
    const mockProducts = [
        {
            id: 1,
            name: "Premium Red Rose Bouquet",
            price: 89.99,
            originalPrice: 119.99,
            discount: 25,
            image: "/placeholder-rose.jpg",
            category: "Premium Bouquets",
            rating: 4.8,
            reviewCount: 156,
            isInStock: true,
            stockCount: 23,
            isFeatured: true,
            isNew: false,
            tags: ["bestseller", "premium"]
        },

        {
            id: 2,
            name: "Sunflower Garden Arrangement",
            price: 65.50,
            originalPrice: null,
            discount: 0,
            image: "/placeholder-sunflower.jpg",
            category: "Seasonal",
            rating: 4.6,
            reviewCount: 89,
            isInStock: true,
            stockCount: 15,
            isFeatured: false,
            isNew: true,
            tags: ["seasonal", "cheerful"]
        },
        
        {
            id: 3,
            name: "Wedding White Lilies",
            price: 124.00,
            originalPrice: 145.00,
            discount: 15,
            image: "/placeholder-lily.jpg",
            category: "Wedding",
            rating: 4.9,
            reviewCount: 203,
            isInStock: false,
            stockCount: 0,
            isFeatured: true,
            isNew: false,
            tags: ["wedding", "elegant"]
        },

        {
            id: 4,
            name: "Mixed Seasonal Bouquet",
            price: 45.99,
            originalPrice: null,
            discount: 0,
            image: "/images/products/mixed/seasonal-bouquet-80-1200x1200mix.jpg",
            category: "Seasonal",
            rating: 4.4,
            reviewCount: 67,
            isInStock: true,
            stockCount: 8, 
            isFeatured: false,
            isNew: false,
            tags: ["mixed", "colorful"]
        }
    ];

    const categories = [
        { id: 'all', name: 'All Categories', count: mockProducts.length },
        { id: 'premium', name: 'Premium Bouquets', count: 1},
        { id: 'seasonal', name: 'Seasonal', count: 2 },
        { id: 'wedding', name: 'Wedding', count: 1 },
        // { id: 'mixed', name: 'Mixed', count: 1 }
    ];

    const loading = false;
    const error = null;

    // Filter and sort products
    const filteredProducts = mockProducts
        .filter(product => {
            // filter base on category
            if (filterCategory !== 'all' && !product.category.toLowerCase().includes(filterCategory)) {
                return false;
            }
            
            // search base on name
            if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }

            // filter base on price range
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }

            // other wise, this product can be shown
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating-asc': return a.rating - b.rating;
                case 'rating-desc': return b.rating - a.rating;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                // case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'newest': return b.isNew - a.isNew; // Temporary solution
                case 'latest': return b.isNew - a.isNew; // Temporary solution
                default: return b.isFeatured - a.isFeatured; 
            }
        });
    
    if (loading) {
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
                <h1 className="text-4xl font-bold mb-4"> Our Products</h1>
                <p className="text-lg text-base-content/70">
                    Discover our beautiful collection of fresh flowers, and arrangements
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="card bg-base-100 shadow-lg mb-8">
                <div className="card-body">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        { /* Search */ }
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
                            <input 
                                type="text" 
                                placeholder="Search products..."
                                className="input input-bordered w-full pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        { /* Category Filter */ }
                        <select 
                            className="select select-bordered w-full lg:w-auto"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.count})
                                </option>
                            ))}
                        </select>

                        { /* Advanced Filters Toggle */ }
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </button>

                        { /* View Mode Toggle */ }
                        <div className="join">
                            <button
                                className={`btn join-item ${viewMode === 'grid' ? 'btn-active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button
                                className={`btn join-item ${viewMode === 'list' ? 'btn-active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    { /* Advanced Filters */ }
                    {showFilters && (
                        <div className="mt-6 p-4 bg-base-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Price Range */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Price Range</span>
                                    </label>
                                    <div className="space-y-2">
                                        <input 
                                            type="range"
                                            min= {minPrice}
                                            max= {maxPrice}
                                            value= {priceRange[1]} 
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="range range-primary"
                                        />
                                        <div className="flex justify-between text-sm">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Status */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Availability</span>
                                    </label>
                                    <div className="form-control">
                                        <label className="cursor-pointer label">
                                            <span className="label-text">In Stock Only</span>
                                            <input type="checkbox" className="checkbox checkbox-primary" />
                                        </label>
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">Minimum Rating</span>
                                    </label>
                                    <select className="select select-bordered w-full">
                                        <option value="">Any Rating</option>
                                        <option value="4">4+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                        <option value="4.8">4.8+ Stars</option>


                                        {/* <option value="">Select Rating</option>
                                        <option value="1">1 Star</option>
                                        <option value="2">2 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="5">5 Stars</option> */}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-lg font-semibold">
                        {filteredProducts.length} products found
                    </span>
                    {searchTerm && (
                        <span className="text-base-content/70 ml-2">
                            for "{searchTerm}"
                        </span>
                    )}
                </div>
            </div>

            {/* Product Grid/List */}
            <div className={`${
                viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }`}>
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                    />
                ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌸</div>
                    <h3 className="text-2xl font-bold mb-2">No products found</h3>
                    <p className="text-base-content/70 mb-4">
                        Try adjusting your search or filter settings.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterCategory('all');
                            setPriceRange([minPrice, maxPrice]);
                            // setShowFilters(false);
                        }}
                        className="btn btn-primary"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Load More / Pagination */}
            {filteredProducts.length > 0 && (
                <div className="text-center mt-12">
                    <button className="btn btn-outline btn-lg">
                        Load More Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;