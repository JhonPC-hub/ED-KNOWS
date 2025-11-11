import React, { createContext, useContext, useState, useEffect } from 'react';
import { Topic, Level, Achievement, DailyProgress, Post, Comment, Testimonial, Request } from '@/types';
import { postsAPI, topicsAPI } from '@/services/api';

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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
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
  const [loading, setLoading] = useState(true);

  // Cargar datos desde la API al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar topics
        const topicsData = await topicsAPI.getAll();
        setTopics(topicsData.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          icon: t.icon,
          image: t.image,
          levels: t.levels.map((l: any) => ({
            id: l.id,
            levelNumber: l.levelNumber,
            type: l.type,
            description: l.description,
            videoUrl: l.videoUrl,
            exerciseImage: l.exerciseImage,
            solutionImage: l.solutionImage,
            explanationVideo: l.explanationVideo,
          })),
        })));

        // Cargar posts
        const postsData = await postsAPI.getAll();
        setPosts(postsData.map((p: any) => ({
          id: p.id,
          userId: p.userId,
          username: p.username,
          userProfilePicture: p.userProfilePicture,
          type: p.type,
          content: p.content,
          images: p.images || [],
          achievementId: p.achievementId,
          achievementName: p.achievementName,
          createdAt: new Date(p.createdAt),
          likes: p.likes || [],
          comments: p.comments.map((c: any) => ({
            id: c.id,
            postId: c.postId,
            userId: c.userId,
            username: c.username,
            userProfilePicture: c.userProfilePicture,
            content: c.content,
            createdAt: new Date(c.createdAt),
          })),
        })));
      } catch (error) {
        console.error('Error al cargar datos desde la API:', error);
        // Fallback a datos iniciales si la API falla
        setTopics(initialTopics);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    safeSetItem('dailyProgress', JSON.stringify(dailyProgress));
  }, [dailyProgress]);

  const addTopic = async (topic: Topic) => {
    try {
      const newTopic = await topicsAPI.create({
        name: topic.name,
        description: topic.description,
        icon: topic.icon,
        image: topic.image,
      });
      setTopics(prev => [...prev, {
        ...topic,
        id: newTopic.id,
        levels: [],
      }]);
    } catch (error) {
      console.error('Error al crear tema:', error);
      throw error;
    }
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    try {
      await topicsAPI.update(id, updates);
      setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    } catch (error) {
      console.error('Error al actualizar tema:', error);
      throw error;
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await topicsAPI.delete(id);
      setTopics(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error al eliminar tema:', error);
      throw error;
    }
  };

  const addLevel = async (topicId: string, level: Level) => {
    try {
      const newLevel = await topicsAPI.addLevel(topicId, {
        levelNumber: level.levelNumber,
        type: level.type,
        description: level.description,
        videoUrl: level.videoUrl,
        exerciseImage: level.exerciseImage,
        solutionImage: level.solutionImage,
        explanationVideo: level.explanationVideo,
      });
      setTopics(prev => prev.map(t => 
        t.id === topicId 
          ? { ...t, levels: [...t.levels, { ...level, id: newLevel.id }] }
          : t
      ));
    } catch (error) {
      console.error('Error al agregar nivel:', error);
      throw error;
    }
  };

  const updateLevel = async (topicId: string, levelId: string, updates: Partial<Level>) => {
    try {
      await topicsAPI.updateLevel(topicId, levelId, updates);
      setTopics(prev => prev.map(t => 
        t.id === topicId
          ? { ...t, levels: t.levels.map(l => l.id === levelId ? { ...l, ...updates } : l) }
          : t
      ));
    } catch (error) {
      console.error('Error al actualizar nivel:', error);
      throw error;
    }
  };

  const deleteLevel = async (topicId: string, levelId: string) => {
    try {
      await topicsAPI.deleteLevel(topicId, levelId);
      setTopics(prev => prev.map(t => 
        t.id === topicId
          ? { ...t, levels: t.levels.filter(l => l.id !== levelId) }
          : t
      ));
    } catch (error) {
      console.error('Error al eliminar nivel:', error);
      throw error;
    }
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

  const addPost = async (post: Post) => {
    try {
      const newPost = await postsAPI.create({
        type: post.type,
        content: post.content,
        images: post.images,
        achievementId: post.achievementId,
        achievementName: post.achievementName,
      });
      setPosts(prev => [{
        ...post,
        id: newPost.id,
        userId: newPost.userId,
        username: newPost.username,
        userProfilePicture: newPost.userProfilePicture,
        createdAt: new Date(newPost.createdAt),
        likes: [],
        comments: [],
      }, ...prev]);
    } catch (error) {
      console.error('Error al crear post:', error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await postsAPI.delete(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error al eliminar post:', error);
      throw error;
    }
  };

  const toggleLike = async (postId: string, userId: string) => {
    try {
      const result = await postsAPI.like(postId);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: result.liked
              ? [...post.likes, userId]
              : post.likes.filter(id => id !== userId)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const addComment = async (postId: string, comment: Comment) => {
    try {
      const newComment = await postsAPI.addComment(postId, comment.content);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: newComment.id,
              postId: newComment.postId,
              userId: newComment.userId,
              username: newComment.username,
              userProfilePicture: newComment.userProfilePicture,
              content: newComment.content,
              createdAt: new Date(newComment.createdAt),
            }]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      await postsAPI.deleteComment(postId, commentId);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      throw error;
    }
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
