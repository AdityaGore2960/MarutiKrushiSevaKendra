import { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_STATIC_PRODUCTS } from '../config/staticProducts';
import { useLanguage } from '../context/LanguageContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateItem, removeItem, clearItems, totalItems } = useCart();
  const { t } = useLanguage();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getItemPrice = (item) => {
    const isStatic = item.product && !isNaN(item.product);
    if (isStatic) {
      const staticProd = ALL_STATIC_PRODUCTS.find(p => p.id === Number(item.product));
      return staticProd ? staticProd.price : 0;
    }
    // Database mock price based on product name length (consistent with ProductDetails.jsx)
    return 120 + (item.name.length * 5) % 350;
  };

  const subtotal = items.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);

  const renderItemImage = (item) => {
    const isStatic = item.product && !isNaN(item.product);
    if (isStatic) {
      const staticProd = ALL_STATIC_PRODUCTS.find(p => p.id === Number(item.product));
      if (staticProd && staticProd.emoji) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-green-50 text-3xl select-none">
            {staticProd.emoji}
          </div>
        );
      }
    }
    return (
      <img
        src={item.imageUrl || 'https://placehold.co/100x100/dcfce7/16a34a?text=Item'}
        alt={t('cart.itemImage')}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = 'https://placehold.co/100x100/dcfce7/16a34a?text=Item'; }}
      />
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-[101] shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">{t('cart.title')}</h2>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag size={48} className="text-gray-200" />
              <p className="font-medium text-gray-500">{t('cart.empty')}</p>
              <button
                onClick={onClose}
                className="mt-2 text-green-600 font-semibold hover:text-green-700"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-50">
                  {renderItemImage(item)}
                </div>

                <div className="flex flex-col flex-1 min-w-0 py-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.packSize && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{t('cart.size')}: {item.packSize}</span>
                    )}
                    <span className="text-xs font-bold text-green-700">₹{getItemPrice(item)}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 px-2 py-1 w-fit">
                      <button
                        onClick={() => updateItem(item._id, item.quantity - 1)}
                        className="text-gray-500 hover:text-green-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold text-gray-700 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item._id, item.quantity + 1)}
                        className="text-gray-500 hover:text-green-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-bold text-gray-700">
              <div className="flex flex-col">
                <span>{t('cart.subtotal', { count: totalItems })}</span>
                <span className="text-lg font-extrabold text-green-700">₹{subtotal}</span>
              </div>
              <button
                onClick={clearItems}
                className="text-red-500 hover:text-red-600 text-xs underline font-semibold"
              >
                {t('cart.clear')}
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5 text-xs text-gray-500 mt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                />
                <span>
                  {t('cart.accept')} <Link to="/terms" onClick={onClose} className="text-green-600 hover:underline font-medium">{t('cart.terms')}</Link>
                </span>
              </label>
              <p className="pl-5 text-[11px] leading-snug">
                {t('cart.policyIntro')} <Link to="/return-policy" onClick={onClose} className="text-green-600 hover:underline font-medium">{t('cart.returnPolicy')}</Link>, {t('cart.and')} <Link to="/privacy-policy" onClick={onClose} className="text-green-600 hover:underline font-medium">{t('cart.privacy')}</Link>
              </p>
            </div>

            <button 
              disabled={!termsAccepted}
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center ${
                termsAccepted 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {t('cart.placeOrder')}
            </button>
            
            <p className="text-[11px] text-center text-gray-400 font-medium">
              {t('cart.checkoutNote')}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
