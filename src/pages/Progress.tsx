import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart3, TrendingUp, Award, Clock, Target, Sparkles, Zap, Flame, Star } from 'lucide-react';
import IconRenderer from '@/components/IconRenderer';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './Progress.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Progress = () => {
  const { user } = useAuth();
  const { topics, achievements, dailyProgress } = useData();
  const { theme } = useTheme();
  const statsRef = useRef(null);
  const chartRef = useRef(null);
  const achievementsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  const isChartInView = useInView(chartRef, { once: true });
  const isAchievementsInView = useInView(achievementsRef, { once: true });

  // Generar datos de los últimos 7 días
  const getLast7Days = () => {
    const days = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      days.push(dateString);
      labels.push(date.toLocaleDateString('es-ES', { weekday: 'short' }));
    }
    return { dates: days, labels };
  };

  const getProgressData = () => {
    const { dates } = getLast7Days();
    const data = dates.map(dateString => {
      const progress = dailyProgress.find(p => {
        const progressDate = typeof p.date === 'string' ? p.date : new Date(p.date).toISOString().split('T')[0];
        return progressDate === dateString;
      });
      return progress?.exercisesCompleted || 0;
    });
    return data;
  };

  const getTimeData = () => {
    const { dates } = getLast7Days();
    const data = dates.map(dateString => {
      const progress = dailyProgress.find(p => {
        const progressDate = typeof p.date === 'string' ? p.date : new Date(p.date).toISOString().split('T')[0];
        return progressDate === dateString;
      });
      return progress?.timeSpent || 0;
    });
    return data;
  };

  const progressData = getProgressData();
  const timeData = getTimeData();
  const maxValue = Math.max(...progressData, ...timeData, 1);
  const { labels } = getLast7Days();

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Ejercicios Completados',
        data: progressData,
        borderColor: 'var(--primary-purple)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(123, 44, 191, 0.4)');
          gradient.addColorStop(0.5, 'rgba(157, 78, 221, 0.2)');
          gradient.addColorStop(1, 'rgba(123, 44, 191, 0.05)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.5,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'var(--primary-purple)',
        pointBorderColor: 'var(--white)',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'var(--primary-purple-light)',
        pointHoverBorderColor: 'var(--white)',
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Tiempo (minutos)',
        data: timeData,
        borderColor: 'var(--success)',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
          return gradient;
        },
        borderWidth: 3,
        tension: 0.5,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'var(--success)',
        pointBorderColor: 'var(--white)',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: 'var(--white)',
        pointHoverBorderWidth: 3,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
      delay: (context: any) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 100;
        }
        return delay;
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#E5E7EB' : '#1F2937',
          font: {
            size: 12,
            weight: '600' as const,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(22, 33, 62, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        titleColor: theme === 'dark' ? '#E5E7EB' : '#1F2937',
        bodyColor: theme === 'dark' ? '#E5E7EB' : '#1F2937',
        borderColor: theme === 'dark' ? 'var(--primary-purple-light)' : 'var(--primary-purple)',
        borderWidth: 2,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        boxPadding: 6,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += context.parsed.y + ' ejercicios';
              } else {
                label += context.parsed.y + ' minutos';
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue > 0 ? Math.ceil(maxValue * 1.2) : 10,
        ticks: {
          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
          font: {
            size: 11,
            weight: '500' as const,
          },
          stepSize: 1,
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1,
          display: true,
        },
        border: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          width: 2,
          display: true,
        },
      },
      y1: {
        type: 'linear' as const,
        display: false,
        position: 'right' as const,
        beginAtZero: true,
        max: maxValue > 0 ? Math.ceil(maxValue * 1.2) : 10,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#D1D5DB' : '#4B5563',
          font: {
            size: 12,
            weight: '600' as const,
          },
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1,
          display: true,
        },
        border: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          width: 2,
          display: true,
        },
      },
    },
  };

  const totalExercises = user?.progress?.reduce((acc, p) => acc + p.exercisesCompleted, 0) || 0;
  // Calcular tiempo total: usar el tiempo total del usuario si existe, sino sumar de los progresos
  const totalTimeFromProgress = user?.progress?.reduce((acc, p) => acc + (p.timeSpent || 0), 0) || 0;
  const totalTime = user?.totalTime && user.totalTime > 0 ? user.totalTime : totalTimeFromProgress;
  
  // Formatear tiempo total en horas y minutos
  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  const unlockedAchievements = user?.achievements?.length || 0;
  const totalAchievements = achievements.length;
  const topicsCompleted = user?.progress?.filter(p => p.completedLevels.length > 0).length || 0;

  const completionRate = topics.length > 0 
    ? (user?.progress?.filter(p => p.completedLevels.length > 0).length || 0) / topics.length * 100 
    : 0;

  return (
    <div className="progress-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="progress-header"
      >
        <div className="header-content-progress">
          <div className="header-text-progress">
            <motion.h1
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Mi Progreso
            </motion.h1>
            <p>Visualiza tus estadísticas y avances</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="header-image-progress"
          >
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop" 
              alt="Progreso"
              className="progress-hero-image"
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
              className="progress-hero-glow"
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="completion-summary"
      >
        <div className="summary-content">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="summary-icon"
          >
            <Target size={48} />
          </motion.div>
          <div className="summary-text">
            <h3>Progreso General</h3>
            <p>Has completado el {Math.round(completionRate)}% de todos los temas disponibles</p>
          </div>
          <div className="summary-progress-ring">
            <svg width="120" height="120" className="progress-ring">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="var(--white)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - completionRate / 100) }}
                transition={{ duration: 1.5, delay: 0.5 }}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="progress-ring-text">
              <span>{Math.round(completionRate)}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="progress-stats" ref={statsRef}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="stat-card"
        >
          <motion.div 
            className="stat-icon" 
            style={{ background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.2) 0%, rgba(123, 44, 191, 0.1) 100%)' }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Target size={32} style={{ color: 'var(--primary-purple)' }} />
          </motion.div>
          <div className="stat-content">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              {totalExercises}
            </motion.h3>
            <p>Ejercicios Completados</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="stat-card"
        >
          <motion.div 
            className="stat-icon" 
            style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)' }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Clock size={32} style={{ color: 'var(--success)' }} />
          </motion.div>
          <div className="stat-content">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              {formatTotalTime(totalTime)}
            </motion.h3>
            <p>Tiempo Total</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="stat-card"
        >
          <motion.div 
            className="stat-icon" 
            style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)' }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Award size={32} style={{ color: 'var(--warning)' }} />
          </motion.div>
          <div className="stat-content">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              {unlockedAchievements} / {totalAchievements}
            </motion.h3>
            <p>Logros Desbloqueados</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="stat-card"
        >
          <motion.div 
            className="stat-icon" 
            style={{ background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.2) 0%, rgba(123, 44, 191, 0.1) 100%)' }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <TrendingUp size={32} style={{ color: 'var(--primary-purple-light)' }} />
          </motion.div>
          <div className="stat-content">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {topicsCompleted}
            </motion.h3>
            <p>Temas Completados</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={chartRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isChartInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="chart-container"
      >
        <div className="chart-header">
          <BarChart3 size={24} />
          <h2>Progreso de los Últimos 7 Días</h2>
        </div>
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="topics-progress"
      >
        <h2>Progreso por Tema</h2>
        <div className="topics-list">
          {topics.map((topic, index) => {
            const progress = user?.progress?.find(p => p.topicId === topic.id);
            const completedLevels = progress?.completedLevels.length || 0;
            const totalLevels = topic.levels.length;
            const percentage = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="topic-progress-item"
              >
                <div className="topic-progress-header">
                  <div className="topic-icon">
                    <IconRenderer iconName={topic.icon} size={32} />
                  </div>
                  <div className="topic-info">
                    <h3>{topic.name}</h3>
                    <p>{completedLevels} / {totalLevels} niveles completados</p>
                  </div>
                  <span className="topic-percentage">{Math.round(percentage)}%</span>
                </div>
                <div className="progress-bar-container">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        ref={achievementsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isAchievementsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1 }}
        className="achievements-section"
      >
        <div className="achievements-header">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Award size={32} />
          </motion.div>
          <h2>Logros</h2>
          <p>{unlockedAchievements} de {totalAchievements} desbloqueados</p>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => {
            const isUnlocked = user?.achievements?.some(a => a.id === achievement.id);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isAchievementsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1 + index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">
                  <IconRenderer iconName={achievement.icon} size={48} />
                </div>
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                {isUnlocked && (
                  <span className="achievement-badge">Desbloqueado</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Progress;

