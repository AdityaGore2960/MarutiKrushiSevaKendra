import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { User, Mail, Phone, ShoppingBag, MapPin, LogOut, Edit2, Lock, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { updateProfile } from '../services/authService';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { user, token, logoutUser, loginUser } = useUser();
  const { onUserLogout } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      });
    }
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
    setStatus({ type: '', message: '' });

    try {
      const dataToUpdate = { ...formData };
      if (!dataToUpdate.password) {
        delete dataToUpdate.password;
      }

      const res = await updateProfile(dataToUpdate, token);
      loginUser(token, res.data.user);
      setStatus({ type: 'success', message: t('profile.updated') });
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || t('profile.updateFailed')
      });
    } finally {
      setLoading(false);
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('profile.title')}</h1>

            {status.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-semibold">{status.message}</p>
              </div>
            )}

            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{t('profile.personalInfo')}</h2>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    <Edit2 size={16} /> {t('profile.edit')}
                  </button>
                )}
              </div>

              <div className="p-6">
                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-24 text-gray-500 font-semibold text-sm">{t('profile.name')}</div>
                      <div className="text-gray-900 font-bold text-base">{user.name}</div>
                    </div>
                    {user.email && (
                      <div className="flex gap-4 items-center">
                        <div className="w-24 text-gray-500 font-semibold text-sm">{t('profile.email')}</div>
                        <div className="text-gray-900 font-bold text-base">{user.email}</div>
                      </div>
                    )}
                    <div className="flex gap-4 items-center">
                      <div className="w-24 text-gray-500 font-semibold text-sm">{t('profile.phone')}</div>
                      <div className="text-gray-900 font-bold text-base">{user.phone}</div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <User size={16} className="text-gray-400" /> {t('profile.fullName')}
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-800 font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" /> {t('profile.phoneNumber')}
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-800 font-medium"
                          maxLength={10}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" /> {t('profile.emailAddress')}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-800 font-medium"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Lock size={16} className="text-gray-400" /> {t('profile.newPassword')}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all bg-white text-gray-800 font-medium placeholder-gray-400"
                          placeholder={t('profile.passwordPlaceholder')}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-70"
                      >
                        {loading ? (
                          <><Loader2 size={16} className="animate-spin" /> {t('profile.saving')}</>
                        ) : (
                          <><Save size={16} /> {t('profile.save')}</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            password: '',
                          });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-bold transition-colors"
                      >
                        {t('profile.cancel')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
