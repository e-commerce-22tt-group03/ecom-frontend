import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addToCart,
    selectAddingToCart,
} from '../../cart/cartSlice';

const ProductCard = ({ product, viewMode = 'grid' }) => {
    const dispatch = useDispatch();
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    const addingToCart = useSelector(selectAddingToCart);

    const {
        productId: id,
        name = "Sample Flower",
        dynamicPrice: price = 29.99,
        basePrice: originalPrice = null,
        imageUrl: image = "/placeholder-flower.jpg",
        condition = "New Flower",
        stockQuantity = 0,
        averageRating = 0,
        totalSold = 0
    } = product || {};

    const discount = originalPrice && originalPrice > price 
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const isInStock = stockQuantity > 0;
    const isLowStock = stockQuantity <= 5 && stockQuantity > 0;
    const isNew = condition === 'New Flower';
    const isBestSelling = totalSold > 10;

    // Now let the Cart function handle authen/session management and refetching
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isInStock) return;

        try {
            await dispatch(addToCart({ 
                product_id: id, 
                quantity: 1 
            })).unwrap();
            // success toast could be added here
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                className={`h-3 w-3 ${
                    i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                }`} 
            />
        ));
    };

    if (viewMode === 'list') {
        return (
            <div className="card lg:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <figure className="lg:w-48">
                    <img 
                        src={image} 
                        alt={name}
                        className="w-full h-48 lg:h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/placeholder-flower.jpg";
                        }}
                    />
                </figure>
                <div className="card-body flex-1">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`badge badge-sm ${
                                    condition === 'New Flower' ? 'badge-success' :
                                    condition === 'Low Stock' ? 'badge-warning' :
                                    'badge-neutral'
                                }`}>
                                    {condition}
                                </span>
                                {isBestSelling && (
                                    <span className="badge badge-primary badge-sm">
                                        Best Seller
                                    </span>
                                )}
                                {isLowStock && (
                                    <span className="badge badge-warning badge-sm">
                                        Only {stockQuantity} left!
                                    </span>
                                )}
                            </div>
                            <h2 className="card-title text-xl">{name}</h2>
                            
                            {/* Rating and Sales */}
                            <div className="flex items-center gap-4 mt-2">
                                {averageRating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center">
                                            {renderStars(averageRating)}
                                        </div>
                                        <span className="text-sm text-base-content/70">
                                            {averageRating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                                {totalSold > 0 && (
                                    <span className="text-sm text-base-content/70">
                                        {totalSold} sold
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-primary">${price}</span>
                                {originalPrice && originalPrice > price && (
                                    <span className="text-sm text-base-content/50 line-through">
                                        ${originalPrice}
                                    </span>
                                )}
                            </div>
                            <span className={`badge ${isInStock ? 'badge-success' : 'badge-error'}`}>
                                {isInStock ? `${stockQuantity} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="card-actions justify-between mt-4">
                        <Link to={`/products/${id}`} className="btn btn-outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleWishlistToggle}
                                className={`btn btn-ghost btn-square ${isWishlisted ? 'text-error' : ''}`}
                            >
                                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                                onClick={handleAddToCart}
                                className="btn btn-primary"
                                disabled={!isInStock || addingToCart}
                            >
                                {addingToCart ? (
                                    <span className="loading loading-spinner loading-sm mr-2"></span>

                                ) : (
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                )}
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <figure className="px-4 pt-4 relative overflow-hidden">
                <img 
                    src={image} 
                    alt={name}
                    className="rounded-xl h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = "/placeholder-flower.jpg";
                    }}
                />
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-1">
                    {discount > 0 && (
                        <span className="badge badge-error text-error-content">
                            -{discount}%
                        </span>
                    )}
                    {isNew && (
                        <span className="badge badge-success">New</span>
                    )}
                    {isBestSelling && (
                        <span className="badge badge-primary">Best Seller</span>
                    )}
                    {condition === 'Low Stock' && (
                        <span className="badge badge-warning">Low Stock</span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button 
                    onClick={handleWishlistToggle}
                    className={`absolute top-6 right-6 btn btn-circle btn-sm ${
                        isWishlisted 
                            ? 'btn-error text-error-content' 
                            : 'btn-ghost bg-base-100/80 hover:bg-base-100'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Quick View Button */}
                <Link 
                    to={`/products/${id}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <span className="btn btn-primary btn-sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Quick View
                    </span>
                </Link>
            </figure>
            
            <div className="card-body">
                {/* Condition Badge */}
                <div className="flex items-center justify-between mb-2">
                    <span className={`badge badge-sm ${
                        condition === 'New Flower' ? 'badge-success' :
                        condition === 'Low Stock' ? 'badge-warning' :
                        'badge-neutral'
                    }`}>
                        {condition}
                    </span>
                    {isLowStock && (
                        <span className="text-xs text-warning font-semibold">
                            Only {stockQuantity} left!
                        </span>
                    )}
                </div>

                <h2 className="card-title text-lg font-semibold line-clamp-2">{name}</h2>

                {/* Rating and Sales */}
                <div className="flex items-center justify-between mt-1">
                    {averageRating > 0 ? (
                        <div className="flex items-center gap-1">
                            <div className="flex items-center">
                                {renderStars(averageRating)}
                            </div>
                            <span className="text-xs text-base-content/70">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xs text-base-content/50">No ratings yet</span>
                    )}
                    
                    {totalSold > 0 && (
                        <span className="text-xs text-base-content/70">
                            {totalSold} sold
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">${price}</span>
                        {originalPrice && originalPrice > price && (
                            <span className="text-sm text-base-content/50 line-through">
                                ${originalPrice}
                            </span>
                        )}
                    </div>
                    <span className={`badge ${isInStock ? 'badge-success' : 'badge-error'} badge-sm`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                <div className="card-actions justify-between mt-4">
                    <Link to={`/products/${id}`} className="btn btn-outline btn-sm flex-1">
                        View Details
                    </Link>
                    <button 
                        onClick={handleAddToCart}
                        className="btn btn-primary btn-sm"
                        disabled={!isInStock || addingToCart}
                    >
                        {addingToCart ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <ShoppingCart className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;