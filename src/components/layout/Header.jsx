import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';

const Header = () => {
    // This will later be replaced with data from redux
    const isLoggedIn = false; 
    const cartItemCount = 0;
    return (
        <header className="bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="navbar container mx-auto">
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
                        LazaHoa - 🌸 FlowerShop
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal p-0">
                        <li><NavLink to="/products">All Flowers</NavLink></li>
                        <li><NavLink to="/occasions/birthday">Birthday</NavLink></li>
                        <li><NavLink to="/occasions/valentines">Valentine's</NavLink></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-ghost btn-circle">
                        <Search />
                    </button>
                    <Link to="/cart" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <ShoppingCart />
                            <span className="badge badge-sm badge-secondary indicator-item">
                                {cartItemCount}</span>
                        </div>
                    </Link>
                    {isLoggedIn ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    {/* In a reap app, this would be the user's avatar */}
                                    <User className="p-2" />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 
                            z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/orders">My Orders</Link></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-ghost">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;