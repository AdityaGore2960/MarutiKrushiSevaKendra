import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ALL_STATIC_PRODUCTS } from '../config/staticProducts';
import { ChevronLeft, CreditCard, Wallet, ShieldCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api from '../services/api';

/* ─────────────────────────────────────────────────────────────────
   Dynamically load Razorpay SDK from their CDN – avoids bundling it
───────────────────────────────────────────────────────────────── */
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

/* ─────────────────────────────────────────────────────────────────
   Payment page
───────────────────────────────────────────────────────────────── */
const Payment = () => {
  const navigate = useNavigate();
  const { items, totalItems, clearItems } = useCart();
  const { user } = useUser();

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'failed'
  const [statusMsg, setStatusMsg] = useState('');

  /* ── Pricing ─────────────────────────────────────────── */
  const getItemPrice = (item) => {
    const isStatic = item.product && !isNaN(item.product);
    if (isStatic) {
      const staticProd = ALL_STATIC_PRODUCTS.find((p) => p.id === Number(item.product));
      return staticProd ? staticProd.price : 0;
    }
    return 120 + (item.name.length * 5) % 350;
  };

  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const shippingCharge = subtotal > 1000 ? 0 : 50;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCharge + taxes;
  const amountNow = paymentMethod === 'cod' ? Math.round(total * 0.1) : total;

  /* ── Get shipping address from sessionStorage (set by Checkout page) ── */
  const getShippingAddress = () => {
    try {
      return JSON.parse(sessionStorage.getItem('shippingAddress') || '{}');
    } catch {
      return {};
    }
  };

  /* ── Main handler ──────────────────────────────────────── */
  const handlePayNow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      /* 1️⃣  Ask the server to create a Razorpay order */
      const { data } = await api.post('/payment/create-order', {
        items: items.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: getItemPrice(item),
          imageUrl: item.imageUrl,
        })),
        shippingAddress: getShippingAddress(),
        subtotal,
        shippingCharge,
        taxes,
        total,
        paymentMethod,
      });

      /* COD path – no popup needed, order is already saved */
      if (paymentMethod === 'cod') {
        setStatus('success');
        setStatusMsg(`COD order placed! Pay ₹${data.amount / 100} advance on the next step.`);
        clearItems();
        sessionStorage.removeItem('shippingAddress');
        return;
      }

      /* 2️⃣  Load Razorpay SDK */
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        throw new Error('Could not load Razorpay SDK. Check your internet connection.');
      }

      /* 3️⃣  Open Razorpay checkout popup */
      await new Promise((resolve, reject) => {
        const options = {
          key: data.keyId,                    // Public key – safe to expose
          amount: data.amount,               // In paise (integer)
          currency: data.currency || 'INR',
          name: 'Maruti Krushiseva Kendra',
          description: 'Agricultural Products',
          // image: must be an absolute https:// URL — omit if no CDN logo yet
          order_id: data.razorpayOrderId,    // From Razorpay's API

          handler: async (response) => {
            try {
              /* 4️⃣  Verify signature on our server – CRITICAL security step */
              const verifyRes = await api.post('/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: data.orderId,
              });

              if (verifyRes.data.success) {
                clearItems();
                sessionStorage.removeItem('shippingAddress');
                resolve();
              } else {
                reject(new Error('Payment verification failed.'));
              }
            } catch (err) {
              reject(err);
            }
          },

          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },

          theme: {
            color: '#16a34a', // Green matching your brand
          },

          modal: {
            ondismiss: () => reject(new Error('Payment cancelled by user.')),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp) => {
          reject(new Error(resp.error?.description || 'Payment failed.'));
        });
        rzp.open();
      });

      setStatus('success');
      setStatusMsg('Payment successful! Your order has been placed. 🎉');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Payment failed. Please try again.';
      setStatus('failed');
      setStatusMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Empty cart guard ───────────────────────────────── */
  if (items.length === 0 && status !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No active order</h2>
          <p className="text-gray-500 mb-6">Return to checkout or products to place an order.</p>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ── Success screen ─────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-green-100 text-center max-w-md w-full animate-scaleIn">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-8">{statusMsg}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors"
          >
            Back to Home
          </button>
        </div>
        <style>{`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.92); }
            to   { opacity: 1; transform: scale(1); }
          }
          .animate-scaleIn { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        `}</style>
      </div>
    );
  }

  /* ── Main payment UI ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Payment</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: Payment Options */}
          <div className="flex-1">
            <form onSubmit={handlePayNow} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-green-600" />
                Select Payment Method
              </h2>

              <div className="space-y-4 mb-8">

                {/* Razorpay Option */}
                <label
                  className={`flex items-start p-5 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-green-600 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'razorpay'}
                    readOnly
                    className="text-green-600 focus:ring-green-500 mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-lg">Prepaid (Razorpay)</span>
                      <ShieldCheck size={20} className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay securely via UPI, Credit/Debit Card, Net Banking, or Wallet.
                    </p>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-start p-5 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-green-600 bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    readOnly
                    className="text-green-600 focus:ring-green-500 mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-lg">COD + 10% Advanced</span>
                      <Wallet size={20} className="text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay ₹{Math.round(total * 0.1)} now and the remaining ₹{Math.round(total * 0.9)} on delivery.
                    </p>
                  </div>
                </label>
              </div>

              {/* Amount summary box */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-8">
                <p className="text-sm text-gray-600 flex justify-between">
                  <span>Amount to pay now:</span>
                  <span className="font-bold text-gray-900 text-lg">₹{amountNow}</span>
                </p>
              </div>

              {/* Error banner */}
              {status === 'failed' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{statusMsg}</p>
                </div>
              )}

              {/* Pay Now button */}
              <button
                type="submit"
                disabled={loading}
                id="pay-now-btn"
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Pay ₹{amountNow} Securely
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} />
                256-bit SSL encrypted &amp; powered by Razorpay
              </p>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.product && !isNaN(item.product) && ALL_STATIC_PRODUCTS.find((p) => p.id === Number(item.product))?.emoji ? (
                        <span className="text-2xl">{ALL_STATIC_PRODUCTS.find((p) => p.id === Number(item.product)).emoji}</span>
                      ) : (
                        <img
                          src={item.imageUrl || 'https://placehold.co/100x100/dcfce7/16a34a?text=Item'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-green-700 mt-1">₹{getItemPrice(item) * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Taxes (GST 5%)</span>
                  <span className="font-semibold text-gray-900">₹{taxes}</span>
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-green-700">₹{total}</span>
                  <p className="text-[10px] text-gray-500">Including all taxes</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
