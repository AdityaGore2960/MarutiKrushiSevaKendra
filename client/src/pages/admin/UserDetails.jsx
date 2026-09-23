import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, Package, Eye, CreditCard, TrendingUp } from 'lucide-react';
import { getUserById } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

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

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserDetails = () => {
    setLoading(true);
    getUserById(id)
      .then((res) => {
        setUser(res.data.data.user);
        setOrders(res.data.data.orders);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user details.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Customer Profile | Admin';
    fetchUserDetails();
  }, [id]);

  if (loading) return <Loading />;
  if (error && !user) return <div className="p-6"><ErrorMessage message={error} onRetry={fetchUserDetails} /></div>;
  if (!user) return <div className="p-6">Customer not found.</div>;

  const totalSpent = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalSpent / orders.length) : 0;
  const lastOrder = orders.length > 0 ? orders[0] : null; // already sorted desc

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/admin/customers" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Customer Profile</h1>
          <p className="text-gray-500 mt-1 text-sm">ID: {user._id}</p>
        </div>
        <span className={`ml-auto inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${user.accountStatus === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {user.accountStatus || 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Profile Card */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-green-100 text-green-700 font-extrabold text-3xl flex items-center justify-center shrink-0 shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><Mail size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email Address</p>
                    <p className="font-medium text-gray-900 break-all">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><Phone size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Mobile Number</p>
                    <p className="font-medium text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Card */}
        <div className="card p-6 flex flex-col justify-center gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
              <CreditCard size={16} className="text-emerald-500" />
              Total Spent
            </p>
            <p className="text-3xl font-extrabold text-gray-900">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
              <Package size={16} className="text-blue-500" />
              Total Orders
            </p>
            <p className="text-3xl font-extrabold text-gray-900">{orders.length}</p>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-500" />
              Avg. Order Value
            </p>
            <p className="text-2xl font-extrabold text-gray-900">₹{avgOrderValue.toLocaleString('en-IN')}</p>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-500 mb-1 flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              Last Order
            </p>
            <p className="text-sm font-bold text-gray-900">
              {lastOrder
                ? new Date(lastOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : <span className="text-gray-400 font-normal italic">No orders yet</span>}
            </p>
          </div>
        </div>

      </div>

      {/* Addresses */}
      <h3 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-red-500" /> Saved Addresses
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {user.addresses && user.addresses.length > 0 ? (
          user.addresses.map(addr => (
            <div key={addr._id} className="card p-5 text-sm text-gray-700 space-y-1 bg-white border border-gray-100">
              <p className="font-bold text-gray-900">{addr.name}</p>
              <p>{addr.phone}</p>
              <p className="mt-2">{addr.house}, {addr.street}</p>
              <p>{addr.city}, {addr.state}</p>
              <p className="font-semibold">{addr.pincode}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No saved addresses.
          </div>
        )}
      </div>

      {/* Order History */}
      <h3 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
        <Package size={20} className="text-indigo-500" /> Order History
      </h3>
      {orders.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">
                    {order.items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 font-extrabold text-green-700">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(order.orderStatus)} capitalize`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title="View Order"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          This customer hasn't placed any orders yet.
        </div>
      )}

    </div>
  );
};

export default UserDetails;
