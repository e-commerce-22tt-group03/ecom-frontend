import { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import {
    fetchProductById,
    clearCurrentProduct,
    // clearProductError,
    selectCurrentProduct,
    selectProductLoading,
    selectProductError,
    selectRecommendations,
    selectRecommendationsLoading,
    fetchRecommendations,
    clearRecommendations,
    selectCanReview,
    selectReviewLoading,
    selectReviewError,
    checkCanReview,
    addReview
} from '../../features/products/productsSlice';
import {
    addToCart,
    selectAddingToCart,
} from '../../features/cart/cartSlice';
import ProductCard from '../../features/products/components/ProductCard';

const ReviewForm = ({ loading, error, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            alert('Please enter a comment.');
            return;
        }
        onSubmit({ rating, comment });
        setComment('');
        setRating(5);
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="card bg-base-200 p-6">
                <div className="rating rating-lg mb-4">
                    {[...Array(5)].map((_, i) => (
                        <input
                            key={i}
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-orange-400"
                            checked={rating === i + 1}
                            onChange={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className="textarea textarea-bordered w-full h-24 mb-4"
                    placeholder="Share your thoughts about the product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>
                {error && <div className="alert alert-error mb-4">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux State
    const product = useSelector(selectCurrentProduct);
    const loading = useSelector(selectProductLoading);
    const error = useSelector(selectProductError);

    // Cart state
    const addingToCart = useSelector(selectAddingToCart);

    // State for product interactions
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    // Redux state for recommendations
    const recommendations = useSelector(selectRecommendations);
    const recommendationsLoading = useSelector(selectRecommendationsLoading);

    // Review state
    const canReview = useSelector(selectCanReview);
    const reviewLoading = useSelector(selectReviewLoading);
    const reviewError = useSelector(selectReviewError);
    const { isAuthenticated } = useSelector((state) => state.auth);


    // Map backend data
    const {
        productId,
        name,
        description,
        imageUrl,
        stockQuantity,
        condition,
        basePrice,
        appliedRuleName,
        dynamicPrice,
        averageRating = 0,
        categories = [],
        reviews = []
    } = useMemo(() => product || {}, [product]);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
            dispatch(fetchRecommendations({ productId: id, limit: 4 }));
            if (isAuthenticated) {
                dispatch(checkCanReview(id));
            }
        }

        return () => {
            dispatch(clearCurrentProduct());
            dispatch(clearRecommendations());
        };
    }, [id, dispatch, isAuthenticated]);

    // Reset selected image when product changes
    useEffect(() => {
        if (product) {
            setSelectedImage(0);
            setQuantity(1);
        }
    }, [product]);

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 0)) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = async () => {
        if (!product?.stockQuantity || quantity > product.stockQuantity) {
            return;
        }

        try {
            await dispatch(addToCart({
                product_id: product.productId,
                quantity: quantity
            })).unwrap();
            setQuantity(1);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert(`Failed to add to cart. Please try again. ${error}`);
        }
    };

    const handleAddToWishlist = () => {
        setIsWishlisted(!isWishlisted);
    };

    const handleAddReview = (reviewData) => {
        dispatch(addReview({ productId: id, reviewData }));
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                    }`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-96">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Product</h2>
                    <p className="text-base-content/70 mb-4">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => dispatch(fetchProductById(id))}
                            className="btn btn-primary"
                        >
                            Try Again
                        </button>
                        <Link to="/products" className="btn btn-outline">
                            Back to Products
                        </Link>
                    </div>
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

    const isInStock = stockQuantity > 0;
    const isLowStock = stockQuantity <= 5 && stockQuantity > 0;
    const discount = basePrice > dynamicPrice
        ? Math.round(((basePrice - dynamicPrice) / basePrice) * 100)
        : 0;

    // Create multiple image array (since API only provides one, so we will duplicate it)
    const images = [imageUrl, imageUrl, imageUrl];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                            <p className="text-base-content/80 leading-relaxed mb-6">
                                {description || "No description available for this product."}
                            </p>
                        </div>

                        {categories.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <span
                                            key={category.categoryId}
                                            className={`badge ${category.categoryType === 'Flower Type'
                                                ? 'badge-primary'
                                                : 'badge-secondary'
                                                }`}
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {appliedRuleName && (
                            <div className="alert alert-info">
                                <span>🔖 Special pricing: {appliedRuleName}</span>
                            </div>
                        )}
                    </div>
                );

            case 'specifications':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Product ID:</span>
                                <span>{productId}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Condition:</span>
                                <span>{condition}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Stock:</span>
                                <span>{stockQuantity} available</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Base Price:</span>
                                <span>${basePrice}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Current Price:</span>
                                <span>${dynamicPrice}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-semibold">Average Rating:</span>
                                <span>{averageRating.toFixed(1)}/5</span>
                            </div>
                            {categories.map(category => (
                                <div key={category.categoryId} className="flex justify-between py-2 border-b">
                                    <span className="font-semibold">{category.categoryType}:</span>
                                    <span>{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'care':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Care Instructions</h3>
                        <div className="prose max-w-none">
                            <ul>
                                <li>Keep flowers in fresh, clean water</li>
                                <li>Trim stems at an angle every 2-3 days</li>
                                <li>Remove wilted flowers and leaves</li>
                                <li>Keep away from direct sunlight and heat</li>
                                <li>Change water completely every 3-4 days</li>
                                <li>Add flower food if provided</li>
                                <li>Play Umamusume: Pretty Derby as much as you can</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-6">
                        {canReview && (
                            <ReviewForm
                                productId={id}
                                loading={reviewLoading}
                                error={reviewError}
                                onSubmit={handleAddReview}
                            />
                        )}

                        {isAuthenticated && !canReview && (
                            <div className="text-center py-8">
                                <p className="text-base-content/70">You have already reviewed this product or are not eligible to review it.</p>
                            </div>
                        )}

                        {!isAuthenticated && (
                            <div className="text-center py-8">
                                <p className="text-base-content/70">
                                    <Link to="/login" className="link link-primary">Log in</Link> to leave a review.
                                </p>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">Customer Reviews</h3>
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {renderStars(averageRating)}
                                    </div>
                                    <span className="font-semibold">{averageRating.toFixed(1)}</span>
                                    <span className="text-base-content/70">({reviews.length} reviews)</span>
                                </div>
                            )}
                        </div>
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.reviewId} className="card bg-base-200">
                                        <div className="card-body">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                                            <span className="text-sm">
                                                                {review.user.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{review.user.name}</div>
                                                        <div className="text-sm text-base-content/70">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-base-content/80">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">💭</div>
                                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                                <p className="text-base-content/70">Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="breadcrumbs text-sm mb-6">
                <ul>
                    <li><Link to="/" className="hover:text-primary">Home</Link></li>
                    <li><Link to="/products" className="hover:text-primary">Products</Link></li>
                    {categories.length > 0 && (
                        <li><span className="text-base-content/70">{categories[0].name}</span></li>
                    )}
                    <li><span className="text-base-content/70">{name}</span></li>
                </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square rounded-2xl overflow-hidden bg-base-200 relative group">
                        <img
                            src={images[selectedImage] || imageUrl}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = "/placeholder-flower.jpg";
                            }}
                        />
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-error text-error-content px-3 py-1 rounded-full text-sm font-semibold">
                                -{discount}%
                            </div>
                        )}
                        <button
                            onClick={handleAddToWishlist}
                            className={`absolute top-4 right-4 btn btn-circle btn-sm ${isWishlisted ? 'btn-error' : 'btn-ghost bg-base-100/80'}`}
                        >
                            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Thumbnail Images*/}
                    {imageUrl && (
                        <div className="grid grid-cols-3 gap-3">
                            {images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-base-300 hover:border-primary/50'
                                        }`}
                                >
                                    <img
                                        src={image || imageUrl}
                                        alt={`${name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/placeholder-flower.jpg";
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="space-y-6">
                    {/* Product Header */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`badge ${condition === 'New Flower' ? 'badge-success' :
                                condition === 'Low Stock' ? 'badge-warning' :
                                    'badge-neutral'
                                }`}>
                                {condition}
                            </span>
                            {categories.map(category => (
                                <span key={category.categoryId} className="badge badge-outline">
                                    {category.name}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl font-bold mb-3">{name}</h1>

                        {/* Rating */}
                        {averageRating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {renderStars(averageRating)}
                                </div>
                                <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                                <span className="text-base-content/70">({reviews.length} reviews)</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-primary">${dynamicPrice}</span>
                        {basePrice > dynamicPrice && (
                            <span className="text-xl text-base-content/50 line-through">
                                ${basePrice}
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="badge badge-error text-error-content">
                                Save ${(basePrice - dynamicPrice).toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Applied Rule */}
                    {appliedRuleName && (
                        <div className="alert alert-info">
                            <span>💰 Special pricing: {appliedRuleName}</span>
                        </div>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isInStock ? 'bg-success' : 'bg-error'}`}></div>
                            <span className="font-semibold">
                                {isInStock ? `${stockQuantity} in stock` : 'Out of stock'}
                            </span>
                        </div>
                        {isLowStock && (
                            <span className="text-warning font-semibold">Only {stockQuantity} left!</span>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Description</h3>
                            <p className="text-base-content/80 leading-relaxed">{description}</p>
                        </div>
                    )}

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
                                    disabled={quantity >= stockQuantity}
                                    className="btn btn-outline btn-sm btn-square"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock || addingToCart}
                                className="btn btn-primary flex-1"
                            >
                                {addingToCart ? (
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                ) : (
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                )}
                                Add to Cart - ${(dynamicPrice * quantity).toFixed(2)}
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
                    <button
                        className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`tab ${activeTab === 'specifications' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('specifications')}
                    >
                        Specifications
                    </button>
                    <button
                        className={`tab ${activeTab === 'care' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('care')}
                    >
                        Care Instructions
                    </button>
                    <button
                        className={`tab ${activeTab === 'reviews' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews ({reviews.length})
                    </button>
                </div>

                <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                    {renderTabContent()}
                </div>
            </div>

            {recommendations && recommendations.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-6 text-center">You Might Also Like</h2>
                    {recommendationsLoading ? (
                        <div className="flex justify-center items-center">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendations.map(product => (
                                <ProductCard
                                    key={product.product_id}
                                    product={{
                                        productId: product.product_id,
                                        name: product.name,
                                        imageUrl: product.image_url,
                                        basePrice: product.base_price,
                                        dynamicPrice: product.dynamicPrice,
                                        condition: product.condition,
                                        stockQuantity: product.stock_quantity,
                                        averageRating: product.average_rating,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

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