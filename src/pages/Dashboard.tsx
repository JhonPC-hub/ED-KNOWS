import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  BookOpen, TrendingUp, Award, Clock, Users, 
  Sparkles, Zap, Target, Flame, Star, TrendingDown
} from 'lucide-react';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { posts, topics, achievements } = useData();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // Debug: Verificar que el componente se está renderizando
  if (!user) {
    return <div>No hay usuario autenticado</div>;
  }

  const completedTopics = user?.progress?.filter(p => p.completedLevels.length > 0).length || 0;
  const totalExercises = user?.progress?.reduce((acc, p) => acc + p.exercisesCompleted, 0) || 0;
  const unlockedAchievements = user?.achievements?.length || 0;
  const totalTime = user?.totalTime || 0;
  const completionRate = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0;

  const stats = [
    {
      icon: <BookOpen size={32} />,
      label: 'Temas Completados',
      value: completedTopics,
      total: topics.length,
      color: 'var(--primary-purple)',
      gradient: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-purple-light) 100%)',
    },
    {
      icon: <TrendingUp size={32} />,
      label: 'Ejercicios Completados',
      value: totalExercises,
      suffix: '+',
      color: 'var(--success)',
      gradient: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
    },
    {
      icon: <Award size={32} />,
      label: 'Logros Desbloqueados',
      value: unlockedAchievements,
      total: achievements.length,
      color: 'var(--warning)',
      gradient: 'linear-gradient(135deg, var(--warning) 0%, #D97706 100%)',
    },
    {
      icon: <Clock size={32} />,
      label: 'Tiempo Total',
      value: `${Math.floor(totalTime / 60)}h ${totalTime % 60}m`,
      color: 'var(--primary-purple-light)',
      gradient: 'linear-gradient(135deg, var(--primary-purple-light) 0%, var(--primary-purple-lighter) 100%)',
    },
  ];

  const quickActions = [
    {
      icon: <BookOpen size={24} />,
      label: 'Explorar Temas',
      link: '/topics',
      color: 'var(--primary-purple)',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Ver Progreso',
      link: '/progress',
      color: 'var(--success)',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    },
    {
      icon: <Award size={24} />,
      label: 'Mis Logros',
      link: '/progress',
      color: 'var(--warning)',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
    },
  ];

  return (
    <div className="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <div className="header-content-wrapper">
          <div className="header-text">
            <motion.h1
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ¡Bienvenido, {user?.username}!
            </motion.h1>
            <p>Comparte tu progreso y conecta con otros estudiantes</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="header-image"
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop" 
              alt="Estudiante"
              className="welcome-image"
            />
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="welcome-glow"
            />
          </motion.div>
        </div>
      </motion.div>

      <div className="stats-grid" ref={statsRef}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="stat-card"
          >
            <motion.div 
              className="stat-icon" 
              style={{ 
                background: stat.gradient,
                color: 'var(--white)'
              }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {stat.icon}
            </motion.div>
            <div className="stat-content">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={isStatsInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {stat.value}{stat.suffix || ''}
                {stat.total && (
                  <span className="stat-total"> / {stat.total}</span>
                )}
              </motion.h3>
              <p>{stat.label}</p>
              {stat.total && (
                <div className="stat-progress-bar">
                  <motion.div
                    className="stat-progress-fill"
                    initial={{ width: 0 }}
                    animate={isStatsInView ? { 
                      width: `${(stat.value / stat.total) * 100}%` 
                    } : {}}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    style={{ background: stat.gradient }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="completion-banner"
      >
        <div className="banner-content">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="banner-icon"
          >
            <Target size={48} />
          </motion.div>
          <div className="banner-text">
            <h3>Progreso General</h3>
            <p>Has completado el {Math.round(completionRate)}% de los temas disponibles</p>
          </div>
          <motion.div
            className="banner-progress"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.div
              className="banner-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ delay: 0.9, duration: 1 }}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="quick-actions"
      >
        <h2>Accesos Rápidos</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <motion.a
              key={index}
              href={action.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="action-card"
            >
              <div 
                className="action-image"
                style={{ backgroundImage: `url(${action.image})` }}
              >
                <div className="action-overlay" />
              </div>
              <div className="action-content">
                <div className="action-icon" style={{ color: action.color }}>
                  {action.icon}
                </div>
                <span>{action.label}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      <div className="feed-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <CreatePost />
        </motion.div>
        
        <div className="posts-feed">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="empty-feed"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="empty-icon"
              >
                <Sparkles size={64} />
              </motion.div>
              <h3>¡Comienza a compartir!</h3>
              <p>No hay publicaciones aún. Sé el primero en compartir tus logros o hacer una pregunta</p>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="empty-arrow"
              >
                <TrendingDown size={32} />
              </motion.div>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
