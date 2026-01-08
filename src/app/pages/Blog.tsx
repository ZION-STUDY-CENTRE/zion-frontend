import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Filter, Loader2 } from 'lucide-react';
import { getBlogPosts, BlogPost } from '../services/api';
import { Pagination } from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

const BlogPostsComponent = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('upcoming-event');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

    const paginate = (items: any[], pageNumber: number) => {
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
        return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        // Backend returns string, but we want to manipulate as date. 
        // We will handle the date conversion in the render or helper.
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch blog posts', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get unique departments
  const departments = ['all', ...new Set(posts.map(post => post.department))];

  // Filter posts based on selected tab and department
  const filteredPosts = posts.filter(post => {
    const matchesTab = post.type === selectedTab;
    const matchesDepartment = selectedDepartment === 'all' || post.department === selectedDepartment;
    return matchesTab && matchesDepartment;
  });

  // Get latest 3 posts overall
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const PostCard = ({ post, isCompact = false }: { post: BlogPost; isCompact?: boolean }) => (
    <div className={`border-b border-gray-200 ${isCompact ? 'py-4' : 'py-6'} hover:bg-gray-50 transition-colors`}>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">{post.department}</span>
          </div>
          
          <h3 className={`font-bold text-gray-900 mb-2 ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {post.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatDate(post.timestamp)}
            </span>
          </div>
        </div>
        
        {post.image && (
          <div className="w-32 h-32 flex-shrink-0">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-12 flex justify-center items-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setSelectedTab('upcoming-event')}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'upcoming-event'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Events
              {selectedTab === 'upcoming-event' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
            
            <button
              onClick={() => setSelectedTab('ongoing-activity')}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'ongoing-activity'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ongoing Activities
              {selectedTab === 'ongoing-activity' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          </div>

          {/* Posts */}
          <div>
            {filteredPosts.length > 0 ? (
              paginate(filteredPosts, currentPage).map(post => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No posts found for this department.
              </div>
            )}
            {filteredPosts.length > 0 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-27 self-start">
          {/* Latest Posts */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
            <div className="space-y-1">
              {latestPosts.map(post => (
                <div key={post.id} className="border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center flex-shrink-0">
                      <Calendar size={16} className="text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{post.department}</p>
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departments Filter */}
          <div>
            <h2 className="text-xl font-bold mb-4">Departments</h2>
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept === 'all' ? 'All' : dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostsComponent;