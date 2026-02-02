import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BlogPost, getBlogPosts } from '../services/api';
import zion from '../../assets/bk3.jpg';

export function PopUp() {

  const [isOpen, setIsOpen] = useState(false);
  const [latestPost, setLatestPost] = useState<BlogPost | null>(null);
  


  let delay = 2000;
  const storageKey = "zion_popup_seen_v1";

  useEffect(() => {

    const hasSeen = sessionStorage.getItem(storageKey);

    
    if (!hasSeen) {
        const timer = setTimeout(() => {
        setIsOpen(true);
        }, delay);
        return () => clearTimeout(timer);
    }
       
  }, [delay, storageKey]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem(storageKey, "true");
  };

  if (!isOpen) return null;

  
    const fetchData = async () => {
        
        const posts = await getBlogPosts().then(data => data).catch(err => {
            console.error("Failed to fetch data for popup", err);
            return [];
        });

        
        if (posts.length > 0) {
           // Sort by date descending
           const sorted = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
           setLatestPost(sorted[0]);
        }
    }

    fetchData();
  

  return (
    (latestPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out_forwards]"
            onClick={handleClose}
        />

        {/* Modal Card */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-[slideDown_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            
            {/* Close Button */}
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
                aria-label="Close popup"
            >
                <X size={20} className="text-gray-600" />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 h-100 relative bg-blue-900">
                 
                 <img 
                    src={latestPost && latestPost.image} 
                    alt="Announcement" 
                    loading="lazy"
                    className="w-full h-full object-cover"
                 /> 
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left bg-white">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4 w-fit">
                    Latest
                </span>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-serif">
                    {latestPost && latestPost.title }
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    {latestPost && latestPost.description }
                </p>
                
            </div>
        </div>
    </div>
    ))
  );
}
