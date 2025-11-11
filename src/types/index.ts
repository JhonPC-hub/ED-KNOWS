export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  role: 'student' | 'admin';
  createdAt: Date;
  achievements: Achievement[];
  progress: TopicProgress[];
  totalTime: number; // en minutos
  lastLogin?: Date;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string; // Imagen de presentación del tema
  levels: Level[];
}

export interface Level {
  id: string;
  topicId: string;
  levelNumber: number;
  type: 'video' | 'exercise';
  description?: string; // Descripción de la lección
  videoUrl?: string;
  exerciseImage?: string;
  solutionImage?: string;
  explanationVideo?: string;
}

export interface TopicProgress {
  topicId: string;
  currentLevel: number;
  completedLevels: number[];
  timeSpent: number; // en minutos
  exercisesCompleted: number;
  lastActivity: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface DailyProgress {
  date: string;
  exercisesCompleted: number;
  timeSpent: number;
}

export interface Testimonial {
  id: string;
  userId: string;
  username: string;
  userProfilePicture?: string;
  text: string;
  createdAt: Date;
  approved?: boolean; // Para que el admin pueda aprobar testimonios
}

export interface Request {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  type: 'suggestion' | 'complaint' | 'question';
  subject: string;
  message: string;
  createdAt: Date;
  status: 'pending' | 'read' | 'resolved';
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePicture?: string;
  type: 'achievement' | 'question';
  content: string;
  images?: string[]; // Array de URLs de imágenes (base64 o URLs)
  achievementId?: string;
  achievementName?: string;
  createdAt: Date;
  likes: string[]; // Array de user IDs que dieron like
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userProfilePicture?: string;
  content: string;
  createdAt: Date;
}


  type: 'suggestion' | 'complaint' | 'question';
  subject: string;
  message: string;
  createdAt: Date;
  status: 'pending' | 'read' | 'resolved';
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePicture?: string;
  type: 'achievement' | 'question';
  content: string;
  images?: string[]; // Array de URLs de imágenes (base64 o URLs)
  achievementId?: string;
  achievementName?: string;
  createdAt: Date;
  likes: string[]; // Array de user IDs que dieron like
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userProfilePicture?: string;
  content: string;
  createdAt: Date;
}

