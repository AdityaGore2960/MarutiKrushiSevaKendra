import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, X, PackageOpen, Check, Save } from 'lucide-react';
import { getProducts, deleteProduct, toggleAvailability, updateStock } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const PLACEHOLDER = 'https://placehold.co/80x80/dcfce7/16a34a?text=P';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  
  // Stock Editing State
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockInput, setStockInput] = useState('');
  const [updatingStock, setUpdatingStock] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCat) params.category = selectedCat;
    getProducts(params)
      .then((res) => setProducts(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Manage Products | Admin';
    getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, selectedCat]);

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const res = await toggleAvailability(id);
      setProducts((prev) =>
        prev.map((p) => p._id === id ? { ...p, available: res.data.data.available } : p)
      );
    } catch {
      alert('Failed to toggle availability.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  const startStockEdit = (product) => {
    setEditingStockId(product._id);
    setStockInput(product.stock.toString());
  };

  const handleStockUpdate = async (id) => {
    const newStock = Number(stockInput);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid stock number.');
      return;
    }
    
    setUpdatingStock(true);
    try {
      const res = await updateStock(id, newStock);
      setProducts((prev) =>
        prev.map((p) => p._id === id ? { ...p, stock: res.data.data.stock, available: res.data.data.available } : p)
      );
      setEditingStockId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock.');
    } finally {
      setUpdatingStock(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} product(s)</p>
        </div>
        <Link to="/admin/products/add" id="add-product-btn" className="btn-primary">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="admin-product-search"
            className="input-field pl-10 pr-8"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={16} />
            </button>
          )}
        </div>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          id="admin-category-filter"
          className="input-field sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No products found"
          action={
            <Link to="/admin/products/add" className="btn-primary">
              <Plus size={18} /> Add First Product
            </Link>
          }
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-left bg-gray-50/50">
                <th className="px-4 py-3 font-semibold text-gray-600">Product</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Brand</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Stock</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl || PLACEHOLDER}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 truncate max-w-[200px]" title={product.name}>
                          {product.name}
                        </span>
                        {product.weight && (
                          <span className="text-xs font-semibold text-gray-500">{product.weight}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-medium">
                    {product.brand || '-'}
                  </td>
                  <td className="px-4 py-3 font-extrabold text-green-700">
                    ₹{product.price}
                    {product.discount > 0 && (
                      <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded uppercase">
                        -{product.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {editingStockId === product._id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          min="0"
                          value={stockInput}
                          onChange={(e) => setStockInput(e.target.value)}
                          className="w-16 p-1 text-center border border-gray-300 rounded font-bold focus:ring-1 focus:ring-green-500 outline-none"
                          autoFocus
                          disabled={updatingStock}
                          onKeyDown={(e) => e.key === 'Enter' && handleStockUpdate(product._id)}
                        />
                        <button 
                          onClick={() => handleStockUpdate(product._id)}
                          disabled={updatingStock}
                          className="p-1 bg-green-100 text-green-700 hover:bg-green-200 rounded disabled:opacity-50"
                          title="Save Stock"
                        >
                          <Save size={14} />
                        </button>
                        <button 
                          onClick={() => setEditingStockId(null)}
                          disabled={updatingStock}
                          className="p-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center justify-center gap-2 cursor-pointer group"
                        onClick={() => startStockEdit(product)}
                        title="Click to update stock"
                      >
                        <span className={`font-bold ${product.stock > 10 ? 'text-gray-900' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                        <Edit size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(product._id)}
                      id={`toggle-${product._id}`}
                      disabled={togglingId === product._id}
                      title={product.available ? "Click to Deactivate" : "Click to Activate"}
                      className={`inline-flex items-center justify-center w-full max-w-[100px] gap-1.5 text-xs font-bold px-2 py-1.5 rounded-lg transition-colors ${
                        product.available
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {product.available ? (
                        <><ToggleRight size={14} /> Active</>
                      ) : (
                        <><ToggleLeft size={14} /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        id={`edit-product-${product._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Full Product"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(product)}
                        id={`delete-product-${product._id}`}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-bold text-gray-900 text-lg mb-2">Delete Product?</h2>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to delete{' '}
              <strong>"{confirmDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                id="cancel-delete-btn"
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                id="confirm-delete-btn"
                disabled={deletingId === confirmDelete._id}
                className="btn-danger flex-1 justify-center disabled:opacity-60"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
