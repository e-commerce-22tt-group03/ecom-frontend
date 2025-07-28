import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProfileSidebar = () => {
  const location = useLocation();
  return (
    <aside className="w-full md:w-1/5 h-64 md:h-screen bg-base-100 shadow-lg flex flex-col items-center justify-center md:justify-start md:items-end p-4">
      <nav className="flex flex-col gap-4 w-full max-w-xs md:items-end">
        <Link
          to="/profile"
          className={`btn btn-ghost justify-start text-left font-semibold w-full transition-colors duration-150 ${location.pathname === '/profile' ? 'text-primary font-bold' : ''}`}
        >
          Profile Detail
        </Link>
        <Link
          to="/orders"
          className={`btn btn-ghost justify-start text-left w-full transition-colors duration-150 ${location.pathname === '/orders' ? 'text-primary font-bold' : ''}`}
        >
          My Orders
        </Link>
      </nav>
    </aside>
  );
};

export default ProfileSidebar; 