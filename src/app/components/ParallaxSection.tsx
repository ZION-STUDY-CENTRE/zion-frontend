import React, { useEffect, useRef } from 'react';
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

const ParallaxSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !leftContentRef.current || !rightContentRef.current) return;

      const section = sectionRef.current;
      const leftContent = leftContentRef.current;
      const rightContent = rightContentRef.current;

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top;
      const sectionHeight = sectionRect.height;
      const windowHeight = window.innerHeight;

      // Check if section is in view
      if (sectionTop > windowHeight || sectionTop + sectionHeight < 0) return;

      // Calculate how much of the section has been scrolled through
      // 0 = section just entering viewport from bottom
      // 1 = section has completely passed through viewport
      const scrollProgress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - windowHeight)));

      const leftContainer = leftContent.parentElement;
      const rightContainer = rightContent.parentElement;

      if (!leftContainer || !rightContainer) return;

      // Calculate maximum scroll distances
      // This ensures both sides reach the bottom of their container at the same time
      const leftMaxScroll = leftContent.scrollHeight - leftContainer.clientHeight;
      const rightMaxScroll = rightContent.scrollHeight - rightContainer.clientHeight;

      // Apply transforms - both scroll proportionally to their content
      leftContent.style.transform = `translateY(-${scrollProgress * leftMaxScroll}px)`;
      rightContent.style.transform = `translateY(-${scrollProgress * rightMaxScroll}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", span: "col-span-1 row-span-2" },
    { url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80", span: "col-span-1 row-span-2" },
    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", span: "col-span-2 row-span-1" },
    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", span: "col-span-1 row-span-1" },
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80", span: "col-span-1 row-span-2" },
    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", span: "col-span-1 row-span-1" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", span: "col-span-2 row-span-1" },
    { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80", span: "col-span-1 row-span-2" },
    { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", span: "col-span-1 row-span-2" },
    { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", span: "col-span-2 row-span-2" },
    { url: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&q=80", span: "col-span-1 row-span-1" },
    { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80", span: "col-span-1 row-span-1" },
  ];

  return (
    <div ref={sectionRef} className="min-h-[300vh] bg-gray-50 py-20">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-[80vh]">
            {/* Left Side - Slower Scroll */}
            <div className="relative overflow-hidden">
              <div 
                ref={leftContentRef}
                className="transition-transform duration-0 will-change-transform"
              >
                <div className="px-10">
                  <div className="flex items-center py-10 gap-2">
                        <div className="w-17 h-17 flex items-center justify-center">
                        <img src={logo} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col lg:hidden xl:flex">
                        <span className="font-bold text-2xl text-blue-900">Zion Study Centre</span>
                        </div>
                    </div>

                  {/* Content */}
                  <div className="space-y-6 text-gray-800 leading-relaxed">
                    <h1 className="text-4xl font-bold mb-6">HISTORY</h1>

                    <p className="text-3xl">
                      <span className="font-serif italic">Zion Study Centre and Leadership Academy (Limited)</span> was born in the year 2002 and incorporated after 10 years. It's more than an extra-moral education center; it's a study center with a great vision.
                    </p>
                    
                    <p className="text-3xl">
                      Our commitment is to provide excellent learning experiences, using modern teaching approaches and a dedicated team of educators to guide students toward success in their academic journeys and beyond.
                    </p>
                    
                    <p className="text-3xl">
                      Through innovation, quality, and dedication, we strive to create an inclusive environment where students can thrive, explore, and reach their fullest potential.
                    </p>
                    
                    <p className="text-3xl">
                      Join us at Zion Study Centre and Leadership Academy, where every student's journey matters, and we are invested in their future achievements.
                    </p>

                    <Link to="/about" className="pt-4">
                      <button className="border-2 border-red-700 text-red-700 px-6 py-3 hover:bg-red-700 hover:text-white transition-colors duration-300">
                        Learn more about our history
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Normal Scroll */}
            <div className="relative overflow-hidden">
              <div 
                ref={rightContentRef}
                className="transition-transform duration-0 will-change-transform"
              >
                <div className="grid grid-cols-2 gap-4 pb-20 auto-rows-[200px]">
                  {galleryImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`${img.span} relative rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      <img 
                        src={img.url} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxSection;