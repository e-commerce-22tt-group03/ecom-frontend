// src/features/cart/components/CartIcon.jsx
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { 
    selectCartItemCount, 
    selectCartDrawerOpen,
    toggleCartDrawer 
} from '../cartSlice';

const CartIcon = ({ className = '' }) => {
    const dispatch = useDispatch();
    const itemCount = useSelector(selectCartItemCount);
    const isOpen = useSelector(selectCartDrawerOpen);

    const handleClick = () => {
        dispatch(toggleCartDrawer());
    };

    return (
        <button
            onClick={handleClick}
            className={`btn btn-ghost btn-circle relative ${className}`}
            aria-label="Shopping cart"
        >
            <ShoppingCart className="h-5 w-5" />
            
            {itemCount > 0 && (
                <span className="badge badge-primary badge-sm absolute -top-2 -right-2 min-w-[1.25rem] h-5">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
};

export default CartIcon;