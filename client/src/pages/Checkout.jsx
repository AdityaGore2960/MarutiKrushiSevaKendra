import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ALL_STATIC_PRODUCTS } from '../config/staticProducts';
import { ChevronLeft, MapPin, Plus, Lock, AlertCircle, X } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, totalItems } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  // Calculate pricing
  const getItemPrice = (item) => {
    const isStatic = item.product && !isNaN(item.product);
    if (isStatic) {
      const staticProd = ALL_STATIC_PRODUCTS.find(p => p.id === Number(item.product));
      return staticProd ? staticProd.price : 0;
    }
    return 120 + (item.name.length * 5) % 350;
  };

  const subtotal = items.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const taxes = Math.round(subtotal * 0.05); // 5% GST example
  const total = subtotal + shipping + taxes;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!selectedAddressId && !useNewAddress) {
      setShowErrorModal(true);
      return;
    }

    // Persist chosen address so the Payment page can attach it to the order
    const address = useNewAddress
      ? formData
      : user?.addresses?.find((a) => a._id === selectedAddressId) || {};
    sessionStorage.setItem('shippingAddress', JSON.stringify(address));

    navigate('/payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products before proceeding to checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const userAddresses = user?.addresses || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Shipping Info */}
          <div className="flex-1">
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-green-600" />
                Shipping Information
              </h2>

              {/* Saved Addresses (if any) */}
              {userAddresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Saved Addresses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userAddresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedAddressId === addr._id && !useNewAddress ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => {
                          setSelectedAddressId(addr._id);
                          setUseNewAddress(false);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="radio"
                            name="addressSelection"
                            checked={selectedAddressId === addr._id && !useNewAddress}
                            readOnly
                            className="text-green-600 focus:ring-green-500 mt-0.5"
                          />
                          <span className="font-bold text-gray-900">{addr.name}</span>
                        </div>
                        <div className="pl-6 text-sm text-gray-600 leading-relaxed">
                          {addr.house}, {addr.street}<br />
                          {addr.city}, {addr.state} {addr.pincode}<br />
                          Phone: {addr.phone}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label
                      className={`inline-flex items-center gap-2 cursor-pointer font-semibold text-sm ${useNewAddress ? 'text-green-700' : 'text-gray-600 hover:text-green-600'}`}
                      onClick={() => {
                        setUseNewAddress(true);
                        setSelectedAddressId(null);
                      }}
                    >
                      <div className={`p-1 rounded-full border ${useNewAddress ? 'bg-green-100 border-green-600' : 'border-gray-300'}`}>
                        <Plus size={16} />
                      </div>
                      Add a new address manually
                    </label>
                  </div>
                </div>
              )}

              {/* Manual Entry Form */}
              {(userAddresses.length === 0 || useNewAddress) && (
                <div className="space-y-4 animate-fadeIn">
                  {userAddresses.length > 0 && <hr className="border-gray-100 mb-6" />}
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">New Address Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="10-digit number" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">House / Flat No.</label>
                    <input type="text" name="house" value={formData.house} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="House 123" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Street / Area</label>
                    <input type="text" name="street" value={formData.street} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Main Street" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Pune" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="411001" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                      <input type="text" name="country" value="India" readOnly className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500" />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 text-lg"
              >
                <Lock size={18} /> Confirm Order
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.product && !isNaN(item.product) && ALL_STATIC_PRODUCTS.find(p => p.id === Number(item.product))?.emoji ? (
                        <span className="text-2xl">{ALL_STATIC_PRODUCTS.find(p => p.id === Number(item.product)).emoji}</span>
                      ) : (
                        <img src={item.imageUrl || 'https://placehold.co/100x100/dcfce7/16a34a?text=Item'} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-green-700 mt-1">₹{getItemPrice(item) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Taxes (GST)</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-green-700">₹{total}</span>
                  <p className="text-[10px] text-gray-500">Including all taxes</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={24} />
                <h3 className="font-bold text-lg text-gray-900">Address Required</h3>
              </div>
              <button onClick={() => setShowErrorModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please select a saved shipping address or add a new one manually before confirming your order.
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors"
            >
              Okay, got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
