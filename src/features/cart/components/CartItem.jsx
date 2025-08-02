// src/features/cart/components/CartItem.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, AlertCircle } from 'lucide-react';

const CartItem = ({ 
    item, 
    onQuantityUpdate, 
    onRemove, 
    isUpdating, 
    isRemoving 
}) => {
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const [isQuantityChanged, setIsQuantityChanged] = useState(false);

    const {
        cart_item_id,
        product_id,
        product_name,
        base_price,
        applied_pricing_rule,
        final_price,
        total_price,
        quantity
    } = item;

    const hasDiscount = applied_pricing_rule && final_price < base_price;
    const discountPercentage = hasDiscount 
        ? Math.round(((base_price - final_price) / base_price) * 100)
        : 0;

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        
        setLocalQuantity(newQuantity);
        setIsQuantityChanged(newQuantity !== quantity);
    };

    const handleQuantityUpdate = () => {
        if (localQuantity !== quantity && localQuantity > 0) {
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
            {/* Product Image */}
            <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-base-200 rounded-lg flex items-center justify-center">
                    {/* Placeholder for product image */}
                    <span className="text-2xl">🌸</span>
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
                        {applied_pricing_rule && (
                            <div className="flex items-center gap-1 mt-2">
                                <Tag className="h-3 w-3 text-success" />
                                <span className="text-xs text-success font-medium">
                                    {applied_pricing_rule.rule_name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
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
                                max="99"
                                value={localQuantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                onKeyPress={handleKeyPress}
                                onBlur={handleQuantityUpdate}
                                className="input input-bordered input-sm w-16 text-center"
                                disabled={isUpdating}
                            />
                            
                            <button
                                onClick={() => handleQuantityChange(localQuantity + 1)}
                                disabled={localQuantity >= 99 || isUpdating}
                                className="btn btn-sm btn-circle btn-outline"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>

                        {/* Update/Reset Buttons */}
                        {isQuantityChanged && (
                            <div className="flex gap-1">
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
                        )}

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