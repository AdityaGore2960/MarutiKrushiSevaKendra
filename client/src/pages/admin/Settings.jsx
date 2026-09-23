import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/adminService';
import Loading from '../../components/Loading';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [form, setForm] = useState({
    storeName: '',
    businessEmail: '',
    customerSupportPhone: '',
    businessAddress: '',
    shippingEnabled: true,
    flatShippingRate: 50,
    freeShippingThreshold: 1000,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    document.title = 'Settings | Admin';
    getSettings()
      .then((res) => {
        const s = res.data.data;
        setForm({
          storeName: s.storeName || '',
          businessEmail: s.businessEmail || '',
          customerSupportPhone: s.customerSupportPhone || '',
          businessAddress: s.businessAddress || '',
          shippingEnabled: s.shippingEnabled !== false,
          flatShippingRate: s.flatShippingRate || 0,
          freeShippingThreshold: s.freeShippingThreshold || 0,
        });
        setImagePreview(s.storeLogoUrl || null);
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load settings.' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
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
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (imageFile) {
      formData.append('logo', imageFile);
    }

    try {
      await updateSettings(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update settings.' });
    } finally {
      setSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={28} className="text-gray-900" />
          Store Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your global business configurations</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${
          message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Business Information Card */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <label className="label">Store Logo</label>
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-full h-32 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden mb-3 p-2">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon size={32} className="text-gray-300" />
                  )}
                </div>
                <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span>{imagePreview ? 'Change Logo' : 'Upload Logo'}</span>
                  <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <div>
                <label className="label">Store Name</label>
                <input 
                  name="storeName"
                  value={form.storeName}
                  onChange={handleChange}
                  className="input-field" 
                  placeholder="Maruti Krushiseva Kendra" 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Business Email</label>
                  <input 
                    type="email"
                    name="businessEmail"
                    value={form.businessEmail}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="contact@marutikrushi.com" 
                    required 
                  />
                </div>
                <div>
                  <label className="label">Customer Support Phone</label>
                  <input 
                    name="customerSupportPhone"
                    value={form.customerSupportPhone}
                    onChange={handleChange}
                    className="input-field" 
                    placeholder="+91 9999999999" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="label">Business Address</label>
                <textarea 
                  name="businessAddress"
                  value={form.businessAddress}
                  onChange={handleChange}
                  className="input-field resize-none h-20" 
                  placeholder="Enter full physical address..." 
                  required 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Configuration Card */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-3">Shipping Configuration</h2>
          
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <input 
              type="checkbox" 
              id="shippingEnabled"
              name="shippingEnabled"
              checked={form.shippingEnabled}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
            />
            <div>
              <label htmlFor="shippingEnabled" className="text-sm font-bold text-gray-900 select-none block">
                Enable Shipping Charges
              </label>
              <p className="text-xs text-gray-500 mt-0.5">Toggle whether flat rate shipping applies to orders.</p>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!form.shippingEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="label">Flat Shipping Rate (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                <input 
                  type="number"
                  name="flatShippingRate"
                  value={form.flatShippingRate}
                  onChange={handleChange}
                  className="input-field pl-8" 
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Base cost added to orders.</p>
            </div>
            <div>
              <label className="label">Free Shipping Threshold (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                <input 
                  type="number"
                  name="freeShippingThreshold"
                  value={form.freeShippingThreshold}
                  onChange={handleChange}
                  className="input-field pl-8" 
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping. Set to 0 to disable.</p>
            </div>
          </div>
        </div>

        {/* Payment Configuration Disclaimer */}
        <div className="card p-6 bg-blue-50 border-blue-100">
          <h2 className="text-lg font-bold text-blue-900 mb-2">Payment Configuration</h2>
          <p className="text-sm text-blue-800">
            For maximum security, Razorpay API credentials and secrets are intentionally excluded from the frontend. 
            They are securely loaded directly from the backend environment variables.
          </p>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full md:w-auto px-8 justify-center disabled:opacity-70"
          >
            {submitting ? (
              <><Loader2 size={18} className="animate-spin" /> Saving Settings...</>
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;
