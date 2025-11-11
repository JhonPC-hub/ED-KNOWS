import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Achievement } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  newAchievement: Achievement | null;
  clearNewAchievement: () => void;
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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const userData = JSON.parse(saved);
      return { ...userData, createdAt: new Date(userData.createdAt) };
    }
    return null;
  });

  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    if (saved) {
      const usersData = JSON.parse(saved);
      return usersData.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
        progress: u.progress?.map((p: any) => ({
          ...p,
          lastActivity: new Date(p.lastActivity),
        })) || [],
        achievements: u.achievements?.map((a: any) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt),
        })) || [],
      }));
    }
    // Usuario admin por defecto
    const adminUser: User = {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@edknows.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date(),
      achievements: [],
      progress: [],
      totalTime: 0,
    };
    return [adminUser];
  });

  useEffect(() => {
    safeSetItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      // No guardar la contraseña en currentUser por seguridad
      const { password, ...userWithoutPassword } = user;
      safeSetItem('currentUser', JSON.stringify(userWithoutPassword));
      // Actualizar último login
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, lastLogin: new Date() } : u
      ));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(
      u => (u.username === username || u.email === username) && u.password === password
    );
    if (foundUser) {
      setUser({ ...foundUser, lastLogin: new Date() });
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    if (users.some(u => u.username === username || u.email === email)) {
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      role: 'student',
      createdAt: new Date(),
      achievements: [],
      progress: [],
      totalTime: 0,
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    }
  };

  const clearNewAchievement = () => {
    setNewAchievement(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, newAchievement, clearNewAchievement }}>
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

