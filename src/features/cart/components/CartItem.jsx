// src/features/cart/components/CartItem.jsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, AlertCircle } from 'lucide-react';

// For make loading more elegant

const CartItemSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border border-base-300 rounded-lg animate-pulse">
            {/* Image Skeleton */}
            <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-base-300 rounded-lg"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="flex-1 space-y-3">
                <div className="h-6 bg-base-300 rounded w-3/4"></div>
                <div className="h-4 bg-base-300 rounded w-1/2"></div>
                <div className="h-4 bg-base-300 rounded w-1/4"></div>
            </div>
            
            {/* Controls Skeleton */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-24 bg-base-300 rounded"></div>
                <div className="h-8 w-8 bg-base-300 rounded"></div>
            </div>
        </div>
    );
};

const CartItem = ({ 
    item, 
    onQuantityUpdate, 
    onRemove, 
    isUpdating, 
    isRemoving 
}) => {
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const [isQuantityChanged, setIsQuantityChanged] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef(null);

    const {
        cart_item_id,
        product_id,
        product_name,
        // raw fields
        image_url,
        // dynamic pricing fields
        base_price,
        applied_pricing_rule,
        dynamic_pricing_result,
        final_price,
        total_price,
        quantity,
        // Temporary Product stock limit //////////////////////////////
        product_stock = 999

    } = item;

    const displayRule = applied_pricing_rule?.rule_name || dynamic_pricing_result?.rule_name;
    const product_image = item.product_image || image_url || '/placeholder-flower.jpg';

    useEffect(() => {
        // reset and immediately mark loaded if browser already cached the image
        setImageLoaded(false);
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            // ensure we flip state after mount
            requestAnimationFrame(() => setImageLoaded(true));
        }
    }, [product_image, cart_item_id]);

    // Sync local input with server-updated quantity (e.g., after refresh)
    useEffect(() => {
        setLocalQuantity(quantity);
        setIsQuantityChanged(false);
    }, [quantity]);

    const hasDiscount = final_price < base_price;
    const discountPercentage = hasDiscount 
        ? Math.round(((base_price - final_price) / base_price) * 100)
        : 0;

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1 || newQuantity > product_stock) return;

        setLocalQuantity(newQuantity);
        setIsQuantityChanged(newQuantity !== quantity);
    };

    const handleQuantityUpdate = () => {
        if (localQuantity !== quantity && localQuantity > 0 && localQuantity <= product_stock) {
            onQuantityUpdate(cart_item_id, localQuantity);
            setIsQuantityChanged(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleQuantityUpdate();
        }
    };

    const resetQuantity = () => {
        setLocalQuantity(quantity);
        setIsQuantityChanged(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 border border-base-300 rounded-lg hover:shadow-md transition-shadow">
            {/* Product Image with loading state */}
            <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-base-200 rounded-lg overflow-hidden relative">
                    {/* Show skeleton while image is loading */}
                    {!imageLoaded && (
                        <div className="w-full h-full bg-base-300 animate-pulse absolute inset-0"></div>
                    )}
                    <img 
                        ref={imgRef}
                        src={product_image}
                        alt={product_name}
                        decoding="async"
                        loading="lazy"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                            e.target.src = "/placeholder-flower.jpg";
                            setImageLoaded(true);
                        }}
                    />
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex-1">
                        <Link 
                            to={`/products/${product_id}`}
                            className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1"
                        >
                            {product_name}
                        </Link>
                        
                        <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-primary">
                                    ${final_price.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-sm text-base-content/50 line-through">
                                            ${base_price.toFixed(2)}
                                        </span>
                                        <span className="badge badge-error badge-sm">
                                            -{discountPercentage}%
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Applied Pricing Rule */}
                        {displayRule && hasDiscount && (
                            <div className="flex items-center gap-1 mt-2">
                                <Tag className="h-3 w-3 text-success" />
                                <span className="text-xs text-success font-medium">
                                    {displayRule}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-3">
                        {/* Update/Reset Buttons (left), keep space reserved to avoid shifting */}
                        <div className={`flex gap-1 ${isQuantityChanged ? '' : 'invisible'}`}>
                            <button
                                onClick={handleQuantityUpdate}
                                disabled={isUpdating}
                                className="btn btn-primary btn-xs"
                            >
                                {isUpdating ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    'Update'
                                )}
                            </button>
                            <button
                                onClick={resetQuantity}
                                disabled={isUpdating}
                                className="btn btn-ghost btn-xs"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleQuantityChange(localQuantity - 1)}
                                disabled={localQuantity <= 1 || isUpdating}
                                className="btn btn-sm btn-circle btn-outline"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            
                            <input
                                type="number"
                                min="1"
                                max={product_stock}
                                value={localQuantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                onKeyPress={handleKeyPress}
                                onBlur={handleQuantityUpdate}
                                className="input input-bordered input-sm w-16 text-center"
                                disabled={isUpdating}
                            />
                            
                            <button
                                onClick={() => handleQuantityChange(localQuantity + 1)}
                                disabled={localQuantity >= product_stock || isUpdating}
                                className="btn btn-sm btn-circle btn-outline"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(cart_item_id)}
                            disabled={isRemoving}
                            className="btn btn-error btn-outline btn-sm"
                            title="Remove from cart"
                        >
                            {isRemoving ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-base-300">
                    <span className="text-sm text-base-content/70">
                        Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})
                    </span>
                    <span className="text-lg font-bold">
                        ${total_price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
export { CartItemSkeleton };