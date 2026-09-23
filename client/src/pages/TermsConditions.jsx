import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, Mail, Phone, MapPin } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const sections = [
  {
    num: '1',
    title: 'About MarutiKrushiSevaKendra',
    paragraphs: [
      'MarutiKrushiSevaKendra provides an online platform for purchasing agricultural and gardening products, including seeds, fertilizers, crop-protection products, pesticides, farming tools, plants, pots, planters, and related products.',
      'By using our Services, you agree to follow these Terms and all applicable laws and regulations.',
    ],
  },
  {
    num: '2',
    title: 'User Account',
    paragraphs: ['Some features may require you to create an account.'],
    intro: 'You are responsible for:',
    items: [
      'Providing correct and updated information',
      'Keeping your password and OTP confidential',
      'All activity performed through your account',
      'Informing us immediately if you suspect unauthorized access',
    ],
    note: 'Do not share your password, OTP, UPI PIN, or other confidential information with anyone.',
  },
  {
    num: '3',
    title: 'Products',
    intro: 'We make reasonable efforts to provide accurate product information, including:',
    items: [
      'Product name',
      'Brand',
      'Price',
      'Quantity/weight',
      'Images',
      'Description',
      'Usage information',
    ],
    paragraphs: [
      'Product images may vary slightly from the actual packaging.',
      'Product availability may change without notice.',
    ],
    paragraphsAfter: true,
  },
  {
    num: '4',
    title: 'Agricultural Products',
    paragraphs: [
      "Seeds, fertilizers, pesticides, fungicides, herbicides, and other crop-protection products must be used only according to the manufacturer's label, instructions, and applicable laws.",
      'Customers are responsible for using and storing products safely and appropriately.',
      'Certain agricultural products may have location, quantity, age, licensing, or delivery restrictions. MarutiKrushiSevaKendra may restrict or cancel an order where required by applicable law.',
    ],
  },
  {
    num: '5',
    title: 'Prices & Taxes',
    items: [
      'All prices are displayed in Indian Rupees (INR).',
      'Prices and offers may change without prior notice.',
      'Applicable taxes and delivery charges will be shown during checkout.',
      'The final price payable will be displayed before you confirm your order.',
    ],
  },
  {
    num: '6',
    title: 'Orders',
    paragraphs: ['Placing an order does not guarantee acceptance of the order.'],
    intro: 'We may cancel or refuse an order because of:',
    items: [
      'Product unavailability',
      'Incorrect pricing or product information',
      'Delivery restrictions',
      'Payment issues',
      'Suspicious or fraudulent activity',
      'Legal or regulatory requirements',
    ],
    note: 'If we cancel an order after payment, an eligible refund will be processed according to our Refund Policy.',
  },
  {
    num: '7',
    title: 'Payments',
    intro: 'We may provide payment methods such as:',
    items: [
      'UPI',
      'Credit/debit cards',
      'Net banking',
      'Wallets',
      'Cash on Delivery, where available',
    ],
    paragraphs: [
      'Payments may be processed through third-party payment gateways.',
      'You must provide accurate payment and billing information.',
    ],
    paragraphsAfter: true,
  },
  {
    num: '8',
    title: 'Shipping & Delivery',
    paragraphs: ['We currently deliver within India, subject to PIN-code and product availability.'],
    intro: 'Delivery times are estimates and may vary due to:',
    items: [
      'Location',
      'Product availability',
      'Courier delays',
      'Weather',
      'Holidays',
      'Government restrictions',
      'Other circumstances beyond our reasonable control',
    ],
    note: 'Please provide a correct delivery address and mobile number.',
    shippingLink: true,
  },
  {
    num: '9',
    title: 'Cancellation, Returns & Refunds',
    items: [
      'Orders may be cancelled according to our Cancellation Policy.',
      'Eligible products may be returned according to our Return & Refund Policy.',
      'Some products, particularly opened/used agricultural chemicals, seeds, plants, and other specified products, may not be eligible for return.',
      'Please check the applicable policy before placing an order.',
    ],
    returnsLink: true,
  },
  {
    num: '10',
    title: 'User Conduct',
    intro: 'You must not:',
    items: [
      'Use MarutiKrushiSevaKendra for illegal activities',
      'Provide false or misleading information',
      'Upload harmful or illegal content',
      'Attempt to hack or disrupt the website',
      'Introduce viruses or malware',
      "Collect other users' information without permission",
      'Misuse promotional offers',
      'Create fraudulent accounts or orders',
      'Violate the rights of MarutiKrushiSevaKendra or others',
    ],
    note: 'We may suspend or terminate accounts involved in prohibited activities.',
    highlight: true,
  },
  {
    num: '11',
    title: 'Reviews & User Content',
    intro: 'If you submit reviews, comments, photos, or other content, you must ensure that the content:',
    items: [
      'Is truthful and relevant',
      "Does not violate anyone's rights",
      'Is not illegal, abusive, or defamatory',
      'Does not contain malware or harmful content',
    ],
    note: 'By submitting content, you allow MarutiKrushiSevaKendra to use it for operating and promoting our Services, subject to applicable law.',
  },
  {
    num: '12',
    title: 'Intellectual Property',
    paragraphs: [
      'The MarutiKrushiSevaKendra name, logo, website design, text, graphics, images, software, and other content are owned by MarutiKrushiSevaKendra or its licensors.',
      'You may not copy, reproduce, modify, distribute, or commercially use our content without written permission.',
    ],
  },
  {
    num: '13',
    title: 'Third-Party Services',
    intro: 'MarutiKrushiSevaKendra may use third-party services such as:',
    items: [
      'Payment gateways',
      'Delivery partners',
      'SMS/OTP providers',
      'Hosting providers',
      'Analytics services',
    ],
    note: 'Third-party services may have their own terms and privacy policies.',
  },
  {
    num: '14',
    title: 'Disclaimer',
    paragraphs: [
      'We make reasonable efforts to keep our website and product information accurate and available.',
    ],
    intro: 'However, we do not guarantee that:',
    items: [
      'The website will always be available',
      'All information will always be error-free',
      'Every product will always be available',
      'Product images will exactly match the delivered packaging',
    ],
    note: 'Nothing in these Terms limits any rights or protections available to consumers under applicable law.',
  },
  {
    num: '15',
    title: 'Limitation of Liability',
    paragraphs: [
      'To the extent permitted by applicable law, MarutiKrushiSevaKendra will not be responsible for indirect or consequential losses resulting from the use of our website or services.',
      'Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited.',
    ],
  },
  {
    num: '16',
    title: 'Account Suspension or Termination',
    intro: 'We may suspend or terminate an account if:',
    items: [
      'These Terms are violated',
      'Fraudulent activity is detected',
      'The account is used for illegal activities',
      'Required by law',
      'The account poses a security risk',
    ],
    note: 'Termination does not affect rights or obligations that arose before termination.',
  },
  {
    num: '17',
    title: 'Privacy',
    paragraphs: [
      'Your use of MarutiKrushiSevaKendra is also subject to our Privacy Policy, which explains how we collect and use personal information.',
    ],
    privacyLink: true,
  },
  {
    num: '18',
    title: 'Changes to These Terms',
    items: [
      'We may update these Terms from time to time.',
      'The latest version will be published on this page with the updated "Last Updated" date.',
      'Where required, we will provide appropriate notice of significant changes.',
    ],
  },
  {
    num: '19',
    title: 'Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of India.',
      'Any disputes will be handled by the courts having appropriate jurisdiction, subject to applicable consumer protection laws.',
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

      {/* Paragraphs before list */}
      {!section.paragraphsAfter && section.paragraphs && section.paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed mb-3">{p}</p>
      ))}

      {section.intro && (
        <p className="text-gray-600 text-sm mb-2">{section.intro}</p>
      )}

      {section.items && (
        <ul className={`list-disc list-inside space-y-1.5 text-sm leading-relaxed mb-3 ${section.highlight ? 'text-red-700' : 'text-gray-600'}`}>
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}

      {/* Paragraphs after list */}
      {section.paragraphsAfter && section.paragraphs && section.paragraphs.map((p, i) => (
        <p key={i} className="text-gray-600 text-sm leading-relaxed mb-2">{p}</p>
      ))}

      {section.note && (
        <p className="text-gray-500 text-sm leading-relaxed mt-3 italic border-l-2 border-green-300 pl-3">
          {section.note}
        </p>
      )}

      {section.shippingLink && (
        <p className="text-gray-600 text-sm mt-3">
          For complete information, please refer to our{' '}
          <Link to="/shipping" className="text-green-700 font-bold underline hover:text-green-600 transition-colors">
            Shipping &amp; Delivery Policy
          </Link>.
        </p>
      )}

      {section.returnsLink && (
        <p className="text-gray-600 text-sm mt-3">
          Please see our{' '}
          <Link to="/returns" className="text-green-700 font-bold underline hover:text-green-600 transition-colors">
            Return &amp; Refund Policy
          </Link>{' '}
          for full eligibility and refund details.
        </p>
      )}

      {section.privacyLink && (
        <p className="text-gray-600 text-sm mt-3">
          Read our{' '}
          <Link to="/privacy" className="text-green-700 font-bold underline hover:text-green-600 transition-colors">
            Privacy Policy
          </Link>.
        </p>
      )}
    </div>
  </div>
);

