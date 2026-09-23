import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, Leaf, Beaker, Bug,
  Package, Factory, Target, AlertTriangle, ShoppingCart, Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../config/store';
import { getProduct } from '../services/productService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { ALL_STATIC_PRODUCTS } from '../config/staticProducts';
import { useLanguage } from '../context/LanguageContext';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/dcfce7/16a34a?text=Product+Image';

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="bg-green-50 rounded-lg p-2 shrink-0">
        <Icon size={16} className="text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 font-medium">
          {Array.isArray(value) ? value.join(', ') : value}
        </p>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem, setCartOpen } = useCart();
  const { t } = useLanguage();
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [selectedPackSize, setSelectedPackSize] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // Check if id is numeric (static deal product)
    if (id && !isNaN(id)) {
      const numericId = Number(id);
      const staticProduct = ALL_STATIC_PRODUCTS.find(p => p.id === numericId);

      if (staticProduct) {
        const manufacturer = staticProduct.name.split(' ')[0];
        const mappedProduct = {
          _id: staticProduct.id.toString(),
          id: staticProduct.id,
          name: staticProduct.name,
          price: staticProduct.price,
          originalPrice: staticProduct.originalPrice,
          badge: staticProduct.badge,
          badgeColor: staticProduct.badgeColor,
          emoji: staticProduct.emoji,
          category: { name: staticProduct.category },
          packSizes: staticProduct.weightOptions || [],
          available: true,
          description: `${staticProduct.name} is a high-performance agricultural solution designed for optimal crop growth and protection. Trusted by local farmers, this product delivers excellent reliability and yield enhancement.`,
          manufacturer: manufacturer,
          suitableCrops: ['All suitable crops and plants'],
          purpose: staticProduct.category,
          targetProblem: 'General crop protection & growth support',
          composition: 'Quality certified active compounds',
          activeIngredient: 'Contact/Systemic formulations',
          imageUrl: '',
          isStatic: true
        };

        setProduct(mappedProduct);
        if (mappedProduct.packSizes.length > 0) {
          setSelectedPackSize(mappedProduct.packSizes[0]);
        }
        document.title = `${mappedProduct.name} | ${STORE_CONFIG.name}`;
        setLoading(false);
      } else {
        setError('Product not found.');
        setLoading(false);
      }
    } else {
      // Load standard database product
      getProduct(id)
        .then((res) => {
          const dbProduct = res.data.data;
          // Assign a stable mock price based on product name length
          const mockPrice = 120 + (dbProduct.name.length * 5) % 350;
          const mockOriginal = Math.round(mockPrice * 1.25);

          setProduct({
            ...dbProduct,
            price: mockPrice,
            originalPrice: mockOriginal
          });

          if (dbProduct.packSizes?.length > 0) {
            setSelectedPackSize(dbProduct.packSizes[0]);
          }
          document.title = `${dbProduct.name} | ${STORE_CONFIG.name}`;
        })
        .catch((err) => setError(err.response?.data?.message || 'Product not found.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><Loading /></div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const handleAddToCart = async () => {
    if (!product || !product.available) return;
    setAdding(true);
    await addItem(product, 1, selectedPackSize);
    setAdding(false);
    setCartOpen(true);
  };

  const handleBuyNow = async () => {
    if (!product || !product.available) return;
    setBuying(true);
    await addItem(product, 1, selectedPackSize);
    setBuying(false);
    setCartOpen(true);
  };

  const isPesticide = ['Insecticides', 'Fungicides', 'Herbicides'].includes(product.category?.name);

  const renderProductImage = () => {
    if (product.imageUrl) {
      return (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />
      );
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 relative overflow-hidden select-none">
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl" />
        
        <div className="w-40 h-40 rounded-full bg-white/75 backdrop-blur-md border border-white flex items-center justify-center shadow-xl shadow-emerald-700/5 relative z-10 transition-transform duration-300 hover:scale-105">
          <span className="text-7xl leading-none filter drop-shadow-md">
            {product.emoji || '📦'}
          </span>
        </div>
        
        <span className="mt-4 text-xs font-bold tracking-wider text-emerald-800/60 uppercase relative z-10">
          {product.category?.name || 'Category'} Product
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link to="/products" id="back-to-products" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-green-700 text-sm font-medium mb-5 transition-colors">
        <ArrowLeft size={16} /> {t('back.toProducts')}
      </Link>

      <div className="card overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-50 md:rounded-l-2xl flex items-center justify-center relative min-h-[300px] md:min-h-[400px]">
            {renderProductImage()}
          </div>

          {/* Main Info */}
          <div className="p-6 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-3">
              <div>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {product.category?.name || t('category.uncategorized')}
                </span>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                {product.manufacturer && (
                  <p className="text-sm text-gray-500 mt-1 font-semibold">Brand: <span className="text-green-700">{product.manufacturer}</span></p>
                )}
              </div>

              {/* Price Details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-green-700">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-slate-400 line-through font-semibold">₹{product.originalPrice}</span>
                        <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Availability</p>
                  {product.available ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      <CheckCircle size={12} /> {t('product.inStock')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      <XCircle size={12} /> {t('product.outOfStock')}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              )}

              {/* Pack Sizes */}
              {product.packSizes?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{t('product.selectPackSize')}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.packSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedPackSize(size)}
                        className={`text-sm font-semibold px-4 py-1.5 rounded-lg border transition-colors ${
                          selectedPackSize === size
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.available || adding}
                className="flex-1 bg-white hover:bg-slate-50 text-green-700 font-bold py-3.5 rounded-xl border-2 border-green-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <ShoppingCart size={18} />
                {adding ? t('product.adding') : t('product.addToCart')}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!product.available || buying}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-green-600/20"
              >
                <Award size={18} />
                {buying ? t('product.processing') : t('product.buyNow')}
              </button>
            </div>
          </div>
        </div>    

        {/* Details Table */}
        <div className="border-t border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <InfoRow icon={Leaf} label="Suitable Crops" value={product.suitableCrops} />
              <InfoRow icon={Target} label="Purpose" value={product.purpose} />
              <InfoRow icon={Bug} label="Target Pest / Problem" value={product.targetProblem} />
            </div>
            <div>
              <InfoRow icon={Beaker} label="Composition" value={product.composition} />
              <InfoRow icon={Beaker} label="Active Ingredient" value={product.activeIngredient} />
              <InfoRow icon={Factory} label="Manufacturer" value={product.manufacturer} />
              <InfoRow icon={Package} label="Pack Sizes" value={product.packSizes} />
            </div>
          </div>
        </div>

        {/* Pesticide Disclaimer */}
        {isPesticide && (
          <div className="mx-6 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Important:</strong> Always follow the product label and applicable local agricultural regulations.
              For specific crop problems, consult a qualified agricultural professional. Application rates and dosage
              should be used strictly as per the official product label.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
