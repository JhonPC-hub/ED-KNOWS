import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Achievement } from '@/types';
import { authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  newAchievement: Achievement | null;
  clearNewAchievement: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function para guardar en localStorage con manejo de errores
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      // Si el localStorage está lleno, limpiar datos antiguos
      console.warn('LocalStorage lleno, limpiando datos antiguos...');
      
      // Limpiar posts antiguos (mantener solo los últimos 50)
      try {
        const posts = localStorage.getItem('posts');
        if (posts) {
          const postsData = JSON.parse(posts);
          if (postsData.length > 50) {
            // Eliminar imágenes de posts antiguos para liberar espacio
            const cleanedPosts = postsData.slice(0, 50).map((post: any) => ({
              ...post,
              images: post.images?.slice(0, 1) || [] // Mantener solo la primera imagen
            }));
            localStorage.setItem('posts', JSON.stringify(cleanedPosts));
          }
        }
      } catch (err) {
        console.error('Error al limpiar posts:', err);
      }
      
      // Intentar guardar de nuevo
      try {
        localStorage.setItem(key, value);
      } catch (e2) {
        console.error('No se pudo guardar en localStorage después de limpiar:', e2);
        // Si aún falla, limpiar todo excepto lo esencial
        localStorage.clear();
        localStorage.setItem('theme', 'light');
        // Intentar una última vez
        try {
          localStorage.setItem(key, value);
        } catch (e3) {
          console.error('Error crítico de localStorage:', e3);
        }
      }
    } else {
      throw e;
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
            profilePicture: userData.profilePicture,
            createdAt: new Date(userData.createdAt),
            lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
            achievements: [],
            progress: [],
            totalTime: 0,
          });
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const data = await authAPI.login(username, password);
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        profilePicture: data.user.profilePicture,
        createdAt: new Date(data.user.createdAt),
        lastLogin: data.user.lastLogin ? new Date(data.user.lastLogin) : undefined,
        achievements: [],
        progress: [],
        totalTime: 0,
      });
      return true;
    } catch (error: any) {
      console.error('Error en login:', error);
      alert(error.message || 'Error al iniciar sesión');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const data = await authAPI.register(username, email, password);
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        profilePicture: data.user.profilePicture,
        createdAt: new Date(data.user.createdAt),
        achievements: [],
        progress: [],
        totalTime: 0,
      });
      return true;
    } catch (error: any) {
      console.error('Error en registro:', error);
      alert(error.message || 'Error al registrar usuario');
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const clearNewAchievement = () => {
    setNewAchievement(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, newAchievement, clearNewAchievement, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

