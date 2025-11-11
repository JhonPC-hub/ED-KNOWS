import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { 
  BookOpen, Users, Award, TrendingUp, ArrowRight, CheckCircle, 
  Clock, Target, BarChart3, Zap, Shield, Star, PlayCircle,
  GraduationCap, Calculator, LineChart, Sparkles, Sun, Moon, BookOpenCheck, User
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import './LandingPage.css';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { testimonials, posts } = useData();
  const [currentComment, setCurrentComment] = useState(0);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // Obtener todos los comentarios de los posts
  const allComments = posts
    .flatMap(post => 
      post.comments.map(comment => ({
        ...comment,
        postContent: post.content,
        postType: post.type,
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Si no hay comentarios, usar testimonios aprobados o testimonios por defecto
  const displayComments = allComments.length > 0
    ? allComments.slice(0, 10).map(c => ({
        id: c.id,
        name: c.username,
        role: 'Estudiante',
        text: c.content,
        image: c.userProfilePicture,
      }))
    : (() => {
        const approvedTestimonials = testimonials.filter(t => t.approved);
        if (approvedTestimonials.length > 0) {
          return approvedTestimonials.slice(0, 4).map(t => ({
            id: t.id,
            name: t.username,
            role: 'Estudiante',
            text: t.text,
            image: t.userProfilePicture,
          }));
        }
        return [
          {
            id: 1,
            name: 'María González',
            role: 'Estudiante de Ingeniería',
            text: 'ED-KNOWS me ayudó a entender ecuaciones diferenciales de una manera completamente nueva. Los ejercicios son claros y los videos explicativos son excelentes.',
            image: undefined,
          },
          {
            id: 2,
            name: 'Carlos Ramírez',
            role: 'Estudiante de Matemáticas',
            text: 'Finalmente encontré una plataforma donde puedo practicar con ejercicios validados por profesores. El sistema de progreso me motiva a seguir aprendiendo.',
            image: undefined,
          },
          {
            id: 3,
            name: 'Ana Martínez',
            role: 'Estudiante de Física',
            text: 'La estructura por niveles es perfecta. Empiezas desde lo básico y vas avanzando gradualmente. Los logros hacen que el aprendizaje sea divertido.',
            image: undefined,
          },
          {
            id: 4,
            name: 'Diego Sánchez',
            role: 'Estudiante de Ingeniería',
            text: 'El cronómetro y el sistema de verificación de respuestas me ayudan a practicar de forma eficiente. ¡Altamente recomendado!',
            image: undefined,
          },
        ];
      })();

  useEffect(() => {
    if (displayComments.length > 0) {
      const interval = setInterval(() => {
        setCurrentComment((prev) => (prev + 1) % displayComments.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [displayComments.length]);

  const features = [
    {
      icon: <Shield size={40} />,
      title: 'Contenido Validado',
      description: 'Todos los ejercicios y videos están autorizados por docentes expertos de la Universidad Simón Bolívar',
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Seguimiento de Progreso',
      description: 'Visualiza tu avance con gráficas detalladas y estadísticas en tiempo real',
    },
    {
      icon: <Award size={40} />,
      title: 'Sistema de Logros',
      description: 'Desbloquea logros mientras aprendes y completa desafíos gamificados',
    },
    {
      icon: <BookOpen size={40} />,
      title: 'Aprendizaje Estructurado',
      description: 'Organizado por temas y niveles (0-5) para un aprendizaje progresivo',
    },
    {
      icon: <Clock size={40} />,
      title: 'Cronómetro Integrado',
      description: 'Practica con tiempo real y mejora tu velocidad de resolución',
    },
    {
      icon: <Users size={40} />,
      title: 'Comunidad Activa',
      description: 'Comparte logros, haz preguntas y aprende junto a otros estudiantes',
    },
  ];

  const stats = [
    { icon: <Users size={32} />, value: 500, label: 'Estudiantes Activos', suffix: '+' },
    { icon: <BookOpen size={32} />, value: 50, label: 'Ejercicios Disponibles', suffix: '+' },
    { icon: <Award size={32} />, value: 15, label: 'Logros Desbloqueables', suffix: '' },
    { icon: <Star size={32} />, value: 4.9, label: 'Calificación Promedio', suffix: '/5' },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Regístrate Gratis',
      description: 'Crea tu cuenta en menos de un minuto y comienza tu viaje de aprendizaje',
      icon: <Users size={48} />,
    },
    {
      number: '02',
      title: 'Elige un Tema',
      description: 'Selecciona entre diferentes temas de ecuaciones diferenciales',
      icon: <BookOpen size={48} />,
    },
    {
      number: '03',
      title: 'Ve el Video Tutorial',
      description: 'Aprende los conceptos básicos con videos explicativos (Nivel 0)',
      icon: <PlayCircle size={48} />,
    },
    {
      number: '04',
      title: 'Practica con Ejercicios',
      description: 'Resuelve ejercicios de nivel 1 a 5 con cronómetro y verificación',
      icon: <Calculator size={48} />,
    },
    {
      number: '05',
      title: 'Rastrea tu Progreso',
      description: 'Visualiza tus avances, logros y tiempo invertido en la plataforma',
      icon: <BarChart3 size={48} />,
    },
  ];

  const benefits = [
    { icon: <Zap size={24} />, text: 'Aprende a tu propio ritmo' },
    { icon: <Target size={24} />, text: 'Ejercicios validados por profesores' },
    { icon: <LineChart size={24} />, text: 'Seguimiento detallado de progreso' },
    { icon: <Sparkles size={24} />, text: 'Sistema gamificado con logros' },
    { icon: <Clock size={24} />, text: 'Cronómetro para medir tu velocidad' },
    { icon: <GraduationCap size={24} />, text: 'Contenido de nivel universitario' },
  ];

  return (
    <div className={`landing-page ${theme}`}>
      <header className="landing-header">
        <div className="landing-header-content">
          <Link to="/" className="landing-logo-link">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="landing-logo"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="logo-icon"
              >
                <BookOpenCheck size={32} />
              </motion.div>
              <span className="logo-text-styled">ED-KNOWS</span>
            </motion.div>
          </Link>
          <nav className="landing-nav">
            <Link to="/about">Acerca de</Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="theme-toggle-landing"
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
            <Link to="/login" className="btn-secondary">Iniciar Sesión</Link>
            <Link to="/register" className="btn-primary">Crear Cuenta</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h2 className="hero-title">
              Aprende Ecuaciones Diferenciales de Forma Interactiva
            </h2>
            <p className="hero-description">
              Encuentra videos y ejercicios detallados validados por docentes expertos.
              Domina las ecuaciones diferenciales con nuestro sistema de aprendizaje
              estructurado y gamificado.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary-large">
                Comenzar Ahora
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn-secondary-large">
                Saber Más
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-image"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="hero-image-placeholder"
            >
              <img 
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=600&fit=crop" 
                alt="Matemáticas y ecuaciones"
                className="hero-main-image"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="hero-glow"
              />
            </motion.div>
            <motion.div
              animate={{ 
                x: [0, 30, 0],
                y: [0, -30, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="floating-icon floating-icon-1"
            >
              <Calculator size={40} />
            </motion.div>
            <motion.div
              animate={{ 
                x: [0, -30, 0],
                y: [0, 30, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="floating-icon floating-icon-2"
            >
              <LineChart size={40} />
            </motion.div>
            <motion.div
              animate={{ 
                x: [0, 20, 0],
                y: [0, 20, 0]
              }}
              transition={{ 
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="floating-icon floating-icon-3"
            >
              <Target size={40} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="stats-section" ref={statsRef}>
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

      <section className="features">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            ¿Por qué elegir ED-KNOWS?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="feature-card"
              >
                <motion.div 
                  className="feature-icon"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Cómo Funciona
          </motion.h2>
          <div className="process-steps">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="process-step"
              >
                <div className="process-number">{step.number}</div>
                <div className="process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Comentarios de Nuestra Comunidad
          </motion.h2>
          <div className="testimonials-carousel">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentComment}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card featured"
              >
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <CheckCircle size={32} />
                  </div>
                  <p>"{displayComments[currentComment]?.text || ''}"</p>
                </div>
                <div className="testimonial-author">
                  {displayComments[currentComment]?.image ? (
                    <img 
                      src={displayComments[currentComment].image} 
                      alt={displayComments[currentComment].name}
                      className="testimonial-avatar-img"
                    />
                  ) : (
                    <div className="testimonial-avatar-placeholder">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h4>{displayComments[currentComment]?.name || ''}</h4>
                    <p>{displayComments[currentComment]?.role || ''}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="testimonial-dots">
              {displayComments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentComment(index)}
                  className={`dot ${index === currentComment ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="testimonials-grid">
            {displayComments.slice(0, 3).map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="testimonial-card"
              >
                <div className="testimonial-content">
                  <p>"{comment.text}"</p>
                </div>
                <div className="testimonial-author">
                  {comment.image ? (
                    <img 
                      src={comment.image} 
                      alt={comment.name}
                      className="testimonial-avatar-img"
                    />
                  ) : (
                    <div className="testimonial-avatar-placeholder">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h4>{comment.name}</h4>
                    <p>{comment.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="teachers">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Docentes Colaboradores
          </motion.h2>
          <div className="teachers-grid">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="teacher-card"
            >
              <div className="teacher-avatar">
                <Users size={60} />
              </div>
              <h3>Profesora Judith Bermúdez</h3>
              <p>Profesora del Área de Matemáticas</p>
              <p className="teacher-institution">Universidad Simón Bolívar</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="teacher-card"
            >
              <div className="teacher-avatar">
                <Users size={60} />
              </div>
              <h3>Profesor Cristian Castro</h3>
              <p>Profesor del Área de Matemáticas</p>
              <p className="teacher-institution">Universidad Simón Bolívar</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Beneficios Adicionales
          </motion.h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: 10 }}
                className="benefit-item"
              >
                <div className="benefit-icon">{benefit.icon}</div>
                <p>{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <motion.h2
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ¿Listo para comenzar tu aprendizaje?
            </motion.h2>
            <p>Únete a cientos de estudiantes que ya están dominando las ecuaciones diferenciales</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="btn-primary-large">
                Crear Cuenta Gratis
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <h3>ED-KNOWS</h3>
              <p>Plataforma de aprendizaje de ecuaciones diferenciales</p>
            </div>
            <div>
              <h4>Desarrollador</h4>
              <p>Jhon F. Pérez Castro</p>
              <p>jhon.perezc@unisimon.edu.co</p>
            </div>
            <div>
              <h4>Enlaces</h4>
              <Link to="/about">Acerca de</Link>
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

export default LandingPage;

