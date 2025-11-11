import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { 
  User, Mail, Lock, Save, Camera, Settings, Award, TrendingUp, Clock, Target, Sparkles,
  Bell, Shield, Globe, Download, Trash2, Eye, EyeOff, Volume2, VolumeX, Zap, 
  BookOpen, Calendar, HelpCircle, LogOut, Database, FileText, MessageSquare, Mail as MailIcon
} from 'lucide-react';
import CreateRequest from '@/components/CreateRequest';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { topics, achievements } = useData();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Preferencias de notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [progressUpdates, setProgressUpdates] = useState(false);
  
  // Configuración de privacidad
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [showProgress, setShowProgress] = useState(true);
  const [showAchievements, setShowAchievements] = useState(true);
  
  // Preferencias de aprendizaje
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [showHints, setShowHints] = useState(true);
  
  // Configuración de cuenta
  const [language, setLanguage] = useState('es');
  const [timezone, setTimezone] = useState('America/Bogota');
  
  // Modales
  const [showRequestModal, setShowRequestModal] = useState(false);

  const completedTopics = user?.progress?.filter(p => p.completedLevels.length > 0).length || 0;
  const totalExercises = user?.progress?.reduce((acc, p) => acc + p.exercisesCompleted, 0) || 0;
  const unlockedAchievements = user?.achievements?.length || 0;
  const totalTime = user?.totalTime || 0;

  const handleSaveProfile = () => {
    if (!username || !email) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos' });
      return;
    }

    updateUser({ username, email });
    setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos' });
      return;
    }

    if (currentPassword !== user?.password) {
      setMessage({ type: 'error', text: 'La contraseña actual es incorrecta' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    updateUser({ password: newPassword });
    setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profilePicture: reader.result as string });
        setMessage({ type: 'success', text: 'Foto de perfil actualizada' });
        setTimeout(() => setMessage(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePreferences = () => {
    // Aquí se guardarían las preferencias en el usuario
    setMessage({ type: 'success', text: 'Preferencias guardadas correctamente' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      user: {
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
      },
      progress: user?.progress,
      achievements: user?.achievements,
      preferences: {
        emailNotifications,
        pushNotifications,
        profileVisibility,
        difficultyLevel,
        language,
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edknows-data-${user?.username}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Datos exportados correctamente' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      setMessage({ type: 'error', text: 'Función de eliminación de cuenta no implementada' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="profile-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-header"
      >
        <div className="header-content-profile">
          <div className="header-text-profile">
            <motion.h1
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Mi Perfil
            </motion.h1>
            <p>Gestiona tu información personal y preferencias</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="header-image-profile"
          >
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Perfil"
                className="profile-hero-image"
              />
            ) : (
              <div className="profile-hero-placeholder">
                <User size={80} />
              </div>
            )}
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
              className="profile-hero-glow"
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="profile-stats-overview"
      >
        <div className="stats-overview-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="stat-overview-card"
          >
            <motion.div
              className="stat-overview-icon"
              style={{ background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.2) 0%, rgba(123, 44, 191, 0.1) 100%)' }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Target size={32} style={{ color: 'var(--primary-purple)' }} />
            </motion.div>
            <div className="stat-overview-content">
              <h3>{totalExercises}</h3>
              <p>Ejercicios</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="stat-overview-card"
          >
            <motion.div
              className="stat-overview-icon"
              style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)' }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp size={32} style={{ color: 'var(--success)' }} />
            </motion.div>
            <div className="stat-overview-content">
              <h3>{completedTopics}</h3>
              <p>Temas</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="stat-overview-card"
          >
            <motion.div
              className="stat-overview-icon"
              style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)' }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Award size={32} style={{ color: 'var(--warning)' }} />
            </motion.div>
            <div className="stat-overview-content">
              <h3>{unlockedAchievements}</h3>
              <p>Logros</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="stat-overview-card"
          >
            <motion.div
              className="stat-overview-icon"
              style={{ background: 'linear-gradient(135deg, rgba(123, 44, 191, 0.2) 0%, rgba(123, 44, 191, 0.1) 100%)' }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Clock size={32} style={{ color: 'var(--primary-purple-light)' }} />
            </motion.div>
            <div className="stat-overview-content">
              <h3>{Math.floor(totalTime / 60)}h</h3>
              <p>Tiempo</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`message ${message.type}`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="profile-content">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="profile-section"
        >
          <div className="section-header">
            <User size={24} />
            <h2>Información Personal</h2>
          </div>

          <div className="profile-picture-section">
            <div className="profile-picture">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Perfil" />
              ) : (
                <User size={64} />
              )}
            </div>
            <label htmlFor="profile-picture" className="picture-upload-btn">
              <Camera size={20} />
              Cambiar Foto
            </label>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <User size={18} />
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            className="save-btn"
          >
            <Save size={20} />
            Guardar Cambios
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="profile-section"
        >
          <div className="section-header">
            <Lock size={24} />
            <h2>Cambiar Contraseña</h2>
          </div>

          <div className="form-group">
            <label htmlFor="current-password">Contraseña Actual</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">Nueva Contraseña</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChangePassword}
            className="save-btn"
          >
            <Lock size={20} />
            Cambiar Contraseña
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="profile-section"
      >
        <div className="section-header">
          <Bell size={24} />
          <h2>Notificaciones</h2>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <Mail size={18} />
              <span>Notificaciones por Email</span>
            </div>
            <p className="preference-description">Recibe actualizaciones importantes por correo electrónico</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <Bell size={18} />
              <span>Notificaciones Push</span>
            </div>
            <p className="preference-description">Recibe notificaciones en tiempo real</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <Award size={18} />
              <span>Alertas de Logros</span>
            </div>
            <p className="preference-description">Notificaciones cuando desbloquees un logro</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={achievementAlerts}
              onChange={(e) => setAchievementAlerts(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <TrendingUp size={18} />
              <span>Actualizaciones de Progreso</span>
            </div>
            <p className="preference-description">Resúmenes semanales de tu progreso</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={progressUpdates}
              onChange={(e) => setProgressUpdates(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePreferences}
          className="save-btn"
        >
          <Save size={20} />
          Guardar Preferencias
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="profile-section"
      >
        <div className="section-header">
          <Shield size={24} />
          <h2>Privacidad</h2>
        </div>

        <div className="form-group">
          <label htmlFor="profile-visibility">
            <Eye size={18} />
            Visibilidad del Perfil
          </label>
          <select
            id="profile-visibility"
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
            className="form-select"
          >
            <option value="public">Público - Cualquiera puede ver tu perfil</option>
            <option value="private">Privado - Solo tú puedes ver tu perfil</option>
          </select>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <TrendingUp size={18} />
              <span>Mostrar Progreso</span>
            </div>
            <p className="preference-description">Permite que otros vean tu progreso</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showProgress}
              onChange={(e) => setShowProgress(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <Award size={18} />
              <span>Mostrar Logros</span>
            </div>
            <p className="preference-description">Permite que otros vean tus logros</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showAchievements}
              onChange={(e) => setShowAchievements(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePreferences}
          className="save-btn"
        >
          <Save size={20} />
          Guardar Configuración
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="profile-section"
      >
        <div className="section-header">
          <BookOpen size={24} />
          <h2>Preferencias de Aprendizaje</h2>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">
            <Zap size={18} />
            Nivel de Dificultad
          </label>
          <select
            id="difficulty"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
            className="form-select"
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <Volume2 size={18} />
              <span>Reproducir Videos Automáticamente</span>
            </div>
            <p className="preference-description">Los videos se reproducirán automáticamente al abrir</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoPlayVideos}
              onChange={(e) => setAutoPlayVideos(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <div className="preference-label">
              <HelpCircle size={18} />
              <span>Mostrar Pistas</span>
            </div>
            <p className="preference-description">Muestra pistas y ayudas durante los ejercicios</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showHints}
              onChange={(e) => setShowHints(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePreferences}
          className="save-btn"
        >
          <Save size={20} />
          Guardar Preferencias
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="profile-section"
      >
        <div className="section-header">
          <Globe size={24} />
          <h2>Idioma y Región</h2>
        </div>

        <div className="form-group">
          <label htmlFor="language">
            <Globe size={18} />
            Idioma
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timezone">
            <Calendar size={18} />
            Zona Horaria
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="form-select"
          >
            <option value="America/Bogota">Bogotá (GMT-5)</option>
            <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
            <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
            <option value="America/Santiago">Santiago (GMT-3)</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSavePreferences}
          className="save-btn"
        >
          <Save size={20} />
          Guardar Configuración
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="profile-section"
      >
        <div className="section-header">
          <Database size={24} />
          <h2>Datos y Exportación</h2>
        </div>

        <div className="action-item">
          <div className="action-info">
            <div className="action-label">
              <Download size={20} />
              <span>Exportar Mis Datos</span>
            </div>
            <p className="action-description">Descarga una copia de todos tus datos en formato JSON</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportData}
            className="action-btn export-btn"
          >
            <Download size={18} />
            Exportar
          </motion.button>
        </div>

        <div className="action-item">
          <div className="action-info">
            <div className="action-label">
              <FileText size={20} />
              <span>Descargar Certificado</span>
            </div>
            <p className="action-description">Obtén un certificado de tus logros y progreso</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMessage({ type: 'success', text: 'Función de certificado próximamente disponible' });
              setTimeout(() => setMessage(null), 3000);
            }}
            className="action-btn export-btn"
          >
            <FileText size={18} />
            Descargar
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="profile-section danger-section"
      >
        <div className="section-header">
          <Trash2 size={24} />
          <h2>Zona de Peligro</h2>
        </div>

        <div className="action-item">
          <div className="action-info">
            <div className="action-label">
              <Trash2 size={20} />
              <span>Eliminar Cuenta</span>
            </div>
            <p className="action-description danger-text">
              Elimina permanentemente tu cuenta y todos tus datos. Esta acción no se puede deshacer.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteAccount}
            className="action-btn danger-btn"
          >
            <Trash2 size={18} />
            Eliminar Cuenta
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="profile-section"
      >
        <h2>Contacto y Soporte</h2>
        <div className="action-item">
          <div className="action-info">
            <h3>Enviar Solicitud o Queja</h3>
            <p className="action-description">
              Envía sugerencias, quejas o preguntas. El administrador recibirá tu mensaje y te responderá.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRequestModal(true)}
            className="action-btn"
          >
            <MailIcon size={18} />
            Enviar Solicitud
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="profile-stats"
      >
        <div className="stat-item">
          <h3>Miembro desde</h3>
          <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}</p>
        </div>
        <div className="stat-item">
          <h3>Rol</h3>
          <p>{user?.role === 'admin' ? 'Administrador' : 'Estudiante'}</p>
        </div>
        <div className="stat-item">
          <h3>Tiempo Total</h3>
          <p>{Math.floor((user?.totalTime || 0) / 60)}h {(user?.totalTime || 0) % 60}m</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showRequestModal && (
          <CreateRequest onClose={() => setShowRequestModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;

