import { useEffect, useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Package,
  Users,
  CreditCard,
  Download,
  Calendar,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { getAllOrders, getAllUsers } from '../../services/adminService';
import { getProducts } from '../../services/productService';
import Loading from '../../components/Loading';

// --- Date Utilities ---
const startOfDay = (d) => new Date(d.setHours(0, 0, 0, 0));
const endOfDay = (d) => new Date(d.setHours(23, 59, 59, 999));

const getDateRanges = () => {
  const now = new Date();
  return {
    'Today': [startOfDay(new Date()), endOfDay(new Date())],
    'Yesterday': [
      startOfDay(new Date(new Date().setDate(now.getDate() - 1))),
      endOfDay(new Date(new Date().setDate(now.getDate() - 1))),
    ],
    'Last 7 Days': [startOfDay(new Date(new Date().setDate(now.getDate() - 6))), endOfDay(new Date())],
    'Last 30 Days': [startOfDay(new Date(new Date().setDate(now.getDate() - 29))), endOfDay(new Date())],
    'This Month': [startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)), endOfDay(new Date())],
    'Last Month': [
      startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
      endOfDay(new Date(now.getFullYear(), now.getMonth(), 0)),
    ],
    'This Year': [startOfDay(new Date(now.getFullYear(), 0, 1)), endOfDay(new Date())],
  };
};

const DATES = getDateRanges();

