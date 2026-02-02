import React, { useEffect, useState } from 'react';
import logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';

// Lazy load images to reduce initial bundle
const image_1 = () => import('../../assets/refined/DirectorTwo.jpeg').then(m => m.default);
const image_2 = () => import('../../assets/img5000.jpg').then(m => m.default);
const image_3 = () => import('../../assets/img4954.jpg').then(m => m.default);
const image_4 = () => import('../../assets/babs04.jpg').then(m => m.default);
const image_5 = () => import('../../assets/img4935.jpg').then(m => m.default);
const image_6 = () => import('../../assets/refined/dataAnalysisInstructor.jpeg').then(m => m.default);
const image_7 = () => import('../../assets/refined/zionStaffsTwo.jpeg').then(m => m.default);
const image_8 = () => import('../../assets/refined/classroomFour.jpeg').then(m => m.default);
const image_9 = () => import('../../assets/refined/classroom.jpeg').then(m => m.default);
const image_10 = () => import('../../assets/refined/DirectorThree.jpeg').then(m => m.default);
const image_11 = () => import('../../assets/refined/onboarding.jpeg').then(m => m.default);
const image_12 = () => import('../../assets/img4925.jpg').then(m => m.default);

const ParallaxSection = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1, 2, 3])); // Load first 4 images initially
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Preload image URLs when component mounts
  useEffect(() => {
    const imageLoaders = [image_1, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9, image_10, image_11, image_12];
    
    Promise.all(imageLoaders.map(async (loader, idx) => {
      try {
        const url = await loader();
        setImageUrls(prev => {
          const updated = [...prev];
          updated[idx] = url;
          return updated;
        });
      } catch (err) {
        console.error(`Failed to load image ${idx}`, err);
      }
    }));
  }, []);

  // Lazy load remaining images with IntersectionObserver
  useEffect(() => {
    const imageElements = document.querySelectorAll('[data-image-index]');
    const observer = new IntersectionObserver((entries) => {
      const newLoaded = new Set(loadedImages);
      let changed = false;
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-image-index') || '-1');
          if (index !== -1 && !loadedImages.has(index)) {
            newLoaded.add(index);
            changed = true;
          }
        }
      });
      
      if (changed) {
        setLoadedImages(newLoaded);
      }
    }, { rootMargin: '100px' });

    imageElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loadedImages]);

  // Grid images (3 rows x 2 columns = 6 images)
  const gridImages = [
    { url: 0, span: "col-span-1 row-span-1" },
    { url: 1, span: "col-span-1 row-span-1" },
    { url: 2, span: "col-span-1 row-span-1" },
    { url: 3, span: "col-span-1 row-span-1" },
    { url: 4, span: "col-span-1 row-span-1" },
    { url: 5, span: "col-span-1 row-span-1" },
  ];

  // Carousel images (fully duplicated for seamless continuous loop)
  const carouselImages = [6, 7, 8, 9, 10, 11, 6, 7, 8, 9, 10, 11, 6, 7, 8, 9, 10, 11, 6, 7, 8, 9, 10, 11];

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Text with matching height */}
          <div className="flex flex-col justify-center h-full">
            <div className="flex items-center py-10 gap-2">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={logo} className="h-full w-full object-cover" alt="Zion Logo" />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="font-bold text-2xl text-blue-900">Zion Study Centre</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-gray-800 leading-relaxed">
              <h1 className="text-4xl font-bold mb-6">HISTORY</h1>

              <p className="text-lg">
                <span className="font-serif italic">Zion Study Centre and Leadership Academy Limited</span> was born in the year 2002 and incorporated after 10 years. It's more than an extra-moral education center; it's a study center with a great vision.
              </p>
              
              <p className="text-lg">
                Our commitment is to provide excellent learning experiences, using modern teaching approaches and a dedicated team of educators to guide students toward success in their academic journeys and beyond.
              </p>
              
              <p className="text-lg">
                Through innovation, quality, and dedication, we strive to create an inclusive environment where students can thrive, explore, and reach their fullest potential.
              </p>
              
              <p className="text-lg">
                Join us at Zion Study Centre and Leadership Academy, where every student's journey matters, and we are invested in their future achievements.
              </p>

              <Link to="/about" className="pt-4 inline-block">
                <button className="border-2 border-red-700 text-red-700 px-6 py-3 hover:bg-red-700 hover:text-white transition-colors duration-300">
                  Learn more about our history
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side - Image Grid + Carousel */}
          <div className="flex flex-col gap-8">
            {/* Grid Section - 3 rows x 2 columns */}
            <div className="grid grid-cols-2 gap-4 auto-rows-[150px]">
              {gridImages.map((img, index) => (
                <div 
                  key={index} 
                  data-image-index={img.url}
                  className={`${img.span} relative rounded-lg overflow-hidden shadow-lg`}
                >
                  {loadedImages.has(img.url) && imageUrls[img.url] ? (
                    <img 
                      src={imageUrls[img.url]} 
                      alt={`Gallery image ${img.url + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  )}
                </div>
              ))}
            </div>

            {/* Carousel Section - Moving right to left */}
            <div className="overflow-hidden bg-white rounded-lg">
              <style>{`
                @keyframes scroll-left {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-1200%);
                  }
                }
                .carousel-container {
                  display: flex;
                  animation: scroll-left 120s linear infinite;
                }
                .carousel-container:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="carousel-container">
                {carouselImages.map((imgIdx, index) => (
                  <div 
                    key={index} 
                    data-image-index={imgIdx}
                    className="flex-shrink-0 w-1/2 h-[200px]"
                  >
                    {loadedImages.has(imgIdx) && imageUrls[imgIdx] ? (
                      <img 
                        src={imageUrls[imgIdx]} 
                        alt={`Carousel image ${imgIdx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxSection;