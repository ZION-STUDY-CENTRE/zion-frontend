import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getGalleryItems, GalleryItem } from '../services/api';

// Algorithmic layout assignment
// Returns a grid class string based on the index to create an irregular "masonry" feel
function getSpanClass(index: number) {
  // Pattern cycle of 10 items
  const pattern = [
    'md:col-span-2 md:row-span-2', // 0: Big Large
    'md:col-span-1 md:row-span-1', // 1: Small
    'md:col-span-1 md:row-span-2', // 2: Tall
    'md:col-span-1 md:row-span-1', // 3: Small
    'md:col-span-2 md:row-span-1', // 4: Wide
    'md:col-span-1 md:row-span-1', // 5: Small
    'md:col-span-1 md:row-span-2', // 6: Tall
    'md:col-span-2 md:row-span-2', // 7: Big Large
    'md:col-span-1 md:row-span-1', // 8: Small
    'md:col-span-2 md:row-span-1', // 9: Wide
  ];
  
  return pattern[index % pattern.length];
}

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Zion Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the vibrant atmosphere of Zion Study Centre through moments captured around our campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 grid-flow-dense">
            {[...items].map((item, index) => (
                <div
                    key={item._id || index}
                    className={`relative overflow-hidden rounded-xl shadow-md group ${getSpanClass(index)} ${index === 0 ? 'md:col-start-1 md:row-start-1' : ''} transition-all duration-300 hover:scale-[1.02]`}
                >
                    <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100">
                        <h3 className="text-white font-medium text-lg tracking-wide border-l-4 border-blue-500 pl-3">
                            {item.title}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
