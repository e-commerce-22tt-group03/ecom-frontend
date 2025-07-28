// import { Link } from 'react-router-dom';
// import { ShoppingCart, Heart } from 'lucide-react';

// const ProductCard = ({ product }) => {
//     // Placeholder data structure - will be replaced with real data from props
//     const {
//         id = 1,
//         name = "Sample Flower",
//         price = 29.99,
//         image = "/placeholder-flower.jpg",
//         category = "Bouquet",
//         isInStock = true
//     } = product || {};

//     return (
//         <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
//             <figure className="px-4 pt-4">
//                 <img 
//                     src={image} 
//                     alt={name}
//                     className="rounded-xl h-48 w-full object-cover"
//                 />
//             </figure>
//             <div className="card-body">
//                 <h2 className="card-title text-lg font-semibold">{name}</h2>
//                 <p className="text-sm text-base-content/70">{category}</p>
//                 <div className="flex items-center justify-between mt-2">
//                     <span className="text-xl font-bold text-primary">${price}</span>
//                     <span className={`badge ${isInStock ? 'badge-success' : 'badge-error'}`}>
//                         {isInStock ? 'In Stock' : 'Out of Stock'}
//                     </span>
//                 </div>
//                 <div className="card-actions justify-between mt-4">
//                     {/* Link to product details, not yet implemented */}
//                     <Link to={`/products/${id}`} className="btn btn-outline btn-sm">
//                         View Details
//                     </Link>
//                     <div className="flex gap-2">
//                         <button className="btn btn-ghost btn-sm btn-square">
//                             <Heart className="h-4 w-4" />
//                         </button>
//                         <button 
//                             className="btn btn-primary btn-sm"
//                             disabled={!isInStock}
//                         >
//                             <ShoppingCart className="h-4 w-4" />
//                             Add to Cart
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;

import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product, viewMode = 'grid' }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    const {
        id = 1,
        name = "Sample Flower",
        price = 29.99,
        originalPrice = null,
        discount = 0,
        image = "/placeholder-flower.jpg",
        category = "Bouquet",
        isInStock = true,
        stockCount = 0,
        rating = 0,
        reviewCount = 0,
        isNew = false,
        isFeatured = false,
        tags = []
    } = product || {};

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Dispatch add to cart action
        console.log(`Adding ${name} to cart`);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
        // TODO: Dispatch wishlist action
    };

    if (viewMode === 'list') {
        return (
            <div className="card lg:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <figure className="lg:w-48">
                    <img 
                        src={image} 
                        alt={name}
                        className="w-full h-48 lg:h-full object-cover"
                    />
                </figure>
                <div className="card-body flex-1">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-outline badge-sm">{category}</span>
                                {isNew && <span className="badge badge-success badge-sm">New</span>}
                                {isFeatured && <span className="badge badge-primary badge-sm">Featured</span>}
                            </div>
                            <h2 className="card-title text-xl">{name}</h2>
                            
                            {/* Rating */}
                            {rating > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-4 w-4 ${
                                                    i < Math.floor(rating) 
                                                        ? 'text-yellow-400 fill-current' 
                                                        : 'text-gray-300'
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-base-content/70">
                                        {rating} ({reviewCount} reviews)
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-primary">${price}</span>
                                {originalPrice && (
                                    <span className="text-sm text-base-content/50 line-through">
                                        ${originalPrice}
                                    </span>
                                )}
                            </div>
                            <span className={`badge ${isInStock ? 'badge-success' : 'badge-error'}`}>
                                {isInStock ? 'In Stock' : 'Out of Stock'}
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
                                disabled={!isInStock}
                            >
                                <ShoppingCart className="mr-2 h-4 w-4" />
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
                    {isFeatured && (
                        <span className="badge badge-primary">Featured</span>
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
                {/* Category & Tags */}
                <div className="flex items-center gap-1 mb-2">
                    <span className="badge badge-outline badge-sm">{category}</span>
                    {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="badge badge-ghost badge-xs">
                            {tag}
                        </span>
                    ))}
                </div>

                <h2 className="card-title text-lg font-semibold line-clamp-2">{name}</h2>
                
                {/* Rating */}
                {rating > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${
                                        i < Math.floor(rating) 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                    }`} 
                                />
                            ))}
                        </div>
                        <span className="text-xs text-base-content/70">
                            ({reviewCount})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">${price}</span>
                        {originalPrice && (
                            <span className="text-sm text-base-content/50 line-through">
                                ${originalPrice}
                            </span>
                        )}
                    </div>
                    <span className={`badge ${isInStock ? 'badge-success' : 'badge-error'} badge-sm`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                {/* Stock Warning */}
                {isInStock && stockCount <= 5 && stockCount > 0 && (
                    <div className="text-xs text-warning font-semibold">
                        Only {stockCount} left!
                    </div>
                )}

                <div className="card-actions justify-between mt-4">
                    <Link to={`/products/${id}`} className="btn btn-outline btn-sm flex-1">
                        View Details
                    </Link>
                    <button 
                        onClick={handleAddToCart}
                        className="btn btn-primary btn-sm"
                        disabled={!isInStock}
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;