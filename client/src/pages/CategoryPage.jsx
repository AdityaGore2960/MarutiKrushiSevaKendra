import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DealCard from '../components/DealCard';
import { useLanguage } from '../context/LanguageContext';
import {
  VEGETABLE_SEEDS,
  FLOWER_SEEDS,
  CROP_PROTECTION_DEALS,
  CROP_NUTRITION_DEALS,
  INSECTICIDES_DEALS,
  FUNGICIDES_DEALS,
  HERBICIDES_DEALS,
  BIO_INSECTICIDES_DEALS,
  TOOLS_EQUIPMENT_DEALS,
  PLANTS_DEALS
} from '../config/staticProducts';

const CATEGORY_PRODUCTS = {
  seeds: [...VEGETABLE_SEEDS, ...FLOWER_SEEDS],
  'crop-protection': [...CROP_PROTECTION_DEALS, ...INSECTICIDES_DEALS, ...FUNGICIDES_DEALS, ...HERBICIDES_DEALS, ...BIO_INSECTICIDES_DEALS],
  'crop-nutrition': CROP_NUTRITION_DEALS,
  'farming-tools': TOOLS_EQUIPMENT_DEALS,
  plants: PLANTS_DEALS,
  'flower-seeds': FLOWER_SEEDS,
  insecticides: INSECTICIDES_DEALS,
  fungicides: FUNGICIDES_DEALS,
  herbicides: HERBICIDES_DEALS,
  'organic-farming': BIO_INSECTICIDES_DEALS,
};

