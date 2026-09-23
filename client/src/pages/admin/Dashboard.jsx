import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, IndianRupee, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';
import { getStats } from '../../services/productService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const StatCard = ({ icon: Icon, label, value, growth, growthLabel, color, linkTo }) => (
  <div className="card p-5 flex flex-col justify-between group transition-all hover:shadow-lg hover:shadow-gray-200/50 relative">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-inner`}>
        <Icon size={24} className="text-white" />
      </div>
      {growth !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${Number(growth) >= 0 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
          {Number(growth) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(Number(growth))}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-semibold">{label}</h3>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        {growthLabel && <span className="text-xs text-gray-400 mb-1 font-medium">{growthLabel}</span>}
      </div>
    </div>
    {linkTo && (
      <Link to={linkTo} className="absolute inset-0 z-10">
        <span className="sr-only">View {label}</span>
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = () => {
    setLoading(true);
    setError('');
    getStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Dashboard | Admin';
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store</p>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchStats} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard 
              icon={IndianRupee} 
              label="Today's Sales" 
              value={`₹${stats.todaysSales?.toLocaleString('en-IN') || 0}`} 
              color="bg-emerald-500" 
            />
            <StatCard 
              icon={ShoppingBag} 
              label="Today's Orders" 
              value={stats.todaysOrders || 0} 
              linkTo="/admin/orders"
              color="bg-emerald-500" 
            />
            <StatCard 
              icon={Users} 
              label="Customers" 
              value={stats.totalCustomers?.toLocaleString() || 0} 
              linkTo="/admin/customers"
              color="bg-emerald-500" 
            />
            <StatCard 
              icon={Package} 
              label="Products" 
              value={stats.totalProducts || 0} 
              linkTo="/admin/products"
              color="bg-emerald-500" 
            />
            <StatCard 
              icon={Clock} 
              label="Pending Payments/Orders" 
              value={stats.pendingOrders || 0} 
              linkTo="/admin/orders?tab=pending-payment"
              color="bg-emerald-500" 
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Order Status Summary & Quick Actions */}
            <div className="xl:col-span-1 flex flex-col gap-4">
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-emerald-500" />
                  Order Status
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {stats.orderStatusSummary && Object.entries(stats.orderStatusSummary).map(([status, count]) => (
                    <Link
                      key={status}
                      to={`/admin/orders?status=${status}`}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl p-3 text-center transition-colors flex flex-col"
                    >
                      <span className="text-2xl font-extrabold text-gray-900">{count}</span>
                      <span className="text-xs font-semibold text-gray-500 capitalize">{status}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-emerald-500" />
                  <h2 className="font-bold text-gray-900">Quick Actions</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to="/admin/orders" className="btn-primary justify-center bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20">
                    Manage Orders
                  </Link>
                  <Link to="/admin/products/add" id="dash-add-product" className="btn-secondary justify-center">
                    + Add New Product
                  </Link>
                  <Link to="/admin/products" id="dash-manage-products" className="btn-secondary justify-center">
                    Manage Products
                  </Link>
                  <Link to="/admin/categories" id="dash-manage-categories" className="btn-secondary justify-center">
                    Manage Categories
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Recent Orders Table */}
            <div className="xl:col-span-2">
              <div className="card overflow-hidden flex flex-col h-full">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={20} className="text-emerald-500" />
                    Recent Orders
                  </h2>
                  <Link to="/admin/orders" className="text-sm font-bold text-emerald-500 hover:text-emerald-600">
                    View All &rarr;
                  </Link>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-5 py-3 font-semibold">Order ID</th>
                        <th className="px-5 py-3 font-semibold">Customer</th>
                        <th className="px-5 py-3 font-semibold">Date</th>
                        <th className="px-5 py-3 font-semibold">Amount</th>
                        <th className="px-5 py-3 font-semibold">Payment</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {stats.recentOrders && stats.recentOrders.length > 0 ? (
                        stats.recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3 align-middle text-sm font-bold text-gray-900 font-mono">
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-5 py-3 align-middle text-sm font-semibold text-gray-700 truncate max-w-[120px]">
                              {order.user?.name || 'Unknown'}
                            </td>
                            <td className="px-5 py-3 align-middle text-sm text-gray-500 whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </td>
                            <td className="px-5 py-3 align-middle text-sm font-extrabold text-green-700">
                              ₹{order.total}
                            </td>
                            <td className="px-5 py-3 align-middle">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="px-5 py-3 align-middle">
                              <span className="text-xs font-bold text-gray-600 capitalize">{order.orderStatus}</span>
                            </td>
                            <td className="px-5 py-3 align-middle text-right">
                              <Link
                                to={`/admin/orders/${order._id}`}
                                className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-5 py-8 text-center text-gray-500 text-sm">
                            No recent orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
