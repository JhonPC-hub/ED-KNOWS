import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, XCircle, Mail, CheckCircle, AlertCircle, HelpCircle, Clock, Sparkles, Shield, MessageSquare } from 'lucide-react';
import IconRenderer from '@/components/IconRenderer';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const { topics, addTopic, updateTopic, deleteTopic, addLevel, updateLevel, deleteLevel, requests, updateRequestStatus, deleteRequest } = useData();
  const [activeTab, setActiveTab] = useState<'users' | 'topics' | 'lessons' | 'requests'>('users');
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingLevel, setEditingLevel] = useState<{ topicId: string; levelId: string } | null>(null);
  const [newTopic, setNewTopic] = useState({ name: '', description: '', icon: 'FunctionSquare', image: '' });
  const [newLevel, setNewLevel] = useState({ topicId: '', levelNumber: 0, type: 'exercise' as 'video' | 'exercise', description: '', videoUrl: '', exerciseImage: '', solutionImage: '', explanationVideo: '' });
  const [editingTopicImage, setEditingTopicImage] = useState<string>('');

  // Obtener usuarios desde localStorage
  const [allUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  const handleTopicImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingTopicImage(reader.result as string);
        } else {
          setNewTopic({ ...newTopic, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTopic = async () => {
    if (newTopic.name && newTopic.description) {
      try {
        await addTopic({
          id: `topic-${Date.now()}`,
          ...newTopic,
          image: newTopic.image || undefined,
          levels: [],
        });
        setNewTopic({ name: '', description: '', icon: 'FunctionSquare', image: '' });
      } catch (error: any) {
        alert(error.message || 'Error al crear tema');
      }
    }
  };

  const handleAddLevel = async () => {
    if (newLevel.topicId) {
      try {
        await addLevel(newLevel.topicId, {
          id: `level-${Date.now()}`,
          ...newLevel,
          description: newLevel.description || undefined,
        });
        setNewLevel({ topicId: '', levelNumber: 0, type: 'exercise', description: '', videoUrl: '', exerciseImage: '', solutionImage: '', explanationVideo: '' });
      } catch (error: any) {
        alert(error.message || 'Error al crear nivel');
      }
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('¿Estás seguro de eliminar este tema?')) {
      try {
        await deleteTopic(topicId);
      } catch (error: any) {
        alert(error.message || 'Error al eliminar tema');
      }
    }
  };

  const handleDeleteLevel = async (topicId: string, levelId: string) => {
    if (confirm('¿Estás seguro de eliminar este nivel?')) {
      try {
        await deleteLevel(topicId, levelId);
      } catch (error: any) {
        alert(error.message || 'Error al eliminar nivel');
      }
    }
  };

  return (
    <div className="admin-panel">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-header"
      >
        <div className="admin-header-content">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="admin-header-icon"
          >
            <Shield size={48} />
          </motion.div>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Panel de Administración
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Gestiona usuarios, temas, lecciones y solicitudes
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Usuarios
        </button>
        <button
          className={activeTab === 'topics' ? 'active' : ''}
          onClick={() => setActiveTab('topics')}
        >
          <BookOpen size={20} />
          Temas
        </button>
        <button
          className={activeTab === 'lessons' ? 'active' : ''}
          onClick={() => setActiveTab('lessons')}
        >
          <BookOpen size={20} />
          Lecciones
        </button>
        <button
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          <Mail size={20} />
          Solicitudes
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="badge-count">{requests.filter(r => r.status === 'pending').length}</span>
          )}
        </button>
      </div>

      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-section"
        >
          <h2>
            <Users size={28} />
            Usuarios Registrados
          </h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha de Registro</th>
                  <th>Último Acceso</th>
                  <th>Tiempo Total</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u: any) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role === 'admin' ? 'Administrador' : 'Estudiante'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}</td>
                    <td>{Math.floor((u.totalTime || 0) / 60)}h {(u.totalTime || 0) % 60}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'topics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-section"
        >
          <h2>
            <BookOpen size={28} />
            Gestionar Temas
          </h2>
          <div className="add-topic-form">
            <h3>
              <Plus size={24} />
              Agregar Nuevo Tema
            </h3>
            <div className="form-group">
              <label htmlFor="topic-name">Nombre del Tema</label>
              <input
                id="topic-name"
                type="text"
                placeholder="Ej: Ecuaciones Diferenciales"
                value={newTopic.name}
                onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                className="form-input-large"
              />
            </div>
            <div className="form-group">
              <label htmlFor="topic-description">Descripción</label>
              <textarea
                id="topic-description"
                placeholder="Describe el tema y qué aprenderán los estudiantes..."
                value={newTopic.description}
                onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                rows={4}
                className="form-textarea-large"
              />
            </div>
            <div className="form-group">
              <label htmlFor="topic-icon">Icono</label>
              <select
                id="topic-icon"
                value={newTopic.icon}
                onChange={(e) => setNewTopic({ ...newTopic, icon: e.target.value })}
                className="form-select-large"
              >
                <option value="FunctionSquare">FunctionSquare</option>
                <option value="Calculator">Calculator</option>
                <option value="BarChart3">BarChart3</option>
                <option value="TrendingUp">TrendingUp</option>
                <option value="LineChart">LineChart</option>
                <option value="FlaskConical">FlaskConical</option>
                <option value="Star">Star</option>
                <option value="BookOpen">BookOpen</option>
                <option value="Clock">Clock</option>
                <option value="Target">Target</option>
              </select>
            </div>
            <div className="form-group">
              <label>Imagen de Presentación (opcional)</label>
              <div className="image-upload-section">
                <label htmlFor="topic-image-upload" className="image-upload-btn">
                  <ImageIcon size={20} />
                  <span>Subir Imagen</span>
                </label>
                <input
                  type="file"
                  id="topic-image-upload"
                  accept="image/*"
                  onChange={(e) => handleTopicImageUpload(e, false)}
                  style={{ display: 'none' }}
                />
                {newTopic.image && (
                  <div className="topic-image-preview">
                    <img src={newTopic.image} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => setNewTopic({ ...newTopic, image: '' })}
                      className="remove-image-btn"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleAddTopic} className="add-btn">
              <Plus size={20} />
              Agregar Tema
            </button>
          </div>

          <div className="topics-list">
            {topics.map(topic => (
              <div key={topic.id} className="topic-item">
                {editingTopic === topic.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label htmlFor={`edit-topic-name-${topic.id}`}>Nombre del Tema</label>
                      <input
                        id={`edit-topic-name-${topic.id}`}
                        type="text"
                        placeholder="Ej: Ecuaciones Diferenciales"
                        value={topic.name}
                        onChange={(e) => updateTopic(topic.id, { name: e.target.value })}
                        className="form-input-large"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`edit-topic-description-${topic.id}`}>Descripción</label>
                      <textarea
                        id={`edit-topic-description-${topic.id}`}
                        placeholder="Describe el tema y qué aprenderán los estudiantes..."
                        value={topic.description}
                        onChange={(e) => updateTopic(topic.id, { description: e.target.value })}
                        rows={4}
                        className="form-textarea-large"
                      />
                    </div>
                    <div className="form-group">
                      <label>Imagen de Presentación</label>
                      <div className="image-upload-section">
                        <label htmlFor={`edit-topic-image-${topic.id}`} className="image-upload-btn">
                          <ImageIcon size={20} />
                          <span>{topic.image ? 'Cambiar Imagen' : 'Agregar Imagen'}</span>
                        </label>
                        <input
                          type="file"
                          id={`edit-topic-image-${topic.id}`}
                          accept="image/*"
                          onChange={(e) => {
                            handleTopicImageUpload(e, true);
                            const file = e.target.files?.[0];
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                updateTopic(topic.id, { image: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        {topic.image && (
                          <div className="topic-image-preview">
                            <img src={topic.image} alt="Preview" />
                            <button
                              type="button"
                              onClick={() => updateTopic(topic.id, { image: undefined })}
                              className="remove-image-btn"
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button onClick={() => {
                        setEditingTopic(null);
                        setEditingTopicImage('');
                      }} className="save-btn">
                        <Save size={18} />
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="topic-info">
                      {topic.image ? (
                        <div className="topic-image-small">
                          <img src={topic.image} alt={topic.name} />
                        </div>
                      ) : (
                        <div className="topic-icon">
                          <IconRenderer iconName={topic.icon} size={32} />
                        </div>
                      )}
                      <div>
                        <h3>{topic.name}</h3>
                        <p>{topic.description}</p>
                      </div>
                    </div>
                    <div className="topic-actions">
                      <button onClick={() => setEditingTopic(topic.id)} className="edit-btn">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteTopic(topic.id)} className="delete-btn">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'lessons' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-section"
        >
          <h2>
            <BookOpen size={28} />
            Gestionar Lecciones
          </h2>
          <div className="add-level-form">
            <h3>
              <Plus size={24} />
              Agregar Nueva Lección
            </h3>
            <div className="form-group">
              <label>Tema</label>
              <select
                value={newLevel.topicId}
                onChange={(e) => setNewLevel({ ...newLevel, topicId: e.target.value })}
              >
                <option value="">Seleccionar tema</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Número de Nivel</label>
                <input
                  type="number"
                  value={newLevel.levelNumber}
                  onChange={(e) => setNewLevel({ ...newLevel, levelNumber: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={newLevel.type}
                  onChange={(e) => setNewLevel({ ...newLevel, type: e.target.value as 'video' | 'exercise' })}
                >
                  <option value="video">Video</option>
                  <option value="exercise">Ejercicio</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Descripción de la Lección (opcional)</label>
              <textarea
                value={newLevel.description}
                onChange={(e) => setNewLevel({ ...newLevel, description: e.target.value })}
                placeholder="Describe qué aprenderá el estudiante en esta lección..."
                rows={3}
              />
            </div>
            {newLevel.type === 'video' ? (
              <div className="form-group">
                <label>URL del Video</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newLevel.videoUrl}
                  onChange={(e) => setNewLevel({ ...newLevel, videoUrl: e.target.value })}
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>URL de Imagen del Ejercicio</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newLevel.exerciseImage}
                    onChange={(e) => setNewLevel({ ...newLevel, exerciseImage: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>URL de Imagen de la Solución</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newLevel.solutionImage}
                    onChange={(e) => setNewLevel({ ...newLevel, solutionImage: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>URL del Video Explicativo</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newLevel.explanationVideo}
                    onChange={(e) => setNewLevel({ ...newLevel, explanationVideo: e.target.value })}
                  />
                </div>
              </>
            )}
            <button onClick={handleAddLevel} className="add-btn">
              <Plus size={20} />
              Agregar Lección
            </button>
          </div>

          <div className="lessons-list">
            {topics.map(topic => (
              <div key={topic.id} className="topic-lessons">
                <h3>{topic.name}</h3>
                {topic.levels.length === 0 ? (
                  <p>No hay lecciones en este tema</p>
                ) : (
                  topic.levels
                    .sort((a, b) => a.levelNumber - b.levelNumber)
                    .map(level => (
                      <div key={level.id} className="level-item">
                        <div className="level-info">
                          <div>
                            <span className="level-title">Nivel {level.levelNumber} - {level.type === 'video' ? 'Video' : 'Ejercicio'}</span>
                            {level.description && (
                              <p className="level-description">{level.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="level-actions">
                          <button 
                            onClick={() => {
                              const newDesc = prompt('Editar descripción:', level.description || '');
                              if (newDesc !== null) {
                                updateLevel(topic.id, level.id, { description: newDesc || undefined });
                              }
                            }} 
                            className="edit-btn"
                          >
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDeleteLevel(topic.id, level.id)} className="delete-btn">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'requests' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-section"
        >
          <h2>
            <Mail size={28} />
            Gestionar Solicitudes
          </h2>
          <div className="requests-admin-list">
            {requests.length === 0 ? (
              <p className="empty-message">No hay solicitudes</p>
            ) : (
              requests.map((request) => {
                const typeIcons = {
                  suggestion: <MessageSquare size={20} />,
                  complaint: <AlertCircle size={20} />,
                  question: <HelpCircle size={20} />,
                };
                const typeLabels = {
                  suggestion: 'Sugerencia',
                  complaint: 'Queja',
                  question: 'Pregunta',
                };
                const statusColors = {
                  pending: 'pending-badge',
                  read: 'read-badge',
                  resolved: 'resolved-badge',
                };
                const statusLabels = {
                  pending: 'Pendiente',
                  read: 'Leído',
                  resolved: 'Resuelto',
                };
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`request-admin-card ${request.status}`}
                  >
                    <div className="request-admin-header">
                      <div className="request-admin-user">
                        <div className="request-type-icon">
                          {typeIcons[request.type]}
                        </div>
                        <div>
                          <h4>{request.username}</h4>
                          <p className="request-email">{request.userEmail}</p>
                          <p className="request-date">
                            {new Date(request.createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="request-status">
                        <span className={`status-badge ${statusColors[request.status]}`}>
                          {statusLabels[request.status]}
                        </span>
                        <span className="request-type-badge">
                          {typeLabels[request.type]}
                        </span>
                      </div>
                    </div>
                    <div className="request-admin-content">
                      <h5>{request.subject}</h5>
                      <p>{request.message}</p>
                    </div>
                    <div className="request-admin-actions">
                      {request.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateRequestStatus(request.id, 'read')}
                          className="read-btn"
                        >
                          <CheckCircle size={18} />
                          Marcar como Leído
                        </motion.button>
                      )}
                      {request.status !== 'resolved' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateRequestStatus(request.id, 'resolved')}
                          className="resolve-btn"
                        >
                          <CheckCircle size={18} />
                          Marcar como Resuelto
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar esta solicitud?')) {
                            deleteRequest(request.id);
                          }
                        }}
                        className="delete-btn"
                      >
                        <Trash2 size={18} />
                        Eliminar
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPanel;