const TermsConditions = () => {
  useEffect(() => {
    document.title = `Terms & Conditions | ${STORE_CONFIG.name}`;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">

      {/* Hero */}
      <section className="rounded-[2.5rem] bg-emerald-950 p-8 md:p-14 text-white mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-400/20 rounded-2xl p-3">
            <ScrollText size={28} className="text-green-400" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400">Legal</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6 max-w-3xl">
          Terms &amp; Conditions
        </h1>
        <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
          Welcome to MarutiKrushiSevaKendra. These Terms &amp; Conditions govern your use of our website, mobile application, and services. By using MarutiKrushiSevaKendra or placing an order, you agree to these Terms.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            Last Updated: DD/MM/YYYY
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-green-100">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            Applicable to all users &amp; orders
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="rounded-[2.5rem] bg-green-50/70 border border-green-100 p-5 sm:p-8 md:p-10 mb-8">
        {sections.map((section, i) => (
          <PolicySection key={section.num} section={section} isLast={i === sections.length - 1} />
        ))}
      </section>

      {/* Section 20 — Contact Us */}
      <section className="rounded-[2.5rem] bg-emerald-950 text-white p-8 md:p-12">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400 mb-4">
          20. Contact Us
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-6 max-w-2xl">
          For questions, complaints, or support, contact us.
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
            <a href="tel:+918069409553" className="text-white font-bold text-sm hover:text-green-300 transition-colors">
              +91 80694 09553
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
          <strong className="text-white">MarutiKrushiSevaKendra Pvt. Ltd.</strong> &mdash; We are here to help with any questions or concerns about our Terms.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/contact"
            id="terms-contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-green-800 hover:bg-green-50 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/privacy"
            id="terms-privacy-policy"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 border border-white/20 px-6 py-3 text-sm font-extrabold text-white hover:bg-green-500 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
