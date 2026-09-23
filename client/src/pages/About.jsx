import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

const About = () => {
  useEffect(() => {
    document.title = `About Us | ${STORE_CONFIG.name}`;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <section className="mt-8 rounded-[2.5rem] bg-emerald-950 p-5 sm:p-8 md:p-10 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-8 items-stretch min-h-[570px]">
          <div className="flex flex-col justify-between p-2 sm:p-4 md:p-6">
            <div>
              <div className="inline-flex items-center gap-2 text-green-100 text-sm font-semibold mb-8">
                <Sprout size={18} />
                MarutiKrushiSevaKendra
              </div>
              <h1 className="max-w-xl text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                Making agri shopping simpler, safer and more reliable.
              </h1>
              <p className="max-w-xl mt-6 text-green-50 text-base md:text-lg leading-relaxed">
                MarutiKrushiSevaKendra started with one clear goal: farmers should be able to buy genuine agri products with confidence, understand what they are buying, and get support when it matters.
              </p>
            </div>

            <Link
              to="/products"
              id="about-explore-products"
              className="mt-10 inline-flex items-center justify-center gap-2 w-fit rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-green-700 hover:bg-green-50 transition-colors"
            >
              Explore Products <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-[2rem] bg-white p-6 sm:p-8 border border-white/70 shadow-lg text-gray-900 flex flex-col justify-between">
            <div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <CheckCircle2 size={19} />
                  <span className="text-xs font-extrabold uppercase tracking-[0.14em]">Our promise</span>
                </div>
                <h2 className="text-2xl font-extrabold mb-3">Genuine products, clearer choices</h2>
                <p className="text-gray-600 leading-relaxed">
                  We focus on verified sellers, product information and practical buying support.
                </p>
              </div>

              <div className="rounded-xl bg-green-50 border border-green-100 p-4 ">
                <div className="flex items-center gap-2 text-green-700 mb-3">
                  <CheckCircle2 size={19} />
                  <span className="text-xs font-extrabold uppercase tracking-[0.14em]">Built for farmers</span>
                </div>
                <h2 className="text-2xl font-extrabold mb-3">Designed around real farm needs</h2>
                <p className="text-gray-600 leading-relaxed">
                  From seeds to crop protection, the platform is built for day-to-day agri decisions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-gray-100">
              <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-green-700 mb-2">Our start</p>
                <h3 className="text-base font-extrabold text-gray-900">Started journey</h3>
                <span className="block mt-2 text-2xl font-black text-green-700">2024</span>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-green-700 mb-2">Our community</p>
                <h3 className="text-base font-extrabold text-gray-900">Growing with farmers</h3>
                <span className="block mt-2 text-2xl font-black text-green-700">2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2.5rem] bg-green-50/70 border border-green-100 p-5 sm:p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-700 mb-3">Our Journey</p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight text-gray-900">
              From a small idea in 2021 to a stronger agri platform in 2026.
            </h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed md:max-w-sm">
            The journey has been about solving practical problems one by one: product trust, seller coordination, shipment visibility, customer support and better product discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { year: '2021', title: 'The starting point', text: 'MarutiKrushiSevaKendra began with the mission to make genuine agri inputs easier to access for farmers.' },
            { year: '2022', title: 'Building trust', text: 'We focused on seller onboarding, product listing quality and transparent product information.' },
            { year: '2023', title: 'Better fulfilment', text: 'Order workflows, seller approvals and shipment tracking became a core part of operations.' },
            { year: '2024', title: 'Support at scale', text: 'We improved customer support, delivery visibility and issue handling for smoother buying.' },
            { year: '2025', title: 'Smarter systems', text: 'Search, inventory, seller panels and internal operations became faster and more organized.' },
            { year: '2026', title: 'Farmer-first growth', text: 'We are strengthening automation, product discovery and service quality for the next stage.' },
          ].map(({ year, title, text }) => (
            <div
              key={year}
              className="min-h-[390px] rounded-[1.75rem] bg-white border border-gray-200 p-6 shadow-sm flex flex-col"
            >
              <span className="inline-flex items-center justify-center w-fit rounded-full bg-emerald-950 px-5 py-3 text-lg font-extrabold text-white">
                {year}
              </span>
              <div className="h-1 rounded-full bg-gradient-to-r from-green-600 to-amber-400 mt-5 mb-6" />
              <h3 className="text-xl font-extrabold leading-tight text-gray-900 mb-4">{title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Believe */}
      <section className="mt-8 rounded-[2.5rem] bg-emerald-950 p-5 sm:p-8 md:p-10 text-white">
        {/* Large headline */}
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-400 mb-4">What We Believe</p>
        <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-white max-w-4xl mb-10">
          A marketplace should earn trust before it earns orders.
        </h2>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left — large square card */}
          <div className="rounded-[2rem] bg-white/10 border border-white/20 p-8 flex flex-col justify-between min-h-[320px]">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug mb-6">
              Farmers need confidence, not confusion.
            </h3>
            <p className="text-green-100 text-base md:text-lg leading-relaxed">
              Agri products are not impulse purchases. A farmer needs the right product, right pack size, genuine source, clear price and support if something goes wrong. That is the experience we are building.
            </p>
          </div>

          {/* Right — two stacked cards */}
          <div className="flex flex-col gap-5">
            <div className="rounded-[2rem] bg-white/10 border border-white/20 p-8 flex-1 flex flex-col justify-between">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-400/20 mb-5">
                <span className="text-green-400 text-lg font-black">01</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white mb-3">Trust in product quality</h3>
                <p className="text-green-100 text-base leading-relaxed">
                  We work to keep product details, seller information and fulfilment checks clear and accountable.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/10 border border-white/20 p-8 flex-1 flex flex-col justify-between">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/20 mb-5">
                <span className="text-amber-400 text-lg font-black">02</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white mb-3">Support after ordering</h3>
                <p className="text-green-100 text-base leading-relaxed">
                  Order updates, issue tracking and customer communication are as important as the sale itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="mt-8 rounded-[2.5rem] bg-green-50/70 border border-green-100 p-5 sm:p-8 md:p-10">
        {/* Headline */}
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green-700 mb-4">How We Work</p>
        <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900 max-w-4xl mb-10">
          Simple for farmers. Structured for the team.
        </h2>

        {/* 4 step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[
            {
              num: '1',
              title: 'List useful products',
              text: 'We organize products with variants, pack sizes, pricing and details farmers can understand.',
            },
            {
              num: '2',
              title: 'Coordinate with sellers',
              text: 'Seller inventory, approval and fulfilment are managed so orders can move with better control.',
            },
            {
              num: '3',
              title: 'Track shipments',
              text: 'We monitor shipment status, pickup delays, delivery delays and issues that need action.',
            },
            {
              num: '4',
              title: 'Close the loop',
              text: 'Remarks, refunds, complaints and internal follow-ups help the team resolve problems faster.',
            },
          ].map(({ num, title, text }) => (
            <div
              key={num}
              className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-sm flex flex-col min-h-[280px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950 text-white text-lg font-black mb-6 shrink-0">
                {num}
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 mb-3 leading-snug">{title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Split card — promise left + values right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          {/* Left — promise card */}
          <div className="rounded-[2rem] bg-emerald-950 text-white p-8 flex flex-col justify-between min-h-[280px]">
            <h3 className="text-2xl md:text-3xl font-extrabold leading-snug mb-6">
              Our promise is practical, not fancy.
            </h3>
            <p className="text-green-100 text-base md:text-lg leading-relaxed">
              We want every farmer to feel that MarutiKrushiSevaKendra is a reliable partner: easy to search, easy to order, easy to contact and honest when support is needed.
            </p>
          </div>

          {/* Right — three value rows */}
          <div className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-sm flex flex-col gap-6 justify-center">
            {[
              {
                title: 'Genuine and relevant products',
                text: 'Products are organized around real crop and farming needs.',
              },
              {
                title: 'Better delivery visibility',
                text: 'Shipment tracking and issue monitoring help reduce silent delays.',
              },
              {
                title: 'Human support where needed',
                text: 'The system supports the team, but customer care remains personal and practical.',
              },
            ].map(({ title, text }, i) => (
              <div key={i} className={i !== 0 ? 'pt-6 border-t border-gray-100' : ''}>
                <h4 className="text-base font-extrabold text-gray-900 mb-1">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width CTA banner */}
        <div className="rounded-[2rem] bg-emerald-950 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-4">
              We are building MarutiKrushiSevaKendra for the farmer who expects better.
            </h2>
            <p className="text-green-100 text-base md:text-lg leading-relaxed">
              Better product information, better seller coordination, better delivery visibility and better support. That is the direction we are moving in for 2026 and beyond.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/products"
              id="about-shop-agri-products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-extrabold text-green-700 hover:bg-green-50 transition-colors whitespace-nowrap"
            >
              Shop Agri Products <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              id="about-contact-mksk"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 border border-white/30 px-6 py-3 text-sm font-extrabold text-white hover:bg-green-500 transition-colors whitespace-nowrap"
            >
              Contact MarutiKrushiSevaKendra
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
