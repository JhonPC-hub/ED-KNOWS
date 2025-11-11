import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';
import { Mail, Send, X, AlertCircle, MessageSquare, HelpCircle } from 'lucide-react';
import './CreateRequest.css';

const CreateRequest = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const { addRequest } = useData();
  const [type, setType] = useState<'suggestion' | 'complaint' | 'question'>('suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !user) return;

    const request = {
      id: `request-${Date.now()}`,
      userId: user.id,
      username: user.username,
      userEmail: user.email,
      type,
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date(),
      status: 'pending' as const,
    };

    addRequest(request);
    setSubject('');
    setMessage('');
    alert('¡Tu solicitud ha sido enviada! El administrador la revisará pronto.');
    onClose();
  };

  if (!user) return null;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="create-request-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="create-request-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-request-header">
          <div className="create-request-title">
            <Mail size={24} />
            <h3>Enviar Solicitud</h3>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-request-form">
          <div className="request-type-selector">
            <label>Tipo de solicitud:</label>
            <div className="type-buttons">
              {(['suggestion', 'complaint', 'question'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`type-btn ${type === t ? 'active' : ''}`}
                >
                  {typeIcons[t]}
                  {typeLabels[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Asunto:</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Escribe el asunto de tu solicitud..."
              className="request-input"
              maxLength={100}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje:</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe tu solicitud, queja o pregunta..."
              className="request-textarea"
              rows={6}
              maxLength={1000}
              required
            />
            <span className="char-count">{message.length}/1000</span>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="submit-request-btn"
            disabled={!subject.trim() || !message.trim()}
          >
            <Send size={18} />
            Enviar Solicitud
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateRequest;