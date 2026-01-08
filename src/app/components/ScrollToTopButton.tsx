import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`${
        isVisible ? 'block' : 'hidden'
      } bg-blue-900 text-white w-10 h-10 rounded-full fixed z-50 flex items-center justify-center bottom-5 left-1/2 transform -translate-x-1/2 hover:scale-110 cursor-pointer shadow-xl animate-bounce scroll-smooth transition-all duration-300`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}
