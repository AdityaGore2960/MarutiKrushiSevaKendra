import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon, Eye, Check, X } from 'lucide-react';
import { getBrands, createBrand, updateBrand, deleteBrand, getProductsByBrand } from '../../services/adminService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({ name: '', active: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // View Products Modal
  const [viewingBrand, setViewingBrand] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchBrands = () => {
    setLoading(true);
    getBrands()
      .then((res) => setBrands(res.data.data))
      .catch(() => setError('Failed to load brands.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Brands | Admin';
    fetchBrands();
  }, []);

  const handleEdit = (brand) => {
    setEditing(brand);
    setForm({ name: brand.name, active: brand.active });
    setImagePreview(brand.imageUrl || null);
    setImageFile(null);
    setFormError('');
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: '', active: true });
    setImagePreview(null);
    setImageFile(null);
    setFormError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Image size should be less than 2MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Brand name is required.'); return; }
    
    setSubmitting(true);
    setFormError('');
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('active', form.active);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editing) {
        await updateBrand(editing._id, formData);
      } else {
        await createBrand(formData);
      }
      handleCancel();
      fetchBrands();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (brand) => {
    setDeletingId(brand._id);
    try {
      await deleteBrand(brand._id);
      setBrands((prev) => prev.filter((b) => b._id !== brand._id));
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete brand.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewProducts = async (brand) => {
    setViewingBrand(brand);
    setLoadingProducts(true);
    try {
      const res = await getProductsByBrand(brand.name);
      setBrandProducts(res.data.data);
    } catch (err) {
      alert('Failed to fetch products for this brand.');
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Brands</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage manufacturers and product brands</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">
              {editing ? 'Edit Brand' : 'Add New Brand'}
            </h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-3">{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden mb-3">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon size={32} className="text-gray-300" />
                  )}
                </div>
                <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <span>{imagePreview ? 'Change Logo' : 'Upload Logo'}</span>
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">JPEG, PNG or WEBP (Max 2MB)</p>
              </div>

              <div>
                <label className="label">Brand Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Bayer"
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-1 mb-2">
                <input 
                  type="checkbox" 
                  id="activeToggle"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="activeToggle" className="text-sm font-semibold text-gray-700 select-none">
                  Brand is Active
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : editing ? (
                    'Update'
                  ) : (
                    <><Plus size={16} /> Add Brand</>
                  )}
                </button>
                {editing && (
                  <button type="button" onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3">
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchBrands} />
          ) : brands.length === 0 ? (
            <EmptyState title="No brands yet" description="Add your first brand to link to products." />
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold text-gray-600 text-left">Brand</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {brands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                            {brand.imageUrl ? (
                              <img src={brand.imageUrl} alt={brand.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="font-bold text-gray-400 text-xs">{brand.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="font-bold text-gray-900">{brand.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle text-center">
                        {brand.active !== false ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase">
                            <Check size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg uppercase">
                            <X size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewProducts(brand)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Products"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(brand)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
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
        </div>
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="font-bold text-gray-900 text-lg mb-2">Delete Brand?</h2>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to delete <strong>"{confirmDelete.name}"</strong>? This will not delete the associated products, but they will lose their valid brand mapping.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete._id}
                className="btn-danger flex-1 justify-center"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Products Modal */}
      {viewingBrand && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                Products by {viewingBrand.name}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{brandProducts.length}</span>
              </h2>
              <button onClick={() => setViewingBrand(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {loadingProducts ? (
                <Loading />
              ) : brandProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No products found for this brand.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brandProducts.map(prod => (
                    <div key={prod._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{prod.name}</p>
                        <p className="text-xs text-green-700 font-extrabold mt-0.5">₹{prod.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
