import { Link } from 'react-router-dom';
import { Leaf, Phone, MessageCircle, MapPin, Send, Store } from 'lucide-react';
import { STORE_CONFIG, getWhatsAppUrl, getGeneralWhatsAppMessage } from '../config/store';
import { useLanguage } from '../context/LanguageContext';

const Facebook = ({ size = 24, fill = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Instagram = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Twitter = ({ size = 24, fill = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Linkedin = ({ size = 24, fill = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useLanguage();
  const footer = t('home.footer');

  return (
    <footer className="bg-green-50/30 pt-10 mt-8">
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-green-50 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-green-700 rounded-xl p-1.5">
                <Leaf size={24} className="text-white" />
              </div>
              <span className="font-bold text-green-900 text-2xl" style={{ fontFamily: "'Clicker Script', cursive" }}>MarutiKrushiSeva</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pr-4">
              {footer.description}
            </p>
            <div className="flex flex-col gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold w-fit transition-colors shadow-sm">
                <div className="text-left">
                  <span className="block text-[10px] font-normal leading-tight opacity-90">{footer.getItOn}</span>
                  <span className="block text-sm leading-tight">Google Play</span>
                </div>
              </button>
              <button className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold w-fit transition-colors">
                <Store size={18} />
                <span className="text-sm">{footer.seller}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-green-900 mb-6 text-lg">{footer.quickLinksTitle}</h4>
            <ul className="flex flex-col gap-3">
              {footer.quickLinks.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2">
                    <span className="text-green-500 font-bold">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories & Social */}
          <div>
            <h4 className="font-bold text-green-900 mb-6 text-lg">{footer.categoriesTitle}</h4>
            <ul className="flex flex-col gap-3 mb-8">
              {footer.categories.map(([to, label]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2">
                    <span className="text-green-500 font-bold">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-bold text-green-900 mb-4 text-sm">{footer.followUs}</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors"><Facebook size={16} fill="currentColor" className="border-none" /></a>
              <a href="#" className="bg-pink-600 text-white p-2.5 rounded-full hover:bg-pink-700 transition-colors"><Instagram size={16} /></a>
              <a href="#" className="bg-sky-500 text-white p-2.5 rounded-full hover:bg-sky-600 transition-colors"><Twitter size={16} fill="currentColor" /></a>
              <a href="#" className="bg-blue-700 text-white p-2.5 rounded-full hover:bg-blue-800 transition-colors"><Linkedin size={16} fill="currentColor" /></a>
            </div>
          </div>

          {/* Column 4: Newsletter & Contact Card */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#f2fdf4] rounded-2xl p-5 border border-green-50">
              <h4 className="font-bold text-green-900 mb-2 text-sm">{footer.updatedTitle}</h4>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">{footer.updatedDescription}</p>
              <div className="flex items-center">
                <input type="email" placeholder={footer.emailPlaceholder} className="w-full text-sm py-2.5 px-3 rounded-l-lg border border-gray-200 outline-none focus:border-green-500" />
                <button className="bg-green-700 hover:bg-green-800 text-white py-2.5 px-4 rounded-r-lg transition-colors border border-green-700">
                  <Send size={16} />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-green-900 mb-3 text-lg">{footer.contactTitle}</h4>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
                <div>
                  <h5 className="font-bold text-gray-800 text-sm mb-1">MarutiKrushiSevaKendra Pvt. Ltd.</h5>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your Address<br />
                    City, State - Pin Code
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-700 rounded-full p-1.5 shrink-0">
                    <MessageCircle size={14} className="text-white" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-800 text-xs">{footer.email}</span>
                    <a href="mailto:[EMAIL_ADDRESS]" className="text-xs text-gray-500 hover:text-green-600">contact@marutikrushisevakendra.in</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-700 rounded-full p-1.5 shrink-0">
                    <Phone size={14} className="text-white" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-800 text-xs">{footer.customerCare}</span>
                    <a href="tel:08062180953" className="text-xs text-gray-500 hover:text-green-600">08062180953</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-800 text-white rounded-t-[2rem] md:rounded-t-full max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium">
        <p className="text-green-50">© {year} <strong className="text-white">MarutiKrushiSevaKendra Pvt. Ltd.</strong> {footer.rights}</p>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
          <Link to="/privacy" className="text-green-50 hover:text-white transition-colors">{footer.privacy}</Link>
          <Link to="/terms" className="text-green-50 hover:text-white transition-colors">{footer.terms}</Link>
          <Link to="/contact" className="text-green-50 hover:text-white transition-colors">{footer.support}</Link>
          <Link to="/admin/login" className="text-green-200 hover:text-white transition-colors border-l border-green-700 pl-4 md:pl-6 ml-0 md:ml-2">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
