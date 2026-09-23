import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const sections = [
  {
    num: '1',
    title: 'Return Period',
    paragraphs: [
      'You can request a return within 2 days of receiving your order.',
    ],
  },
  {
    num: '2',
    title: 'When Can You Return a Product?',
    intro: 'A return may be accepted if:',
    items: [
      'You received a damaged or defective product.',
      'You received the wrong product.',
      'The product is missing or incorrect compared with your order.',
      'The product meets our return conditions mentioned below.',
    ],
    note: 'The product should be unused, unopened, and in its original packaging, wherever applicable. You may also be asked to provide the order number, invoice, receipt, or photos/videos of the issue.',
  },
  {
    num: '3',
    title: 'How to Request a Return',
    paragraphs: [
      'To request a return, contact us within 2 days of delivery.',
      'Please provide your order number and details/photos of the product issue.',
      'We will review your request and inform you whether the return is approved.',
    ],
    contact: true,
  },
  {
    num: '4',
    title: 'Damaged or Wrong Products',
    items: [
      'Please check your order when it is delivered.',
      'If you receive a damaged, defective, leaking, expired, or wrong product, contact us as soon as possible, preferably on the day of delivery, with photos/videos of the product and packaging.',
      'Do not use a damaged or defective agricultural product.',
    ],
  },
  {
    num: '5',
    title: 'Non-Returnable Products',
    intro: 'For safety and quality reasons, certain products may not be eligible for return, including:',
    items: [
      'Opened or used pesticides and crop-protection products',
      'Opened fertilizers or agricultural chemicals',
      'Seeds that have been opened or used',
      'Plants and other perishable products',
      'Products damaged after delivery due to improper handling or storage',
      'Customized or specially ordered products',
      'Gift cards',
      'Products clearly marked as non-returnable on the product page',
    ],
    note: 'Sale/discounted products: Return eligibility will be mentioned on the respective product page.',
    highlight: true,
  },
  {
    num: '6',
    title: 'Return Shipping',
    paragraphs: [
      'If the return is due to a wrong, damaged, or defective product, MarutiKrushiSevaKendra may arrange or bear the applicable return shipping cost.',
      'For other approved returns, return shipping charges may apply.',
    ],
  },
  {
    num: '7',
    title: 'Refunds',
    intro: 'Once we receive and inspect the returned product, we will notify you whether your refund has been approved. If approved:',
    items: [
      'The refund will normally be processed within 5 business days.',
      'Refunds will generally be made to the original payment method.',
      'For Cash on Delivery orders, we may require valid bank/UPI details to process the refund.',
      'The actual time for the amount to appear in your account may depend on your bank or payment provider.',
    ],
  },
  {
    num: '8',
    title: 'Order Cancellation',
    items: [
      'You may request cancellation before the order is dispatched.',
      'Once an order has been dispatched or delivered, the Return & Refund Policy will apply.',
    ],
  },
  {
    num: '9',
    title: 'Important Note for Agricultural Products',
    paragraphs: [
      'Pesticides, fertilizers, seeds, and other agricultural products must be stored and used according to the manufacturer\'s instructions and applicable laws.',
      'MarutiKrushiSevaKendra is not responsible for products that are damaged due to improper storage, handling, or use after delivery.',
    ],
    warning: true,
  },
];

const PolicySection = ({ section, isLast }) => (
  <div className={`grid grid-cols-[3rem_1fr] gap-6 py-8 ${!isLast ? 'border-b border-green-100' : ''}`}>
    {/* Number + connector */}
    <div className="flex flex-col items-center pt-1">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-950 text-white text-sm font-black shrink-0">
        {section.num}
      </span>
      {!isLast && <div className="flex-1 w-px bg-green-200 mt-3" />}
    </div>

    {/* Content */}
    <div>
      <h2 className="text-xl font-extrabold text-gray-900 mb-4">{section.title}</h2>

      {section.warning && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-amber-800 text-sm font-semibold">
            Important: These rules apply to all agricultural products.
          </p>
        </div>
      )}

      {section.paragraphs && section.paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{p}</p>
      ))}

      {section.contact && (
        <div className="flex flex-wrap gap-4 my-4">
          <a href="mailto:contact@MarutiKrushiSevaKendra.in" className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 hover:border-green-400 hover:text-green-700 transition-colors shadow-sm">
            <Mail size={15} className="text-green-600" /> contact@MarutiKrushiSevaKendra.in
          </a>
          <a href="tel:08069409553" className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 hover:border-green-400 hover:text-green-700 transition-colors shadow-sm">
            <Phone size={15} className="text-green-600" /> 08069409553
          </a>
        </div>
      )}

      {section.intro && (
        <p className="text-gray-600 text-sm mb-2">{section.intro}</p>
      )}

      {section.items && (
        <ul className={`list-disc list-inside space-y-1.5 text-sm leading-relaxed mb-3 ${section.highlight ? 'text-red-700' : 'text-gray-600'}`}>
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}

      {section.note && (
        <p className="text-gray-500 text-sm leading-relaxed mt-3 italic border-l-2 border-green-300 pl-3">
          {section.note}
        </p>
      )}
    </div>
  </div>
);

const ReturnRefundPolicy = () => {
  useEffect(() => {
    document.title = `Return & Refund Policy | ${STORE_CONFIG.name}`;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      {/* Hero */}
      <section className="rounded-[2.5rem] bg-emerald-950 p-8 md:p-14 text-white mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-400/20 rounded-2xl p-3">
            <RotateCcw size={28} className="text-green-400" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 max-w-3xl">
          Return &amp; Refund Policy
        </h1>
        <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          At MarutiKrushiSevaKendra, we want you to receive the right products in good condition. Please read the following return and refund policy before placing your order.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            Return window: 2 days from delivery
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            Refunds within 5 business days
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="rounded-[2.5rem] bg-green-50/70 border border-green-100 p-5 sm:p-8 md:p-10 mb-8">
        {sections.map((section, i) => (
          <PolicySection key={section.num} section={section} isLast={i === sections.length - 1} />
        ))}
      </section>

      {/* Section 10 — Contact Us */}
      <section className="rounded-[2.5rem] bg-emerald-950 text-white p-8 md:p-12">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400 mb-4">
          10. Contact Us
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-6 max-w-2xl">
          For returns, refunds, or any product-related issue.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Email */}
          <div className="rounded-[1.5rem] bg-white/10 border border-white/20 p-6 flex flex-col gap-3">
            <div className="bg-green-400/20 rounded-xl p-2.5 w-fit">
              <Mail size={20} className="text-green-400" />
            </div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-green-400">Email</p>
            <a href="mailto:contact@MarutiKrushiSevaKendra.in" className="text-white font-bold text-sm hover:text-green-300 transition-colors break-all">
              contact@MarutiKrushiSevaKendra.in
            </a>
          </div>

          {/* Phone */}
          <div className="rounded-[1.5rem] bg-white/10 border border-white/20 p-6 flex flex-col gap-3">
            <div className="bg-green-400/20 rounded-xl p-2.5 w-fit">
              <Phone size={20} className="text-green-400" />
            </div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-green-400">Phone</p>
            <a href="tel:08069409553" className="text-white font-bold text-sm hover:text-green-300 transition-colors">
              08069409553
            </a>
          </div>

          {/* Address */}
          <div className="rounded-[1.5rem] bg-white/10 border border-white/20 p-6 flex flex-col gap-3">
            <div className="bg-green-400/20 rounded-xl p-2.5 w-fit">
              <MapPin size={20} className="text-green-400" />
            </div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-green-400">Address</p>
            <p className="text-green-100 text-sm leading-relaxed">
              Afghan Cottage, Near Over Bridge,<br />
              Niwaranpur, Amity University,<br />
              Ranchi &ndash; 834002, Jharkhand, India.
            </p>
          </div>
        </div>

        <p className="text-green-200 text-sm leading-relaxed mb-6">
          <strong className="text-white">MarutiKrushiSevaKendra Pvt. Ltd.</strong> &mdash; We are here to help resolve your concerns as quickly and fairly as possible.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/contact"
            id="returns-contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-green-800 hover:bg-green-50 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/products"
            id="returns-shop-products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 border border-white/20 px-6 py-3 text-sm font-extrabold text-white hover:bg-green-500 transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReturnRefundPolicy;
