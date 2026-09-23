import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { STORE_CONFIG } from '../config/store';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    document.title = `Products | ${STORE_CONFIG.name}`;
    getCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCategory) params.category = selectedCategory;

    getProducts(params)
      .then((res) => setProducts(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  }, [search, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    const params = {};
    if (catId) params.category = catId;
    if (search.trim()) params.search = search.trim();
    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    const params = {};
    if (value.trim()) params.search = value.trim();
    if (selectedCategory) params.category = selectedCategory;
    setSearchParams(params);
  };

  const clearSearch = () => handleSearchChange('');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Agricultural Products</h1>
        <p className="text-gray-500 mt-1">Find the right product for your farm</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, crops..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          id="product-search"
          className="input-field pl-12 pr-10"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            id="clear-search-btn"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleCategorySelect('')}
          id="filter-all"
          className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
            !selectedCategory
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategorySelect(cat._id)}
            id={`filter-${cat.slug || cat._id}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
              selectedCategory === cat._id
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-4">
          {products.length} product{products.length !== 1 ? 's' : ''} found
          {search && ` for "${search}"`}
        </p>
      )}

      {/* Products Grid */}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={search ? `No results for "${search}". Try a different search.` : 'No products in this category yet.'}
          action={
            (search || selectedCategory) && (
              <button
                onClick={() => { clearSearch(); handleCategorySelect(''); }}
                className="btn-secondary"
                id="clear-filters-btn"
              >
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
