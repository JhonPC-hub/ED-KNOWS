import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic, Level, Achievement, DailyProgress, Post, Comment, Testimonial, Request } from '@/types';

interface DataContextType {
  topics: Topic[];
  achievements: Achievement[];
  dailyProgress: DailyProgress[];
  posts: Post[];
  testimonials: Testimonial[];
  requests: Request[];
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  addLevel: (topicId: string, level: Level) => void;
  updateLevel: (topicId: string, levelId: string, updates: Partial<Level>) => void;
  deleteLevel: (topicId: string, levelId: string) => void;
  addDailyProgress: (progress: DailyProgress) => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  deleteComment: (postId: string, commentId: string) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  approveTestimonial: (testimonialId: string) => void;
  deleteTestimonial: (testimonialId: string) => void;
  addRequest: (request: Request) => void;
  updateRequestStatus: (requestId: string, status: 'pending' | 'read' | 'resolved') => void;
  deleteRequest: (requestId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function para guardar en localStorage con manejo de errores y compresión
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn(`LocalStorage lleno al guardar ${key}, limpiando datos...`);
      
      // Limpiar posts antiguos y comprimir imágenes
      if (key === 'posts') {
        try {
          const postsData = JSON.parse(value);
          // Limitar a 30 posts más recientes
          const limitedPosts = postsData.slice(0, 30);
          // Comprimir imágenes: mantener solo la primera imagen y reducir calidad
          const compressedPosts = limitedPosts.map((post: any) => ({
            ...post,
            images: post.images?.slice(0, 1).map((img: string) => {
              // Si la imagen es muy grande (más de 100KB en base64), reducirla
              if (img.length > 100000) {
                // Retornar solo una versión más pequeña (primeros 50000 caracteres)
                return img.substring(0, 50000);
              }
              return img;
            }) || []
          }));
          localStorage.setItem(key, JSON.stringify(compressedPosts));
          return;
        } catch (err) {
          console.error('Error al comprimir posts:', err);
        }
      }
      
      // Limpiar dailyProgress antiguos (mantener solo últimos 30 días)
      if (key === 'dailyProgress') {
        try {
          const progressData = JSON.parse(value);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recentProgress = progressData.filter((p: any) => {
            const progressDate = new Date(p.date);
            return progressDate >= thirtyDaysAgo;
          });
          localStorage.setItem(key, JSON.stringify(recentProgress));
          return;
        } catch (err) {
          console.error('Error al limpiar dailyProgress:', err);
        }
      }
      
      // Si aún falla, intentar guardar de nuevo
      try {
        localStorage.setItem(key, value);
      } catch (e2) {
        console.error(`No se pudo guardar ${key} después de limpiar:`, e2);
      }
    } else {
      throw e;
    }
  }
};

