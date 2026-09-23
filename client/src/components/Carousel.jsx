import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ children, itemsToShow = 4, minWidth = 180, gap = 16, className = '' }) => {
  const trackRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = trackRef.current;
    const prev = prevRef.current;
    const next = nextRef.current;
    if (!el) return;

    const getItemWidth = () => {
      const first = el.querySelector(':scope > *');
      if (!first) return el.clientWidth;
      return first.offsetWidth + gap;
    };

    let itemWidth = getItemWidth();

    const update = () => {
      itemWidth = getItemWidth();
      setCanPrev(el.scrollLeft > 5);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };

    const onPrev = () => el.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    const onNext = () => el.scrollBy({ left: itemWidth, behavior: 'smooth' });

    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    prev && prev.addEventListener('click', onPrev);
    next && next.addEventListener('click', onNext);

    update();

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      prev && prev.removeEventListener('click', onPrev);
      next && next.removeEventListener('click', onNext);
    };
  }, [gap]);

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-4 px-1 py-2 overflow-x-auto scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
          {React.Children.map(children, (child) => (
            <div style={{ flex: `0 0 ${100 / itemsToShow}%`, maxWidth: `${100 / itemsToShow}%`, minWidth: `${minWidth}px` }} className="flex-shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      <button ref={prevRef} aria-label="Previous" className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full -ml-10 hidden md:flex items-center justify-center z-20 ${!canPrev ? 'opacity-40 pointer-events-none' : ''}`} style={{ transform: 'translateY(-50%) translateX(-8px)' }}>
        <ChevronLeft size={18} />
      </button>
      <button ref={nextRef} aria-label="Next" className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full -mr-10 hidden md:flex items-center justify-center z-20 ${!canNext ? 'opacity-40 pointer-events-none' : ''}`} style={{ transform: 'translateY(-50%) translateX(8px)' }}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Carousel;
