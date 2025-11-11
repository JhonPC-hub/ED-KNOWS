import { Link } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  BookOpen, CheckCircle, Lock, TrendingUp, 
  Award, Zap, Target, Sparkles, ArrowRight
} from 'lucide-react';
import IconRenderer from '@/components/IconRenderer';
import './Topics.css';

const Topics = () => {
  const { topics } = useData();
  const { user } = useAuth();
  const topicsRef = useRef(null);
  const isTopicsInView = useInView(topicsRef, { once: true });

  const getTopicProgress = (topicId: string) => {
    const progress = user?.progress?.find(p => p.topicId === topicId);
    if (!progress) return { currentLevel: 0, completedLevels: [] };
    return {
      currentLevel: progress.currentLevel,
      completedLevels: progress.completedLevels,
    };
  };

  const totalTopics = topics.length;
  const completedTopics = user?.progress?.filter(p => p.completedLevels.length > 0).length || 0;
  const totalLevels = topics.reduce((acc, topic) => acc + topic.levels.length, 0);
  const completedLevels = user?.progress?.reduce((acc, p) => acc + p.completedLevels.length, 0) || 0;

  return (
    <div className="topics-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="topics-header"
      >
        <div className="header-content-topics">
          <div className="header-text-topics">
            <motion.h1
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Temas de Ecuaciones Diferenciales
            </motion.h1>
            <p>Selecciona un tema para comenzar a aprender</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="header-stats-topics"
          >
            <div className="stat-mini">
              <BookOpen size={24} />
              <div>
                <h3>{totalTopics}</h3>
                <p>Temas</p>
              </div>
            </div>
            <div className="stat-mini">
              <Target size={24} />
              <div>
                <h3>{completedTopics}</h3>
                <p>Completados</p>
              </div>
            </div>
            <div className="stat-mini">
              <TrendingUp size={24} />
              <div>
                <h3>{completedLevels}/{totalLevels}</h3>
                <p>Niveles</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="topics-overview"
      >
        <div className="overview-card">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="overview-icon"
          >
            <Sparkles size={48} />
          </motion.div>
          <div className="overview-content">
            <h3>¡Comienza tu aprendizaje!</h3>
            <p>
              Explora nuestros {totalTopics} temas cuidadosamente seleccionados. 
              Cada tema incluye videos explicativos y ejercicios prácticos para dominar 
              las ecuaciones diferenciales paso a paso.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="topics-grid" ref={topicsRef}>
        {topics.map((topic, index) => {
          const progress = getTopicProgress(topic.id);
          const totalLevels = topic.levels.length;
          const completedCount = progress.completedLevels.length;
          const progressPercentage = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;
          const isCompleted = progressPercentage === 100;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isTopicsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.03, y: -8 }}
              className={`topic-card ${isCompleted ? 'completed' : ''}`}
            >
              <Link to={`/topics/${topic.id}`} className="topic-link">
                {topic.image ? (
                  <motion.div 
                    className="topic-image-container"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={topic.image} alt={topic.name} className="topic-image" />
                    <div className="topic-image-overlay" />
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="completed-badge"
                      >
                        <Award size={32} />
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="topic-icon"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconRenderer iconName={topic.icon} size={48} />
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="completed-badge-icon"
                      >
                        <CheckCircle size={24} />
                      </motion.div>
                    )}
                  </motion.div>
                )}
                <div className="topic-content">
                  <div className="topic-header-content">
                    <h2>{topic.name}</h2>
                    {isCompleted && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="completed-label"
                      >
                        <CheckCircle size={18} />
                        Completado
                      </motion.span>
                    )}
                  </div>
                  <p>{topic.description}</p>
                  <div className="topic-progress">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={isTopicsInView ? { width: `${progressPercentage}%` } : {}}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                        style={{
                          background: isCompleted 
                            ? 'linear-gradient(90deg, var(--success) 0%, #059669 100%)'
                            : 'linear-gradient(90deg, var(--primary-purple) 0%, var(--primary-purple-light) 100%)'
                        }}
                      />
                    </div>
                    <div className="progress-info">
                      <span className="progress-text">
                        {completedCount} / {totalLevels} niveles
                      </span>
                      <span className="progress-percentage">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </div>
                  <motion.div
                    className="topic-action"
                    whileHover={{ x: 5 }}
                  >
                    <span>Explorar tema</span>
                    <ArrowRight size={18} />
                  </motion.div>
                </div>
                <div className="topic-status">
                  {progress.currentLevel > 0 ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle size={24} className="status-icon completed" />
                    </motion.div>
                  ) : (
                    <BookOpen size={24} className="status-icon" />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {topics.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-topics"
        >
          <BookOpen size={64} />
          <h3>No hay temas disponibles</h3>
          <p>Los temas se agregarán próximamente</p>
        </motion.div>
      )}
    </div>
  );
};

export default Topics;

