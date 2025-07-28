import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    ShoppingCart,
    Heart,
    ArrowLeft,
    Star,
    Minus,
    Plus,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    PrinterCheck
} from 'lucide-react';
import { original } from '@reduxjs/toolkit';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // State for product interactions
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Temporary mock product data - Will be replaced with Redux selector
    // const product = useSelector(state => selectProductById(state, id));
    const product = {
        id: parseInt(id),
        name: "Premium Red Rose Bouquet",
        price: 89.99,
        originalPrice: 119.99, // temporary field
        discount: 25, // temporary field
        category: "Premium Bouquets",
        brand: "LazaHoa Signature",
        rating: 4.8,
        reviewCount: 156,
        inStock: true,
        stockCount: 23,
        description: "Elegant hand-crafted bouquet featuring 24 premium red roses, carefully selected and arranged by our master florists. Perfect for expressing deep love and admiration on special occasions.",
        longDescription: "This stunning bouquet showcases the timeless beauty of red roses, each bloom hand-picked at the perfect stage of opening. Our signature arrangement includes complementary greenery and is wrapped in premium packaging. The roses are sourced from sustainable farms and guaranteed fresh for 7-10 days with proper care.",
        images: [
            "/images/products/roses/red-rose-bouquet-1.jpg",
            "/images/products/roses/red-rose-bouquet-2.jpg",
            "/images/products/roses/red-rose-bouquet-3.jpg"
        ],
        features: [
            "24 Premium Red Roses",
            "Hand-crafted Arrangement",
            "7-10 Days Freshness Guarantee",
            "Sustainable Sourcing",
            "Premium Gift Wrapping",
            "Care Instructions Included"
        ],
        specifications: {
            "Flower Type": "Premium Red Roses",
            "Quantity": "24 Stems",
            "Arrangement Style": "Classis Bouquet",
            "Vase": "Not Included",
            "Delivery": "Same Day Available",
            "Care Duration": "7-10 Days"
        },
        deliveryInfo: {
            sameDay: true,
            nextDay: true,
            standard: "2-3 days",
            freeShipping: true
        }
    }

    // Related products - will come from Redux
    const relatedProducts = [
        { id: 2, name: "White Rose Elegance", price: 79.99, image: "/placeholder-white-rose.jpg", rating: 4.6 },
        { id: 3, name: "Mixed Seasonal Bouquet", price: 65.99, image: "/placeholder-mixed.jpg", rating: 4.7 },
        { id: 4, name: "Pink Rose Garden", price: 74.99, image: "/placeholder-pink-rose.jpg", rating: 4.5 }
    ];

    // Loading state - will come from Redux
    const isLoading = false; 

    useEffect(() => {
        // TODO: Dispatch action to fetch product details by ID
        // dispatch(fetchProductById(id));
    }, [id, dispatch]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stockCount) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        // TODO: Dispatch add to cart action
        // dispatch(addToCart({ productId: product.id, quantity }));
        console.log(`Adding ${quantity}x ${product.name} to cart`); 
    };

    const handleAddToWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // TODO: Dispatch action to add/remove product from wishlist
        // dispatch(toggleWishlist(product.id));
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-96">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <Link to="/products" className="btn btn-primary">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="breadcrumbs text-sm mb-6">
                <ul>
                    <li><Link to="/" className="hover:text-primary">Home</Link></li>
                    <li><Link to="/products" className="hover:text-primary">Products</Link></li>
                    <li><span className="text-base-content/70">{product.category}</span></li>
                    <li><span className="text-base-content/70">{product.name}</span></li>
                </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square rounded-2xl overflow-hidden bg-base-200 relative group">
                        <img 
                            src={product.images[selectedImage]} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.discount && (
                            <div className="absolute top-4 left-4 bg-error text-error-content px-3 py-1 rounded-full text-sm font-semibold">
                                -{product.discount}%
                            </div>
                        )}
                        <button 
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`absolute top-4 right-4 btn btn-circle btn-sm ${isWishlisted ? 'btn-error' : 'btn-ghost bg-base-100/80'}`}
                        >
                            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    
                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-4 gap-3">
                        {product.images.map((image, index) => (
                            <button 
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                    selectedImage === index ? 'border-primary' : 'border-base-300 hover:border-primary/50'
                                }`}
                            >
                                <img 
                                    src={image} 
                                    alt={`${product.name} ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    {/* Product Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-outline">{product.category}</span>
                            <span className="text-sm text-base-content/70">•</span>
                            <span className="text-sm text-base-content/70">{product.brand}</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`h-5 w-5 ${
                                            i < Math.floor(product.rating) 
                                                ? 'text-yellow-400 fill-current' 
                                                : 'text-gray-300'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <span className="text-lg font-semibold">{product.rating}</span>
                            <span className="text-base-content/70">({product.reviewCount} reviews)</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-primary">${product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xl text-base-content/50 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                        {product.discount && (
                            <span className="badge badge-error text-error-content">
                                Save ${(product.originalPrice - product.price).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-success' : 'bg-error'}`}></div>
                            <span className="font-semibold">
                                {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                            </span>
                        </div>
                        {product.inStock && product.stockCount <= 10 && (
                            <span className="text-warning font-semibold">Only {product.stockCount} left!</span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Description</h3>
                        <p className="text-base-content/80 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {product.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                                    <span className="text-base-content/80">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">Quantity:</span>
                            <div className="flex items-center">
                                <button 
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="btn btn-outline btn-sm btn-square"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-16 text-center font-semibold">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stockCount}
                                    className="btn btn-outline btn-sm btn-square"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="btn btn-primary flex-1"
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart - ${(product.price * quantity).toFixed(2)}
                            </button>
                            <button 
                                onClick={handleAddToWishlist}
                                className={`btn btn-outline btn-square ${isWishlisted ? 'btn-error' : ''}`}
                            >
                                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                            <button className="btn btn-outline btn-square">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                            <Truck className="h-6 w-6 text-primary" />
                            <div>
                                <div className="font-semibold text-sm">Free Delivery</div>
                                <div className="text-xs text-base-content/70">Orders over $50</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                            <Shield className="h-6 w-6 text-primary" />
                            <div>
                                <div className="font-semibold text-sm">Freshness Guarantee</div>
                                <div className="text-xs text-base-content/70">7-10 days fresh</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                            <RotateCcw className="h-6 w-6 text-primary" />
                            <div>
                                <div className="font-semibold text-sm">Easy Returns</div>
                                <div className="text-xs text-base-content/70">30 day policy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mb-12">
                <div className="tabs tabs-boxed mb-6">
                    <a className="tab tab-active">Details</a>
                    <a className="tab">Specifications</a>
                    <a className="tab">Care Instructions</a>
                    <a className="tab">Reviews ({product.reviewCount})</a>
                </div>
                
                <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                    <p className="text-base-content/80 leading-relaxed mb-6">
                        {product.longDescription}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-2 border-b border-base-300">
                                <span className="font-semibold">{key}:</span>
                                <span className="text-base-content/80">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">You May Also Like</h2>
                    <Link to="/products" className="btn btn-outline">
                        View All Products
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedProducts.map(relatedProduct => (
                        <Link 
                            key={relatedProduct.id} 
                            to={`/products/${relatedProduct.id}`}
                            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                        >
                            <figure className="px-4 pt-4">
                                <img 
                                    src={relatedProduct.image} 
                                    alt={relatedProduct.name}
                                    className="rounded-xl h-48 w-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg">{relatedProduct.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-primary">${relatedProduct.price}</span>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="ml-1 text-sm">{relatedProduct.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Back to Products */}
            <div className="mt-8 text-center">
                <button onClick={() => navigate(-1)} className="btn btn-outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;