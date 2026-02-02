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
  image: any;
}

export interface GalleryItem {
  _id: string;
  id?: number | string;
  title: string;
  img: string;
  category?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://zion-backend-og8z.onrender.com/api';

// Concurrency handling for Token Refresh
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const subscribeTokenRefresh = (cb: (success: boolean) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
};

// Helper for credentials & Auto-Refresh
const fetchWithCreds = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
    });

    // Check for 401 (Unauthorized) which implies Token Expiration
    if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                // Attempt to refresh token
                const refreshRes = await fetch(`${API_URL}/auth/refresh`, { 
                    method: 'POST', 
                    credentials: 'include' 
                });
                
                const success = refreshRes.ok;
                isRefreshing = false;
                onRefreshed(success);
                
                if (success) {
                    // Retry original request with new cookies
                    return fetch(url, { ...options, credentials: 'include' });
                }
            } catch (error) {
                isRefreshing = false;
                onRefreshed(false);
            }
            return response; // Return original 401 if refresh failed
        }

        // For subsequent requests that came in while refreshing
        return new Promise<Response>((resolve) => {
            subscribeTokenRefresh(async (success) => {
                if (success) {
                    resolve(await fetch(url, { ...options, credentials: 'include' }));
                } else {
                    resolve(response); // Resolve with original 401
                }
            });
        });
    }

    return response;
};

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

export const createProgram = async (programData: Partial<Program>, token?: string): Promise<Program> => {
    const response = await fetchWithCreds(`${API_URL}/programs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(programData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create program');
    }
    return await response.json();
};

export const updateProgram = async (id: string, programData: Partial<Program>, token?: string): Promise<Program> => {
    const response = await fetchWithCreds(`${API_URL}/programs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(programData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update program');
    }
    return await response.json();
};

export const deleteProgram = async (id: string, token?: string): Promise<void> => {
    const response = await fetchWithCreds(`${API_URL}/programs/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete program');
    }
};

export const uploadImage = async (file: File, category: 'programs' | 'blog' | 'gallery' | 'general' = 'general', token?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    console.log('📤 Starting image upload:', {
        filename: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
        category: category,
        apiUrl: `${API_URL}/upload?category=${category}`
    });

    try {
        const response = await fetchWithCreds(`${API_URL}/upload?category=${category}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Upload failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
                apiUrl: `${API_URL}/upload?category=${category}`
            });
            throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorData.message || JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        if (!data.imageUrl) {
            console.error('❌ No image URL in response:', data);
            throw new Error('No image URL returned from server');
        }
        
        console.log('✅ Image uploaded successfully:', {
            url: data.imageUrl,
            category: data.category,
            size: data.size,
            public_id: data.public_id
        });
        
        return data.imageUrl;
    } catch (error) {
        console.error('Image upload error:', error);
        throw error;
    }
};

export const createBlogPost = async (postData: Partial<BlogPost>, token?: string): Promise<BlogPost> => {
    const response = await fetchWithCreds(`${API_URL}/content/blog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create blog post');
    }
    return response.json();
};

export const createGalleryItem = async (itemData: Partial<GalleryItem>, token?: string): Promise<GalleryItem> => {
    const response = await fetchWithCreds(`${API_URL}/content/gallery`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to create gallery item');
    }
    return response.json();
};

export const deleteBlogPost = async (id: string, token?: string): Promise<void> => {
    const response = await fetchWithCreds(`${API_URL}/content/blog/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to delete blog post');
    }
};

export const deleteGalleryItem = async (id: string, token?: string): Promise<void> => {
    const response = await fetchWithCreds(`${API_URL}/content/gallery/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to delete gallery item');
    }
};

// --- User Management API ---

export const getUsers = async (token?: string): Promise<any[]> => {
    const response = await fetchWithCreds(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
};

export const getInstructorsList = async (token?: string): Promise<any[]> => {
    const response = await fetchWithCreds(`${API_URL}/users/instructors`);
    if (!response.ok) throw new Error('Failed to fetch instructors');
    return await response.json();
};

export const registerUser = async (userData: any, token?: string): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to register user');
    return data;
};

export const updateUser = async (userId: string, userData: any, token?: string): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Failed to update user');
    return data;
};

export const reactivateUser = async (userId: string, durationMonths: number, token?: string): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/users/${userId}/reactivate`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ durationMonths })
    });
    if (!response.ok) throw new Error('Failed to reactivate user');
    return await response.json();
};

export const deleteUser = async (userId: string, token?: string): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to delete user');
    }
    return true;
};