// --- CSV Export Helper ---
const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvContent =
    keys.join(',') +
    '\n' +
    data
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell.toString().replace(/"/g, '""');
            return `"${cell}"`;
          })
          .join(',')
      )
      .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Raw Data
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // Filters
  const [rangeType, setRangeType] = useState('Last 30 Days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Fetch all core data
  useEffect(() => {
    document.title = 'Reports | Admin';
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
          getProducts({ limit: 1000 }), // Get all products
        ]);
        setOrders(ordersRes.data.data);
        setUsers(usersRes.data.data);
        setProducts(productsRes.data.data || productsRes.data.products);
      } catch (err) {
        setError('Failed to load report data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Derived Active Date Range ---
  const activeRange = useMemo(() => {
    if (rangeType === 'Custom Range') {
      const s = customStart ? startOfDay(new Date(customStart)) : new Date(0);
      const e = customEnd ? endOfDay(new Date(customEnd)) : endOfDay(new Date());
      return [s, e];
    }
    return DATES[rangeType];
  }, [rangeType, customStart, customEnd]);

  // --- Filtered Data ---
  const filteredOrders = useMemo(() => {
    const [start, end] = activeRange;
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });
  }, [orders, activeRange]);

  const filteredUsers = useMemo(() => {
    const [start, end] = activeRange;
    return users.filter((u) => {
      const d = new Date(u.createdAt);
      return d >= start && d <= end;
    });
  }, [users, activeRange]);

  // --- Aggregations ---

  // 1. Overview
  const totalOrders = filteredOrders.length;
  const successfulOrders = filteredOrders.filter(o => o.paymentStatus === 'paid');
  const totalSales = successfulOrders.reduce((acc, o) => acc + (o.totalPrice || o.total || 0), 0);
  const activeCustomersCount = new Set(filteredOrders.map(o => o.user?._id || o.user)).size;
  const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // 2. Sales Chart (Daily breakdown)
  const salesData = useMemo(() => {
    if (!filteredOrders.length) return [];

    // Group by Day
    const days = {};
    filteredOrders.forEach(o => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!days[dateStr]) days[dateStr] = { revenue: 0, orders: 0, units: 0 };

      if (o.paymentStatus === 'paid') {
        days[dateStr].revenue += (o.totalPrice || o.total || 0);
      }
      days[dateStr].orders += 1;

      const itemsCount = o.orderItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
      days[dateStr].units += itemsCount;
    });

    const sortedDays = Object.keys(days).sort();
    return sortedDays.map(date => ({
      date,
      ...days[date]
    }));
  }, [filteredOrders]);

  const maxRevenue = Math.max(...salesData.map(d => d.revenue), 100);

  // 3. Product Performance
  const topProducts = useMemo(() => {
    const productStats = {};
    filteredOrders.forEach(o => {
      if (o.orderStatus === 'cancelled') return;
      (o.orderItems || []).forEach(item => {
        const id = item.product?._id || item.product;
        const name = item.name || 'Unknown Product';
        if (!productStats[id]) {
          productStats[id] = { name, units: 0, revenue: 0 };
        }
        productStats[id].units += item.quantity || 1;
        productStats[id].revenue += (item.price * (item.quantity || 1));
      });
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  // 4. Order Status Breakdown
  const orderStatuses = {
    'Pending Payment': filteredOrders.filter(o => o.paymentStatus === 'pending').length,
    'Processing': filteredOrders.filter(o => o.orderStatus === 'processing' || o.orderStatus === 'placed').length,
    'Shipped': filteredOrders.filter(o => o.orderStatus === 'shipped' || o.orderStatus === 'out for delivery').length,
    'Delivered': filteredOrders.filter(o => o.orderStatus === 'delivered').length,
    'Cancelled': filteredOrders.filter(o => o.orderStatus === 'cancelled').length,
  };

  // 5. Payment Status Breakdown
  const paymentStats = {
    'Paid': filteredOrders.filter(o => o.paymentStatus === 'paid'),
    'Pending': filteredOrders.filter(o => o.paymentStatus === 'pending'),
    'Failed': filteredOrders.filter(o => o.paymentStatus === 'failed'),
  };

  // 6. Inventory & Refunds
  const lowStockThreshold = 10;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const cancelledOrders = filteredOrders.filter(o => o.orderStatus === 'cancelled');
  const refundedValue = cancelledOrders
    .filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'refunded') // Approximation based on existing schema
    .reduce((acc, o) => acc + (o.totalPrice || o.total || 0), 0);

  // --- Export Handlers ---
  const handleExportSales = () => {
    const exportData = filteredOrders.map(o => ({
      'Order ID': o._id,
      'Date': new Date(o.createdAt).toLocaleString(),
      'Customer': o.user?.name || 'Guest',
      'Total Amount': o.totalPrice || o.total || 0,
      'Payment Status': o.paymentStatus,
      'Order Status': o.orderStatus
    }));
    exportToCSV(exportData, `Sales_Report_${rangeType.replace(/\s+/g, '_')}`);
  };

  const handleExportProducts = () => {
    exportToCSV(topProducts, `Top_Products_${rangeType.replace(/\s+/g, '_')}`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-emerald-500">{error}</div>;

  return (
    <div className="pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-emerald-500" /> Reports & Analytics
          </h1>
          <p className="text-gray-500 mt-1">Business performance overview</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <Calendar size={16} className="text-gray-400 ml-2" />
            <select
              value={rangeType}
              onChange={(e) => setRangeType(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-gray-700 py-1.5 pr-8 focus:ring-0 cursor-pointer outline-none"
            >
              {Object.keys(DATES).map(k => <option key={k} value={k}>{k}</option>)}
              <option value="Custom Range">Custom Range</option>
            </select>
          </div>

          {rangeType === 'Custom Range' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                className="input-field py-1.5 text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                className="input-field py-1.5 text-sm"
              />
            </div>
          )}

          <div className="relative group">
            <button className="flex items-center gap-2 bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors shadow-sm shadow-emerald-500/20">
              <Download size={16} /> Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
              <button onClick={handleExportSales} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Export Sales (CSV)
              </button>
              <button onClick={handleExportProducts} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-t border-gray-50">
                Export Products (CSV)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-gray-500">Total Sales</p>
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-emerald-500"><TrendingUp size={16} /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-gray-500">Total Orders</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><Package size={16} /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{totalOrders}</p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-gray-500">Active Customers</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><Users size={16} /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{activeCustomersCount}</p>
        </div>

        <div className="card p-5">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-gray-500">Avg Order Value</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><CreditCard size={16} /></div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">₹{aov.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 2. Sales Chart (CSS Based) */}
        <div className="card p-6 lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Revenue Overview</h2>
          {salesData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-semibold">No sales data for this period</div>
          ) : (
            <div className="flex-1 flex items-end gap-2 h-64 mt-auto">
              {salesData.map((day, idx) => (
                <div key={idx} className="relative flex-1 group h-full flex items-end">
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} <br />
                    ₹{day.revenue.toLocaleString('en-IN')}
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full bg-emerald-500 hover:bg-emerald-700 transition-all rounded-t-sm"
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 2)}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Order & Payment Breakdown */}
        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Order Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-semibold"><span className="text-black-500 flex items-center gap-1.5"><Clock size={14} /> Pending Payment</span> <span>{orderStatuses['Pending Payment']}</span></div>
              <div className="flex justify-between text-sm font-semibold"><span className="text-black-500 flex items-center gap-1.5"><Package size={14} /> Processing</span> <span>{orderStatuses['Processing']}</span></div>
              <div className="flex justify-between text-sm font-semibold"><span className="text-black-500 flex items-center gap-1.5"><ArrowRight size={14} /> Shipped</span> <span>{orderStatuses['Shipped']}</span></div>
              <div className="flex justify-between text-sm font-semibold"><span className="text-black-500 flex items-center gap-1.5"><CheckCircle2 size={14} /> Delivered</span> <span>{orderStatuses['Delivered']}</span></div>
              <div className="flex justify-between text-sm font-semibold"><span className="text-black-500 flex items-center gap-1.5"><XCircle size={14} /> Cancelled</span> <span>{orderStatuses['Cancelled']}</span></div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Payment Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Successful Payments</span>
                  <span>₹{paymentStats['Paid'].reduce((a, o) => a + (o.totalPrice || o.total || 0), 0).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-gray-500">{paymentStats['Paid'].length} orders</p>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Pending Payments</span>
                  <span>₹{paymentStats['Pending'].reduce((a, o) => a + (o.totalPrice || o.total || 0), 0).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-gray-500">{paymentStats['Pending'].length} orders</p>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                  <span>Failed Payments</span>
                  <span>₹{paymentStats['Failed'].reduce((a, o) => a + (o.totalPrice || o.total || 0), 0).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-xs text-gray-500">{paymentStats['Failed'].length} orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Top Products */}
        <div className="card p-0 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-extrabold text-gray-900">Top Selling Products</h2>
          </div>
          <div className="p-0">
            {topProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm font-semibold">No products sold in this period</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold text-center">Units Sold</th>
                    <th className="px-5 py-3 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-sm font-bold text-gray-800">{p.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 text-center">{p.units}</td>
                      <td className="px-5 py-3 text-sm font-bold text-green-600 text-right">₹{p.revenue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 5. Customers & Inventory */}
        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Customer Acquisition</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">New Signups</p>
                <p className="text-2xl font-extrabold text-emerald-500">{filteredUsers.length}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Active Shoppers</p>
                <p className="text-2xl font-extrabold text-emerald-500">{activeCustomersCount}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Inventory Alerts & Refunds</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-600 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Low Stock Products</span>
                <span className="font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{lowStockCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-600 flex items-center gap-2"><XCircle size={16} className="text-red-500" /> Out of Stock Products</span>
                <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded">{outOfStockCount}</span>
              </div>
              <div className="h-px bg-gray-100 my-2"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-600">Refunded / Cancelled (Paid)</span>
                <span className="font-extrabold text-red-600">₹{refundedValue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminReports;
