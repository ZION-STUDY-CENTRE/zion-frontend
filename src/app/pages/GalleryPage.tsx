import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import logo from '../../assets/logo.png';
import { getGalleryItems, GalleryItem } from '../services/api';
import { Pagination } from '../components/Pagination';
import { getOptimizedImageUrl } from '../../utils/cloudinaryOptimization';

const ITEMS_PER_PAGE = 10;

// Algorithmic layout assignment
// Returns a grid class string based on the index to create an irregular "masonry" feel
function getSpanClass(index: number) {
  // Pattern cycle of 10 items
  const pattern = [
    'col-span-2 row-span-2', // 0: Big Large
    'col-span-1 row-span-1', // 1: Small
    'col-span-1 row-span-2', // 2: Tall
    'col-span-1 row-span-1', // 3: Small
    'col-span-2 row-span-1', // 4: Wide
    'col-span-1 row-span-1', // 5: Small
    'col-span-1 row-span-2', // 6: Tall
    'col-span-2 row-span-2', // 7: Big Large
    'col-span-1 row-span-1', // 8: Small
    'col-span-2 row-span-1', // 9: Wide
  ];
  
  return pattern[index % pattern.length];
}

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);  
  const [scrollY, setScrollY] = useState(0);

    useEffect(()=>{
       const onScroll = () => {
        setScrollY(window.scrollY);
      };
  
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll)
    }, [])


  const paginate = (items: any[], pageNumber: number) => {
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);


  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGalleryItems();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch gallery items', err);
        setError('Failed to load gallery items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  let shrink = Math.min(scrollY / 80, 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-900" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
         <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:px-8">
      <div className=" ">
        <div className="text-center mb-12 sticky lg:static top-25 bg-gray-50 py-6 z-10">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">ECHOES FROM</h1>
          <h1
            className="font-extrabold text-blue-900 mb-4 flex items-center justify-center"
            style={{
              fontSize: `calc(7rem - ${shrink * 4}rem)`, // from 9rem to 4rem
              transition: 'all 0.5s ease'
            }}
          >
            ZI
            <img
              src={logo}
              alt="Zion Logo"
              className="inline-block -mr-1"
              style={{
                width: `calc(6rem - ${shrink * 3}rem)`, // from 6rem to 4rem
                height: `calc(6rem - ${shrink * 3}rem)`,
                transition: 'all 0.5s ease'
              }}
            />
            N
          </h1>
          
          <h1 className="text-4xl font-extrabold text-blue-200 mb-4">Photo Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the vibrant atmosphere of Zion Study Centre through moments captured around our campus.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4 px-4 sm:px-6 grid-flow-dense pb-8">
            {paginate([...items], currentPage).map((item, index) => (
                <div
                    key={item._id || index}
                    className={`relative overflow-hidden rounded-xl shadow-md group ${getSpanClass(index)} ${index === 0 ? 'md:col-start-1 md:row-start-1' : ''} transition-all duration-300 hover:scale-[1.02]`}
                >
                    <img 
                        src={getOptimizedImageUrl(item.img, 'gallery')} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100">
                        <h3 className="text-white font-medium text-lg tracking-wide border-l-4 border-blue-500 pl-3">
                            {item.title}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
        {items.length > 0 && (
             <Pagination 
                currentPage={currentPage}
                totalPages={Math.ceil(items.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
            />
        )}
      </div>
    </div>
  );
}
