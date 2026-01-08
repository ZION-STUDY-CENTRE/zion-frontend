// Define the shape of a Program as expected by the frontend
// This mirrors the CourseDetail interface but handles the API response
export interface Program {
  _id: string;
  code: string; // This maps to 'id' in the frontend routing
  id?: string; // Optional, handled by mapper
  title: string;
  category: string;
  heroImage: string;
  imageUrl?: string;
  shortDescription: string;
  description?: string;
  overview: string;
  keyStats: {
    duration: string;
    studyMode: string;
    intakes: string[];
    certification: string;
  };
  schedule?: string;
  students?: number;
  modules: {
    title: string;
    description: string;
  }[];
  entryRequirements: string[];
  careerOpportunities: string[];
  instructors?: ({ _id: string; name: string; email: string; } | string)[];
  createdAt?: string;
}

export interface BlogPost {
  _id: string;
  id?: number | string;
  type: 'upcoming-event' | 'ongoing-activity';
  department: string;
  title: string;
  description: string;
  shortDescription: string;
  timestamp: string | Date; // API returns string usually
  image: string | null;
}

export interface GalleryItem {
  _id: string;
  id?: number | string;
  title: string;
  img: string;
  category?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://zionstudycentrewebsitebackend.onrender.com/api';

export const getPrograms = async (): Promise<Program[]> => {
  const response = await fetch(`${API_URL}/programs`);
  if (!response.ok) {
    throw new Error('Failed to fetch programs');
  }
  const data = await response.json();
  
  // Map backend '_id' and 'code' if necessary, but 'code' effectively becomes the routing 'id'
  return data.map((item: any) => ({
    ...item,
    id: item.code // Ensure 'id' exists for frontend compatibility
  }));
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await fetch(`${API_URL}/content/blog`);
  if (!response.ok) {
    throw new Error('Failed to fetch blog posts');
  }
  return response.json();
};

export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  const response = await fetch(`${API_URL}/content/gallery`);
  if (!response.ok) {
    throw new Error('Failed to fetch gallery items');
  }
  return response.json();
};

export const getProgramBySlug = async (slug: string): Promise<Program> => {
    // backend endpoint supports /api/programs/:id which can be code or _id
    const response = await fetch(`${API_URL}/programs/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch program');
    }
    const data = await response.json();
    return {
        ...data,
        id: data.code
    };
};

export const createProgram = async (programData: Partial<Program>, token: string): Promise<Program> => {
    const response = await fetch(`${API_URL}/programs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(programData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create program');
    }
    return await response.json();
};

export const updateProgram = async (id: string, programData: Partial<Program>, token: string): Promise<Program> => {
    const response = await fetch(`${API_URL}/programs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(programData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update program');
    }
    return await response.json();
};

export const deleteProgram = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/programs/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete program');
    }
};

export const uploadImage = async (file: File, token: string, category: 'programs' | 'blog' | 'gallery' | 'general' = 'general'): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/upload?category=${category}`, {
        method: 'POST',
        headers: {
            'x-auth-token': token
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
};

export const createBlogPost = async (postData: Partial<BlogPost>, token: string): Promise<BlogPost> => {
    const response = await fetch(`${API_URL}/content/blog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create blog post');
    }
    return response.json();
};

export const createGalleryItem = async (itemData: Partial<GalleryItem>, token: string): Promise<GalleryItem> => {
    const response = await fetch(`${API_URL}/content/gallery`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
        body: JSON.stringify(itemData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create gallery item');
    }
    return response.json();
};

export const deleteBlogPost = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/content/blog/${id}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to delete blog post');
    }
};

export const deleteGalleryItem = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/content/gallery/${id}`, {
        method: 'DELETE',
        headers: {
            'x-auth-token': token
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to delete gallery item');
    }
};

// --- User Management API ---

export const getUsers = async (token: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
};

export const getInstructorsList = async (token: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/users/instructors`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch instructors');
    return await response.json();
};

export const registerUser = async (userData: any, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to register user');
    return data;
};

export const updateUser = async (userId: string, userData: any, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update user');
    return data;
};

export const reactivateUser = async (userId: string, durationMonths: number, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/${userId}/reactivate`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ durationMonths })
    });
    if (!response.ok) throw new Error('Failed to reactivate user');
    return await response.json();
};

export const deleteUser = async (userId: string, token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to delete user');
    }
    return true;
};

export const sendEmail = async (type: 'contact' | 'admission', data: any) => {
    try {
        const response = await fetch(`${API_URL}/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, data }),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
