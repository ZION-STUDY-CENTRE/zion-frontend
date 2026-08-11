import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, GraduationCap, Award, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getPrograms, getGalleryItems, Program, GalleryItem } from '../services/api';

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const fuzzyMatches = (query: string, text: string): boolean => {
  const normalizedQuery = normalizeText(query).replace(/\s+/g, '');
  const normalizedText = normalizeText(text).replace(/\s+/g, '');

  if (!normalizedQuery || !normalizedText) {
    return false;
  }

  if (normalizedText.includes(normalizedQuery)) {
    return true;
  }

  const threshold = Math.max(1, Math.floor(normalizedText.length * 0.25));
  return levenshteinDistance(normalizedQuery, normalizedText) <= threshold;
};

// Only keep static pages here. Courses and Gallery items will be fetched.
const staticSearchData = [
  { title: "Technology & Computer Academy", type: "Category", path: "/programs/technology", icon: BookOpen },
  { title: "International Exams", type: "Category", path: "/programs/international-exams", icon: GraduationCap },
  { title: "Secondary School Preparation", type: "Category", path: "/programs/secondary-exams", icon: Award },
  { title: "About Us", type: "Page", path: "/about", icon: ArrowRight },
  { title: "Blog", type: "Page", path: "/blog", icon: ArrowRight },
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
          path: `/course/${program.code || program._id}`,
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
      const filtered = allItems.filter(item => fuzzyMatches(searchQuery, item.title));
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
    <div className="shadow-lg relative w-full h-110 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 ">
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
     
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-between">
        {/* Left side - Hero text */}
        <div className="max-w-full hidden md:block">
          <h1 className="text-6xl font-serif text-white mb-4 leading-tight">
            Join the Zion class
          </h1>
          <button className="text-white border-b-2 border-red-500 pb-1 hover:border-red-400 transition-colors">
            Find out more
          </button>
        </div>

        {/* Right side - Search box */}
        <div className="w-full max-w-2xl ml-auto relative" ref={wrapperRef}>
          <form onSubmit={handleSearch} className="flex shadow-lg overflow-hidden relative z-20">
            <input
              type="text"
              placeholder="Search for courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white pl-6 py-8 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-2 md:px-8 py-4 transition-colors"
              aria-label="Search"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </form>

          {/* Dropdown Results */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto z-30">
              <div className="py-2">
                {results.length > 0 ? (
                  results.map((item, index) => (
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
                  ))
                ) : (
                  <div className="px-6 py-6 text-center text-gray-600">
                    No results found for "{searchQuery}". Try a different spelling or keyword.
                  </div>
                )}
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