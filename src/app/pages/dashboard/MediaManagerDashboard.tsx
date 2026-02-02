import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createBlogPost, createGalleryItem, uploadImage, getPrograms, Program, getBlogPosts, getGalleryItems, deleteBlogPost, deleteGalleryItem, BlogPost, GalleryItem, getTestimonials, createTestimonial, deleteTestimonial, Testimonial } from '../../services/api';
import { Loader2, Upload, Plus, Image as ImageIcon, FileText, Trash2, Search, LogOut, Star, Clock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ChangePasswordDialog } from '../../components/ChangePasswordDialog';
import { NotificationBell } from '../../components/NotificationBell';
import { Pagination } from '../../components/Pagination';
import { getOptimizedImageUrl } from '../../../utils/cloudinaryOptimization';
import { showSuccess, showError, showConfirm, showWarning } from '../../../utils/sweetAlert';
import { ChatComponent } from '../../components/ChatComponent';

const ITEMS_PER_PAGE = 10;

export const MediaManagerDashboard = () => {
    const { user, logout } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(user?.isFirstLogin ? true : false);

    // Programs State for Department Dropdown
    const [programs, setPrograms] = useState<Program[]>([]);
    const [existingPosts, setExistingPosts] = useState<BlogPost[]>([]);
    const [existingGalleryItems, setExistingGalleryItems] = useState<GalleryItem[]>([]);
    const [existingTestimonials, setExistingTestimonials] = useState<Testimonial[]>([]);
    
    // Search State
    const [blogSearchQuery, setBlogSearchQuery] = useState('');
    const [gallerySearchQuery, setGallerySearchQuery] = useState('');
    const [testimonialSearchQuery, setTestimonialSearchQuery] = useState('');

    const [currentPageBlog, setCurrentPageBlog] = useState(1);
    const [currentPageGallery, setCurrentPageGallery] = useState(1);
    const [currentPageTestimonial, setCurrentPageTestimonial] = useState(1);

    const paginate = (items: any[], pageNumber: number) => {
        const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
        return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPageBlog]);

    const refreshData = async () => {
        try {
            const [postsData, galleryData, testimonialsData] = await Promise.all([
                getBlogPosts(),
                getGalleryItems(),
                getTestimonials()
            ]);
            setExistingPosts(postsData);
            setExistingGalleryItems(galleryData);
            setExistingTestimonials(testimonialsData);
        } catch (error) {
            console.error('Failed to fetch content:', error);
        }
    };

    useEffect(() => {
        const fetchProgramsData = async () => {
            try {
                const data = await getPrograms();
                setPrograms(data);
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            }
        };
        fetchProgramsData();
        refreshData();
    }, []);

    // Blog Form State
    const [blogTitle, setBlogTitle] = useState('');
    const [blogDesc, setBlogDesc] = useState('');
    const [blogShortDesc, setBlogShortDesc] = useState('');
    const [blogDept, setBlogDept] = useState('');
    const [blogType, setBlogType] = useState('upcoming-event');
    const [blogImage, setBlogImage] = useState<File | null>(null);
    const [blogDate, setBlogDate] = useState('');

    // Gallery Form State
    const [galleryTitle, setGalleryTitle] = useState('');
    const [galleryImage, setGalleryImage] = useState<File | null>(null);

    // Testimonial Form State
    const [testimonialName, setTestimonialName] = useState('');
    const [testimonialCourse, setTestimonialCourse] = useState('');
    const [testimonialRating, setTestimonialRating] = useState('5');
    const [testimonialText, setTestimonialText] = useState('');
    const [testimonialImage, setTestimonialImage] = useState<File | null>(null);

    const handleImageUpload = async (file: File, category: 'blog' | 'gallery') => {
        
        return await uploadImage(file, category);
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setMessage(null);

        try {
            let imageUrl = null;
            if (blogImage) {
                imageUrl = await handleImageUpload(blogImage, 'blog');
            }

            await createBlogPost({
                title: blogTitle,
                description: blogDesc,
                shortDescription: blogShortDesc,
                department: blogDept,
                type: blogType as any,
                image: imageUrl,
                timestamp: blogDate ? new Date(blogDate) : new Date()
            });

            setMessage({ type: 'success', text: 'Blog post created successfully!' });
            showSuccess('Success!', 'Blog post created successfully!');
            // Reset form
            setBlogTitle('');
            setBlogDesc('');
            setBlogShortDesc('');
            setBlogDept('');
            setBlogImage(null);
            setBlogDate('');
            refreshData();
        } catch (err: any) {
            showError('Error', err.message || 'Failed to create blog post');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        const confirmed = await showConfirm('Delete Blog Post', 'Are you sure you want to delete this post?', 'Yes, delete it!', 'Cancel');
        if (!confirmed) return;
        try {
            await deleteBlogPost(id);
            showSuccess('Success!', 'Blog post deleted successfully');
            refreshData();
        } catch (err: any) {
            showError('Error', err.message || 'Failed to delete post');
        }
    };

    const handleGallerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryImage) {
            showError('Please select an image', 'An image is required to add to the gallery');
            return;
        }

        setUploading(true);

        try {
            const imageUrl = await handleImageUpload(galleryImage, 'gallery');
            
            await createGalleryItem({
                title: galleryTitle,
                img: imageUrl
            });

            showSuccess('Success!', 'Gallery item uploaded successfully!');
            setGalleryTitle('');
            setGalleryImage(null);
            refreshData();
        } catch (err: any) {
            showError('Error', err.message || 'Failed to upload gallery item');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGalleryItem = async (id: string) => {
        const confirmed = await showConfirm('Delete Image', 'Are you sure you want to delete this image?', 'Yes, delete it!', 'Cancel');
        if (!confirmed) return;
        try {
            await deleteGalleryItem(id);
            showSuccess('Success!', 'Image deleted successfully');
            refreshData();
        } catch (err: any) {
            showError('Error', err.message || 'Failed to delete image');
        }
    };

    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        setMessage(null);

        try {
            let imageUrl = null;
            if (testimonialImage) {
                imageUrl = await handleImageUpload(testimonialImage, 'blog');
            }

            await createTestimonial({
                name: testimonialName,
                course: testimonialCourse,
                rating: parseInt(testimonialRating),
                text: testimonialText,
                image: imageUrl
            });

            setMessage({ type: 'success', text: 'Testimonial created successfully!' });
            showSuccess('Success!', 'Testimonial created successfully!');
            // Reset form
            setTestimonialName('');
            setTestimonialCourse('');
            setTestimonialRating('5');
            setTestimonialText('');
            setTestimonialImage(null);
            refreshData();
        } catch (err: any) {
            showError('Error', err.message || 'Failed to create testimonial');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        const confirmed = await showConfirm('Delete Testimonial', 'Are you sure you want to delete this testimonial?', 'Yes, delete it!', 'Cancel');
        if (!confirmed) return;
        try {
            await deleteTestimonial(id);
            showSuccess('Success!', 'Testimonial deleted successfully');
            refreshData();
        } catch (err: any) {
            showError('Error', err.message || 'Failed to delete testimonial');
        }
    };

    const handleLogout = async () => {
        const confirmed = await showConfirm('Logout', 'Are you sure you want to logout?', 'Yes, logout', 'Cancel');
        if (confirmed) {
            await logout();
        }
    };

    const filteredPosts = existingPosts.filter(post => 
        post.title.toLowerCase().includes(blogSearchQuery.toLowerCase())
    );

    const filteredGalleryItems = existingGalleryItems.filter(item => 
        item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase())
    );

    const filteredTestimonials = existingTestimonials.filter(testimonial => 
        testimonial.name.toLowerCase().includes(testimonialSearchQuery.toLowerCase()) ||
        testimonial.course.toLowerCase().includes(testimonialSearchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Media Manager Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <NotificationBell />
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>Change Password</Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                    <ChangePasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} />
                </div>

                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <Tabs defaultValue="blog" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="blog">
                            <FileText className="mr-2 h-4 w-4" />
                            Blog Content
                        </TabsTrigger>
                        <TabsTrigger value="gallery">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Gallery Images
                        </TabsTrigger>
                        <TabsTrigger value="testimonials">
                            <Star className="mr-2 h-4 w-4" />
                            Testimonials
                        </TabsTrigger>
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                    </TabsList>

                    <TabsContent value="blog">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Blog Post</CardTitle>
                                <CardDescription>Add a new event or activity to the blog page.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleBlogSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input id="title" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <select 
                                                id="department"
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={blogDept}
                                                onChange={e => setBlogDept(e.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select a Department</option>
                                                {programs.map((program) => (
                                                    <option key={program._id} value={program.title}>
                                                        {program.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <select 
                                                id="type"
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={blogType}
                                                onChange={e => setBlogType(e.target.value)}
                                            >
                                                <option value="upcoming-event">Upcoming Event</option>
                                                <option value="ongoing-activity">Ongoing Activity</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Input id="date" type="datetime-local" value={blogDate} onChange={e => setBlogDate(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shortDesc">Short Description</Label>
                                        <Input id="shortDesc" value={blogShortDesc} onChange={e => setBlogShortDesc(e.target.value)} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Full Description</Label>
                                        <Textarea id="description" value={blogDesc} onChange={e => setBlogDesc(e.target.value)} rows={5} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blogImage">Cover Image (Optional)</Label>
                                        <Input id="blogImage" type="file" accept="image/*" onChange={e => setBlogImage(e.target.files?.[0] || null)} />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={uploading}>
                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        {uploading ? 'Creating...' : 'Create Post'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="mt-8 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Blog Posts</h3>
                                    <p className="text-sm text-gray-600 mt-1">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</p>
                                </div>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Search posts..." 
                                        className="pl-10 border-gray-300" 
                                        value={blogSearchQuery} 
                                        onChange={e => setBlogSearchQuery(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {filteredPosts.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No blog posts found</p>
                                    <p className="text-gray-400 text-sm">Create your first blog post above to get started</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-4">
                                        {paginate(filteredPosts, currentPageBlog).map(post => (
                                            <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                                                <div className="p-5">
                                                    <div className="flex gap-4">
                                                        {/* Image Preview */}
                                                        {post.image && (
                                                            <div className="flex-shrink-0">
                                                                <img 
                                                                    src={post.image} 
                                                                    alt={post.title}
                                                                    className="h-24 w-24 rounded-lg object-cover shadow-sm"
                                                                />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Content */}
                                                        <div className="flex-grow">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="flex-grow">
                                                                    <h4 className="font-bold text-lg text-gray-900 line-clamp-2">{post.title}</h4>
                                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.description}</p>
                                                                    
                                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {post.department}
                                                                        </span>
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                                            {post.type === 'upcoming-event' ? '📅 Upcoming Event' : '🔄 Ongoing'}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            {new Date(post.timestamp).toLocaleDateString()} 
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Delete Button */}
                                                                <Button 
                                                                    variant="destructive" 
                                                                    size="sm"
                                                                    onClick={() => handleDeletePost(post._id)}
                                                                    className="flex-shrink-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    {filteredPosts.length > 0 && (
                                        <Pagination 
                                            currentPage={currentPageBlog}
                                            totalPages={Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)}
                                            onPageChange={setCurrentPageBlog}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="gallery">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Gallery Image</CardTitle>
                                <CardDescription>Add a new image to the gallery page.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleGallerySubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="galleryTitle">Image Title/Caption</Label>
                                        <Input id="galleryTitle" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="galleryImage">Image File</Label>
                                        <div className="flex items-center gap-4">
                                            <Input id="galleryImage" type="file" accept="image/*" onChange={e => setGalleryImage(e.target.files?.[0] || null)} required />
                                        </div>
                                    </div>

                                    {galleryImage && (
                                        <div className="mt-4 p-4 border rounded bg-gray-50 flex justify-center">
                                            <img src={URL.createObjectURL(galleryImage)} alt="Preview" className="max-h-64 rounded shadow-sm" />
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full" disabled={uploading}>
                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Existing Gallery Images</h3>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input 
                                        placeholder="Search by title..." 
                                        className="pl-8" 
                                        value={gallerySearchQuery} 
                                        onChange={e => setGallerySearchQuery(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {paginate(filteredGalleryItems, currentPageGallery).map(item => (
                                    <Card key={item._id} className="overflow-hidden">
                                        <div className="aspect-[4/3] relative group">
                                            <img src={getOptimizedImageUrl(item.img, 'gallery')} alt={item.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteGalleryItem(item._id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="font-medium text-sm truncate" title={item.title}>{item.title}</p>
                                        </div>
                                    </Card>
                                ))}
                                {filteredGalleryItems.length === 0 && <p className="text-gray-500 col-span-full">No gallery items found.</p>}
                            </div>
                            {filteredGalleryItems.length > 0 && (
                                <Pagination 
                                    currentPage={currentPageGallery}
                                    totalPages={Math.ceil(filteredGalleryItems.length / ITEMS_PER_PAGE)}
                                    onPageChange={setCurrentPageGallery}
                                />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="testimonials">
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Testimonial</CardTitle>
                                <CardDescription>Add a new student success story or testimonial.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="testimName">Student Name</Label>
                                            <Input id="testimName" value={testimonialName} onChange={e => setTestimonialName(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="testimCourse">Course/Program</Label>
                                            <select 
                                                id="testimCourse"
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={testimonialCourse} 
                                                onChange={e => setTestimonialCourse(e.target.value)} 
                                                required
                                            >
                                                <option value="">Select a program...</option>
                                                {programs.map(program => (
                                                    <option key={program._id} value={program.title}>
                                                        {program.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="testimRating">Rating</Label>
                                        <select 
                                            id="testimRating"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={testimonialRating}
                                            onChange={e => setTestimonialRating(e.target.value)}
                                        >
                                            <option value="5">★★★★★ 5 Stars</option>
                                            <option value="4">★★★★☆ 4 Stars</option>
                                            <option value="3">★★★☆☆ 3 Stars</option>
                                            <option value="2">★★☆☆☆ 2 Stars</option>
                                            <option value="1">★☆☆☆☆ 1 Star</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="testimText">Testimonial Text</Label>
                                        <Textarea id="testimText" value={testimonialText} onChange={e => setTestimonialText(e.target.value)} rows={4} placeholder="Write the testimonial here..." required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="testimImage">Student Photo (Optional)</Label>
                                        <Input id="testimImage" type="file" accept="image/*" onChange={e => setTestimonialImage(e.target.files?.[0] || null)} />
                                    </div>

                                    {testimonialImage && (
                                        <div className="mt-4 p-4 border rounded bg-gray-50 flex justify-center">
                                            <img src={URL.createObjectURL(testimonialImage)} alt="Preview" className="max-h-32 max-w-32 rounded-full shadow-sm" />
                                        </div>
                                    )}

                                    <Button type="submit" className="w-full" disabled={uploading}>
                                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        {uploading ? 'Creating...' : 'Add Testimonial'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Existing Testimonials</h3>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input 
                                        placeholder="Search by name..." 
                                        className="pl-8" 
                                        value={testimonialSearchQuery} 
                                        onChange={e => setTestimonialSearchQuery(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4">
                                {paginate(filteredTestimonials, currentPageTestimonial).map(testimonial => (
                                    <Card key={testimonial._id} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4 flex-1">
                                                {testimonial.image && (
                                                    <img src={getOptimizedImageUrl(testimonial.image, 'testimonial')} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-bold">{testimonial.name}</h4>
                                                    <p className="text-sm text-gray-500 mb-2">{testimonial.course}</p>
                                                    <div className="flex gap-1 mb-2">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-700 italic">"{testimonial.text}"</p>
                                                </div>
                                            </div>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteTestimonial(testimonial._id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                {filteredTestimonials.length === 0 && <p className="text-gray-500">No testimonials found.</p>}
                            </div>
                            {filteredTestimonials.length > 0 && (
                                <Pagination 
                                    currentPage={currentPageTestimonial}
                                    totalPages={Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE)}
                                    onPageChange={setCurrentPageTestimonial}
                                />
                            )}
                        </div>
                    </TabsContent>

                    {/* Chat Tab */}
                    <TabsContent value="chat">
                        <ChatComponent />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
