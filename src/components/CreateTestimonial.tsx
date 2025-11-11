import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';
import { MessageSquare, Send, X } from 'lucide-react';
import './CreateTestimonial.css';

const CreateTestimonial = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const { addTestimonial } = useData();
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const testimonial = {
      id: `testimonial-${Date.now()}`,
      userId: user.id,
      username: user.username,
      userProfilePicture: user.profilePicture,
      text: text.trim(),
      createdAt: new Date(),
      approved: false, // Requiere aprobación del admin
    };

    addTestimonial(testimonial);
    setText('');
    alert('¡Gracias por tu opinión! Será revisada antes de publicarse.');
    onClose();
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="create-testimonial-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="create-testimonial-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="create-testimonial-header">
          <div className="create-testimonial-title">
            <MessageSquare size={24} />
            <h3>Escribe tu Opinión</h3>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="create-testimonial-form">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comparte tu experiencia con ED-KNOWS..."
            className="testimonial-textarea"
            rows={6}
            maxLength={500}
            required
          />
          <div className="testimonial-footer">
            <span className="char-count">{text.length}/500</span>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="submit-testimonial-btn"
              disabled={!text.trim()}
            >
              <Send size={18} />
              Enviar Opinión
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateTestimonial;