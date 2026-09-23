import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const sections = [
  {
    num: '1',
    title: 'Delivery Locations',
    items: [
      'We currently deliver orders within India.',
      'Delivery availability may depend on your PIN code and the product ordered.',
      'Certain agricultural or crop-protection products may have delivery restrictions due to applicable laws or transportation requirements.',
    ],
  },
  {
    num: '2',
    title: 'Order Processing',
    items: [
      'Orders are processed after successful payment confirmation or order confirmation for Cash on Delivery, where available.',
      'Orders are normally dispatched as soon as possible.',
      'Processing time may vary depending on product availability and seller/warehouse location.',
    ],
  },
  {
    num: '3',
    title: 'Delivery Time',
    items: [
      'Estimated delivery time will be shown during checkout or communicated after the order is placed.',
      'Delivery time may vary depending on your location, product availability, courier service, weather, holidays, and other circumstances.',
      'Delivery dates are estimates and are not guaranteed.',
    ],
    note: 'Delivery dates are estimates only and may vary based on factors outside our control.',
  },
  {
    num: '4',
    title: 'Shipping Charges',
    items: [
      'Applicable shipping charges will be displayed during checkout before you place your order.',
      'Shipping charges may vary based on delivery location, order value, product weight, and delivery method.',
    ],
  },
  {
    num: '5',
    title: 'Order Tracking',
    items: [
      'Once your order is shipped, we may provide tracking information through email, SMS, WhatsApp, or your MarutiKrushiSevaKendra account.',
      'You can use the tracking information to check your order status.',
    ],
  },
  {
    num: '6',
    title: 'Delivery Address',
    items: [
      'Please make sure that your delivery address, mobile number, PIN code, and other details are correct before placing your order.',
      'We may not be able to change the delivery address after the order has been dispatched.',
      'MarutiKrushiSevaKendra is not responsible for delays caused by an incorrect or incomplete address.',
      'Additional delivery attempts or charges may apply in certain cases.',
    ],
  },
  {
    num: '7',
    title: 'Damaged or Tampered Packages',
    items: [
      'Please check the package when it is delivered.',
      'If the package appears damaged, leaking, open, or tampered with, please do not accept it where possible and contact MarutiKrushiSevaKendra immediately.',
    ],
    linkNote: true,
  },
  {
    num: '8',
    title: 'Failed or Delayed Delivery',
    intro: 'Delivery may be delayed or unsuccessful due to:',
    items: [
      'Incorrect address or contact details',
      'Customer unavailable at the delivery address',
      'Weather or natural events',
      'Transportation or logistics issues',
      'Holidays or high-demand periods',
      'Government or regulatory restrictions',
      'Product-specific delivery restrictions',
    ],
    note: 'We will make reasonable efforts to assist you in such situations.',
  },
  {
    num: '9',
    title: 'Agricultural & Crop-Protection Products',
    paragraphs: [
      'Some pesticides, fertilizers, seeds, and other agricultural products may be subject to applicable laws, transportation requirements, or location-based restrictions.',
      'MarutiKrushiSevaKendra may cancel or restrict delivery of an order where required by law or where safe/legal delivery is not possible. If an order is cancelled for such reasons, any eligible refund will be processed according to our Refund Policy.',
    ],
    warning: true,
  },
  {
    num: '10',
    title: 'Returns',
    paragraphs: [
      'You can request a return within 2 days of receiving your order, subject to our Return & Refund Policy.',
    ],
    returnLink: true,
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
            Agricultural products may have additional delivery restrictions as per applicable law.
          </p>
        </div>
      )}

      {section.paragraphs && section.paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{p}</p>
      ))}

      {section.intro && (
        <p className="text-gray-600 text-sm mb-2">{section.intro}</p>
      )}

      {section.items && (
        <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm leading-relaxed mb-3">
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}

      {section.note && (
        <p className="text-gray-500 text-sm leading-relaxed mt-3 italic border-l-2 border-green-300 pl-3">
          {section.note}
        </p>
      )}

      {section.linkNote && (
        <p className="text-gray-600 text-sm mt-2">
          For damaged, defective, or incorrect products, please refer to our{' '}
          <Link to="/returns" className="text-green-700 font-bold underline hover:text-green-600 transition-colors">
            Return &amp; Refund Policy
          </Link>.
        </p>
      )}

      {section.returnLink && (
        <p className="text-gray-600 text-sm mt-2">
          Please see our{' '}
          <Link to="/returns" className="text-green-700 font-bold underline hover:text-green-600 transition-colors">
            Return &amp; Refund Policy
          </Link>{' '}
          for eligibility and refund details.
        </p>
      )}
    </div>
  </div>
);

const ShippingPolicy = () => {
  useEffect(() => {
    document.title = `Shipping Policy | ${STORE_CONFIG.name}`;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      {/* Hero */}
      <section className="rounded-[2.5rem] bg-emerald-950 p-8 md:p-14 text-white mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-400/20 rounded-2xl p-3">
            <Truck size={28} className="text-green-400" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 max-w-3xl">
          Shipping Policy
        </h1>
        <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          At MarutiKrushiSevaKendra, we work to deliver your agricultural and gardening products safely and on time. Please read the following information about our shipping and delivery process.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            Delivery across India
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            Returns within 2 days of delivery
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="rounded-[2.5rem] bg-green-50/70 border border-green-100 p-5 sm:p-8 md:p-10 mb-8">
        {sections.map((section, i) => (
          <PolicySection key={section.num} section={section} isLast={i === sections.length - 1} />
        ))}
      </section>

      {/* Section 11 — Contact Us */}
      <section className="rounded-[2.5rem] bg-emerald-950 text-white p-8 md:p-12">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400 mb-4">
          11. Contact Us
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-6 max-w-2xl">
          For questions about shipping or your order.
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
          <strong className="text-white">MarutiKrushiSevaKendra Pvt. Ltd.</strong> &mdash; We are here to help ensure your order reaches you safely and on time.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/contact"
            id="shipping-contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-green-800 hover:bg-green-50 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/returns"
            id="shipping-returns-policy"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 border border-white/20 px-6 py-3 text-sm font-extrabold text-white hover:bg-green-500 transition-colors"
          >
            Return &amp; Refund Policy
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
