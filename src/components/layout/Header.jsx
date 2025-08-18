import { LogOut, Menu, Search, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import React, { useEffect, useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light'));

  useEffect(() => {
    // Apply theme to document for global daisyUI tokens
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore in SSR
    }
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
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

        {/* Theme toggle button - uses daisyUI themes via data-theme on document */}
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle" aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

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