import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Phone, MapPin, Clock, Shield, Star, Users, Headphones, ShoppingCart, Check, Truck, Lock, Award } from 'lucide-react';
import { getProducts } from '../services/productService';
import { STORE_CONFIG, getWhatsAppUrl, getGeneralWhatsAppMessage } from '../config/store';
import ProductCard from '../components/ProductCard';
import { StaticCategoryCard } from '../components/CategoryCard';
import WhatsAppButton from '../components/WhatsAppButton';
import Loading from '../components/Loading';
import Carousel from '../components/Carousel';
import pesticideImg from '../assets/categories/Seeds.png';
import cropProtectionImg from '../assets/categories/CropProtection.png';
import cropNutritionImage from '../assets/categories/cropNutritionImage.png';
import FarmingToolsImg from '../assets/categories/FarmingToolsImg.png';
import PlantsImg from '../assets/categories/PlantsImg.png';
import PotsImg from '../assets/categories/PotsImg.png';
import FlowerSeedsImg from '../assets/categories/FlowerSeedsImg.png';
import InsecticidesImg from '../assets/categories/InsecticidesImg.png';
import FungicidesImg from '../assets/categories/FungicidesImg.png';
import HerbicidesImg from '../assets/categories/HerbicidesImg.png';
import OrganicFarmingImg from '../assets/categories/OrganicFarmingImg.png';
import AnimalFeedImg from '../assets/categories/AnimalFeedImg.png';
import heroImg from '../assets/categories/HeroImgOne.png';
import { useCart } from '../context/CartContext';
import DealCard from '../components/DealCard';
import { useLanguage } from '../context/LanguageContext';

const quickMenuKey = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

/* ─── Seeds Mega-Menu Data ─────────────────────────────── */
const SEEDS_MENU = [
  {
    heading: 'VEGETABLE SEEDS',
    items: [
      { label: 'Bhindi (Okra) Seeds', search: 'bhindi seeds' },
      { label: 'Chilli Seeds', search: 'chilli seeds' },
      { label: 'Tomato Seeds', search: 'tomato seeds' },
      { label: 'Cauliflower Seeds', search: 'cauliflower seeds' },
      { label: 'Bitter Gourd Seeds', search: 'bitter gourd seeds' },
      { label: 'Bottle Gourd Seeds', search: 'bottle gourd seeds' },
      { label: 'Broccoli Seeds', search: 'broccoli seeds' },
      { label: 'Brinjal Seeds', search: 'brinjal seeds' },
      { label: 'Carrot Seeds', search: 'carrot seeds' },
    ],
    viewAll: '/products?search=vegetable+seeds',
  },
  {
    heading: 'FRUIT SEEDS',
    items: [
      { label: 'Muskmelon Seeds', search: 'muskmelon seeds' },
      { label: 'Watermelon Seeds', search: 'watermelon seeds' },
      { label: 'Papaya Seeds', search: 'papaya seeds' },
      { label: 'Strawberry', search: 'strawberry seeds' },
    ],
  },
  {
    heading: 'TOP BRANDS',
    items: [
      { label: 'Seminis Seeds', search: 'seminis' },
      { label: 'VNR Seeds', search: 'vnr' },
      { label: 'Sakata', search: 'sakata' },
      { label: 'Clause Seeds', search: 'clause' },
      { label: 'Advanta Seeds', search: 'advanta' },
    ],
  },
  {
    heading: 'FLOWER SEEDS',
    items: [
      { label: 'Marigold Seeds', search: 'marigold seeds' },
      { label: 'Zinnia Seeds', search: 'zinnia seeds' },
    ],
  },
];