const CATEGORY_DATA = {
  seeds: {
    title: 'Seeds',
    icon: '🌾',
    description: 'High-quality vegetable, field & hybrid seeds for every season',
    bg: 'from-amber-50 to-yellow-50',
    accent: 'text-amber-700',
    border: 'border-amber-200',
    subcategories: [
      { icon: '🥦', label: 'Vegetable Seeds', search: 'vegetable seeds', desc: 'Bhindi, Tomato, Chilli & more' },
      { icon: '🌽', label: 'Field Crops Seeds', search: 'field crops seeds', desc: 'Maize, Soybean, Wheat seeds' },
      { icon: '🍉', label: 'Fruit Seeds', search: 'fruit seeds', desc: 'Watermelon, Muskmelon, Papaya' },
      { icon: '🌸', label: 'Flower Seeds', search: 'flower seeds', desc: 'Marigold, Zinnia & seasonal blooms' },
      { icon: '🌿', label: 'Herb Seeds', search: 'herb seeds', desc: 'Coriander, Fenugreek, Mint' },
      { icon: '🥕', label: 'Root Vegetable Seeds', search: 'root vegetable seeds', desc: 'Carrot, Radish, Beetroot' },
      { icon: '🫑', label: 'Hybrid Seeds', search: 'hybrid seeds', desc: 'High-yield hybrid varieties' },
      { icon: '🌱', label: 'Open Pollinated Seeds', search: 'open pollinated seeds', desc: 'Traditional OP varieties' },
      { icon: '🍅', label: 'Tomato Seeds', search: 'tomato seeds', desc: 'Cherry, Roma & hybrid tomato' },
      { icon: '🌶️', label: 'Chilli Seeds', search: 'chilli seeds', desc: 'Hot, mild & coloured chilli' },
    ],
  },
  'crop-protection': {
    title: 'Crop Protection',
    icon: '🛡️',
    description: 'Effective pesticides, fungicides & disease control solutions',
    bg: 'from-red-50 to-rose-50',
    accent: 'text-red-700',
    border: 'border-red-200',
    subcategories: [
      { icon: '🐛', label: 'Insecticides', search: 'insecticide', desc: 'Chemical & bio insect control' },
      { icon: '🍄', label: 'Fungicides', search: 'fungicide', desc: 'Prevent & treat fungal diseases' },
      { icon: '🌿', label: 'Herbicides', search: 'herbicide', desc: 'Weed management solutions' },
      { icon: '🐜', label: 'Bio Pesticides', search: 'bio pesticide', desc: 'Organic & biological control' },
      { icon: '🦟', label: 'Nematicides', search: 'nematicide', desc: 'Soil nematode control' },
      { icon: '🐀', label: 'Rodenticides', search: 'rodenticide', desc: 'Rodent control products' },
      { icon: '🌱', label: 'Bio Insecticides', search: 'bio insecticide', desc: 'Eco-friendly insect control' },
      { icon: '🧪', label: 'Systemic Pesticides', search: 'systemic pesticide', desc: 'Absorbed-action pesticides' },
      { icon: '💧', label: 'Contact Pesticides', search: 'contact pesticide', desc: 'Instant contact-kill solutions' },
    ],
  },
  'crop-nutrition': {
    title: 'Crop Nutrition',
    icon: '🌿',
    description: 'Fertilizers, micronutrients & biostimulants for healthy crops',
    bg: 'from-lime-50 to-green-50',
    accent: 'text-lime-700',
    border: 'border-lime-200',
    subcategories: [
      { icon: '🌱', label: 'Fertilizers', search: 'fertilizer', desc: 'NPK & complex fertilizers' },
      { icon: '🧫', label: 'Bio Fertilizers', search: 'bio fertilizer', desc: 'Rhizobium, Azospirillum etc.' },
      { icon: '⚗️', label: 'Micronutrients', search: 'micronutrient', desc: 'Zinc, Boron, Iron, Calcium' },
      { icon: '🌿', label: 'Biostimulants', search: 'biostimulant', desc: 'Enhance crop performance' },
      { icon: '💪', label: 'Plant Growth Promoters', search: 'plant growth promoter', desc: 'PGRs for better yield' },
      { icon: '🌊', label: 'Water Soluble Fertilizers', search: 'water soluble fertilizer', desc: 'For drip & foliar feeding' },
      { icon: '🌾', label: 'Organic Manure', search: 'organic manure', desc: 'Vermicompost & FYM' },
      { icon: '🔬', label: 'Soil Conditioners', search: 'soil conditioner', desc: 'Improve soil health' },
      { icon: '🍃', label: 'Foliar Sprays', search: 'foliar spray', desc: 'Leaf-applied nutrition' },
    ],
  },
  'farming-tools': {
    title: 'Farming Tools',
    icon: '🔧',
    description: 'Quality hand tools, sprayers & farm equipment',
    bg: 'from-slate-50 to-gray-50',
    accent: 'text-slate-700',
    border: 'border-slate-200',
    subcategories: [
      { icon: '🌾', label: 'Garden & Hand Tools', search: 'garden hand tools', desc: 'Spades, forks, rakes & hoes' },
      { icon: '💨', label: 'Sprayers & Pumps', search: 'sprayer pump', desc: 'Knapsack & power sprayers' },
      { icon: '🚜', label: 'Power Weeders', search: 'power weeder', desc: 'Motorized weeding machines' },
      { icon: '🪚', label: 'Harvesters', search: 'harvester', desc: 'Manual & motorized harvesters' },
      { icon: '🌀', label: 'Earth Augers', search: 'earth auger', desc: 'Hole-boring machines' },
      { icon: '🌿', label: 'Lawn Mowers', search: 'lawn mower', desc: 'Electric & petrol mowers' },
      { icon: '🧤', label: 'Safety Gloves', search: 'safety gloves', desc: 'Protective hand gloves' },
      { icon: '🔩', label: 'Wolf Garten Tools', search: 'wolf garten', desc: 'Premium German tools' },
      { icon: '🪣', label: 'Drip Irrigation', search: 'drip irrigation', desc: 'Kits, pipes & emitters' },
      { icon: '⚙️', label: 'Accessories', search: 'farm accessories', desc: 'Nozzles, pipes & fittings' },
    ],
  },
  plants: {
    title: 'Plants',
    icon: '🌳',
    description: 'Healthy saplings, ornamental & indoor plants',
    bg: 'from-green-50 to-emerald-50',
    accent: 'text-green-700',
    border: 'border-green-200',
    subcategories: [
      { icon: '🌳', label: 'Fruit Trees', search: 'fruit tree', desc: 'Mango, Guava, Lemon saplings' },
      { icon: '🌸', label: 'Ornamental Plants', search: 'ornamental plants', desc: 'Decorative garden plants' },
      { icon: '🪴', label: 'Indoor Plants', search: 'indoor plants', desc: 'Low-maintenance indoor greens' },
      { icon: '🌿', label: 'Medicinal Plants', search: 'medicinal plants', desc: 'Aloe Vera, Tulsi, Neem' },
      { icon: '🌺', label: 'Flowering Plants', search: 'flowering plants', desc: 'Hibiscus, Rose, Bougainvillea' },
      { icon: '🌴', label: 'Shade Trees', search: 'shade tree', desc: 'Large trees for shade' },
      { icon: '🌱', label: 'Vegetable Seedlings', search: 'vegetable seedlings', desc: 'Ready-to-plant veggies' },
      { icon: '🍃', label: 'Succulents & Cacti', search: 'succulents cacti', desc: 'Low-water plants' },
      { icon: '🪻', label: 'Climbers & Creepers', search: 'climbers creepers', desc: 'Vines & creeping plants' },
    ],
  },
  'pots-planters': {
    title: 'Pots & Planters',
    icon: '🪴',
    description: 'Garden pots, planters, trays & containers',
    bg: 'from-orange-50 to-amber-50',
    accent: 'text-orange-700',
    border: 'border-orange-200',
    subcategories: [
      { icon: '🪴', label: 'Plastic Pots', search: 'plastic pots', desc: 'Lightweight & durable' },
      { icon: '🏺', label: 'Terracotta Pots', search: 'terracotta pots', desc: 'Traditional clay pots' },
      { icon: '🌱', label: 'Nursery Trays', search: 'nursery tray', desc: 'Seedling & plug trays' },
      { icon: '🪣', label: 'Grow Bags', search: 'grow bags', desc: 'Fabric & HDPE grow bags' },
      { icon: '🔲', label: 'Rectangular Planters', search: 'rectangular planter', desc: 'Window boxes & troughs' },
      { icon: '🌸', label: 'Hanging Baskets', search: 'hanging basket', desc: 'Decorative hanging planters' },
      { icon: '🏡', label: 'Decorative Planters', search: 'decorative planter', desc: 'Designer garden containers' },
      { icon: '📦', label: 'Seed Trays', search: 'seed tray', desc: 'Propagation & seeding trays' },
      { icon: '⚫', label: 'Polybags', search: 'polybag nursery', desc: 'Nursery polythene bags' },
    ],
  },
  'flower-seeds': {
    title: 'Flower Seeds',
    icon: '🌸',
    description: 'Annual, perennial & seasonal flowering seeds',
    bg: 'from-pink-50 to-rose-50',
    accent: 'text-pink-700',
    border: 'border-pink-200',
    subcategories: [
      { icon: '🌻', label: 'Marigold Seeds', search: 'marigold seeds', desc: 'African & French marigold' },
      { icon: '🌺', label: 'Zinnia Seeds', search: 'zinnia seeds', desc: 'Bright multi-colour zinnia' },
      { icon: '🌹', label: 'Rose Seeds', search: 'rose seeds', desc: 'Hybrid tea & miniature roses' },
      { icon: '💐', label: 'Petunia Seeds', search: 'petunia seeds', desc: 'Trailing & mounding petunias' },
      { icon: '🌼', label: 'Sunflower Seeds', search: 'sunflower seeds', desc: 'Dwarf & tall sunflowers' },
      { icon: '🌷', label: 'Dahlia Seeds', search: 'dahlia seeds', desc: 'Decorative & ball dahlias' },
      { icon: '🪻', label: 'Lavender Seeds', search: 'lavender seeds', desc: 'Fragrant lavender varieties' },
      { icon: '🌸', label: 'Cosmos Seeds', search: 'cosmos seeds', desc: 'Feathery cosmos flowers' },
      { icon: '🌼', label: 'Dianthus Seeds', search: 'dianthus seeds', desc: 'Carnation-type flowers' },
      { icon: '🌿', label: 'Wildflower Mix', search: 'wildflower seeds', desc: 'Mixed meadow flower blend' },
    ],
  },
  insecticides: {
    title: 'Insecticides',
    icon: '🐛',
    description: 'Control harmful insects & pests effectively',
    bg: 'from-yellow-50 to-amber-50',
    accent: 'text-yellow-700',
    border: 'border-yellow-200',
    subcategories: [
      { icon: '🧪', label: 'Organophosphates', search: 'organophosphate insecticide', desc: 'Broad-spectrum control' },
      { icon: '🔬', label: 'Pyrethroids', search: 'pyrethroid insecticide', desc: 'Fast knockdown effect' },
      { icon: '🌿', label: 'Bio Insecticides', search: 'bio insecticide', desc: 'Neem & microbial based' },
      { icon: '🦟', label: 'Neonicotinoids', search: 'neonicotinoid', desc: 'Systemic insect control' },
      { icon: '🐜', label: 'Ant & Termite Control', search: 'ant termite control', desc: 'Soil & foliar treatment' },
      { icon: '🐛', label: 'Caterpillar Control', search: 'caterpillar insecticide', desc: 'Bollworm, leaf-roller control' },
      { icon: '🦗', label: 'Sucking Pest Control', search: 'sucking pest insecticide', desc: 'Aphids, whitefly, thrips' },
      { icon: '🪲', label: 'Granular Insecticides', search: 'granular insecticide', desc: 'Soil application granules' },
      { icon: '💨', label: 'Fumigants', search: 'fumigant insecticide', desc: 'Storage pest control' },
    ],
  },
  fungicides: {
    title: 'Fungicides',
    icon: '🍄',
    description: 'Prevent & treat fungal diseases in crops',
    bg: 'from-purple-50 to-violet-50',
    accent: 'text-purple-700',
    border: 'border-purple-200',
    subcategories: [
      { icon: '🌿', label: 'Systemic Fungicides', search: 'systemic fungicide', desc: 'Internal plant protection' },
      { icon: '🛡️', label: 'Contact Fungicides', search: 'contact fungicide', desc: 'Surface protective action' },
      { icon: '🔬', label: 'Bio Fungicides', search: 'bio fungicide', desc: 'Trichoderma & Bacillus based' },
      { icon: '🍄', label: 'Mancozeb Products', search: 'mancozeb', desc: 'Broad-spectrum protection' },
      { icon: '💊', label: 'Copper Fungicides', search: 'copper fungicide', desc: 'Bordeaux mixture & compounds' },
      { icon: '🌾', label: 'Downy Mildew Control', search: 'downy mildew fungicide', desc: 'Water mould management' },
      { icon: '🌱', label: 'Powdery Mildew Control', search: 'powdery mildew fungicide', desc: 'White mould treatment' },
      { icon: '🍅', label: 'Blight Control', search: 'blight fungicide', desc: 'Early & late blight control' },
      { icon: '🧫', label: 'Seed Treatment Fungicides', search: 'seed treatment fungicide', desc: 'Protect seeds at sowing' },
    ],
  },
  herbicides: {
    title: 'Herbicides',
    icon: '🌾',
    description: 'Effective weed control & management solutions',
    bg: 'from-teal-50 to-cyan-50',
    accent: 'text-teal-700',
    border: 'border-teal-200',
    subcategories: [
      { icon: '🌿', label: 'Pre-Emergent Herbicides', search: 'pre emergent herbicide', desc: 'Prevent weed germination' },
      { icon: '🌱', label: 'Post-Emergent Herbicides', search: 'post emergent herbicide', desc: 'Kill existing weeds' },
      { icon: '🌾', label: 'Grassy Weed Control', search: 'grassy weed herbicide', desc: 'Control grass weeds' },
      { icon: '🍀', label: 'Broadleaf Weed Control', search: 'broadleaf herbicide', desc: 'Dicot weed management' },
      { icon: '🧪', label: 'Glyphosate Products', search: 'glyphosate', desc: 'Total kill non-selective' },
      { icon: '🌊', label: 'Paraquat Products', search: 'paraquat herbicide', desc: 'Fast-acting burndown' },
      { icon: '🌿', label: 'Selective Herbicides', search: 'selective herbicide', desc: 'Crop-safe weed control' },
      { icon: '💧', label: 'Non-Selective Herbicides', search: 'non selective herbicide', desc: 'Total vegetation control' },
      { icon: '🪴', label: 'Rice Weed Control', search: 'rice herbicide', desc: 'Paddy field herbicides' },
    ],
  },
  'organic-farming': {
    title: 'Organic Farming',
    icon: '♻️',
    description: 'Bio pesticides & certified organic farming inputs',
    bg: 'from-emerald-50 to-green-50',
    accent: 'text-emerald-700',
    border: 'border-emerald-200',
    subcategories: [
      { icon: '🌱', label: 'Bio Pesticides', search: 'bio pesticide organic', desc: 'Neem, Pyrethrin based' },
      { icon: '🧫', label: 'Bio Fertilizers', search: 'bio fertilizer organic', desc: 'Rhizobium, Azotobacter' },
      { icon: '🪱', label: 'Vermicompost', search: 'vermicompost', desc: 'Worm castings & compost' },
      { icon: '🌿', label: 'Neem Products', search: 'neem product', desc: 'Neem oil, cake & extracts' },
      { icon: '🍃', label: 'Organic Manure', search: 'organic manure', desc: 'FYM & plant-based manure' },
      { icon: '🔬', label: 'Trichoderma Products', search: 'trichoderma', desc: 'Biological soil fungicide' },
      { icon: '💧', label: 'Panchagavya', search: 'panchagavya', desc: 'Traditional organic input' },
      { icon: '🌾', label: 'Organic Seeds', search: 'organic seeds', desc: 'Untreated, chemical-free seeds' },
      { icon: '♻️', label: 'Soil Health Products', search: 'soil health organic', desc: 'Humic acid & biostimulants' },
    ],
  },
  'animal-feed': {
    title: 'Animal Feed',
    icon: '🐄',
    description: 'Feed, supplements & animal care products',
    bg: 'from-cyan-50 to-sky-50',
    accent: 'text-cyan-700',
    border: 'border-cyan-200',
    subcategories: [
      { icon: '🐄', label: 'Cattle Feed', search: 'cattle feed', desc: 'Compound & bypass protein feed' },
      { icon: '🐓', label: 'Poultry Feed', search: 'poultry feed', desc: 'Broiler & layer feed' },
      { icon: '🐐', label: 'Goat & Sheep Feed', search: 'goat sheep feed', desc: 'Small ruminant nutrition' },
      { icon: '🐖', label: 'Pig Feed', search: 'pig feed', desc: 'Starter, grower & finisher' },
      { icon: '🐟', label: 'Fish Feed', search: 'fish feed', desc: 'Aquaculture pellets' },
      { icon: '💊', label: 'Animal Supplements', search: 'animal supplement', desc: 'Vitamins, minerals & tonics' },
      { icon: '🌿', label: 'Green Fodder Seeds', search: 'fodder seeds', desc: 'Napier, Lucerne & Sorghum' },
      { icon: '🧴', label: 'Animal Healthcare', search: 'animal healthcare', desc: 'Disinfectants & drenches' },
      { icon: '🥛', label: 'Milk Enhancers', search: 'milk enhancer cattle', desc: 'Improve milk yield & quality' },
    ],
  },
};

const SubCategoryCard = ({ icon, label, desc, search }) => (
  <Link
    to={`/products?search=${encodeURIComponent(search)}`}
    className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
  >
    <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <div>
      <p className="font-bold text-gray-800 text-sm leading-tight">{label}</p>
      <p className="text-xs text-gray-400 mt-1 leading-snug">{desc}</p>
    </div>
    <span className="text-xs font-semibold text-green-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      View Products <ArrowRight size={11} />
    </span>
  </Link>
);

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const cat = CATEGORY_DATA[slug];
  const products = CATEGORY_PRODUCTS[slug] || [];

  if (!cat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-2xl font-bold">{t('categoryPage.notFound')}</p>
        <button onClick={() => navigate('/')} className="btn-primary">{t('categoryPage.goHome')}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> {t('categoryPage.back')}
        </button>

        <h1 className={`text-3xl md:text-4xl font-extrabold ${cat.accent} mb-8`}>
          {t(`categoryPage.titles.${slug}`)}
        </h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <DealCard key={prod.id} deal={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-gray-500 text-sm font-medium">{t('categoryPage.noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
