import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, Trash2, Box, MessageSquare, RefreshCcw, PackageSearch, AlertCircle, ShoppingBag, Info } from 'lucide-react';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../../services/adminService';
import Loading from '../../components/Loading';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = () => {
    setLoading(true);
    getNotifications()
      .then(res => setNotifications(res.data.data))
      .catch(() => setError('Failed to load notifications.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Notifications | Admin';
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      if (id === 'all') {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } else {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      alert('Failed to update notification.');
    }
  };

  const handleDelete = async (id) => {
    if (id === 'all' && !window.confirm('Are you sure you want to clear all notifications?')) return;
    
    try {
      await deleteNotification(id);
      if (id === 'all') {
        setNotifications([]);
      } else {
        setNotifications(prev => prev.filter(n => n._id !== id));
      }
    } catch (err) {
      alert('Failed to delete notification.');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag size={20} className="text-blue-600" />;
      case 'INVENTORY': return <Box size={20} className="text-orange-600" />;
      case 'MESSAGE': return <MessageSquare size={20} className="text-green-600" />;
      case 'RETURN': return <RefreshCcw size={20} className="text-red-600" />;
      default: return <Info size={20} className="text-gray-600" />;
    }
  };

  if (loading) return <Loading />;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Bell size={28} className="text-gray-900" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1">Stay updated on orders, inventory alerts, and messages</p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleMarkAsRead('all')}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Mark all as read
            </button>
            <button 
              onClick={() => handleDelete('all')}
              className="text-sm font-semibold text-red-600 hover:text-red-700 bg-white border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl font-medium border border-red-200">{error}</div>
      ) : notifications.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h2>
          <p className="text-gray-500 max-w-sm">There are no new alerts right now. We'll notify you here when something needs your attention.</p>
        </div>
      ) : (
        <div className="card overflow-hidden divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-gray-50 ${notif.isRead ? 'opacity-70' : 'bg-blue-50/30'}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-gray-100' : 'bg-white shadow-sm border border-gray-100'}`}>
                {getIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                  <h3 className={`font-bold text-gray-900 truncate ${!notif.isRead && 'text-blue-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{notif.message}</p>
                
                {notif.link && (
                  <Link 
                    to={notif.link}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                    className="inline-flex text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                {!notif.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Mark as Read"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notif._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
