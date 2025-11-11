import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import './Exercise.css';

const Exercise = () => {
  const { topicId, levelId } = useParams<{ topicId: string; levelId: string }>();
  const { topics, addDailyProgress } = useData();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const topic = topics.find(t => t.id === topicId);
  const level = topic?.levels.find(l => l.id === levelId);

  useEffect(() => {
    if (isRunning && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handleFinish = () => {
    setIsRunning(false);
    setIsFinished(true);
  };

  const handleViewSolution = () => {
    setShowSolution(true);
  };

  const handleAnswerCheck = (isCorrect: boolean) => {
    setUserAnswer(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      // Actualizar progreso del usuario
      const progress = user?.progress?.find(p => p.topicId === topicId) || {
        topicId: topicId!,
        currentLevel: 0,
        completedLevels: [],
        timeSpent: 0,
        exercisesCompleted: 0,
        lastActivity: new Date(),
      };

      const levelNumber = level?.levelNumber || 0;
      const newCompletedLevels = [...progress.completedLevels];
      if (!newCompletedLevels.includes(levelNumber)) {
        newCompletedLevels.push(levelNumber);
      }

      const newProgress = {
        ...progress,
        currentLevel: Math.max(progress.currentLevel, levelNumber + 1),
        completedLevels: newCompletedLevels,
        exercisesCompleted: progress.exercisesCompleted + 1,
        timeSpent: progress.timeSpent + Math.floor(time / 60),
        lastActivity: new Date(),
      };

      const timeInMinutes = Math.floor(time / 60);
      const today = new Date().toISOString().split('T')[0];
      
      // Actualizar tiempo total del usuario
      updateUser({
        progress: [
          ...(user?.progress?.filter(p => p.topicId !== topicId) || []),
          newProgress,
        ],
        totalTime: (user?.totalTime || 0) + timeInMinutes,
      });

      // Agregar al progreso diario para la gráfica
      addDailyProgress({
        date: today,
        exercisesCompleted: 1,
        timeSpent: timeInMinutes,
      });
    }
  };

  const handleNext = () => {
    if (topic && level) {
      const sortedLevels = [...topic.levels].sort((a, b) => a.levelNumber - b.levelNumber);
      const currentIndex = sortedLevels.findIndex(l => l.id === levelId);
      if (currentIndex < sortedLevels.length - 1) {
        navigate(`/topics/${topicId}/level/${sortedLevels[currentIndex + 1].id}`);
        window.location.reload();
      } else {
        navigate(`/topics/${topicId}`);
      }
    }
  };

  if (!topic || !level) {
    return <div>Ejercicio no encontrado</div>;
  }

  if (level.type === 'video') {
    return (
      <div className="exercise-page">
        <div className="video-container">
          <h2>Video Tutorial - Nivel {level.levelNumber}</h2>
          {level.videoUrl ? (
            <div className="video-wrapper">
              <iframe
                src={level.videoUrl}
                title="Video tutorial"
                allowFullScreen
                className="video-iframe"
              />
            </div>
          ) : (
            <div className="video-placeholder">
              <p>Video no disponible aún</p>
            </div>
          )}
          <button onClick={() => navigate(`/topics/${topicId}`)} className="back-btn">
            <ArrowLeft size={20} />
            Volver al tema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-page">
      <div className="exercise-container">
        <div className="exercise-header">
          <h2>Ejercicio - Nivel {level.levelNumber}</h2>
          <div className="timer-container">
            <div className="timer-display">
              <span className="timer-label">Tiempo:</span>
              <span className="timer-value">{formatTime(time)}</span>
            </div>
            {!isFinished && (
              <div className="timer-controls">
                {!isRunning && time === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                    className="timer-btn start"
                  >
                    <Play size={20} />
                    Iniciar
                  </motion.button>
                )}
                {isRunning && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePause}
                      className="timer-btn pause"
                    >
                      <Pause size={20} />
                      Parar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFinish}
                      className="timer-btn finish"
                    >
                      Finalizar
                    </motion.button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {!showSolution && !isFinished && (
          <div className="exercise-content">
            {level.exerciseImage ? (
              <img src={level.exerciseImage} alt="Ejercicio" className="exercise-image" />
            ) : (
              <div className="exercise-placeholder">
                <p>Imagen del ejercicio no disponible</p>
              </div>
            )}
          </div>
        )}

        {isFinished && !showSolution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="finish-actions"
          >
            <h3>¿Has terminado el ejercicio?</h3>
            <p>Tiempo total: {formatTime(time)}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewSolution}
              className="view-solution-btn"
            >
              Ver Solución
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="solution-container"
            >
              <h3>Solución del Ejercicio</h3>
              {level.solutionImage ? (
                <img src={level.solutionImage} alt="Solución" className="solution-image" />
              ) : (
                <div className="solution-placeholder">
                  <p>Imagen de la solución no disponible</p>
                </div>
              )}

              {userAnswer === null && (
                <div className="answer-check">
                  <h4>¿Tu respuesta coincide con la solución?</h4>
                  <div className="answer-buttons">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswerCheck(true)}
                      className="answer-btn correct"
                    >
                      <CheckCircle size={24} />
                      Sí, coincide
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswerCheck(false)}
                      className="answer-btn incorrect"
                    >
                      <XCircle size={24} />
                      No coincide
                    </motion.button>
                  </div>
                </div>
              )}

              {userAnswer === 'correct' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="answer-feedback correct-feedback"
                >
                  <CheckCircle size={48} />
                  <h3>¡Excelente trabajo!</h3>
                  <p>Has completado este ejercicio correctamente.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="next-btn"
                  >
                    Siguiente Nivel
                    <ArrowRight size={20} />
                  </motion.button>
                </motion.div>
              )}

              {userAnswer === 'incorrect' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="answer-feedback incorrect-feedback"
                >
                  <XCircle size={48} />
                  <h3>No te preocupes</h3>
                  <p>Aquí tienes un video explicativo para ayudarte a entender mejor.</p>
                  {level.explanationVideo ? (
                    <div className="explanation-video">
                      <iframe
                        src={level.explanationVideo}
                        title="Video explicativo"
                        allowFullScreen
                        className="video-iframe"
                      />
                    </div>
                  ) : (
                    <p className="no-video">Video explicativo no disponible aún</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/topics/${topicId}`)}
                    className="back-btn"
                  >
                    <ArrowLeft size={20} />
                    Volver al tema
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Exercise;