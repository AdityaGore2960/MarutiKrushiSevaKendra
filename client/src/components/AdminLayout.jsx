import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, LogOut, Leaf, Menu, X, ShoppingBag, Users, MessageSquare, Warehouse, Award, Star, Ticket, BarChart3, Settings, Search, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORE_CONFIG } from '../config/store';
import { getUnreadNotificationCount } from '../services/adminService';

const adminNavLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/brands', label: 'Brands', icon: Award },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = () => {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error('Failed to fetch unread notifications');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-40 flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex lg:overflow-y-auto overflow-x-hidden`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
          <div className="bg-green-600 rounded-xl p-1.5">
            <Leaf size={20} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm text-white">{STORE_CONFIG.name}</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            id="sidebar-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {adminNavLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              id={`admin-nav-${label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
              id="sidebar-open"
            >
              <Menu size={22} />
            </button>
            
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64 lg:w-96 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all">
              <Search size={18} className="text-gray-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search products, orders, customers..." 
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-4">
            <NavLink 
              to="/admin/notifications" 
              className={({ isActive }) => `relative p-2 rounded-full transition-colors ${isActive ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </NavLink>
            
            <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900 leading-tight">Admin Profile</p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{admin?.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold border border-green-200 shrink-0">
                A
              </div>
              <button
                onClick={handleLogout}
                id="admin-logout-btn"
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
