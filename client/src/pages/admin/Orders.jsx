import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Search, Filter } from 'lucide-react';
import { getAllOrders } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'packed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'out for delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    case 'returned': return 'bg-gray-100 text-gray-800 border-gray-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'text-green-600 bg-green-50';
    case 'pending': return 'text-amber-600 bg-amber-50';
    case 'failed': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// Tab definitions
const TABS = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending-payment', label: 'Pending Payment' },
  { key: 'to-fulfill', label: 'To Fulfill' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

// Apply tab-based filter to the full orders list
const applyTabFilter = (orders, tab) => {
  switch (tab) {
    case 'pending-payment':
      return orders.filter(o => o.paymentStatus === 'pending');
    case 'to-fulfill':
      return orders.filter(o => o.paymentStatus === 'paid' && o.orderStatus !== 'shipped' && o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && o.orderStatus !== 'returned');
    case 'shipped':
      return orders.filter(o => o.orderStatus === 'shipped' || o.orderStatus === 'out for delivery');
    case 'delivered':
      return orders.filter(o => o.orderStatus === 'delivered');
    default:
      return orders;
  }
};

const AdminOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Active tab driven by ?tab= query param
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all';

  const setActiveTab = (tab) => {
    const params = new URLSearchParams(location.search);
    if (tab === 'all') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    navigate(`/admin/orders?${params.toString()}`, { replace: true });
  };

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Manage Orders | Admin';
    fetchOrders();
  }, []);

  // Derived: apply tab filter → then search + status filter
  const tabFiltered = applyTabFilter(orders, activeTab);

  const filteredOrders = tabFiltered.filter(o => {
    const s = search.trim().toLowerCase();
    const matchesSearch = !s || (
      o._id.toLowerCase().includes(s) ||
      o.user?.name?.toLowerCase().includes(s) ||
      o.user?.email?.toLowerCase().includes(s)
    );
    const matchesStatus = !statusFilter || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 mt-1">View and update customer orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            id={`orders-tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-500 bg-emerald-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {!loading && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {applyTabFilter(orders, tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Status filter */}
      <div className="card p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="w-full md:w-64 relative flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2.5"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchOrders} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description={search || statusFilter || activeTab !== 'all' ? "No orders match your filters." : "You don't have any orders yet."}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                  <th className="px-6 py-4 font-bold text-gray-700">Order ID &amp; Date</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Items &amp; Total</th>
                  <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-semibold text-gray-900 font-mono">{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-semibold text-gray-900">{order.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(order.orderStatus)} capitalize`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-xs font-semibold text-gray-500 mb-1">{order.items?.length || 0} items</p>
                      <p className="text-sm font-extrabold text-green-700">₹{order.total}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPaymentStatusColor(order.paymentStatus)} uppercase`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold px-4 py-2 rounded-xl transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;


