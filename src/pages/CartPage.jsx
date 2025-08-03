// src/pages/CartPage.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ShoppingCart, 
    Trash2, 
    Plus, 
    Minus, 
    ArrowLeft,
    RefreshCw,
    AlertTriangle,
    ShoppingBag,
    LogIn,
    UserPlus
} from 'lucide-react';
import {
    fetchCart,
    fetchCartWithProductDetails, // temporary version
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    resetCart, // temporary, may not need later.
    selectCartItems,
    selectCartTotal,
    selectCartLoading,
    selectCartError,
    selectUpdatingItem,
    selectRemovingItem,
    selectClearingCart,
    selectCartRequiresAuth,
    selectIsAuthenticated,
    clearErrors
} from '../features/cart/cartSlice';
import CartItem from '../features/cart/components/CartItem';
import CartSummary from '../features/cart/components/CartSummary';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const items = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const updatingItem = useSelector(selectUpdatingItem);
    const removingItem = useSelector(selectRemovingItem);
    const clearingCart = useSelector(selectClearingCart);
    const requiresAuth = useSelector(selectCartRequiresAuth);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    // Local state
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);



    // Fetch cart on component mount
    useEffect(() => {
        if (isAuthenticated) {
            // Fetch cart with product details
            dispatch(fetchCartWithProductDetails())
                .finally(() => {
                    setInitialLoadComplete(true); // After dispatch success
                })
            // dispatch(fetchCart());
        } else {
            // Maybe not need later, but for now:
            // Reset Cart state if not authenticated
            dispatch(resetCart());
            setInitialLoadComplete(true);
        }
        
        // Clear any previous errors
        return () => {
            dispatch(clearErrors());
        };
    }, [dispatch, isAuthenticated]);

    // Handlers
    const handleQuantityUpdate = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity })).unwrap();
            // Refresh cart to get updated totals
            // dispatch(fetchCart());

            // Temporary version to fetch cart with product details
            dispatch(fetchCartWithProductDetails());
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await dispatch(removeFromCart(itemId)).unwrap();
            // Refresh cart to get updated totals
            // dispatch(fetchCart());

            // Temporary version to fetch cart with product details
            dispatch(fetchCartWithProductDetails());
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
        if (isAuthenticated) {
            // dispatch(fetchCart());
            dispatch(fetchCartWithProductDetails()); // temporary version
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    // Show authentication required state
    if (!isAuthenticated || requiresAuth) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                        <LogIn className="h-12 w-12 text-base-content/40" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-base-content/70 mb-8 max-w-md mx-auto">
                        Please log in to view your cart and manage your items.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={handleLogin} className="btn btn-primary">
                            <LogIn className="mr-2 h-4 w-4" />
                            Log In
                        </button>
                        <button onClick={handleRegister} className="btn btn-outline">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Register
                        </button>
                    </div>
                    <div className="mt-8">
                        <Link to="/products" className="btn btn-ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if ((loading && !initialLoadComplete) || (loading && items.length === 0)) {
        return (
            // <div className="container mx-auto px-4 py-8">
            //     <div className="flex justify-center items-center min-h-96">
            //         <span className="loading loading-spinner loading-lg"></span>
            //     </div>
            // </div>

            // temporary quick fix
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
            {/* Header Section */}
            {/* <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link to="/products" className="btn btn-ghost btn-sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Link>
                        <div className="divider divider-horizontal"></div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <ShoppingCart className="h-8 w-8" />
                            Shopping Cart
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleRefresh}
                            className="btn btn-outline btn-sm"
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        
                        {items.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="btn btn-error btn-outline btn-sm"
                                disabled={clearingCart}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Cart
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-base-content/70">
                    <span className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        {items.length} {items.length === 1 ? 'item' : 'items'} in cart
                    </span>
                    <div className="divider divider-horizontal"></div>
                    <span>Total: ${cartTotal.toFixed(2)}</span>
                </div>
            </div> */}  {/* The above header section is having a really bad design */}

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
                        />
                    </div>
                </div>
            )}

            {/* Clear Cart Confirmation Modal */}
            {showClearConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-warning" />
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