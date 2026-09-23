import { Link } from 'react-router-dom';

const CATEGORY_STYLES = {
  // DB-driven categories (linked by ID)
  Fertilizers: { bg: 'bg-lime-50', border: 'border-lime-200', icon: '🌱', text: 'text-lime-700' },
  Insecticides: { bg: 'bg-orange-50', border: 'border-orange-200', icon: '🐛', text: 'text-orange-700' },
  Fungicides: { bg: 'bg-purple-50', border: 'border-purple-200', icon: '🍄', text: 'text-purple-700' },
  Herbicides: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '🌿', text: 'text-yellow-700' },
  Micronutrients: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '⚗️', text: 'text-blue-700' },
  Other: { bg: 'bg-gray-50', border: 'border-gray-200', icon: '📦', text: 'text-gray-700' },
};

// DB-driven card (links by category ObjectId)
const CategoryCard = ({ category }) => {
  const style = CATEGORY_STYLES[category.name] || CATEGORY_STYLES['Other'];

  return (
    <Link
      to={`/products?category=${category._id}`}
      id={`cat-${category.slug || category._id}`}
      className={`${style.bg} ${style.border} border-2 rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
    >
      <div className="h-28 flex items-center justify-center">
        <span className="text-5xl">{style.icon}</span>
      </div>
      <h3 className={`font-bold text-base ${style.text}`}>{category.name}</h3>
      {category.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{category.description}</p>
      )}
    </Link>
  );
};

export default CategoryCard;

// ─────────────────────────────────────────────────────
// Static browse card — does not need a DB category ID.
// Links to /products?search=<keyword>
// ─────────────────────────────────────────────────────
export const StaticCategoryCard = ({ icon, image, label, description, slug, bg, border, text }) => (
  <Link
    to={`/category/${slug}`}
    id={`browse-${slug}`}
    className={`${border} border rounded-2xl overflow-hidden flex flex-col text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group bg-white`}
  >
    {/* Image / placeholder zone */}
    <div className={`${image ? '' : bg} flex items-center justify-center h-40 relative overflow-hidden`}>
      {image ? (
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <>
          <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(255,255,255,0.7), transparent 70%)' }} />
          <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-200 drop-shadow-sm">{icon}</span>
        </>
      )}
    </div>

    {/* Text area */}
    <div className="px-3 py-3 flex flex-col gap-1">
      <h3 className={`font-bold text-sm leading-snug ${text}`}>{label}</h3>
      {description && (
        <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">{description}</p>
      )}
    </div>
  </Link>
);

