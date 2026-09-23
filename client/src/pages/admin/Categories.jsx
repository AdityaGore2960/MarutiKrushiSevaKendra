import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Check, X } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({ name: '', description: '', parentCategory: '', active: true });
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    getCategories()
      .then((res) => {
        // Group categories to show hierarchy nicely if needed, or just list them.
        setCategories(res.data.data);
      })
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = 'Categories | Admin';
    fetchCategories();
  }, []);

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({ 
      name: cat.name, 
      description: cat.description || '',
      parentCategory: cat.parentCategory?._id || '',
      active: cat.active !== false
    });
    setFormError('');
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: '', description: '', parentCategory: '', active: true });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Category name is required.'); return; }
    
    // Prevent self-referencing parent
    if (editing && form.parentCategory === editing._id) {
      setFormError('A category cannot be its own parent.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        parentCategory: form.parentCategory || null,
        active: form.active
      };

      if (editing) {
        await updateCategory(editing._id, payload);
      } else {
        await createCategory(payload);
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat) => {
    setDeletingId(cat._id);
    try {
      await deleteCategory(cat._id);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
      setConfirmDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category. It may have products or subcategories attached.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage agricultural product categories & subcategories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">
              {editing ? 'Edit Category' : 'Add New Category'}
            </h2>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-3">{formError}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label">Category Name <span className="text-red-500">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Vegetable Seeds"
                  required
                />
              </div>

              <div>
                <label className="label">Parent Category (Optional)</label>
                <select 
                  value={form.parentCategory} 
                  onChange={(e) => setForm({ ...form, parentCategory: e.target.value })}
                  className="input-field"
                >
                  <option value="">-- None (Top Level) --</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id} disabled={editing && c._id === editing._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Brief description..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="activeToggle"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="activeToggle" className="text-sm font-semibold text-gray-700 select-none">
                  Enable this category
                </label>
              </div>

              <div className="flex gap-2 mt-2">
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
                    <><Plus size={16} /> Add Category</>
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
            <ErrorMessage message={error} onRetry={fetchCategories} />
          ) : categories.length === 0 ? (
            <EmptyState title="No categories yet" description="Add your first category." />
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold text-gray-600 text-left">Name & Hierarchy</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 align-top">
                        <div className="font-bold text-gray-900">{cat.name}</div>
                        {cat.parentCategory && (
                          <div className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
                            Subcategory of: {cat.parentCategory.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-center">
                        {cat.active !== false ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase">
                            <Check size={12} /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg uppercase">
                            <X size={12} /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(cat)}
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
            <h2 className="font-bold text-gray-900 text-lg mb-2">Delete Category?</h2>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to delete <strong>"{confirmDelete.name}"</strong>?
              This will fail if products or subcategories are still using it.
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
    </div>
  );
};

export default Categories;
