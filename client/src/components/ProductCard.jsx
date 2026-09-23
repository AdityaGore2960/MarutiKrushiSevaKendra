import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Leaf, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x300/dcfce7/16a34a?text=Product';

const ProductCard = ({ product }) => {
  const { _id, name, category, suitableCrops, available, imageUrl } = product;
  const { addItem, setCartOpen } = useCart();
  const [adding, setAdding] = useState(false);
  const { t } = useLanguage();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!available) return;
    setAdding(true);
    await addItem(product, 1);
    setAdding(false);
    setCartOpen(true);
  };

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Product Image (taller) */}
      <div className="overflow-hidden bg-gray-50" style={{ aspectRatio: '3/4' }}>
        <img
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
          loading="lazy"
        />
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category Badge */}
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit">
          {category?.name || t('category.uncategorized')}
        </span>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 leading-snug">{name}</h3>

        {/* Suitable Crops */}
            {suitableCrops && suitableCrops.length > 0 && (
          <div className="flex items-start gap-1.5">
            <Leaf size={14} className="text-green-600 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('product.suitable') || 'Suitable for:'} </span>
              {suitableCrops.slice(0, 3).join(', ')}
              {suitableCrops.length > 3 && '...'}
            </p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
            {available ? (
              <span className="badge-available">
                <CheckCircle size={13} /> {t('product.available')}
              </span>
            ) : (
              <span className="badge-unavailable">
                <XCircle size={13} /> {t('product.outOfStock')}
              </span>
            )}

            <Link
              to={`/products/${_id}`}
              id={`view-product-${_id}`}
              className="inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm hover:text-green-800 transition-colors"
            >
              <Eye size={15} />
              {t('product.viewDetails')}
            </Link>
          </div>

            <button
            onClick={handleAddToCart}
            disabled={!available || adding}
            className="w-full bg-green-50 text-green-700 hover:bg-green-100 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-200"
          >
            <ShoppingCart size={16} />
            {adding ? t('product.adding') : t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
