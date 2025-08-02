import { LayoutDashboard, Settings, ShoppingCart, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const getLinkClass = ({ isActive }) =>
    `flex items-center p-3 rounded-lg hover:bg-base-300 ${isActive ? 'bg-primary text-primary-content' : ''}`;

  return (
    <aside className="w-64 bg-base-200 p-4 rounded-lg shadow-lg">
      <ul className="menu space-y-2">
        <li>
          <NavLink to="/admin/dashboard" className={getLinkClass}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className={getLinkClass}>
            <ShoppingCart className="w-5 h-5 mr-3" />
            Manage Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/orders" className={getLinkClass}>
            <ShoppingCart className="w-5 h-5 mr-3" />
            Manage Orders
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={getLinkClass}>
            <Users className="w-5 h-5 mr-3" />
            Manage Users
          </NavLink>
        </li>
        <div className="divider"></div>
        <li>
          <NavLink to="/admin/settings" className={getLinkClass}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;