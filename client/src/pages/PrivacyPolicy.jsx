import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const sections = [
  {
    num: '1',
    title: 'Information We Collect',
    items: [
      'Name, mobile number, and email address',
      'Billing and delivery address',
      'Account and login information',
      'Order, payment, return, and refund details',
      'Product reviews and feedback',
      'Device, browser, IP address, and website usage information',
      'Information you provide when contacting customer support',
    ],
    note: 'We only collect information that is reasonably needed to provide our services.',
  },
  {
    num: '2',
    title: 'How We Use Your Information',
    intro: 'We use your information to:',
    items: [
      'Create and manage your account',
      'Process and deliver your orders',
      'Process payments and refunds',
      'Send OTPs, order confirmations, and delivery updates',
      'Provide customer support',
      'Process returns and cancellations',
      'Improve our website and services',
      'Prevent fraud and maintain security',
      'Send offers and promotional messages where permitted',
      'Comply with applicable laws and regulations',
    ],
  },
  {
    num: '3',
    title: 'Payment Information',
    paragraphs: [
      'Payments may be processed through trusted third-party payment providers. MarutiKrushiSevaKendra may receive information such as payment status, transaction ID, and payment method.',
      'Sensitive payment details such as card passwords, CVV, or UPI PIN are not intentionally stored by MarutiKrushiSevaKendra.',
    ],
  },
  {
    num: '4',
    title: 'Sharing Your Information',
    paragraphs: ['We do not sell or rent your personal information.'],
    intro: 'We may share necessary information with trusted service providers such as:',
    items: [
      'Payment gateways',
      'Delivery and courier partners',
      'SMS/OTP and email providers',
      'Hosting and technology providers',
      'Customer-support services',
    ],
    note: 'We may also share information when required by law or necessary to prevent fraud, protect our rights, or maintain security.',
  },
  {
    num: '5',
    title: 'Cookies',
    intro: 'We use cookies and similar technologies to:',
    items: [
      'Keep you logged in',
      'Remember your shopping cart and preferences',
      'Improve website performance',
      'Understand website usage',
      'Maintain security',
    ],
    note: 'You can manage cookies through your browser settings. Disabling some cookies may affect website functionality.',
  },
  {
    num: '6',
    title: 'Data Security',
    paragraphs: [
      'We use reasonable security measures such as encryption, access controls, authentication, and secure systems to protect your information.',
      'However, no online system can be guaranteed to be completely secure.',
    ],
  },
  {
    num: '7',
    title: 'Data Retention',
    paragraphs: [
      'We keep your information only for as long as reasonably necessary to provide our services, process transactions, resolve disputes, prevent fraud, and comply with legal requirements.',
    ],
  },
  {
    num: '8',
    title: 'Your Privacy Choices',
    intro: 'Subject to applicable law, you may request to:',
    items: [
      'Access your personal information',
      'Correct incorrect information',
      'Delete your account or personal information where applicable',
      'Withdraw consent where applicable',
      'Stop receiving promotional messages',
    ],
    note: 'You can contact us to make a privacy-related request.',
  },
  {
    num: '9',
    title: "Children's Privacy",
    paragraphs: [
      "Our services are not intended for children. We do not knowingly collect children's personal information in violation of applicable law.",
    ],
  },
  {
    num: '10',
    title: 'Third-Party Links',
    paragraphs: [
      'Our website may contain links to third-party websites or services. MarutiKrushiSevaKendra is not responsible for their privacy practices, so we recommend reviewing their privacy policies.',
    ],
  },
  {
    num: '11',
    title: 'Policy Changes',
    paragraphs: [
      'We may update this Privacy Policy when our services, practices, or applicable laws change. The latest version will always be available on this page with the updated "Last Updated" date.',
    ],
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
        <p className="text-gray-600 text-sm leading-relaxed mt-3">{section.note}</p>
      )}
    </div>
  </div>
);

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = `Privacy Policy | ${STORE_CONFIG.name}`;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      {/* Hero */}
      <section className="rounded-[2.5rem] bg-emerald-950 p-8 md:p-14 text-white mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-400/20 rounded-2xl p-3">
            <ShieldCheck size={28} className="text-green-400" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 max-w-3xl">
          Privacy Policy
        </h1>
        <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          Welcome to MarutiKrushiSevaKendra. Your privacy is important to us. This Privacy Policy explains what information we collect, why we collect it, how we use it, and how we protect it when you use our website, create an account, or purchase our products.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
          <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          Last Updated: September 2025
        </div>
      </section>

      {/* Policy Sections */}
      <section className="rounded-[2.5rem] bg-green-50/70 border border-green-100 p-5 sm:p-8 md:p-10 mb-8">
        {sections.map((section, i) => (
          <PolicySection key={section.num} section={section} isLast={i === sections.length - 1} />
        ))}
      </section>

      {/* Section 12 — Contact & Grievance */}
      <section className="rounded-[2.5rem] bg-emerald-950 text-white p-8 md:p-12">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400 mb-4">
          12. Contact &amp; Grievance
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-6 max-w-2xl">
          For questions, complaints, or privacy requests, contact us.
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
          <strong className="text-white">MarutiKrushiSevaKendra Pvt. Ltd.</strong> &mdash; We will review and address privacy-related concerns in accordance with applicable law.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/contact"
            id="privacy-contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-green-800 hover:bg-green-50 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/products"
            id="privacy-shop-products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 border border-white/20 px-6 py-3 text-sm font-extrabold text-white hover:bg-green-500 transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
