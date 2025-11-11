import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Lock, CheckCircle, Video } from 'lucide-react';
import IconRenderer from '@/components/IconRenderer';
import './TopicDetail.css';

const TopicDetail = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { topics } = useData();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const topic = topics.find(t => t.id === topicId);
  if (!topic) {
    return <div>Tema no encontrado</div>;
  }

  const progress = user?.progress?.find(p => p.topicId === topicId);
  const currentLevel = progress?.currentLevel || 0;
  const completedLevels = progress?.completedLevels || [];

  const isLevelUnlocked = (levelNumber: number) => {
    if (levelNumber === 0) return true;
    return completedLevels.includes(levelNumber - 1);
  };

  const handleLevelClick = (level: any) => {
    if (isLevelUnlocked(level.levelNumber)) {
      navigate(`/topics/${topicId}/level/${level.id}`);
    }
  };

  return (
    <div className="topic-detail">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/topics')}
        className="back-button"
      >
        <ArrowLeft size={20} />
        Volver a Temas
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="topic-detail-header"
      >
        {topic.image ? (
          <div className="topic-detail-image">
            <img src={topic.image} alt={topic.name} />
          </div>
        ) : (
          <div className="topic-detail-icon">
            <IconRenderer iconName={topic.icon} size={64} />
          </div>
        )}
        <div>
          <h1>{topic.name}</h1>
          <p>{topic.description}</p>
        </div>
      </motion.div>

      <div className="levels-container">
        <h2>Niveles</h2>
        <div className="levels-grid">
          {topic.levels.length === 0 ? (
            <div className="no-levels">
              <p>Este tema aún no tiene niveles disponibles.</p>
              {user?.role === 'admin' && (
                <Link to="/admin" className="admin-link">
                  Agregar niveles desde el panel de administración
                </Link>
              )}
            </div>
          ) : (
            topic.levels
              .sort((a, b) => a.levelNumber - b.levelNumber)
              .map((level, index) => {
                const isUnlocked = isLevelUnlocked(level.levelNumber);
                const isCompleted = completedLevels.includes(level.levelNumber);

                return (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleLevelClick(level)}
                  >
                    <div className="level-number">
                      {isCompleted ? (
                        <CheckCircle size={32} className="level-icon completed" />
                      ) : isUnlocked ? (
                        level.type === 'video' ? (
                          <Video size={32} className="level-icon" />
                        ) : (
                          <Play size={32} className="level-icon" />
                        )
                      ) : (
                        <Lock size={32} className="level-icon locked" />
                      )}
                    </div>
                    <div className="level-content">
                      <h3>
                        Nivel {level.levelNumber}
                        {level.levelNumber === 0 && ' - Introducción'}
                      </h3>
                      <p>
                        {level.type === 'video' ? 'Video tutorial' : 'Ejercicio práctico'}
                      </p>
                      {level.description && (
                        <p className="level-description-text">{level.description}</p>
                      )}
                    </div>
                    {isUnlocked && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="level-arrow"
                      >
                        →
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
