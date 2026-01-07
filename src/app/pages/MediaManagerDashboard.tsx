import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createBlogPost, createGalleryItem, uploadImage, getPrograms, Program, getBlogPosts, getGalleryItems, deleteBlogPost, deleteGalleryItem, BlogPost, GalleryItem } from '../services/api';
import { Loader2, Upload, Plus, Image as ImageIcon, FileText, Trash2, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ChangePasswordDialog } from '../components/ChangePasswordDialog';

export const MediaManagerDashboard = () => {
    const { user, token } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    // Programs State for Department Dropdown
    const [programs, setPrograms] = useState<Program[]>([]);
    const [existingPosts, setExistingPosts] = useState<BlogPost[]>([]);
    const [existingGalleryItems, setExistingGalleryItems] = useState<GalleryItem[]>([]);
    
    // Search State
    const [blogSearchQuery, setBlogSearchQuery] = useState('');
    const [gallerySearchQuery, setGallerySearchQuery] = useState('');

    const refreshData = async () => {
        try {
            const [postsData, galleryData] = await Promise.all([
                getBlogPosts(),
                getGalleryItems()
            ]);
            setExistingPosts(postsData);
            setExistingGalleryItems(galleryData);
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

    const handleImageUpload = async (file: File, category: 'blog' | 'gallery') => {
        if (!token) throw new Error("No token");
        return await uploadImage(file, token, category);
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
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
            }, token);

            setMessage({ type: 'success', text: 'Blog post created successfully!' });
            // Reset form
            setBlogTitle('');
            setBlogDesc('');
            setBlogShortDesc('');
            setBlogDept('');
            setBlogImage(null);
            setBlogDate('');
            refreshData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to create blog post' });
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        if (!token) return;
        try {
            await deleteBlogPost(id, token);
            setMessage({ type: 'success', text: 'Blog post deleted successfully' });
            refreshData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete post' });
        }
    };

    const handleGallerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        if (!galleryImage) {
            setMessage({ type: 'error', text: 'Please select an image' });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const imageUrl = await handleImageUpload(galleryImage, 'gallery');
            
            await createGalleryItem({
                title: galleryTitle,
                img: imageUrl
            }, token);

            setMessage({ type: 'success', text: 'Gallery item uploaded successfully!' });
            setGalleryTitle('');
            setGalleryImage(null);
            refreshData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to upload gallery item' });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGalleryItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        if (!token) return;
        try {
            await deleteGalleryItem(id, token);
            setMessage({ type: 'success', text: 'Image deleted successfully' });
            refreshData();
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete image' });
        }
    };

    const filteredPosts = existingPosts.filter(post => 
        post.title.toLowerCase().includes(blogSearchQuery.toLowerCase())
    );

    const filteredGalleryItems = existingGalleryItems.filter(item => 
        item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Media Manager Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user?.name}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>Change Password</Button>
                    <ChangePasswordDialog isOpen={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} />
                </div>

                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <Tabs defaultValue="blog" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="blog">
                            <FileText className="mr-2 h-4 w-4" />
                            Blog Content
                        </TabsTrigger>
                        <TabsTrigger value="gallery">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Gallery Images
                        </TabsTrigger>
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

                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Existing Blog Posts</h3>
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input 
                                        placeholder="Search by title..." 
                                        className="pl-8" 
                                        value={blogSearchQuery} 
                                        onChange={e => setBlogSearchQuery(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4">
                                {filteredPosts.map(post => (
                                    <Card key={post._id} className="p-4 flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold">{post.title}</h4>
                                            <p className="text-sm text-gray-500">{post.department} - {new Date(post.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </Card>
                                ))}
                                {filteredPosts.length === 0 && <p className="text-gray-500">No blog posts found.</p>}
                            </div>
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
                                {filteredGalleryItems.map(item => (
                                    <Card key={item._id} className="overflow-hidden">
                                        <div className="aspect-[4/3] relative group">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
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
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
