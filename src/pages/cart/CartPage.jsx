// src/pages/CartPage.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ShoppingCart, 
    Trash2, 
    ArrowLeft,
    RefreshCw,
    AlertTriangle,
    ShoppingBag,
} from 'lucide-react';
import {
    fetchCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    selectCartItems,
    selectCartTotal,
    selectCartLoading,
    selectCartError,
    selectUpdatingItem,
    selectRemovingItem,
    selectClearingCart,
    clearErrors
} from '../../features/cart/cartSlice';
import CartItem from '../../features/cart/components/CartItem';
import CartSummary from '../../features/cart/components/CartSummary';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const updatingItem = useSelector(selectUpdatingItem);
    const removingItem = useSelector(selectRemovingItem);
    const clearingCart = useSelector(selectClearingCart);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Fetch cart on mount 
    // Now let CartSlice.js handle authentication/session management and refetching cart
    useEffect(() => {
        dispatch(fetchCart());
        return () => { 
            dispatch(clearErrors());
        };
    }, [dispatch]);

    const handleQuantityUpdate = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity })).unwrap();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await dispatch(removeFromCart(itemId)).unwrap();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await dispatch(clearCart()).unwrap();
            setShowClearConfirm(false);
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const handleRefresh = () => {
        dispatch(fetchCart());
    };

    const handleProceedToCheckout = () => {
        if (items.length === 0) return;
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
            return;
        }
        navigate('/checkout');
    };

    if (loading && items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-96">
                    <span className="loading loading-spinner loading-lg mb-4"></span>
                    <p className="text-lg font-medium">Loading your cart...</p>
                    <p className="text-sm text-base-content/70">Please wait while we fetch your items</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                {/* Breadcrumb */}
                <div className="breadcrumbs text-sm mb-6">
                    <ul>
                        <li><Link to="/" className="hover:text-primary">Home</Link></li>
                        <li><Link to="/products" className="hover:text-primary">Products</Link></li>
                        <li><span className="text-base-content/70">Cart</span></li>
                    </ul>
                </div>

                {/* Main Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div className="flex-1">
                        <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-2">
                            Your Shopping Cart
                        </h1>
                        <p className="text-base-content/70 text-lg">
                            Review your items and proceed to checkout
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            className="btn btn-ghost btn-sm gap-2"
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        
                        {items.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="btn btn-error btn-outline btn-sm gap-2"
                                disabled={clearingCart}
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Cart Summary Bar */}
                <div className="bg-base-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="font-semibold">
                                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                                </span>
                            </div>
                            <div className="text-base-content/70">
                                Subtotal: <span className="font-semibold text-primary">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <Link to="/products" className="btn btn-outline btn-sm gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-error mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Error: {error}</span>
                    <button 
                        onClick={() => dispatch(clearErrors())}
                        className="btn btn-sm btn-ghost"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Main Content */}
            {items.length === 0 ? (
                // Empty Cart State
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart className="h-12 w-12 text-base-content/40" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-base-content/70 mb-8 max-w-md mx-auto">
                        Discover our beautiful collection of fresh flowers and arrangements to get started.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Start Shopping
                    </Link>
                </div>
            ) : (
                // Cart Items - Admin CMS Style Layout
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="xl:col-span-2">
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-header">
                                <div className="card-title p-6 pb-0">
                                    <h2 className="text-xl font-semibold">Cart Items</h2>
                                    {/* temporary loading indicator while fetching */}
                                    {loading && (
                                        <span className="loading loading-spinner loading-sm ml-2"></span>
                                    )}
                                </div>
                            </div>
                            <div className="card-body pt-4">
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.cart_item_id}
                                            item={item}
                                            onQuantityUpdate={handleQuantityUpdate}
                                            onRemove={handleRemoveItem}
                                            isUpdating={updatingItem}
                                            isRemoving={removingItem}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Summary Section */}
                    <div className="xl:col-span-1">
                        <CartSummary
                            items={items}
                            cartTotal={cartTotal}
                            loading={loading}
                            onProceed={handleProceedToCheckout}
                        />
                    </div>
                </div>
            )}

            {/* Clear Cart Confirmation Modal */}
            {showClearConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            Clear Cart?
                        </h3>
                        <p className="py-4">
                            Are you sure you want to remove all items from your cart? This action cannot be undone.
                        </p>
                        <div className="modal-action">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="btn btn-outline"
                                disabled={clearingCart}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearCart}
                                className="btn btn-error"
                                disabled={clearingCart}
                            >
                                {clearingCart ? (
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                Clear Cart
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowClearConfirm(false)}></div>
                </div>
            )}
        </div>
    );
};

export default CartPage;