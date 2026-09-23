import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { User, ShoppingBag, MapPin, LogOut, Plus, Home, Map, Flag, Hash, Phone, X, Save, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { addAddress, updateAddress, removeAddress } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';

const Addresses = () => {
  const { user, token, logoutUser, loginUser } = useUser();
  const { onUserLogout } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    house: '',
    street: '',
    city: '',
    state: '',
    country: 'India'
  });

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const handleLogout = () => {
    logoutUser();
    onUserLogout();
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (editingId) {
        res = await updateAddress(editingId, formData, token);
      } else {
        res = await addAddress(formData, token);
      }
      loginUser(token, res.data.user);
      setIsAdding(false);
      setEditingId(null);
      setFormData({
        name: '', phone: '', pincode: '', house: '', street: '', city: '', state: '', country: 'India'
      });
    } catch (err) {
      setError(err.response?.data?.message || t('addresses.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (address) => {
    setFormData({ ...address });
    setEditingId(address._id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('addresses.confirmRemove'))) return;
    
    try {
      const res = await removeAddress(id, token);
      loginUser(token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || t('addresses.removeFailed'));
    }
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('addresses.title')}</h1>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {isAdding ? (
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-bold text-gray-800 text-green-700">{editingId ? t('addresses.edit') : t('addresses.add')}</h2>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><User size={14}/> {t('addresses.name')}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Phone size={14}/> {t('addresses.mobile')}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength={10} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Hash size={14}/> {t('addresses.pincode')}</label>
                      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Home size={14}/> {t('addresses.house')}</label>
                      <input type="text" name="house" value={formData.house} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Map size={14}/> {t('addresses.street')}</label>
                      <input type="text" name="street" value={formData.street} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700">{t('addresses.city')}</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><MapPin size={14}/> {t('addresses.state')}</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Flag size={14}/> {t('addresses.country')}</label>
                      <input type="text" name="country" value={formData.country} readOnly className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg outline-none cursor-not-allowed" />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-70 flex items-center gap-2">
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {editingId ? t('addresses.update') : t('addresses.save')}
                    </button>
                    <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-600 hover:text-gray-900 font-semibold px-4 py-2.5">
                      {t('addresses.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsAdding(true)}
                  className="h-48 border-2 border-dashed border-green-500/50 rounded-xl flex flex-col items-center justify-center gap-2 text-green-700 hover:bg-green-50/50 transition-colors cursor-pointer w-full bg-white group"
                >
                  <Plus size={32} className="text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-green-700">{t('addresses.addNew')}</span>
                </button>

                {user.addresses && user.addresses.map((address, index) => (
                  <div key={index} className="h-48 border border-gray-200 rounded-xl p-5 hover:border-green-300 hover:shadow-sm transition-all bg-white relative group">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleEditClick(address)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        title={t('addresses.editTitle')}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(address._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title={t('addresses.removeTitle')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block mb-3 mt-1">{t('addresses.address')} {index + 1}</div>
                    <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {address.name} <span className="text-sm font-normal text-gray-500">{address.phone}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {address.house}, {address.street}<br/>
                      {address.city}, {address.state} {address.pincode}<br/>
                      {address.country}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Addresses;
