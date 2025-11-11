import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Home, BookOpen, User, BarChart3, Settings, LogOut, Menu, X, BookOpenCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="logo-icon-container"
            >
              <BookOpenCheck size={28} />
            </motion.div>
            <span className="logo-text">ED-KNOWS</span>
          </Link>
          
          <nav className="nav-desktop">
            <Link to="/dashboard" className="nav-link">
              <Home size={20} />
              <span>Inicio</span>
            </Link>
            <Link to="/topics" className="nav-link">
              <BookOpen size={20} />
              <span>Temas</span>
            </Link>
            <Link to="/progress" className="nav-link">
              <BarChart3 size={20} />
              <span>Progreso</span>
            </Link>
            <Link to="/profile" className="nav-link">
              <User size={20} />
              <span>Perfil</span>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link">
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          <div className="header-actions">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="theme-toggle"
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

            <button
              onClick={handleLogout}
              className="logout-btn"
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="nav-mobile"
            >
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Home size={20} />
                <span>Inicio</span>
              </Link>
              <Link to="/topics" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen size={20} />
                <span>Temas</span>
              </Link>
              <Link to="/progress" onClick={() => setMobileMenuOpen(false)}>
                <BarChart3 size={20} />
                <span>Progreso</span>
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} />
                <span>Perfil</span>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={20} />
                  <span>Admin</span>
                </Link>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
