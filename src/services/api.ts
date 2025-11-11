const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper para hacer peticiones
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const data = await request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  login: async (username: string, password: string) => {
    const data = await request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  getMe: async () => {
    return request<any>('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },
};

// Posts API
export const postsAPI = {
  getAll: async () => {
    return request<any[]>('/posts');
  },

  create: async (post: {
    type: 'achievement' | 'question';
    content: string;
    images?: string[];
    achievementId?: string;
    achievementName?: string;
  }) => {
    return request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  delete: async (postId: string) => {
    return request<{ message: string }>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  like: async (postId: string) => {
    return request<{ liked: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  addComment: async (postId: string, content: string) => {
    return request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (postId: string, commentId: string) => {
    return request<{ message: string }>(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Topics API
export const topicsAPI = {
  getAll: async () => {
    return request<any[]>('/topics');
  },

  create: async (topic: {
    name: string;
    description: string;
    icon?: string;
    image?: string;
  }) => {
    return request<any>('/topics', {
      method: 'POST',
      body: JSON.stringify(topic),
    });
  },

  update: async (topicId: string, updates: Partial<{
    name: string;
    description: string;
    icon: string;
    image: string;
  }>) => {
    return request<any>(`/topics/${topicId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (topicId: string) => {
    return request<{ message: string }>(`/topics/${topicId}`, {
      method: 'DELETE',
    });
  },

  addLevel: async (topicId: string, level: {
    levelNumber: number;
    type: 'video' | 'exercise';
    description?: string;
    videoUrl?: string;
    exerciseImage?: string;
    solutionImage?: string;
    explanationVideo?: string;
  }) => {
    return request<any>(`/topics/${topicId}/levels`, {
      method: 'POST',
      body: JSON.stringify(level),
    });
  },

  updateLevel: async (topicId: string, levelId: string, updates: Partial<{
    levelNumber: number;
    type: 'video' | 'exercise';
    description: string;
    videoUrl: string;
    exerciseImage: string;
    solutionImage: string;
    explanationVideo: string;
  }>) => {
    return request<any>(`/topics/${topicId}/levels/${levelId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteLevel: async (topicId: string, levelId: string) => {
    return request<{ message: string }>(`/topics/${topicId}/levels/${levelId}`, {
      method: 'DELETE',
    });
  },
};

