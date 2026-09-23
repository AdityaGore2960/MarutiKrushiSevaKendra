import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import DealCard from '../components/DealCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getProducts } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';

const BioInsecticidesLocalizedContent = ({ page }) => (
  <div className="mt-16 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm text-gray-600 space-y-6">
    {page.sections.map((section) => (
      <section key={section.heading}>
        <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
        {section.paragraphs?.map((paragraph) => <p key={paragraph} className="text-sm leading-relaxed mb-2">{paragraph}</p>)}
        {section.items && <ul className="list-disc pl-5 text-sm space-y-1">{section.items.map((item) => <li key={Array.isArray(item) ? item[0] : item}>{Array.isArray(item) ? <><strong>{item[0]}</strong> {item[1]}</> : item}</li>)}</ul>}
      </section>
    ))}
    <section>
      <h3 className="text-lg font-bold text-gray-900 mb-3">{page.faqTitle}</h3>
      <div className="space-y-4">{page.faq.map(([question, answer]) => <div key={question}><h4 className="font-semibold text-gray-800 text-sm">{question}</h4><p className="text-sm text-gray-600 mt-1">{answer}</p></div>)}</div>
    </section>
    <div className="pt-4 border-t border-gray-100"><p className="text-xs text-gray-400 italic">{page.disclaimer}</p></div>
  </div>
);

const BioInsecticides = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const page = t('bioInsecticidesPage');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getProducts({ categorySlug: 'bio-insecticides' })
      .then((res) => setProducts(res.data.data))
      .catch((err) => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> {t('Back')}
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-8">
          {t('BioInsecticides')}
        </h1>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <DealCard key={prod._id} deal={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-gray-500 text-sm font-medium">{t('bioInsecticidesPage.noProducts')}</p>
          </div>
        )}
        
        {/* SEO / Extra Content Section */}
        {language === 'mr' ? <BioInsecticidesLocalizedContent page={page} /> : <div className="mt-16 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Buy Vegetable Seeds Online in India</h2>
            <p className="text-sm leading-relaxed">Grow fresh, healthy and high-quality vegetables with the right seeds. At MarutiKrushiSevaKendra, you can buy vegetable seeds online for commercial farming, kitchen gardening, terrace gardening and home cultivation. Explore a wide selection of hybrid, improved and open-pollinated vegetable seeds from trusted agricultural brands.</p>
            <p className="text-sm leading-relaxed mt-2">Our vegetable seed collection includes popular crops suitable for different seasons, soil conditions and growing regions across India. Farmers can compare available varieties and select seeds according to crop duration, yield potential, fruit quality, disease tolerance and local climatic conditions.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Shop Vegetable Seeds by Crop</h3>
            <p className="text-sm leading-relaxed">Choose seeds for frequently grown vegetables such as tomato, chilli, brinjal, okra, onion, cabbage, cauliflower, cucumber, bottle gourd, bitter gourd, ridge gourd, sponge gourd, pumpkin, watermelon, muskmelon, carrot, radish, beetroot, coriander, spinach, peas, beans and many more.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Vegetable Seeds for Every Growing Requirement</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Hybrid Vegetable Seeds:</strong> Selected for uniform growth, desirable produce quality and high yield potential.</li>
              <li><strong>Open-Pollinated Seeds:</strong> Suitable for farmers and gardeners looking for traditional and naturally pollinated varieties.</li>
              <li><strong>Commercial Farming Seeds:</strong> Varieties suitable for larger cultivation areas and market-oriented vegetable production.</li>
              <li><strong>Kitchen Garden Seeds:</strong> Convenient seed options for growing vegetables at home, on terraces or in small garden spaces.</li>
              <li><strong>Seasonal Vegetable Seeds:</strong> Varieties available for Kharif, Rabi, summer and year-round cultivation, depending on local conditions.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Benefits of Choosing Quality Vegetable Seeds</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Better germination and healthy crop establishment</li>
              <li>Uniform plant growth and produce development</li>
              <li>Improved yield and marketable crop quality</li>
              <li>Availability of varieties suitable for different regions and seasons</li>
              <li>Options with desirable colour, shape, size, taste and shelf life</li>
              <li>Reduced risk associated with poor-quality or unidentified seeds</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How to Select the Right Vegetable Seeds</h3>
            <p className="text-sm leading-relaxed">Before purchasing vegetable seeds, consider the recommended sowing season, climate, soil type, irrigation availability, crop duration and cultivation method. Farmers should also check important varietal characteristics such as germination, plant habit, maturity period, expected yield, produce quality, disease tolerance and suitability for local market demand.</p>
            <p className="text-sm leading-relaxed mt-2">Always read the product description and seed packet label carefully before sowing. Recommended seed rate, spacing and cultivation practices may vary according to the crop, variety, location and growing conditions.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Why Buy Vegetable Seeds from MarutiKrushiSevaKendra?</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Wide range of vegetable crops and varieties</li>
              <li>Seeds from trusted and recognised agricultural brands</li>
              <li>Suitable options for farmers and home gardeners</li>
              <li>Convenient online ordering from anywhere in India</li>
              <li>Delivery to villages, towns and cities across serviceable locations</li>
              <li>Multiple pack sizes and price options where available</li>
              <li>Cash on Delivery available on eligible orders</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Order Vegetable Seeds Online</h3>
            <p className="text-sm leading-relaxed">Browse the collection and order vegetable seeds online according to your crop, season and farming requirements. Whether you need tomato seeds for commercial cultivation, chilli seeds for high-quality production, gourd seeds for seasonal farming or mixed vegetable seeds for a kitchen garden, MarutiKrushiSevaKendra helps you find suitable options in one place.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Which vegetable seeds are available online?</h4>
                <p className="text-sm text-gray-600 mt-1">You can shop for seeds of tomato, chilli, brinjal, okra, onion, cucumber, cabbage, cauliflower, gourds, leafy vegetables, root vegetables, beans, peas, melons and several other vegetable crops.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Are these seeds suitable for commercial farming?</h4>
                <p className="text-sm text-gray-600 mt-1">Many varieties are intended for commercial cultivation, while some are also suitable for kitchen gardens and small growing spaces. Check the individual product details before purchasing.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">How should I choose a vegetable seed variety?</h4>
                <p className="text-sm text-gray-600 mt-1">Select a variety based on your location, sowing season, crop duration, cultivation method, disease conditions and local market requirements. Follow the manufacturer's recommendations printed on the seed packet.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Can vegetable seeds be delivered to villages?</h4>
                <p className="text-sm text-gray-600 mt-1">MarutiKrushiSevaKendra delivers to many serviceable village, town and city PIN codes across India. Delivery availability can be checked using the destination PIN code.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Does MarutiKrushiSevaKendra provide Cash on Delivery?</h4>
                <p className="text-sm text-gray-600 mt-1">Cash on Delivery may be available for eligible products and serviceable PIN codes. Available payment options are displayed during checkout.</p>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 italic">Disclaimer: Seed germination and crop performance depend on seed quality as well as soil, climate, irrigation, sowing practices, storage conditions and crop management. Always follow the instructions printed on the product label and seek guidance from a local agriculture expert when required.</p>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default BioInsecticides;