export const getMe = async (): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/auth/me`);
    if (!response.ok) throw new Error('Failed to fetch current user');
    return await response.json();
};

export const loginUser = async (credentials: any): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        const error = await response.json();
        const customError: any = new Error(error.msg || 'Login failed');
        customError.code = error.code;
        customError.email = error.email;
        throw customError;
    }
    return await response.json();
};

export const verifyEmail = async (token: string): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Verification failed');
    }
    return await response.json();
};

export const resendVerificationEmail = async (email: string): Promise<any> => {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to resend verification');
    }
    return await response.json();
};

export const changeInitialPassword = async (newPassword: string): Promise<any> => {
    const response = await fetchWithCreds(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to update password');
    }
    return await response.json();
};

export const logoutUser = async (): Promise<void> => {
    await fetchWithCreds(`${API_URL}/auth/logout`, { method: 'POST' });
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
            let errorMessage = 'Failed to send email';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                if (errorData.error) console.error("Server Error Details:", errorData.error);
            } catch (e) {
                // If response is not JSON
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("API sendEmail error:", error);
        throw error;
    }
};

export const getStudentProgram = async () => {
    const response = await fetchWithCreds(`${API_URL}/programs/student/my-program`);
    if (response.status === 404) return null;
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to fetch program');
    }
    return response.json();
};

export const getInstructorPrograms = async () => {
    const response = await fetchWithCreds(`${API_URL}/programs/instructor`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to fetch programs');
    }
    return response.json();
};

export const getProgramStudents = async (programId: string) => {
    const response = await fetchWithCreds(`${API_URL}/users/program/${programId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to fetch students');
    }
    return response.json();
};

export const changeOwnPassword = async (currentPassword: string, newPassword: string) => {
    const response = await fetchWithCreds(`${API_URL}/users/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!response.ok) {
         const error = await response.json();
        throw new Error(error.msg || 'Failed to change password');
    }
    return response.json();
};

// ============ ASSIGNMENTS API ============

export const getAssignments = async (programId: string) => {
    const response = await fetchWithCreds(`${API_URL}/assignments/program/${programId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch assignments');
    }
    return response.json();
};

export const getAssignment = async (assignmentId: string) => {
    const response = await fetchWithCreds(`${API_URL}/assignments/${assignmentId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch assignment');
    }
    return response.json();
};

export const createAssignment = async (assignmentData: any) => {
    const response = await fetchWithCreds(`${API_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create assignment');
    }
    return response.json();
};

export const updateAssignment = async (assignmentId: string, assignmentData: any) => {
    const response = await fetchWithCreds(`${API_URL}/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update assignment');
    }
    return response.json();
};

export const deleteAssignment = async (assignmentId: string) => {
    const response = await fetchWithCreds(`${API_URL}/assignments/${assignmentId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete assignment');
    }
    return response.json();
};

// ============ QUIZZES API ============

export const getQuizzes = async (programId: string) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/program/${programId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch quizzes');
    }
    return response.json();
};

export const getQuiz = async (quizId: string) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/${quizId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch quiz');
    }
    return response.json();
};

export const createQuiz = async (quizData: any) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create quiz');
    }
    return response.json();
};

export const updateQuiz = async (quizId: string, quizData: any) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/${quizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update quiz');
    }
    return response.json();
};

export const submitQuiz = async (quizId: string, submissionData: any) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit quiz');
    }
    return response.json();
};

export const getQuizSubmission = async (quizId: string) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/${quizId}/submission`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch submission');
    }
    return response.json();
};

export const getQuizSubmissions = async (quizId: string) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/${quizId}/submissions`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch submissions');
    }
    return response.json();
};

