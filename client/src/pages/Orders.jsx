import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { User, ShoppingBag, MapPin, LogOut, Package, Search } from 'lucide-react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Orders = () => {
  const { user, logoutUser } = useUser();
  const { onUserLogout } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState('All');
  const filters = [
    ['All', 'orders.filters.all'],
    ['Pending', 'orders.filters.pending'],
    ['Processing', 'orders.filters.processing'],
    ['Shipped', 'orders.filters.shipped'],
    ['Delivered', 'orders.filters.delivered'],
    ['Cancelled', 'orders.filters.cancelled'],
  ];

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logoutUser();
    onUserLogout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f3f7f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

        {/* Left Sidebar Card */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            {/* User Avatar & Info */}
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-md">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.phone}</p>

            {/* Navigation Menu */}
            <div className="w-full flex flex-col gap-2">
              <NavLink
                to="/profile"
                end
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <User size={18} /> {t('profile.profile')}
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <ShoppingBag size={18} /> {t('profile.orders')}
              </NavLink>

              <NavLink
                to="/addresses"
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <MapPin size={18} /> {t('profile.addresses')}
              </NavLink>

              <div className="h-px bg-gray-100 my-2"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={18} /> {t('profile.logout')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">

            {/* Top Banner */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                  <Package size={18} />
                </div>
                <div>
                  <span className="text-green-800 font-bold mr-2">{t('orders.title')}</span>
                  <span className="text-gray-700 font-semibold">{user.name}</span>
                </div>
              </div>
              <div className="text-green-800 font-bold text-sm">
                {t('orders.count', { count: 0 })}
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto gap-2 hide-scrollbar">
                {filters.map(([filter, labelKey]) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${activeFilter === filter
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-600 hover:text-green-600'
                      }`}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full lg:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('orders.searchPlaceholder')}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  {t('orders.range', { from: 0, to: 0, total: 0 })}
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('orders.title')}</h1>

            {/* Empty State Card */}
            <div className="border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('orders.noOrders')}</h2>
              <p className="text-gray-500 mb-6">{t('orders.emptyMessage')}</p>
              <Link
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors inline-flex"
              >
                <ShoppingBag size={18} /> {t('orders.shopNow')}
              </Link>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Orders;