const initialTopics: Topic[] = [
  {
    id: 'topic-1',
    name: 'Ecuaciones Homogéneas',
    description: 'Aprende a resolver ecuaciones diferenciales homogéneas',
    icon: 'FunctionSquare',
    levels: [],
  },
  {
    id: 'topic-2',
    name: 'Ecuaciones de Bernoulli',
    description: 'Domina las ecuaciones diferenciales de Bernoulli',
    icon: 'BarChart3',
    levels: [],
  },
  {
    id: 'topic-3',
    name: 'Ecuaciones de Orden Superior',
    description: 'Resuelve ecuaciones diferenciales de orden superior',
    icon: 'TrendingUp',
    levels: [],
  },
  {
    id: 'topic-4',
    name: 'Aplicaciones de Ecuaciones Diferenciales',
    description: 'Aplica ecuaciones diferenciales a problemas reales',
    icon: 'FlaskConical',
    levels: [],
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'Primeros Pasos',
    description: 'Completa tu primer ejercicio',
    icon: 'Star',
  },
  {
    id: 'ach-2',
    name: 'Estudiante Dedicado',
    description: 'Completa 10 ejercicios',
    icon: 'BookOpen',
  },
  {
    id: 'ach-3',
    name: 'Maestro del Tiempo',
    description: 'Pasa 1 hora estudiando',
    icon: 'Clock',
  },
  {
    id: 'ach-4',
    name: 'Perfeccionista',
    description: 'Completa un tema completo',
    icon: 'Target',
  },
  {
    id: 'ach-5',
    name: 'Rayo Veloz',
    description: 'Completa 5 ejercicios en un día',
    icon: 'Zap',
  },
  {
    id: 'ach-6',
    name: 'Maratón de Estudio',
    description: 'Pasa 5 horas estudiando',
    icon: 'Flame',
  },
  {
    id: 'ach-7',
    name: 'Experto',
    description: 'Completa 50 ejercicios',
    icon: 'Award',
  },
  {
    id: 'ach-8',
    name: 'Maestro',
    description: 'Completa 100 ejercicios',
    icon: 'Trophy',
  },
  {
    id: 'ach-9',
    name: 'Coleccionista',
    description: 'Completa 3 temas completos',
    icon: 'BookMarked',
  },
  {
    id: 'ach-10',
    name: 'Leyenda',
    description: 'Completa todos los temas',
    icon: 'Crown',
  },
  {
    id: 'ach-11',
    name: 'Constancia',
    description: 'Estudia 7 días consecutivos',
    icon: 'Calendar',
  },
  {
    id: 'ach-12',
    name: 'Velocidad Supersónica',
    description: 'Completa 10 ejercicios en un día',
    icon: 'Rocket',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem('topics');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error al cargar topics desde localStorage:', error);
    }
    return initialTopics;
  });

  const [achievements] = useState<Achievement[]>(initialAchievements);

  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>(() => {
    const saved = localStorage.getItem('dailyProgress');
    return saved ? JSON.parse(saved) : [];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('testimonials');
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = useState<Request[]>(() => {
    const saved = localStorage.getItem('requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('posts');
      if (saved) {
        const postsData = JSON.parse(saved);
        return postsData.map((p: any) => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
          comments: p.comments?.map((c: any) => ({
            ...c,
            createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          })) || [],
        }));
      }
    } catch (error) {
      console.error('Error al cargar posts desde localStorage:', error);
    }
    return [];
  });

  // Limpiar localStorage si está lleno al iniciar (solo si es absolutamente necesario)
  useEffect(() => {
    try {
      // Intentar guardar un valor de prueba para verificar si hay espacio
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('LocalStorage lleno al iniciar, limpiando datos antiguos...');
        // Limpiar posts antiguos solo si hay más de 50 posts
        try {
          const postsData = localStorage.getItem('posts');
          if (postsData) {
            const parsed = JSON.parse(postsData);
            // Solo limpiar si hay más de 50 posts, mantener los más recientes
            if (parsed.length > 50) {
              const cleaned = parsed.slice(0, 50).map((post: any) => ({
                ...post,
                // Comprimir imágenes en lugar de eliminarlas completamente
                images: post.images?.slice(0, 1).map((img: string) => {
                  if (img.length > 50000) {
                    return img.substring(0, 50000);
                  }
                  return img;
                }) || []
              }));
              localStorage.setItem('posts', JSON.stringify(cleaned));
            }
          }
        } catch (err) {
          console.error('Error al limpiar posts:', err);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Guardar topics en localStorage cada vez que cambien
    // Esto incluye cuando se agregan, actualizan o eliminan topics o levels
    try {
      const topicsToSave = topics.map(t => ({
        ...t,
        levels: t.levels.map(l => ({
          ...l,
        })),
      }));
      safeSetItem('topics', JSON.stringify(topicsToSave));
    } catch (error) {
      console.error('Error al guardar topics:', error);
    }
  }, [topics]);

  useEffect(() => {
    safeSetItem('dailyProgress', JSON.stringify(dailyProgress));
  }, [dailyProgress]);

  useEffect(() => {
    // Guardar posts en localStorage cada vez que cambien
    // Guardar siempre, incluso si está vacío, para mantener la persistencia
    // Esto incluye cuando se agregan comentarios, likes, etc.
    try {
      const postsToSave = posts.map(p => ({
        ...p,
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
        comments: p.comments.map(c => ({
          ...c,
          createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
        })),
      }));
      safeSetItem('posts', JSON.stringify(postsToSave));
    } catch (error) {
      console.error('Error al guardar posts:', error);
    }
  }, [posts]);

  const addTopic = (topic: Topic) => {
    setTopics(prev => [...prev, topic]);
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const addLevel = (topicId: string, level: Level) => {
    setTopics(prev => prev.map(t => 
      t.id === topicId 
        ? { ...t, levels: [...t.levels, level] }
        : t
    ));
  };

  const updateLevel = (topicId: string, levelId: string, updates: Partial<Level>) => {
    setTopics(prev => prev.map(t => 
      t.id === topicId
        ? { ...t, levels: t.levels.map(l => l.id === levelId ? { ...l, ...updates } : l) }
        : t
    ));
  };

  const deleteLevel = (topicId: string, levelId: string) => {
    setTopics(prev => prev.map(t => 
      t.id === topicId
        ? { ...t, levels: t.levels.filter(l => l.id !== levelId) }
        : t
    ));
  };

  const addDailyProgress = (progress: DailyProgress) => {
    setDailyProgress(prev => {
      const existing = prev.find(p => p.date === progress.date);
      if (existing) {
        return prev.map(p => 
          p.date === progress.date 
            ? { ...p, exercisesCompleted: p.exercisesCompleted + progress.exercisesCompleted, timeSpent: p.timeSpent + progress.timeSpent }
            : p
        );
      }
      return [...prev, progress];
    });
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const deletePost = (postId: string) => {
    // Los posts solo pueden ser eliminados por el admin (verificación adicional en el componente)
    setPosts(prev => {
      const filtered = prev.filter(p => p.id !== postId);
      // Guardar inmediatamente en localStorage
      try {
        localStorage.setItem('posts', JSON.stringify(filtered));
      } catch (e) {
        console.error('Error al guardar posts después de eliminar:', e);
      }
      return filtered;
    });
  };

  const toggleLike = (postId: string, userId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(userId);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId]
        };
      }
      return post;
    }));
  };

  const addComment = (postId: string, comment: Comment) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        };
      }
      return post;
    }));
  };

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [testimonial, ...prev]);
  };

  const approveTestimonial = (testimonialId: string) => {
    setTestimonials(prev => prev.map(t => 
      t.id === testimonialId ? { ...t, approved: true } : t
    ));
  };

  const deleteTestimonial = (testimonialId: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== testimonialId));
  };

  const addRequest = (request: Request) => {
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (requestId: string, status: 'pending' | 'read' | 'resolved') => {
    setRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status } : r
    ));
  };

  const deleteRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  useEffect(() => {
    safeSetItem('testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    safeSetItem('requests', JSON.stringify(requests));
  }, [requests]);

  return (
    <DataContext.Provider value={{
      topics,
      achievements,
      dailyProgress,
      posts,
      testimonials,
      requests,
      addTopic,
      updateTopic,
      deleteTopic,
      addLevel,
      updateLevel,
      deleteLevel,
      addDailyProgress,
      addPost,
      deletePost,
      toggleLike,
      addComment,
      deleteComment,
      addTestimonial,
      approveTestimonial,
      deleteTestimonial,
      addRequest,
      updateRequestStatus,
      deleteRequest,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
