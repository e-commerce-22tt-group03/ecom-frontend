// import { Link, NavLink } from 'react-router-dom';
// import { ShoppingCart, Search, User } from 'lucide-react';

// import { version } from "react"

// const Header = () => {
//     // This will later be replaced with data from redux
//     const isLoggedIn = false; 
//     const cartItemCount = 0;
//     return (
//         <header className="bg-base-100 shadow-lg sticky top-0 z-50">
//             <div className="navbar container mx-auto">
//                 <div className="navbar-start">
//                     <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
//                         LazaHoa - 🌸 FlowerShop
//                     </Link>
//                 </div>
//                 <div className="navbar-center hidden lg:flex">
//                     <ul className="menu menu-horizontal p-0">
//                         <li><NavLink to="/products">All Flowers</NavLink></li>
//                         <li><NavLink to="/occasions/birthday">Birthday</NavLink></li>
//                         <li><NavLink to="/occasions/valentines">Valentine's</NavLink></li>
//                     </ul>
//                 </div>
//                 <div className="navbar-end">
//                     <button className="btn btn-ghost btn-circle">
//                         <Search />
//                     </button>
//                     <Link to="/cart" className="btn btn-ghost btn-circle">
//                         <div className="indicator">
//                             <ShoppingCart />
//                             <span className="badge badge-sm badge-secondary indicator-item">
//                                 {cartItemCount}</span>
//                         </div>
//                     </Link>
//                     {isLoggedIn ? (
//                         <div className="dropdown dropdown-end">
//                             <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
//                                 <div className="w-10 rounded-full">
//                                     {/* In a reap app, this would be the user's avatar */}
//                                     <User className="p-2" />
//                                 </div>
//                             </label>
//                             <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 
//                             z-[1] p-2 shadow bg-base-100 rounded-box w-52">
//                                 <li><Link to="/profile">Profile</Link></li>
//                                 <li><Link to="/orders">My Orders</Link></li>
//                                 <li><a>Logout</a></li>
//                             </ul>
//                         </div>
//                     ) : (
//                         <Link to="/login" className="btn btn-ghost">Login</Link>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header; 

// Older version of Header components

// src/components/layout/Header.jsx
import { LogOut, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu className="w-5 h-5" />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
          🌸 LazaHoa
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search flowers..." className="input input-bordered w-24 md:w-auto" />
        </div>
        <button className="btn btn-ghost btn-circle">
          <Search className="w-5 h-5" />
        </button>
        <Link to="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <ShoppingCart className="w-5 h-5" />
            {/* <span className="badge badge-sm indicator-item">3</span> */}
          </div>
        </Link>

        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{user?.full_name || user?.email}</span>
              </li>
              {isAdmin && <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>}
              {!isAdmin && <li><Link to="/profile">Profile</Link></li>}
              {!isAdmin && <li><Link to="/orders">My Orders</Link></li>}
              {!isAdmin && <li><Link to="/address">My Address</Link></li>}
              <li><button onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-ghost btn-circle">
            <User className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;