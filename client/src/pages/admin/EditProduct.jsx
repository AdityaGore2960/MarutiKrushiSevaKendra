import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { getCategories } from '../../services/categoryService';
import { getProductById, updateProduct, getBrands } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    name: '', brand: '', category: '', description: '', suitableCrops: '',
    purpose: '', composition: '', activeIngredient: '',
    targetProblem: '', packSizes: '', manufacturer: '',
    price: '0', discount: '0', stock: '0', weight: '', available: 'true',
  });

  useEffect(() => {
    document.title = 'Edit Product | Admin';
    Promise.all([
      getProductById(id),
      getCategories(),
      getBrands()
    ])
      .then(([prodRes, catRes, brandRes]) => {
        setCategories(catRes.data.data);
        setBrands(brandRes.data.data.filter(b => b.active !== false));
        const p = prodRes.data.data;
        setForm({
          name: p.name || '',
          brand: p.brand || '',
          category: p.category?._id || p.category || '',
          description: p.description || '',
          suitableCrops: (p.suitableCrops || []).join(', '),
          purpose: p.purpose || '',
          composition: p.composition || '',
          activeIngredient: p.activeIngredient || '',
          targetProblem: p.targetProblem || '',
          packSizes: (p.packSizes || []).join(', '),
          manufacturer: p.manufacturer || '',
          price: p.price || 0,
          discount: p.discount || 0,
          stock: p.stock || 0,
          weight: p.weight || '',
          available: p.available ? 'true' : 'false',
        });
        if (p.imageUrl) setImagePreview(p.imageUrl);
      })
      .catch(() => setFetchError('Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Product name is required.'); return; }
    if (!form.category) { setError('Please select a category.'); return; }

    setSubmitting(true);
    setError('');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('image', imageFile);

    try {
      await updateProduct(id, formData);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (fetchError) return <ErrorMessage message={fetchError} />;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} id="back-btn" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-green-700 text-sm font-medium mb-5 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-0.5">Update the product details below</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-gray-800">Basic Information</h2>
          <div>
            <label className="label">Product Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
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
            <textarea name="description" value={form.description} onChange={handleChange} className="input-field resize-none" rows={3} />
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

        <div className="card p-5 flex flex-col gap-4">
          <h2 className="font-bold text-gray-800">Agricultural Details</h2>
          {[
            { name: 'suitableCrops', label: 'Suitable Crops', placeholder: 'Cotton, Wheat, Rice' },
            { name: 'purpose', label: 'Purpose', placeholder: '' },
            { name: 'composition', label: 'Composition', placeholder: '' },
            { name: 'activeIngredient', label: 'Active Ingredient', placeholder: '' },
            { name: 'targetProblem', label: 'Target Pest / Problem', placeholder: '' },
            { name: 'packSizes', label: 'Pack Sizes', placeholder: '100 ml, 250 ml, 1 L' },
            { name: 'manufacturer', label: 'Manufacturer', placeholder: '' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input name={name} value={form[name]} onChange={handleChange} className="input-field" placeholder={placeholder} />
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-gray-800 mb-3">Product Image</h2>
          {imagePreview ? (
            <div className="relative w-full max-w-xs">
              <img src={imagePreview} alt="Preview" className="w-full rounded-xl border border-gray-200 object-cover" />
              <button
                type="button"
                onClick={() => { setImagePreview(''); setImageFile(null); }}
                id="remove-image-btn"
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
              <label htmlFor="edit-image" className="mt-3 btn-secondary text-sm inline-flex cursor-pointer">
                <Upload size={14} /> Change Image
                <input type="file" id="edit-image" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>
          ) : (
            <label htmlFor="edit-image" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-400">
              <Upload size={28} className="text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to upload image</p>
              <input type="file" id="edit-image" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          )}
        </div>

        <button
          type="submit"
          id="edit-product-submit"
          disabled={submitting}
          className="btn-primary justify-center disabled:opacity-60"
        >
          {submitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
