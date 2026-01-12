import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, GraduationCap, Award, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getPrograms, getGalleryItems, Program, GalleryItem } from '../services/api';

// Only keep static pages here. Courses and Gallery items will be fetched.
const staticSearchData = [
  { title: "Technology & Computer Academy", type: "Category", path: "/programs/technology", icon: BookOpen },
  { title: "International Exams", type: "Category", path: "/programs/international-exams", icon: GraduationCap },
  { title: "Secondary School Preparation", type: "Category", path: "/programs/secondary-exams", icon: Award },
  { title: "About Us", type: "Page", path: "/about", icon: ArrowRight },
<<<<<<< HEAD
=======
  { title: "Blog", type: "Page", path: "/blog", icon: ArrowRight },
>>>>>>> 97b6d22c93b8a8b33b0132ef20a875b26d38a70b
  { title: "Contact Us", type: "Page", path: "/contact", icon: ArrowRight },
  { title: "Register", type: "Page", path: "/register", icon: ArrowRight },
  { title: "Admissions", type: "Page", path: "/register", icon: ArrowRight },
  { title: "Gallery", type: "Page", path: "/gallery", icon: ArrowRight },
];

interface SearchItem {
  title: string;
  type: string;
  path: string;
  icon: React.ElementType;
}

interface SearchCourseProps {
  onClose?: () => void;
}

export const SearchCourse: React.FC<SearchCourseProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState<SearchItem[]>(staticSearchData);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programsData, galleryData] = await Promise.all([
          getPrograms(),
          getGalleryItems()
        ]);

        const programItems: SearchItem[] = programsData.map((program: Program) => ({
          title: program.title,
          type: "Course",
          path: `/programs/${program.code || program._id}`,
          icon: BookOpen
        }));

        const galleryItems: SearchItem[] = galleryData.map((item: GalleryItem) => ({
          title: item.title,
          type: "Gallery",
          path: "/gallery", 
          icon: ImageIcon
        }));

        setAllItems([...staticSearchData, ...programItems, ...galleryItems]);
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0]);
    }
  };

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    if (onClose) onClose();
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
<<<<<<< HEAD
    <div className="relative h-110 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 ">
=======
    <div className="shadow-lg relative w-full h-110 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 ">
>>>>>>> 97b6d22c93b8a8b33b0132ef20a875b26d38a70b
      {/* Close Button for Modal Context */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors"
        >
          <X size={32} />
        </button>
      )}

      {/* Decorative curved lines */}
      <div className="absolute top-0 right-0 w-96 h-96">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          <path
            d="M 400 0 Q 300 100 400 200"
            stroke="#ef4444"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-full h-64">
        <svg className="w-full h-full" viewBox="0 0 1600 300">
          <path
            d="M 1600 150 Q 1400 50 1200 150 T 800 150"
            stroke="#ef4444"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-between">
        {/* Left side - Hero text */}
        <div className="max-w-xl hidden md:block">
          <h1 className="text-6xl font-serif text-white mb-4 leading-tight">
            Join the Zion class
          </h1>
<<<<<<< HEAD
          <p className="text-white text-lg mb-6">Study with us</p>
=======
>>>>>>> 97b6d22c93b8a8b33b0132ef20a875b26d38a70b
          <button className="text-white border-b-2 border-red-500 pb-1 hover:border-red-400 transition-colors">
            Find out more
          </button>
        </div>

        {/* Right side - Search box */}
        <div className="w-full max-w-2xl ml-auto relative" ref={wrapperRef}>
          <form onSubmit={handleSearch} className="flex shadow-lg relative z-20">
            <input
              type="text"
              placeholder="Search for courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white px-6 py-8 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 transition-colors"
              aria-label="Search"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </form>

          {/* Dropdown Results */}
          {showDropdown && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto z-30">
              <div className="py-2">
                {results.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation links */}
          <div className="flex gap-6 mt-6 flex-wrap">
            <Link
              to="/programs/technology"
              className="text-white hover:text-gray-300 transition-colors hover:border-b border-white pb-1"
            >
              Technology Courses
            </Link>
            <Link
              to="/programs/international-exams"
              className="text-white hover:text-gray-300 hover:border-b transition-colors border-white pb-1"
            >
              International courses
            </Link>
            <Link
              to="/programs/secondary-exams"
              className="text-white hover:text-gray-300 hover:border-b transition-colors border-white pb-1"
            >
              Secondary School Prep
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCourse;