import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Exercise from './pages/Exercise';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import Layout from './components/Layout';
import AchievementNotification from './components/AchievementNotification';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  const { newAchievement, clearNewAchievement } = useAuth();

  return (
    <>
      <Router>
        <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/topics"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Topics />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/topics/:topicId"
                element={
                  <PrivateRoute>
                    <Layout>
                      <TopicDetail />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/topics/:topicId/level/:levelId"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Exercise />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Progress />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Layout>
                      <AdminPanel />
                    </Layout>
                  </AdminRoute>
                }
              />
        </Routes>
      </Router>
      <AchievementNotification 
        achievement={newAchievement} 
        onClose={clearNewAchievement} 
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

