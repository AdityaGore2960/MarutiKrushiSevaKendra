import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { getCategories } from '../../services/categoryService';
import { getBrands } from '../../services/adminService';
import { createProduct } from '../../services/productService';

const ARRAY_HELP = 'Separate multiple values with commas (e.g. Cotton, Wheat, Rice)';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    name: '', brand: '', category: '', description: '', suitableCrops: '',
    purpose: '', composition: '', activeIngredient: '',
    targetProblem: '', packSizes: '', manufacturer: '', 
    price: '0', discount: '0', stock: '0', weight: '', available: 'true',
  });

  useEffect(() => {
    document.title = 'Add Product | Admin';
    Promise.all([getCategories(), getBrands()])
      .then(([catRes, brandRes]) => {
        setCategories(catRes.data.data);
        setBrands(brandRes.data.data.filter(b => b.active !== false));
      })
      .catch(() => setError('Failed to load form data.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Product name is required.'); return; }
    if (!form.category) { setError('Please select a category.'); return; }

    setLoading(true);
    setError('');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('image', imageFile);

    try {
      await createProduct(formData);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} id="back-btn" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-green-700 text-sm font-medium mb-5 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-0.5">Fill in the product details below</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Basic Info */}
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-gray-800">Basic Information</h2>

          <div>
            <label className="label">Product Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g. 10:26:26 NPK Fertilizer" required />
          </div>

          <div>
            <label className="label">Category <span className="text-red-500">*</span></label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={3} placeholder="Brief description of the product..." />
          </div>

          <div>
            <label className="label">Availability</label>
            <select name="available" value={form.available} onChange={handleChange} className="input-field">
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-gray-800">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" min="0" name="price" value={form.price} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Discount (%)</label>
              <input type="number" min="0" max="100" name="discount" value={form.discount} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Stock Quantity <span className="text-red-500">*</span></label>
              <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="label">Weight / Quantity string</label>
              <input name="weight" value={form.weight} onChange={handleChange} className="input-field" placeholder="e.g. 1 kg, 500 ml" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Brand</label>
              <select name="brand" value={form.brand} onChange={handleChange} className="input-field">
                <option value="">-- No Brand / Unbranded --</option>
                {brands.map(b => (
                  <option key={b._id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Agri Details */}
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-gray-800">Agricultural Details</h2>

          <div>
            <label className="label">Suitable Crops</label>
            <input name="suitableCrops" value={form.suitableCrops} onChange={handleChange} className="input-field" placeholder="Cotton, Wheat, Rice" />
            <p className="text-xs text-gray-400 mt-1">{ARRAY_HELP}</p>
          </div>

          <div>
            <label className="label">Purpose</label>
            <input name="purpose" value={form.purpose} onChange={handleChange} className="input-field" placeholder="What does this product do?" />
          </div>

          <div>
            <label className="label">Composition</label>
            <input name="composition" value={form.composition} onChange={handleChange} className="input-field" placeholder="e.g. N:10%, P:26%, K:26%" />
          </div>

          <div>
            <label className="label">Active Ingredient</label>
            <input name="activeIngredient" value={form.activeIngredient} onChange={handleChange} className="input-field" placeholder="e.g. Imidacloprid 17.8%" />
          </div>

          <div>
            <label className="label">Target Pest / Problem</label>
            <input name="targetProblem" value={form.targetProblem} onChange={handleChange} className="input-field" placeholder="e.g. Aphids, Whiteflies" />
          </div>

          <div>
            <label className="label">Pack Sizes</label>
            <input name="packSizes" value={form.packSizes} onChange={handleChange} className="input-field" placeholder="100 ml, 250 ml, 1 L, 5 L" />
            <p className="text-xs text-gray-400 mt-1">{ARRAY_HELP}</p>
          </div>

          <div>
            <label className="label">Manufacturer</label>
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="input-field" placeholder="e.g. IFFCO, Bayer CropScience" />
          </div>
        </div>

        {/* Image */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-3">Product Image</h2>
          {imagePreview ? (
            <div className="relative w-full max-w-xs">
              <img src={imagePreview} alt="Preview" className="w-full rounded-xl border border-gray-200 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                id="remove-image-btn"
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="product-image"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-400 transition-colors"
            >
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
              <input
                type="file"
                id="product-image"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="add-product-submit"
          disabled={loading}
          className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
