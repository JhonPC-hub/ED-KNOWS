import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { 
  BookOpen, Users, Mail, ArrowLeft, GraduationCap, 
  Target, Heart, Lightbulb, Award, TrendingUp, 
  Shield, Zap, Code, Star, CheckCircle,
  BarChart3, Clock, Sparkles, Sun, Moon, BookOpenCheck
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import './About.css';

const About = () => {
  const { theme, toggleTheme } = useTheme();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  const values = [
    {
      icon: <Shield size={48} />,
      title: 'Calidad',
      description: 'Todo nuestro contenido está validado por expertos académicos para garantizar la máxima calidad educativa.',
    },
    {
      icon: <Heart size={48} />,
      title: 'Accesibilidad',
      description: 'Creemos que la educación de calidad debe estar disponible para todos los estudiantes.',
    },
    {
      icon: <Lightbulb size={48} />,
      title: 'Innovación',
      description: 'Utilizamos tecnología moderna para crear una experiencia de aprendizaje única y efectiva.',
    },
    {
      icon: <Target size={48} />,
      title: 'Excelencia',
      description: 'Nos esforzamos por superar las expectativas y proporcionar la mejor experiencia educativa.',
    },
  ];

  const stats = [
    { icon: <Users size={32} />, value: 500, label: 'Estudiantes', suffix: '+' },
    { icon: <BookOpen size={32} />, value: 50, label: 'Ejercicios', suffix: '+' },
    { icon: <Award size={32} />, value: 15, label: 'Logros', suffix: '' },
    { icon: <Star size={32} />, value: 4.9, label: 'Calificación', suffix: '/5' },
  ];

  const features = [
    { icon: <Shield size={32} />, text: 'Contenido validado por profesores' },
    { icon: <TrendingUp size={32} />, text: 'Seguimiento de progreso detallado' },
    { icon: <Award size={32} />, text: 'Sistema de logros gamificado' },
    { icon: <BookOpen size={32} />, text: 'Aprendizaje estructurado por niveles' },
    { icon: <Clock size={32} />, text: 'Cronómetro integrado para práctica' },
    { icon: <Users size={32} />, text: 'Comunidad activa de estudiantes' },
    { icon: <BarChart3 size={32} />, text: 'Gráficas de progreso semanal' },
    { icon: <Sparkles size={32} />, text: 'Experiencia visual atractiva' },
  ];

  return (
    <div className={`about-page ${theme}`}>
      <header className="about-header">
        <div className="about-header-content">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="about-logo-container"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="about-logo-icon"
            >
              <BookOpenCheck size={32} />
            </motion.div>
            <h1 className="about-logo">ED-KNOWS</h1>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="theme-toggle-about"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-text"
            >
              <motion.h2
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Acerca de ED-KNOWS
              </motion.h2>
              <p className="hero-description">
                ED-KNOWS es una plataforma educativa diseñada específicamente para estudiantes
                de ecuaciones diferenciales. Nuestro objetivo es proporcionar un espacio donde
                los estudiantes puedan encontrar contenido validado y autorizado por docentes
                expertos, facilitando el aprendizaje de esta importante área de las matemáticas.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hero-image-container"
            >
              <img 
                src="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop" 
                alt="Educación y aprendizaje"
                className="hero-about-image"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="hero-image-glow"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-stats" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="stat-item"
              >
                <div className="stat-icon">{stat.icon}</div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={isStatsInView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {stat.value}{stat.suffix}
                </motion.h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <div className="mission-vision-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mission-content"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mission-icon"
              >
                <Target size={64} />
              </motion.div>
              <h3>Nuestra Misión</h3>
              <p>
                Crear una plataforma accesible y confiable donde los estudiantes puedan aprender
                ecuaciones diferenciales a través de ejercicios y videos cuidadosamente seleccionados
                y validados por profesores especializados. Creemos que el aprendizaje debe ser
                estructurado, progresivo y, sobre todo, validado por expertos en la materia.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="vision-content"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="vision-icon"
              >
                <Lightbulb size={64} />
              </motion.div>
              <h3>Nuestra Visión</h3>
              <p>
                Ser la plataforma líder en educación de ecuaciones diferenciales, reconocida por
                su calidad, innovación y compromiso con el éxito estudiantil. Aspiramos a expandir
                nuestro contenido y llegar a estudiantes de todas las universidades, facilitando
                el aprendizaje de esta disciplina fundamental.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Nuestros Valores
          </motion.h3>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="value-card"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="value-icon"
                >
                  {value.icon}
                </motion.div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-teachers">
        <div className="container">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Docentes Colaboradores
          </motion.h3>
          <div className="teachers-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="teacher-card"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="teacher-avatar"
              >
                <div className="teacher-avatar-placeholder">
                  <GraduationCap size={60} />
                </div>
              </motion.div>
              <h4>Profesora Judith Bermúdez</h4>
              <p className="teacher-role">Profesora del Área de Matemáticas</p>
              <p className="teacher-institution">
                <GraduationCap size={16} />
                Universidad Simón Bolívar
              </p>
              <p className="teacher-bio">
                La profesora Bermúdez ha contribuido significativamente con su experiencia
                en la validación de ejercicios y la creación de contenido educativo de calidad
                para la plataforma. Su dedicación y conocimiento han sido fundamentales para
                el éxito de ED-KNOWS.
              </p>
              <div className="teacher-badges">
                <span className="badge">
                  <Award size={14} />
                  Experta en ED
                </span>
                <span className="badge">
                  <Star size={14} />
                  Validación de Contenido
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="teacher-card"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="teacher-avatar"
              >
                <div className="teacher-avatar-placeholder">
                  <GraduationCap size={60} />
                </div>
              </motion.div>
              <h4>Profesor Cristian Castro</h4>
              <p className="teacher-role">Profesor del Área de Matemáticas</p>
              <p className="teacher-institution">
                <GraduationCap size={16} />
                Universidad Simón Bolívar
              </p>
              <p className="teacher-bio">
                El profesor Castro ha aportado su conocimiento y experiencia en ecuaciones
                diferenciales para asegurar que todos los ejercicios y materiales educativos
                cumplan con los más altos estándares académicos. Su compromiso con la excelencia
                educativa es evidente en cada recurso de la plataforma.
              </p>
              <div className="teacher-badges">
                <span className="badge">
                  <Award size={14} />
                  Especialista en ED
                </span>
                <span className="badge">
                  <Star size={14} />
                  Control de Calidad
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-developer">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="developer-card"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="developer-image-container"
            >
              <div className="developer-avatar-placeholder">
                <Code size={80} />
              </div>
            </motion.div>
            <div className="developer-header">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Code size={48} />
              </motion.div>
              <h3>Desarrollador</h3>
            </div>
            <div className="developer-info">
              <h4>Jhon F. Pérez Castro</h4>
              <p className="developer-role">
                <GraduationCap size={18} />
                Estudiante - Universidad Simón Bolívar
              </p>
              <div className="developer-contact">
                <Mail size={20} />
                <a href="mailto:jhon.perezc@unisimon.edu.co">jhon.perezc@unisimon.edu.co</a>
              </div>
              <p className="developer-bio">
                Estudiante de la Universidad Simón Bolívar, desarrollador de esta plataforma
                educativa con el objetivo de facilitar el aprendizaje de ecuaciones diferenciales
                para estudiantes de todas las áreas. Apasionado por la educación y la tecnología,
                creó ED-KNOWS para transformar la forma en que los estudiantes aprenden matemáticas.
              </p>
              <div className="developer-skills">
                <span className="skill-tag">
                  <Zap size={14} />
                  React & TypeScript
                </span>
                <span className="skill-tag">
                  <Code size={14} />
                  Desarrollo Web
                </span>
                <span className="skill-tag">
                  <Heart size={14} />
                  Educación
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="about-features">
        <div className="container">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Características Principales
          </motion.h3>
          <div className="features-grid-extended">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, x: 10 }}
                className="feature-item-extended"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="feature-icon-extended"
                >
                  {feature.icon}
                </motion.div>
                <p>{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <h4>ED-KNOWS</h4>
              <p>Plataforma de aprendizaje de ecuaciones diferenciales</p>
            </div>
            <div>
              <h4>Enlaces</h4>
              <Link to="/">Inicio</Link>
              <Link to="/login">Iniciar Sesión</Link>
              <Link to="/register">Registrarse</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ED-KNOWS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;

