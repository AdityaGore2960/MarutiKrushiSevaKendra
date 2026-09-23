import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const DealCard = ({ deal }) => {
  const { addItem } = useCart();
  const { t } = useLanguage();
  
  const id = deal.id || deal._id;
  const badge = deal.badge || (deal.discount > 0 ? `${deal.discount}% OFF` : 'NEW');
  const badgeColor = deal.badgeColor || (deal.discount > 0 ? '#ef4444' : '#22c55e');
  const emoji = deal.emoji || '';
  const categoryName = deal.category?.name || deal.category || 'Product';
  const name = deal.name;
  const placeholderImageUrl = `https://placehold.co/400x300/dcfce7/16a34a?text=${encodeURIComponent(name.split(' ').slice(0, 2).join(' '))}`;
  
  const price = deal.price || 0;
  const originalPrice = deal.originalPrice || (deal.discount ? Math.round(price / (1 - deal.discount/100)) : price);
  const saveAmount = originalPrice - price;
  
  const weightOptions = deal.weightOptions?.length ? deal.weightOptions : (deal.packSizes?.length ? deal.packSizes : ['Standard']);
  const defaultWeight = deal.defaultWeight || weightOptions[0];

  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const [added, setAdded] = useState(false);

  // Update selected weight if deal changes
  useEffect(() => {
    setSelectedWeight(defaultWeight);
  }, [defaultWeight]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use proper id for DB products
    const itemToAdd = { ...deal, id };
    addItem(itemToAdd, 1, selectedWeight);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.25s ease',
        cursor: 'default',
        position: 'relative',
        height: '100%',
      }}
      className="deal-card hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        to={`/products/${id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >

        {/* Image Holder (taller) */}
        <div className="overflow-hidden bg-gray-50" style={{ height: '240px', borderBottom: '1px solid #e5e7eb' }}>
          <img
            src={deal.imageUrl || placeholderImageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = placeholderImageUrl; }}
            loading="lazy"
          />
        </div>

        {/* Card Body */}
        <div
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1,
          }}
        >
          {/* Product Name */}
          <h3
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#111827',
              lineHeight: '1.4',
              margin: 0,
            }}
            className="line-clamp-2"
          >
            {name}
          </h3>

          {/* Price Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#16a34a',
              }}
            >
              ₹{price}
            </span>

            {originalPrice > price && (
              <>
                <span
                  style={{
                    fontSize: '13px',
                    color: '#9ca3af',
                    textDecoration: 'line-through',
                  }}
                >
                  ₹{originalPrice}
                </span>

                <span
                  style={{
                    fontSize: '11px',
                    color: '#16a34a',
                    fontWeight: 600,
                  }}
                >
                  Save ₹{saveAmount}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Bottom Actions */}
      <div
        style={{
          padding: '0 14px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Weight Dropdown */}
        <div>
          <label
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            {t('product.selectWeight')}
          </label>

          <select
            value={selectedWeight}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedWeight(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: '8px',
              border: '1.5px solid #d1d5db',
              fontSize: '12px',
              fontWeight: 600,
              color: '#374151',
              background: '#f9fafb',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'auto',
            }}
          >
            {weightOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Add to Cart */}
        <button
          id={`deal-add-cart-${id}`}
          onClick={handleAddToCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: added
              ? 'linear-gradient(135deg, #022c22, #022c22)'
              : 'linear-gradient(135deg, #022c22, #022c22)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
          }}
        >
          {added ? (
            <>
              <Check size={15} />
              {t('product.adding')}
            </>
          ) : (
            <>
              <ShoppingCart size={15} />
              {t('product.addToCart')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DealCard;