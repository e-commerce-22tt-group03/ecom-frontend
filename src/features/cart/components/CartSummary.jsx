// src/features/cart/components/CartSummary.jsx
import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck, Shield, ArrowRight } from 'lucide-react';

const CartSummary = ({ items, cartTotal, loading }) => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    
    // Calculate savings
    const totalSavings = items.reduce((total, item) => {
        if (item.applied_pricing_rule && item.final_price < item.base_price) {
            return total + ((item.base_price - item.final_price) * item.quantity);
        }
        return total;
    }, 0);

    const hasActiveDiscounts = items.some(item => 
        item.applied_pricing_rule && item.final_price < item.base_price
    );

    return (
        <div className="card bg-base-100 shadow-lg sticky top-8">
            <div className="card-header">
                <div className="card-title p-6 pb-0">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
            </div>
            
            <div className="card-body pt-4">
                {/* Items Summary */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span>Items ({itemCount})</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Show savings if any */}
                    {hasActiveDiscounts && totalSavings > 0 && (
                        <div className="flex justify-between text-success">
                            <span className="flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                Savings
                            </span>
                            <span>-${totalSavings.toFixed(2)}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-success">FREE</span>
                    </div>
                    
                    <div className="divider my-2"></div>
                    
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Active Discounts */}
                {hasActiveDiscounts && (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-6">
                        <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Active Discounts
                        </h4>
                        <div className="space-y-1">
                            {items
                                .filter(item => item.applied_pricing_rule && item.final_price < item.base_price)
                                .map(item => (
                                    <div key={item.cart_item_id} className="text-sm">
                                        <span className="font-medium">{item.applied_pricing_rule.rule_name}</span>
                                        <span className="text-success ml-2">
                                            -${((item.base_price - item.final_price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Checkout Button */}
                <button 
                    className="btn btn-primary w-full mb-4"
                    disabled={loading || items.length === 0}
                >
                    {loading ? (
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                    ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                </button>

                {/* Continue Shopping */}
                <Link 
                    to="/products" 
                    className="btn btn-outline w-full mb-6"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                </Link>

                {/* Shipping Info */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                            <div className="font-semibold">Free Shipping</div>
                            <div className="text-base-content/70">On orders over $50</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                            <div className="font-semibold">Secure Checkout</div>
                            <div className="text-base-content/70">Your data is protected</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;