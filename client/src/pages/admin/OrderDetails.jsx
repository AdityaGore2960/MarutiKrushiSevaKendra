import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, Save, CheckCircle } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../../services/adminService';
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

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrder = () => {
    setLoading(true);
    getOrderById(id)
      .then((res) => {
        setOrder(res.data.data);
        setStatus(res.data.data.orderStatus);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load order details.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Order Details | Admin';
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setError('');

    try {
      const res = await updateOrderStatus(id, status);
      setOrder(res.data.data);
      setStatus(res.data.data.orderStatus);
      setSuccessMsg('Order status updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !order) return <div className="p-6"><ErrorMessage message={error} onRetry={fetchOrder} /></div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link to="/admin/orders" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <span className={`ml-auto inline-flex px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusColor(order.orderStatus)} capitalize`}>
          {order.orderStatus}
        </span>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-xl p-4 mb-6 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          {successMsg}
        </div>
      )}
      
      {error && order && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Order Items & Customer Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Order Items */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} className="text-green-600" />
              Order Items
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm leading-snug">{item.name}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm font-bold text-green-700">₹{item.price}</p>
                      <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Discount</span>
                <span className="font-semibold text-green-600">-₹{order.discount || 0}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shipping</span>
                <span className="font-semibold">₹{order.shippingCharge}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>Taxes</span>
                <span className="font-semibold">₹{order.taxes}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-900">
                <span className="font-extrabold">Total</span>
                <span className="font-extrabold text-green-700">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Status Update Form */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              Update Order Status
            </h2>
            <form onSubmit={handleUpdateStatus} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="label">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field"
                >
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
              <button 
                type="submit" 
                disabled={updating || status === order.orderStatus}
                className="btn-primary"
              >
                {updating ? 'Updating...' : <><Save size={18} /> Update</>}
              </button>
            </form>
          </div>

        </div>

        {/* Right Col: Details */}
        <div className="flex flex-col gap-6">
          
          {/* Customer */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-purple-600" />
              Customer Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Name</p>
                <p className="font-medium text-gray-900">{order.user?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Email</p>
                <p className="font-medium text-gray-900 break-all">{order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Phone</p>
                <p className="font-medium text-gray-900">{order.user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-red-600" />
              Shipping Address
            </h2>
            {order.shippingAddress ? (
              <div className="text-sm text-gray-700 leading-relaxed space-y-1">
                <p className="font-bold text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p className="font-semibold">{order.shippingAddress.pincode}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address provided.</p>
            )}
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-amber-600" />
              Payment Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Method</span>
                <span className="font-bold text-gray-900 uppercase">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.razorpayOrderId && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Razorpay Order ID</p>
                  <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">{order.razorpayOrderId}</p>
                </div>
              )}
              {order.razorpayPaymentId && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Razorpay Payment ID</p>
                  <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">{order.razorpayPaymentId}</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
