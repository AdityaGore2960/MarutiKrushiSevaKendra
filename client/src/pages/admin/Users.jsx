import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Mail, Phone, Calendar, ArrowRight, UserCheck, UserPlus, Repeat, TrendingUp } from 'lucide-react';
import { getAllUsers } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

// Filter tab definitions
const TABS = [
  { key: 'all',     label: 'All' },
  { key: 'active',  label: 'Active' },
  { key: 'inactive',label: 'Inactive' },
  { key: 'new',     label: 'New' },
  { key: 'repeat',  label: 'Repeat Customers' },
];

const applyTabFilter = (users, tab) => {
  switch (tab) {
    case 'active':   return users.filter(u => u.isActive);
    case 'inactive': return users.filter(u => !u.isActive);
    case 'new':      return users.filter(u => u.isNew);
    case 'repeat':   return users.filter(u => u.isRepeat);
    default:         return users;
  }
};

const AdminUsers = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((res) => setUsers(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load customers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Manage Customers | Admin';
    fetchUsers();
  }, []);

  // Derived stats from real data
  const totalCustomers  = users.length;
  const activeCount     = users.filter(u => u.isActive).length;
  const newCount        = users.filter(u => u.isNew).length;
  const repeatCount     = users.filter(u => u.isRepeat).length;

  // Tab filter → then search filter
  const tabFiltered = applyTabFilter(users, activeTab);
  const filteredUsers = tabFiltered.filter(u => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.phone?.includes(s)
    );
  });

  const overviewCards = [
    { icon: Users,      label: 'Total Customers', value: totalCustomers, color: 'bg-emerald-500',  tab: 'all' },
    { icon: UserCheck,  label: 'Active',           value: activeCount,    color: 'bg-emerald-500',   tab: 'active' },
    { icon: UserPlus,   label: 'New (30 days)',    value: newCount,       color: 'bg-emerald-500',    tab: 'new' },
    { icon: Repeat,     label: 'Repeat Customers', value: repeatCount,    color: 'bg-emerald-500',  tab: 'repeat' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Manage Customers</h1>
        <p className="text-gray-500 mt-1">View all registered customers and their order activity</p>
      </div>

      {/* Overview Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {overviewCards.map(card => (
            <button
              key={card.tab}
              id={`customers-card-${card.tab}`}
              onClick={() => setActiveTab(card.tab)}
              className={`card p-5 text-left transition-all hover:shadow-md ${activeTab === card.tab ? 'ring-2 ring-offset-1 ring-emerald-500' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} shadow-inner mb-3`}>
                <card.icon size={20} className="text-white" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{card.value}</p>
              <p className="text-sm font-semibold text-gray-500 mt-1">{card.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            id={`customers-tab-${tab.key}`}
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
                {applyTabFilter(users, tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4 md:p-5 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Found"
          description={search || activeTab !== 'all' ? 'No customers match your filters.' : "You don't have any registered customers yet."}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[960px]">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-sm">
                  <th className="px-6 py-4 font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Email / Phone</th>
                  <th className="px-6 py-4 font-bold text-gray-700 text-center">Orders</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Total Spent</th>
                  <th className="px-6 py-4 font-bold text-gray-700">Last Order</th>
                  <th className="px-6 py-4 font-bold text-gray-700 text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Customer */}
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email / Phone */}
                    <td className="px-6 py-4 align-middle space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate max-w-[180px]" title={user.email}>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={13} className="text-gray-400 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    {/* Orders */}
                    <td className="px-6 py-4 align-middle text-center">
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-bold text-sm px-3 py-1 rounded-lg">
                        {user.orderCount || 0}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-6 py-4 align-middle">
                      <span className="font-extrabold text-green-700">
                        ₹{(user.totalSpent || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Last Order */}
                    <td className="px-6 py-4 align-middle">
                      {user.lastOrderDate ? (
                        <span className="text-sm text-gray-600">
                          {new Date(user.lastOrderDate).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No orders yet</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 align-middle text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 align-middle text-right">
                      <Link
                        to={`/admin/customers/${user._id}`}
                        id={`view-customer-${user._id}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                      >
                        View <ArrowRight size={13} />
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

export default AdminUsers;