/* ─── SeedsMegaMenu component ──────────────────────────── */
const SeedsMegaMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const timeoutRef = useRef(null);

  const show = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Trigger pill */}
      <button
        id="quick-cat-seeds"
        className={`flex items-center gap-1.5 whitespace-nowrap border text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 ${open
          ? 'bg-green-50 text-green-700 border-green-300'
          : 'bg-gray-50 hover:bg-green-50 hover:text-green-700 border-gray-200 hover:border-green-300 text-gray-600'
          }`}
      >
        
        {t('home.quickCategories.seeds')}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega-menu panel */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 min-w-[680px]"
          style={{ animation: 'seedsMenuIn 0.18s ease' }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Small caret */}
          <div className="absolute -top-2 left-5 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 rounded-sm" />

          <div className="grid grid-cols-4 gap-6 relative z-10">
            {SEEDS_MENU.map((col) => (
              <div key={col.heading}>
                <p className="text-[10px] font-extrabold tracking-widest text-green-700 uppercase mb-3 pb-1 border-b border-green-100">
                  {t(`home.quickMenu.${quickMenuKey(col.heading)}`)}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={`/products?search=${encodeURIComponent(item.search)}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-gray-600 hover:text-green-700 hover:translate-x-0.5 transition-all duration-100 block leading-snug"
                      >
                        {t(`home.quickMenu.${quickMenuKey(item.label)}`)}
                      </Link>
                    </li>
                  ))}
                  {col.viewAll && (
                    <li className="pt-1">
                      <Link
                        to={col.viewAll}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-green-600 hover:text-green-800 hover:underline"
                      >
                        {t('home.quickMenu.view_all')}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyframe */}
      <style>{`
        @keyframes seedsMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

/* ─── Crop Protection Mega-Menu Data ───────────────────── */
const CROP_PROTECTION_MENU = [
  {
    heading: 'CHEMICAL PESTICIDES',
    items: [
      { label: 'Insecticides', search: 'insecticide' },
      { label: 'Fungicides', search: 'fungicide' },
      { label: 'Herbicides', search: 'herbicide' },
    ],
    viewAll: '/products?search=pesticides',
  },
  {
    heading: 'BIO PESTICIDES',
    items: [
      { label: 'Bio Insecticide', search: 'bio insecticide' },
      { label: 'Bio Fungicide', search: 'bio fungicide' },
    ],
  },
  {
    heading: 'TOP BRANDS',
    items: [
      { label: 'UPL', search: 'upl' },
      { label: 'Bayer', search: 'bayer' },
      { label: 'Adama', search: 'adama' },
      { label: 'BASF', search: 'basf' },
      { label: 'Dhanuka', search: 'dhanuka' },
    ],
  },
];

/* ─── CropProtectionMegaMenu component ─────────────────── */
const CropProtectionMegaMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const timeoutRef = useRef(null);

  const show = () => { clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative shrink-0" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger pill */}
      <button
        id="quick-cat-crop-protection"
        className={`flex items-center gap-1.5 whitespace-nowrap border text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 ${open
          ? 'bg-green-50 text-green-700 border-green-300'
          : 'bg-gray-50 hover:bg-green-50 hover:text-green-700 border-gray-200 hover:border-green-300 text-gray-600'
          }`}
      >
        
        {t('home.quickCategories.cropProtection')}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega-menu panel */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 min-w-[480px]"
          style={{ animation: 'cropMenuIn 0.18s ease' }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Caret */}
          <div className="absolute -top-2 left-5 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 rounded-sm" />

          <div className="grid grid-cols-3 gap-6 relative z-10">
            {CROP_PROTECTION_MENU.map((col) => (
              <div key={col.heading}>
                <p className="text-[10px] font-extrabold tracking-widest text-green-700 uppercase mb-3 pb-1 border-b border-green-100">
                  {t(`home.quickMenu.${quickMenuKey(col.heading)}`)}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={`/products?search=${encodeURIComponent(item.search)}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-gray-600 hover:text-green-700 hover:translate-x-0.5 transition-all duration-100 block leading-snug"
                      >
                        {t(`home.quickMenu.${quickMenuKey(item.label)}`)}
                      </Link>
                    </li>
                  ))}
                  {col.viewAll && (
                    <li className="pt-1">
                      <Link
                        to={col.viewAll}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-green-600 hover:text-green-800 hover:underline"
                      >
                        {t('home.quickMenu.view_all')}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cropMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

/* ─── Crop Nutrition Mega-Menu Data ────────────────────── */
const CROP_NUTRITION_MENU = [
  {
    heading: 'CROP NUTRITION',
    items: [
      { label: 'Fertilizers', search: 'fertilizer' },
      { label: 'Bio Fertilizers', search: 'bio fertilizer' },
      { label: 'Biostimulants', search: 'biostimulant' },
      { label: 'Plant Growth Promoter', search: 'plant growth promoter' },
    ],
    viewAll: '/products?search=crop+nutrition',
  },
];

/* ─── CropNutritionMegaMenu component ───────────────────── */
const CropNutritionMegaMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const timeoutRef = useRef(null);

  const show = () => { clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative shrink-0" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger pill */}
      <button
        id="quick-cat-crop-nutrition"
        className={`flex items-center gap-1.5 whitespace-nowrap border text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 ${open
          ? 'bg-green-50 text-green-700 border-green-300'
          : 'bg-gray-50 hover:bg-green-50 hover:text-green-700 border-gray-200 hover:border-green-300 text-gray-600'
          }`}
      >
        
        {t('home.quickCategories.cropNutrition')}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega-menu panel */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 min-w-[220px]"
          style={{ animation: 'nutritionMenuIn 0.18s ease' }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Caret */}
          <div className="absolute -top-2 left-5 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 rounded-sm" />

          <div className="relative z-10">
            {CROP_NUTRITION_MENU.map((col) => (
              <div key={col.heading}>
                <p className="text-[10px] font-extrabold tracking-widest text-lime-700 uppercase mb-3 pb-1 border-b border-lime-100">
                  {t(`home.quickMenu.${quickMenuKey(col.heading)}`)}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={`/products?search=${encodeURIComponent(item.search)}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-gray-600 hover:text-lime-700 hover:translate-x-0.5 transition-all duration-100 block leading-snug"
                      >
                        {t(`home.quickMenu.${quickMenuKey(item.label)}`)}
                      </Link>
                    </li>
                  ))}
                  {col.viewAll && (
                    <li className="pt-1">
                      <Link
                        to={col.viewAll}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-lime-600 hover:text-lime-800 hover:underline"
                      >
                        {t('home.quickMenu.view_all')}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes nutritionMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

/* ─── Farming Tools Mega-Menu Data ─────────────────────── */
const FARMING_TOOLS_MENU = [
  {
    heading: 'FARMING TOOLS',
    items: [
      { label: 'Garden & Hand Tools', search: 'garden hand tools' },
      { label: 'Sprayers and Pumps', search: 'sprayer pump' },
      { label: 'Wolf Garten Tools', search: 'wolf garten' },
      { label: 'Lawn Mower', search: 'lawn mower' },
      { label: 'Power Weeder', search: 'power weeder' },
      { label: 'Earth Auger', search: 'earth auger' },
      { label: 'Harvesters', search: 'harvester' },
      { label: 'Safety Hand Gloves', search: 'safety gloves' },
      { label: 'Weeders', search: 'weeder' },
    ],
    viewAll: '/products?search=farming+tools',
  },
];

/* ─── FarmingToolsMegaMenu component ────────────────────── */
const FarmingToolsMegaMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const timeoutRef = useRef(null);

  const show = () => { clearTimeout(timeoutRef.current); setOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative shrink-0" onMouseEnter={show} onMouseLeave={hide}>
      {/* Trigger pill */}
      <button
        id="quick-cat-farming-tools"
        className={`flex items-center gap-1.5 whitespace-nowrap border text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 ${open
          ? 'bg-slate-100 text-green-700 border-green-300'
          : 'bg-gray-50 hover:bg-slate-100 hover:text-green-700 border-gray-200 hover:border-green-300 text-gray-600'
          }`}
      >
        
        {t('home.quickCategories.farmingTools')}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega-menu panel */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 min-w-[240px]"
          style={{ animation: 'toolsMenuIn 0.18s ease' }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* Caret */}
          <div className="absolute -top-2 left-5 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 rounded-sm" />

          <div className="relative z-10">
            {FARMING_TOOLS_MENU.map((col) => (
              <div key={col.heading}>
                <p className="text-[10px] font-extrabold tracking-widest text-green-700 uppercase mb-3 pb-1 border-b border-green-100">
                  {t(`home.quickMenu.${quickMenuKey(col.heading)}`)}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={`/products?search=${encodeURIComponent(item.search)}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-gray-600 hover:text-green-700 hover:translate-x-0.5 transition-all duration-100 block leading-snug"
                      >
                        {t(`home.quickMenu.${quickMenuKey(item.label)}`)}
                      </Link>
                    </li>
                  ))}
                  {col.viewAll && (
                    <li className="pt-1">
                      <Link
                        to={col.viewAll}
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-green-600 hover:text-green-800 hover:underline"
                      >
                        {t('home.quickMenu.view_all')}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes toolsMenuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
};

const BROWSE_CATEGORIES = [
  {
    icon: '🌾', label: 'Seeds', slug: 'seeds',
    labelKey: 'home.categories.seeds', descriptionKey: 'home.categories.seedsDescription',
    image: pesticideImg,
    description: 'Vegetable, field & hybrid seeds',
    searchKey: 'Seeds', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800',
  },
  {
    icon: '🛡️', label: 'Crop Protection', slug: 'crop-protection',
    labelKey: 'home.categories.cropProtection', descriptionKey: 'home.categories.cropProtectionDescription',
    image: cropProtectionImg,
    description: 'Pesticides & disease control',
    searchKey: 'crop protection', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700',
  },
  {
    icon: '🌿', label: 'Crop Nutrition', slug: 'crop-nutrition',
    labelKey: 'home.categories.cropNutrition', descriptionKey: 'home.categories.cropNutritionDescription',
    image: cropNutritionImage,
    description: 'Fertilizers & micronutrients',
    searchKey: 'crop nutrition', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-700',
  },
  {
    icon: '🔧', label: 'Farming Tools', slug: 'farming-tools',
    labelKey: 'home.categories.farmingTools', descriptionKey: 'home.categories.farmingToolsDescription',
    image: FarmingToolsImg,
    description: 'Hand tools & farm equipment',
    searchKey: 'farming tools', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700',
  },
  {
    icon: '🌳', label: 'Plants', slug: 'plants',
    labelKey: 'home.categories.plants', descriptionKey: 'home.categories.plantsDescription',
    image: PlantsImg,
    description: 'Saplings & ornamental plants',
    searchKey: 'plants', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700',
  },
  {
    icon: '🪴', label: 'Pots & Planters', slug: 'pots-planters',
    labelKey: 'home.categories.pots', descriptionKey: 'home.categories.potsDescription',
    image: PotsImg,
    description: 'Garden pots, planters & trays',
    searchKey: 'pots', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700',
  },
  {
    icon: '🌸', label: 'Flower Seeds', slug: 'flower-seeds',
    labelKey: 'home.categories.flowerSeeds', descriptionKey: 'home.categories.flowerSeedsDescription',
    image: FlowerSeedsImg,
    description: 'Annual, perennial & seasonal blooms',
    searchKey: 'flower seeds', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700',
  },
  {
    icon: '🐛', label: 'Insecticides', slug: 'insecticides',
    labelKey: 'home.categories.insecticides', descriptionKey: 'home.categories.insecticidesDescription',
    image: InsecticidesImg,
    description: 'Control harmful insects & pests',
    searchKey: 'insecticide', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700',
  },
  {
    icon: '🍄', label: 'Fungicides', slug: 'fungicides',
    labelKey: 'home.categories.fungicides', descriptionKey: 'home.categories.fungicidesDescription',
    image: FungicidesImg,
    description: 'Prevent & treat fungal diseases',
    searchKey: 'fungicide', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700',
  },
  {
    icon: '🌾', label: 'Herbicides', slug: 'herbicides',
    labelKey: 'home.categories.herbicides', descriptionKey: 'home.categories.herbicidesDescription',
    image: HerbicidesImg,
    description: 'Weed control & management',
    searchKey: 'herbicide', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700',
  },
  {
    icon: '♻️', label: 'Organic Farming', slug: 'organic-farming',
    labelKey: 'home.categories.organicFarming', descriptionKey: 'home.categories.organicFarmingDescription',
    image: OrganicFarmingImg,
    description: 'Bio pesticides & organic inputs',
    searchKey: 'organic', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
  },
  {
    icon: '🐄', label: 'Animal Feed', slug: 'animal-feed',
    labelKey: 'home.categories.animalFeed', descriptionKey: 'home.categories.animalFeedDescription',
    image: AnimalFeedImg,
    description: 'Feed, supplements & animal care',
    searchKey: 'animal feed', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700',
  },
];

/* ─── Best Deals Data ──────────────────────────────────── */
import {
  BEST_DEALS,
  VEGETABLE_SEEDS,
  CROP_PROTECTION_DEALS,
  FLOWER_SEEDS,
  CROP_NUTRITION_DEALS,
  INSECTICIDES_DEALS,
  FUNGICIDES_DEALS,
  HERBICIDES_DEALS,
  BIO_INSECTICIDES_DEALS,
  TOOLS_EQUIPMENT_DEALS,
  PLANTS_DEALS
} from '../config/staticProducts';

/* ─── Reusable DealCard component imported from components ─── */

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none hover:bg-gray-50"
      >
        <span className="font-bold text-gray-800 text-sm md:text-base">{question}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
          {answer}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { t } = useLanguage();
  const faqQuestions = t('home.seo.questions');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    document.title = `${STORE_CONFIG.name} | Quality Agricultural Products`;

    getProducts()
      .then((res) => setProducts(res.data.data.slice(0, 6)))
      .catch(() => { })
      .finally(() => setLoadingProducts(false));
  }, []);

  // Brands carousel refs & controls
  const brandsRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Deals carousel refs & controls
  const dealsRef = useRef(null);
  const dealsPrevRef = useRef(null);
  const dealsNextRef = useRef(null);
  const [canScrollPrevDeals, setCanScrollPrevDeals] = useState(false);
  const [canScrollNextDeals, setCanScrollNextDeals] = useState(true);

  useEffect(() => {
    const el = brandsRef.current || document.getElementById('brands-scroll');
    const prev = prevBtnRef.current || document.getElementById('brands-prev');
    const next = nextBtnRef.current || document.getElementById('brands-next');
    if (!el) return;

    const getItemWidth = () => {
      const first = el.querySelector(':scope > *');
      if (!first) return el.clientWidth;
      const style = getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || 0) || 0;
      return first.offsetWidth + gap;
    };

    let itemWidth = getItemWidth();

    const update = () => {
      itemWidth = getItemWidth();
      setCanScrollPrev(el.scrollLeft > 5);
      setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    const onPrev = () => {
      el.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    };
    const onNext = () => {
      el.scrollBy({ left: itemWidth, behavior: 'smooth' });
    };

    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    prev && prev.addEventListener('click', onPrev);
    next && next.addEventListener('click', onNext);
    // initial
    update();

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      prev && prev.removeEventListener('click', onPrev);
      next && next.removeEventListener('click', onNext);
    };
  }, []);

  // Deals carousel behavior (one card per click)
  useEffect(() => {
    const el = dealsRef.current || document.getElementById('deals-scroll');
    const prev = dealsPrevRef.current || document.getElementById('deals-prev');
    const next = dealsNextRef.current || document.getElementById('deals-next');
    if (!el) return;

    const getItemWidth = () => {
      const first = el.querySelector(':scope > *');
      if (!first) return el.clientWidth;
      const style = getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || 0) || 0;
      return first.offsetWidth + gap;
    };

    let itemWidth = getItemWidth();

    const update = () => {
      itemWidth = getItemWidth();
      setCanScrollPrevDeals(el.scrollLeft > 5);
      setCanScrollNextDeals(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    const onPrev = () => el.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    const onNext = () => el.scrollBy({ left: itemWidth, behavior: 'smooth' });

    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    prev && prev.addEventListener('click', onPrev);
    next && next.addEventListener('click', onNext);
    update();

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      prev && prev.removeEventListener('click', onPrev);
      next && next.removeEventListener('click', onNext);
    };
  }, []);

  return (
    <div>
      {/* Quick Category Strip (sticky under navbar) */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide sticky top-16 z-40" style={{ overflow: 'visible', borderBottom: '1px solid #f3f4f6' }}>
        <div className="flex items-center justify-start md:justify-center gap-2 px-4 py-2.5 min-w-full w-max md:w-auto">
          {/* Seeds — has hover mega-menu */}
          <SeedsMegaMenu />

          {/* Crop Protection — has hover mega-menu */}
          <CropProtectionMegaMenu />

          {/* Crop Nutrition — has hover mega-menu */}
          <CropNutritionMegaMenu />

          {/* Farming Tools — has hover mega-menu */}
          <FarmingToolsMegaMenu />

          {/* Other categories */}
          {[
            { icon: '', labelKey: 'plants', search: 'plants' },
            { icon: '', labelKey: 'pots', search: 'pots' },
            { icon: '', labelKey: 'animalFeed', search: 'animal feed' },
          ].map(({ icon, labelKey, search }) => {
            const to = search === 'plants'
              ? '/plants'
              : search === 'pots'
                ? '/category/pots-planters'
                : search === 'animal feed'
                  ? '/category/animal-feed'
                  : `/products?search=${encodeURIComponent(search)}`;

            return (
              <Link
                key={labelKey}
                to={to}
                id={`quick-cat-${search.replace(/\s+/g, '-')}`}
                className="flex items-center gap-1.5 whitespace-nowrap bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-150 shrink-0"
              >
                <span>{icon}</span>
                {t(`home.quickCategories.${labelKey}`)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100 min-h-[320px] md:min-h-[420px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImg}
            alt="Hero banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          <Link to="/crop-protection" aria-label="View Crop Protection" className="absolute inset-0 z-20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20">
          {/* Hero text removed - showing image only */}
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100" >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600 shrink-0">
                <Award size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">{t('home.features.original')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-snug">{t('home.features.originalDescription')}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600 shrink-0">
                <Truck size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">{t('home.features.delivery')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-snug">{t('home.features.deliveryDescription')}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-4 flex-1">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600 shrink-0">
                <Lock size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">{t('home.features.payment')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-snug">{t('home.features.paymentDescription')}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600 shrink-0">
                <Shield size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-gray-900">{t('home.features.expert')}</h4>
                <p className="text-xs text-gray-500 mt-1 font-medium leading-snug">{t('home.features.expertDescription')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100 home-categories">
        <div className="mb-6">
          <h2 className="section-title">{t('home.categories.title')}</h2>
          <p className="section-subtitle">{t('home.categories.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BROWSE_CATEGORIES.map((cat) => (
            <StaticCategoryCard
              key={cat.label}
              {...cat}
              label={t(cat.labelKey)}
              description={t(cat.descriptionKey)}
            />
          ))}
        </div>
      </section>
      <style>{`
        /* Force text color to black only inside the Home Products by Category section */
        .home-categories * {
          color: #000 !important;
        }
        /* Keep images and backgrounds unaffected */
        .home-categories img { color: inherit; }
      `}</style>

      {/* Brands Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="section-title">{t('home.brands.title')}</h2>
            <p className="section-subtitle">{t('home.brands.subtitle')}</p>
          </div>

          {/* Carousel: shows 4 cards by default with left/right buttons */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                id="brands-scroll"
                ref={brandsRef}
                className="brands-track flex gap-4 px-1 py-2 overflow-x-auto scrollbar-hide transition-scroll"
                style={{ scrollBehavior: 'smooth' }}
              >
                {[
                  { id: 'iffco', name: 'IFFCO' },
                  { id: 'bayer', name: 'Bayer' },
                  { id: 'upl', name: 'UPL' },
                  { id: 'syngenta', name: 'Syngenta' },
                  { id: 'basf', name: 'BASF' },
                  { id: 'coromandel', name: 'Coromandel' },
                  { id: 'mahindra', name: 'Mahindra' },
                  { id: 'godrej', name: 'Godrej' },
                ].map(({ id, name }) => (
                  <div
                    key={id}
                    className="bg-white border rounded-2xl overflow-hidden flex flex-col items-center gap-2 transition-all duration-200 group cursor-pointer flex-shrink-0"
                    style={{ flex: '0 0 120px', maxWidth: '120px', minWidth: '120px' }}
                  >
                    <div className="w-20 h-20 mt-3 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {/* Image holder - replace img src with brand image when available */}
                      <span className="text-lg font-semibold text-gray-500">{name.charAt(0)}</span>
                    </div>
                    <div className="px-2 pb-3 text-center">
                      <p className="font-semibold text-sm text-gray-900 truncate">{name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left / Right controls */}
            <button
              id="brands-prev"
              ref={prevBtnRef}
              aria-label={t('home.brands.previous')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full -ml-10 hidden md:flex items-center justify-center z-20 ${!canScrollPrev ? 'opacity-40 pointer-events-none' : ''}`}
              style={{ transform: 'translateY(-50%) translateX(-8px)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              id="brands-next"
              ref={nextBtnRef}
              aria-label={t('home.brands.next')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full -mr-10 hidden md:flex items-center justify-center z-20 ${!canScrollNext ? 'opacity-40 pointer-events-none' : ''}`}
              style={{ transform: 'translateY(-50%) translateX(8px)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Best Deals Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.bestDeals.title')}</h2>
              <p className="section-subtitle">{t('home.bestDeals.subtitle')}</p>
            </div>
            <Link
              to="/products"
              id="best-deals-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#022c22', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #022c22', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="deals-view-all-btn"
            >
              {t('home.bestDeals.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel (card-by-card scroll) */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                id="deals-scroll"
                ref={dealsRef}
                className="deals-track flex gap-5 px-1 py-2 overflow-x-auto scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
              >
                {BEST_DEALS.map((deal) => (
                  <div key={deal.id} className="flex-shrink-0" style={{ flex: '0 0 25%', maxWidth: '25%', minWidth: '180px' }}>
                    <DealCard deal={deal} />
                  </div>
                ))}
              </div>
            </div>

            <button
              id="deals-prev"
              ref={dealsPrevRef}
              aria-label={t('home.bestDeals.previous')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full -ml-10 hidden md:flex items-center justify-center z-20 ${!canScrollPrevDeals ? 'opacity-40 pointer-events-none' : ''}`}
              style={{ transform: 'translateY(-50%) translateX(-8px)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              id="deals-next"
              ref={dealsNextRef}
              aria-label={t('home.bestDeals.next')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full -mr-10 hidden md:flex items-center justify-center z-20 ${!canScrollNextDeals ? 'opacity-40 pointer-events-none' : ''}`}
              style={{ transform: 'translateY(-50%) translateX(8px)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scoped styles */}
        <style>{`
          .deal-card:hover {
            box-shadow: 0 12px 40px rgba(0,0,0,0.12);
            transform: translateY(-4px);
            border-color: #86efac !important;
          }
          .deals-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Vegetable Seeds Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.vegetableSeeds.title')}</h2>
              <p className="section-subtitle">{t('home.vegetableSeeds.subtitle')}</p>
            </div>
            <Link
              to="/vegetable-seeds"
              id="veg-seeds-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="deals-view-all-btn"
            >
              {t('home.vegetableSeeds.viewAll')} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {VEGETABLE_SEEDS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>
      </section>

      {/* Crop Protection Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.cropProtection')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.cropProtection')[1]}</p>
            </div>
            <Link
              to="/crop-protection"
              id="crop-protection-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="crop-protection-view-all-btn"
            >
              {t('home.sections.cropProtection')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {CROP_PROTECTION_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .crop-protection-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Flower Seeds Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.flowerSeeds')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.flowerSeeds')[1]}</p>
            </div>
            <Link
              to="/flower-seeds"
              id="flower-seeds-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="flower-seeds-view-all-btn"
            >
              {t('home.sections.flowerSeeds')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {FLOWER_SEEDS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .flower-seeds-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Crop Nutrition Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.cropNutrition')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.cropNutrition')[1]}</p>
            </div>
            <Link
              to="/crop-nutrition"
              id="crop-nutrition-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="crop-nutrition-view-all-btn"
            >
              {t('home.sections.cropNutrition')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {CROP_NUTRITION_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .crop-nutrition-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Insecticides Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.insecticides')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.insecticides')[1]}</p>
            </div>
            <Link
              to="/insecticides"
              id="insecticides-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="insecticides-view-all-btn"
            >
              {t('home.sections.insecticides')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {INSECTICIDES_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .insecticides-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Fungicides Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.fungicides')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.fungicides')[1]}</p>
            </div>
            <Link
              to="/fungicides"
              id="fungicides-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="fungicides-view-all-btn"
            >
              {t('home.sections.fungicides')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {FUNGICIDES_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .fungicides-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Herbicides Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.herbicides')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.herbicides')[1]}</p>
            </div>
            <Link
              to="/herbicides"
              id="herbicides-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="herbicides-view-all-btn"
            >
              {t('home.sections.herbicides')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {HERBICIDES_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .herbicides-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Bio Insecticides Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.bioInsecticides')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.bioInsecticides')[1]}</p>
            </div>
            <Link
              to="/bio-insecticides"
              id="bio-insecticides-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="bio-insecticides-view-all-btn"
            >
              {t('home.sections.bioInsecticides')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {BIO_INSECTICIDES_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .bio-insecticides-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Tools & Equipment Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.toolsEquipment')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.toolsEquipment')[1]}</p>
            </div>
            <Link
              to="/farming-tools"
              id="tools-equipment-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="tools-equipment-view-all-btn"
            >
              {t('home.sections.toolsEquipment')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {TOOLS_EQUIPMENT_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .tools-equipment-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Plants Section */}
      <section style={{ padding: '56px 0' }}>
        <div className="max-w-6xl mx-auto px-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              </div>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>{t('home.sections.plants')[0]}</h2>
              <p className="section-subtitle">{t('home.sections.plants')[1]}</p>
            </div>
            <Link
              to="/plants"
              id="plants-view-all"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '14px', textDecoration: 'none', border: '2px solid #16a34a', padding: '8px 18px', borderRadius: '10px', transition: 'all 0.2s ease' }}
              className="plants-view-all-btn"
            >
              {t('home.sections.plants')[2]} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Carousel */}
          <Carousel itemsToShow={4} minWidth={180} className="px-1">
            {PLANTS_DEALS.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </Carousel>
        </div>

        {/* Scoped hover styles */}
        <style>{`
          .plants-view-all-btn:hover {
            background: #16a34a !important;
            color: #fff !important;
          }
        `}</style>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="section-title">{t('home.whyChooseUs.title')}</h2>
          <p className="section-subtitle">{t('home.whyChooseUs.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Shield, message: t('home.whyChooseUs.quality') },
            { icon: Star, message: t('home.whyChooseUs.service') },
            { icon: Users, message: t('home.whyChooseUs.support') },
            { icon: Headphones, message: t('home.whyChooseUs.farmerFriendly') },
          ].map(({ icon: Icon, message }) => (
            <div key={message[0]} className="card p-5 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-50 rounded-full p-3 w-fit mx-auto mb-3">
                <Icon size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{message[0]}</h3>
              <p className="text-sm text-gray-500">{message[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO & FAQs Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
          <div className="mb-10 text-center">
            <h2 className="section-title">{t('home.seo.title')}</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto mt-4">
              {t('home.seo.description')}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('home.seo.faqTitle')}</h3>
            {faqQuestions.map(([question, answer]) => (
              <FaqItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
