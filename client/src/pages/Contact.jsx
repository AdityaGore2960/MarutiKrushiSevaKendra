import { useEffect, useState } from 'react';
import {
  Phone, MessageCircle, MapPin, Mail, Briefcase,
  Package, HelpCircle, CheckCircle, Send, ExternalLink,
} from 'lucide-react';
import { STORE_CONFIG, getWhatsAppUrl, getGeneralWhatsAppMessage } from '../config/store';
import api from '../services/api';

const supportCards = [
  {
    icon: Package,
    title: 'Order Support',
    text: 'Get help for shipment status, invoice, return or delivery related questions.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: HelpCircle,
    title: 'Product Queries',
    text: 'Ask about seeds, crop protection, crop nutrition, tools and suitable product options.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Briefcase,
    title: 'Business Enquiries',
    text: 'Connect with us for seller, bulk order and partnership related enquiries.',
    color: 'bg-amber-50 text-amber-600',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = `Contact Us | ${STORE_CONFIG.name}`;
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      setForm({ name: '', mobile: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      {/* Hero Banner */}
      <section className="rounded-[2.5rem] bg-emerald-950 p-8 md:p-14 text-white mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-400/20 rounded-2xl p-3">
            <MessageCircle size={28} className="text-green-400" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400">Contact Us</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-5 max-w-3xl">
          Need help with an order, crop input or product query?
        </h1>
        <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl">
          Our team is here to support farmers, gardeners and agri buyers with fast order help, product guidance and reliable follow-up.
        </p>
      </section>

      {/* 3 Support Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {supportCards.map(({ icon: Icon, title, text, color }) => (
          <div key={title} className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-sm flex flex-col gap-4">
            <div className={`rounded-2xl p-3 w-fit ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left — Quick Contacts */}
        <div className="rounded-[2rem] bg-emerald-950 text-white p-8 md:p-10 flex flex-col gap-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400 mb-3">Quick Contacts</p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-snug">Reach us directly</h2>
          </div>

          {/* Contact rows */}
          <div className="flex flex-col gap-5">
            {/* Customer Care */}
            <div className="flex items-start gap-4 pb-5 border-b border-white/10">
              <div className="bg-green-400/20 rounded-xl p-2.5 shrink-0">
                <Phone size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-green-400 mb-1">Customer Care</p>
                <a href="tel:08062180953" className="text-white font-bold text-base hover:text-green-300 transition-colors">
                  08062180953
                </a>
                <p className="text-green-200 text-xs mt-1">Mon – Sat, 9 AM – 7 PM</p>
              </div>
            </div>

            {/* General Enquiry */}
            <div className="flex items-start gap-4 pb-5 border-b border-white/10">
              <div className="bg-green-400/20 rounded-xl p-2.5 shrink-0">
                <Mail size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-green-400 mb-1">General Enquiry</p>
                <a href="mailto:[EMAIL_ADDRESS]" className="text-white font-bold text-base hover:text-green-300 transition-colors break-all">
                  [EMAIL_ADDRESS]
                </a>
              </div>
            </div>

            {/* Complaints */}
            <div className="flex items-start gap-4 pb-5 border-b border-white/10">
              <div className="bg-green-400/20 rounded-xl p-2.5 shrink-0">
                <Mail size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-green-400 mb-1">Complaints</p>
                <a href="mailto:[EMAIL_ADDRESS]" className="text-white font-bold text-base hover:text-green-300 transition-colors break-all">
                  [EMAIL_ADDRESS]
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4 pb-5 border-b border-white/10">
              <div className="bg-green-400/20 rounded-xl p-2.5 shrink-0">
                <MessageCircle size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-green-400 mb-1">WhatsApp Support</p>
                <a
                  href={getWhatsAppUrl(getGeneralWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-bold text-base hover:text-green-300 transition-colors flex items-center gap-1.5"
                >
                  8969447088 <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Office Address */}
            <div className="flex items-start gap-4">
              <div className="bg-green-400/20 rounded-xl p-2.5 shrink-0">
                <MapPin size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-green-400 mb-1">Office Address</p>
                <p className="text-white font-bold text-sm leading-relaxed">MarutiKrushiSevaKendra Pvt. Ltd.</p>
                <p className="text-green-100 text-sm leading-relaxed mt-1">
                  Afghan Cottage, Near Over Bridge,<br />
                  Niwaranpur, Arya Nagar,<br />
                  Ranchi, Jharkhand – 834002
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Contact Form */}
        <div className="rounded-[2rem] bg-white border border-gray-200 p-8 md:p-10 shadow-sm flex flex-col">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-700 mb-3">Send a Message</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-8">
            Send Us a Message
          </h2>

          {/* Success Banner */}
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-2xl p-4 mb-6 flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold">Message Sent!</p>
                <p className="text-xs text-green-600 font-normal mt-0.5">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm font-semibold rounded-2xl p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
            {/* Name */}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-bold text-gray-700 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="contact-mobile" className="block text-sm font-bold text-gray-700 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contact-mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                required
                placeholder="e.g. 9876543210"
                pattern="[6-9][0-9]{9}"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-sm font-bold text-gray-700 mb-1.5">
                Email Address
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. ramesh@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Message */}
            <div className="flex-1">
              <label htmlFor="contact-message" className="block text-sm font-bold text-gray-700 mb-1.5">
                How can we help you? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm placeholder:text-gray-400 transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              id="contact-send-message"
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-extrabold py-4 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-green-700/20"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
