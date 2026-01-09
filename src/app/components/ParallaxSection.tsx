import React, { useEffect, useRef } from 'react';
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

import image_1 from '../../assets/ict.jpg';
import image_2 from '../../assets/CANON/IMG_5000.JPG'; 
import image_3 from '../../assets/ZION IMG/IMG_9224.jpeg';
import image_4 from '../../assets/CANON/EXPORTS/IMAGES/BABS-04.jpg';
import image_5 from '../../assets/CANON/IMG_4935.JPG'; 
import image_6 from '../../assets/CANON/IMG_4954.JPG';
import image_7 from  '../../assets/CANON/IMG_5009.JPG';
import image_8 from '../../assets/ict.jpg';
import image_9 from '../../assets/ZION IMG/IMG_9222.jpeg'; 
import image_10 from '../../assets/CANON/IMG_4925.JPG';
import image_11 from '../../assets/ZION IMG/IMG_9220.jpeg'; 
import image_12 from '../../assets/CANON/IMG_5012.JPG';

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
    { url: image_1, span: "col-span-1 row-span-2" },
    { url: image_2, span: "col-span-1 row-span-2" },
    { url: image_3, span: "col-span-2 row-span-1" },
    { url: image_4, span: "col-span-1 row-span-1" },
    { url: image_5, span: "col-span-1 row-span-2" },
    { url: image_6, span: "col-span-1 row-span-1" },
    { url: image_7, span: "col-span-2 row-span-1" },
    { url: image_8, span: "col-span-1 row-span-2" },
    { url: image_9, span: "col-span-1 row-span-2" },
    { url: image_10, span: "col-span-2 row-span-2" },
    { url: image_11, span: "col-span-1 row-span-1" },
    { url: image_12, span: "col-span-1 row-span-1" },
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