import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Search, User, LogOut, ChevronDown, Eye, EyeOff, Loader2, ShoppingCart, Globe } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';
import { useUser } from '../context/UserContext';
import { registerUser, loginUser, sendOtp, verifyOtp } from '../services/authService';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import CartDrawer from './CartDrawer';

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
];

/* ─── Auth Modal ──────────────────────────────────────────────────── */
const AuthModal = ({ onClose, onUserLogin }) => {
  const { loginUser: ctxLogin } = useUser();
  const { t } = useLanguage();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const overlayRef = useRef(null);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', password: '' });
    setOtp('');
    setOtpSent(false);
    setError('');
    setSuccess('');
  };

  const switchTab = (t) => { setTab(t); resetForm(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (tab === 'login') {
      if (loginMethod === 'email' && (!form.email || !form.password)) {
        setError(t('auth.emailRequired'));
        return;
      }
      if (loginMethod === 'phone') {
        if (!form.phone) {
          setError(t('auth.phoneRequired'));
          return;
        }
        if (otpSent && !otp) {
          setError(t('auth.otpRequired'));
          return;
        }
      }
    } else {
      if (!form.email || !form.password || !form.phone) {
        setError('Email, phone number, and password are required.');
        return;
      }
    }
    if (tab === 'register' && !form.name.trim()) {
      setError(t('auth.fullNameRequired'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('auth.passwordRequirement'));
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        if (loginMethod === 'email') {
          const res = await loginUser({ email: form.email, password: form.password });
          ctxLogin(res.data.token, res.data.user);
          if (onUserLogin) await onUserLogin();
          setSuccess(t('auth.welcome', { name: res.data.user.name }));
          setTimeout(onClose, 1200);
        } else if (loginMethod === 'phone') {
          if (!otpSent) {
            await sendOtp({ phone: form.phone });
            setOtpSent(true);
            setSuccess(`OTP sent to ${form.phone}. Please check your messages.`);
          } else {
            const res = await verifyOtp({ phone: form.phone, otp });
            ctxLogin(res.data.token, res.data.user);
            if (onUserLogin) await onUserLogin();
            setSuccess(`Welcome back, ${res.data.user.name}! 🎉`);
            setTimeout(onClose, 1200);
          }
        }
      } else {
        const res = await registerUser({
          name: form.name.trim(),
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        ctxLogin(res.data.token, res.data.user);
        if (onUserLogin) await onUserLogin();
        setSuccess(t('auth.accountCreated', { name: res.data.user.name }));
        setTimeout(onClose, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', animation: 'modalFadeIn 0.2s ease',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
        animation: 'modalSlideUp 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px' }}>
              <Leaf size={22} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#bbf7d0', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {STORE_CONFIG.name}
              </p>
              <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: 0 }}>
                {tab === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            id="auth-modal-close"
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px',
              padding: '6px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          {['login', 'register'].map((tb) => (
            <button
              key={tb}
              id={`auth-tab-${tb}`}
              onClick={() => switchTab(tb)}
              style={{
                flex: 1, padding: '12px', border: 'none', background: 'transparent',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                color: tab === tb ? '#16a34a' : '#6b7280',
                borderBottom: tab === tb ? '2px solid #16a34a' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {tb === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a',
              borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tab === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                  Full Name *
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  style={inputStyle}
                  autoFocus
                />
              </div>
            )}

            {tab === 'login' && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('email'); setOtpSent(false); setOtp(''); setError(''); }}
                  style={{ flex: 1, padding: '8px', fontSize: '13px', fontWeight: 600, borderRadius: '8px', border: loginMethod === 'email' ? '1.5px solid #16a34a' : '1px solid #d1d5db', background: loginMethod === 'email' ? '#f0fdf4' : '#fff', color: loginMethod === 'email' ? '#16a34a' : '#6b7280', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('phone'); setOtpSent(false); setOtp(''); setError(''); }}
                  style={{ flex: 1, padding: '8px', fontSize: '13px', fontWeight: 600, borderRadius: '8px', border: loginMethod === 'phone' ? '1.5px solid #16a34a' : '1px solid #d1d5db', background: loginMethod === 'phone' ? '#f0fdf4' : '#fff', color: loginMethod === 'phone' ? '#16a34a' : '#6b7280', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Phone Number
                </button>
              </div>
            )}

            {(tab === 'register' || (tab === 'login' && loginMethod === 'email')) && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                  Email Address *
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={inputStyle}
                  autoFocus={tab === 'login' && loginMethod === 'email'}
                  autoComplete="email"
                />
              </div>
            )}

            {(tab === 'register' || (tab === 'login' && loginMethod === 'phone')) && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                  Phone Number *
                </label>
                <input
                  id="auth-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  style={inputStyle}
                  autoFocus={tab === 'login' && loginMethod === 'phone'}
                />
              </div>
            )}

            {tab === 'login' && loginMethod === 'phone' && otpSent && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                  Enter OTP *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  style={inputStyle}
                  autoFocus
                />
              </div>
            )}

            {(tab === 'register' || (tab === 'login' && loginMethod === 'email')) && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '5px' }}>
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="auth-password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={tab === 'register' ? 'Min 6 characters' : 'Enter password'}
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    id="auth-toggle-password"
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '2px',
                    }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={loading || !!(success && (tab === 'register' || (tab === 'login' && (loginMethod === 'email' || otpSent))))}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
                fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading || (success && (tab === 'register' || (tab === 'login' && (loginMethod === 'email' || (loginMethod === 'phone' && otpSent))))) ? 0.75 : 1, transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(34,197,94,0.35)',
              }}
            >
              {loading ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t('general.search') /* small filler while loading */}</>
              ) : tab === 'login' ? (loginMethod === 'phone' ? (otpSent ? t('auth.verifyLogin') : t('auth.sendOtp')) : `🔑 ${t('auth.login')}`) : t('auth.createAccount')}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
              id={`auth-switch-to-${tab === 'login' ? 'register' : 'login'}`}
              style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              {tab === 'login' ? t('auth.register') + ' here' : t('auth.login') + ' here'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '9px',
  border: '1.5px solid #d1d5db', fontSize: '13px', color: '#111827',
  background: '#f9fafb', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

/* ─── Navbar ──────────────────────────────────────────────────────── */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const { totalItems, onUserLogout, onUserLogin, cartOpen: showCart, setCartOpen: setShowCart } = useCart();
  const { language, changeLanguage, t } = useLanguage();
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onUserLogout();
    setShowUserDropdown(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" id="nav-logo">
              <div className="bg-emerald-950 rounded-xl p-1.5">
                <Leaf size={22} className="text-white" />
              </div>
              <span className="font-bold text-emerald-950 text-base hidden sm:block">
                {STORE_CONFIG.name}
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-sm items-center"
              role="search"
            >
              <div className="relative w-full">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  id="navbar-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
            </form>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 shrink-0">
              {navLinks.map(({ to, key }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  id={`nav-${key.replace('.', '-')}`}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive
                      ? 'bg-emerald-50 text-green-700'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                    }`
                  }
                >
                  {t(key)}
                </NavLink>
              ))}

              {/* Language Switcher */}
              <div
                ref={langDropdownRef}
                style={{ position: 'relative' }}
                onMouseEnter={() => setShowLangDropdown(true)}
                onMouseLeave={() => setShowLangDropdown(false)}
              >
                <button
                  id="nav-language-switcher"
                  title={language === 'en' ? 'Change Language' : 'भाषा बदला'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '1.5px solid #86efac', borderRadius: '10px',
                    padding: '6px 12px', cursor: 'pointer', fontSize: '13px',
                    fontWeight: 700, color: '#15803d',
                  }}
                >
                  <Globe size={15} />
                  <span>{language === 'en' ? 'EN' : 'मर'}</span>
                  <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: showLangDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                {showLangDropdown && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', paddingTop: '8px', zIndex: 100,
                  }}>
                    <div style={{
                      background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12)', minWidth: '160px',
                      overflow: 'hidden', animation: 'modalSlideUp 0.18s ease',
                    }}>
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                        <p style={{ fontWeight: 700, fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                          {t('nav.language')}
                        </p>
                      </div>
                      {[
                        { code: 'en', label: 'English', native: 'English' },
                        { code: 'mr', label: 'Marathi', native: 'मराठी' },
                      ].map(({ code, label, native }) => (
                        <button
                          key={code}
                          onClick={() => { changeLanguage(code); setShowLangDropdown(false); }}
                          className="hover:bg-gray-50"
                          style={{
                            width: '100%', padding: '10px 16px', border: 'none',
                            background: language === code ? '#f0fdf4' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: '10px', cursor: 'pointer', fontSize: '13px',
                            fontWeight: language === code ? 700 : 600,
                            color: language === code ? '#16a34a' : '#374151',
                            borderBottom: '1px solid #f3f4f6',
                            transition: 'background 0.15s',
                          }}
                        >
                          <span>{label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{native}</span>
                            {language === code && <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 800 }}>✓</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Login / User Button */}
              {user ? (
                <div
                  ref={dropdownRef}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <button
                    id="nav-user-menu"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      border: '1.5px solid #86efac', borderRadius: '10px',
                      padding: '6px 12px', cursor: 'pointer', fontSize: '13px',
                      fontWeight: 700, color: '#15803d',
                    }}
                  >
                    <div style={{
                      background: '#86efac', borderRadius: '50%', width: '26px', height: '26px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#15803d', fontSize: '11px', fontWeight: 800,
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>

                  {showUserDropdown && (
                    <div style={{ position: 'absolute', right: 0, top: '100%', paddingTop: '8px', zIndex: 100 }}>
                      <div style={{
                        background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.12)', minWidth: '200px',
                        overflow: 'hidden',
                        animation: 'modalSlideUp 0.18s ease',
                      }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                          <p style={{ fontWeight: 800, fontSize: '14px', color: '#111827', margin: 0 }}>{user.name}</p>
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0' }}>{user.email || user.phone}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Link
                            to="/profile"
                            className="hover:bg-gray-50"
                            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User size={15} /> {t('nav.profile')}
                          </Link>
                          <Link
                            to="/orders"
                            className="hover:bg-gray-50"
                            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <ShoppingCart size={15} /> {t('nav.orders')}
                          </Link>
                          <Link
                            to="/addresses"
                            className="hover:bg-gray-50"
                            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Leaf size={15} /> {t('nav.address')}
                          </Link>
                        </div>

                        <button
                          id="nav-logout-btn"
                          onClick={handleLogout}
                          className="hover:bg-red-50"
                          style={{
                            width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                            display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 600, color: '#dc2626', transition: 'background-color 0.2s',
                          }}
                        >
                          <LogOut size={15} /> {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#15803d',
                    border: 'none', borderRadius: '10px', padding: '8px 16px',
                    color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(2, 44, 34, 0.3)', transition: 'all 0.2s',
                  }}
                >
                  <User size={15} /> {t('auth.login')}
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                  background: '#15803d', border: 'none', borderRadius: '10px', padding: '8px',
                  color: 'white', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <ShoppingCart size={20} /> {t('nav.cart')}
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold',
                    borderRadius: '50%', width: '18px', height: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {totalItems}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile: Search Icon + Login + Hamburger */}
            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
                aria-label="Toggle search"
                id="mobile-search-toggle"
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </button>

              {/* Mobile login / avatar */}
              {user ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  style={{
                    background: '#16a34a', borderRadius: '50%', width: '34px', height: '34px',
                    border: 'none', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                  }}
                  id="mobile-user-avatar"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
              ) : (
                <button
                  id="mobile-login-btn"
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    background: '#022c22', border: 'none',
                    borderRadius: '8px', padding: '6px 12px', color: '#fff',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  Login
                </button>
              )}

              <button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
                aria-label="Toggle menu"
                id="mobile-menu-toggle"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2" role="search">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  id="mobile-navbar-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 text-base border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                id="mobile-search-submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {t('nav.search')}
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4">
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ to, key }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  id={`mobile-nav-${key.replace('.', '-')}`}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {t(key)}
                </NavLink>
              ))}

              {/* Mobile Language Switcher */}
              <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '8px', paddingTop: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {t('nav.language')}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'mr', label: 'मराठी' },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => { changeLanguage(code); setMenuOpen(false); }}
                      style={{
                        flex: 1, padding: '9px', borderRadius: '10px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 700,
                        border: language === code ? '1.5px solid #16a34a' : '1px solid #e5e7eb',
                        background: language === code ? '#f0fdf4' : '#fff',
                        color: language === code ? '#16a34a' : '#6b7280',
                        transition: 'all 0.15s',
                      }}
                    >
                      {language === code && '✓ '}{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile user actions */}
              {user ? (
                <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '8px', paddingTop: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
                    {t('nav.loggedInAs')} <strong style={{ color: '#111827' }}>{user.name}</strong>
                  </p>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '10px 14px', border: '1px solid #fecaca',
                      borderRadius: '10px', background: '#fef2f2', color: '#dc2626',
                      fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    }}
                  >
                    <LogOut size={16} /> {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowAuthModal(true); setMenuOpen(false); }}
                  style={{
                    marginTop: '8px', background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none', borderRadius: '10px', padding: '11px',
                    color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  <User size={16} /> {t('auth.login')} / {t('auth.register')}
                </button>
              )}
            </nav>
          </div>
        )}
        {/* Cart Drawer */}
        <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
      </header>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onUserLogin={onUserLogin} />}

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