export const deleteQuiz = async (quizId: string) => {
    const response = await fetchWithCreds(`${API_URL}/quizzes/${quizId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete quiz');
    }
    return response.json();
};

// ============ FILE RESOURCES API ============

export const getFileResources = async (programId: string) => {
    const response = await fetchWithCreds(`${API_URL}/files/program/${programId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch files');
    }
    return response.json();
};

export const getFileResource = async (fileId: string) => {
    const response = await fetchWithCreds(`${API_URL}/files/${fileId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch file');
    }
    return response.json();
};

export const uploadFileResource = async (fileData: any) => {
    const response = await fetchWithCreds(`${API_URL}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload file');
    }
    return response.json();
};

export const updateFileResource = async (fileId: string, fileData: any) => {
    const response = await fetchWithCreds(`${API_URL}/files/${fileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update file');
    }
    return response.json();
};

export const recordDownload = async (fileId: string) => {
    const response = await fetchWithCreds(`${API_URL}/files/${fileId}/download`, {
        method: 'POST'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to record download');
    }
    return response.json();
};

export const deleteFileResource = async (fileId: string) => {
    const response = await fetchWithCreds(`${API_URL}/files/${fileId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete file');
    }
    return response.json();
};

// Assignment Submissions
export const submitAssignment = async (assignmentId: string, data: any) => {
    const response = await fetchWithCreds(`${API_URL}/assignment-submissions/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit assignment');
    }
    return response.json();
};

export const getMyAssignmentSubmission = async (assignmentId: string) => {
    const response = await fetchWithCreds(`${API_URL}/assignment-submissions/${assignmentId}/my-submission`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get submission');
    }
    return response.json();
};

export const getAssignmentSubmissions = async (assignmentId: string) => {
    const response = await fetchWithCreds(`${API_URL}/assignment-submissions/${assignmentId}/submissions`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get submissions');
    }
    return response.json();
};

export const gradeAssignmentSubmission = async (submissionId: string, data: any) => {
    const response = await fetchWithCreds(`${API_URL}/assignment-submissions/${submissionId}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to grade submission');
    }
    return response.json();
};

// Testimonials
export interface Testimonial {
    _id: string;
    id?: string;
    name: string;
    course: string;
    rating: number;
    text: string;
    image?: any;
    approved?: boolean;
    createdAt?: string;
}

export const getTestimonials = async () => {
    const response = await fetch(`${API_URL}/testimonials`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
    }
    return response.json();
};

export const createTestimonial = async (data: Omit<Testimonial, '_id' | 'id'>) => {
    const response = await fetchWithCreds(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create testimonial');
    }
    return response.json();
};

export const updateTestimonial = async (id: string, data: Partial<Testimonial>) => {
    const response = await fetchWithCreds(`${API_URL}/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update testimonial');
    }
    return response.json();
};

export const deleteTestimonial = async (id: string) => {
    const response = await fetchWithCreds(`${API_URL}/testimonials/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete testimonial');
    }
    return response.json();
};

// ================== CHAT APIs ==================

export const getConversations = async () => {
    const response = await fetchWithCreds(`${API_URL}/chat/conversations`);
    if (!response.ok) {
        throw new Error('Failed to fetch conversations');
    }
    return response.json();
};

export const getMessages = async (conversationId: string) => {
    const response = await fetchWithCreds(`${API_URL}/chat/conversations/${conversationId}/messages`);
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }
    return response.json();
};

export const createMessage = async (conversationId: string, text: string, fileUrl?: string, fileName?: string) => {
    const url = `${API_URL}/chat/messages`;
    console.log('[DEBUG] Creating message to:', url);
    const response = await fetchWithCreds(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, text, fileUrl, fileName })
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error('[ERROR] Response status:', response.status, 'Body:', errorText);
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
    }
    return response.json();
};

export const getOrCreateConversation = async (userId: string) => {
    const response = await fetchWithCreds(`${API_URL}/chat/or-create/${userId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to get or create conversation');
    }
    return response.json();
};

export const createGroupConversation = async (name: string, participantIds: string[]) => {
    const response = await fetchWithCreds(`${API_URL}/chat/group-conversation`, {
        method: 'POST',
        body: JSON.stringify({ name, participantIds })
    });
    if (!response.ok) {
        throw new Error('Failed to create group conversation');
    }
    return response.json();
};

export const getAllUsersForChat = async () => {
    const response = await fetchWithCreds(`${API_URL}/chat/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const deleteConversation = async (conversationId: string) => {
    const response = await fetchWithCreds(`${API_URL}/chat/conversations/${conversationId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete conversation');
    }
    return response.json();
};

// Notification APIs
export const getNotifications = async () => {
    const response = await fetchWithCreds(`${API_URL}/notifications`);
    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }
    return response.json();
};

export const getUnreadCount = async () => {
    const response = await fetchWithCreds(`${API_URL}/notifications/unread/count`);
    if (!response.ok) {
        throw new Error('Failed to fetch unread count');
    }
    return response.json();
};

export const markAsRead = async (notificationId: string) => {
    const response = await fetchWithCreds(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }
    return response.json();
};

export const markAllAsRead = async () => {
    const response = await fetchWithCreds(`${API_URL}/notifications/all/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error('Failed to mark all as read');
    }
    return response.json();
};

export const deleteNotification = async (notificationId: string) => {
    const response = await fetchWithCreds(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete notification');
    }
    return response.json();
};

export const clearAllNotifications = async () => {
    const response = await fetchWithCreds(`${API_URL}/notifications/all/clear`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to clear notifications');
    }
    return response.json();
};
