import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';
import { Award, HelpCircle, X, Image as ImageIcon, XCircle } from 'lucide-react';
import { Post } from '@/types';
import './CreatePost.css';

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { addPost, achievements } = useData();
  const [showForm, setShowForm] = useState(false);
  const [postType, setPostType] = useState<'achievement' | 'question'>('achievement');
  const [content, setContent] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const userAchievements = achievements.filter(a => 
    user?.achievements?.some(ua => ua.id === a.id)
  );

  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calcular nuevas dimensiones manteniendo la proporción
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convertir a base64 con calidad reducida
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          } else {
            // Fallback si no se puede comprimir
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limitar a 3 imágenes máximo
    const filesArray = Array.from(files).slice(0, 3);
    
    for (const file of filesArray) {
      if (file.type.startsWith('image/')) {
        try {
          // Comprimir imagen antes de agregarla
          const compressedImage = await compressImage(file);
          setImages(prev => {
            // Limitar a 3 imágenes en total
            if (prev.length >= 3) return prev;
            return [...prev, compressedImage];
          });
        } catch (error) {
          console.error('Error al procesar imagen:', error);
        }
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    if (postType === 'achievement' && !selectedAchievement) {
      alert('Por favor selecciona un logro');
      return;
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: user.id,
      username: user.username,
      userProfilePicture: user.profilePicture,
      type: postType,
      content: content.trim(),
      images: images.length > 0 ? images : undefined,
      achievementId: postType === 'achievement' ? selectedAchievement : undefined,
      achievementName: postType === 'achievement' 
        ? achievements.find(a => a.id === selectedAchievement)?.name 
        : undefined,
      createdAt: new Date(),
      likes: [],
      comments: [],
    };

    addPost(newPost);
    setContent('');
    setSelectedAchievement('');
    setImages([]);
    setShowForm(false);
    if (onPostCreated) onPostCreated();
  };

  return (
    <div className="create-post">
      {!showForm ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="create-post-btn"
        >
          <span>¿Qué quieres compartir?</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="create-post-form"
        >
          <div className="form-header">
            <h3>Crear Publicación</h3>
            <button onClick={() => setShowForm(false)} className="close-btn">
              <X size={20} />
            </button>
          </div>

          <div className="post-type-selector">
            <button
              onClick={() => setPostType('achievement')}
              className={`type-btn ${postType === 'achievement' ? 'active' : ''}`}
            >
              <Award size={20} />
              <span>Compartir Logro</span>
            </button>
            <button
              onClick={() => setPostType('question')}
              className={`type-btn ${postType === 'question' ? 'active' : ''}`}
            >
              <HelpCircle size={20} />
              <span>Hacer Pregunta</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {postType === 'achievement' && (
              <div className="form-group">
                <label>Selecciona un logro</label>
                <select
                  value={selectedAchievement}
                  onChange={(e) => setSelectedAchievement(e.target.value)}
                  required
                >
                  <option value="">Selecciona un logro...</option>
                  {userAchievements.map(achievement => (
                    <option key={achievement.id} value={achievement.id}>
                      {achievement.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>
                {postType === 'achievement' ? 'Comparte tu experiencia' : 'Escribe tu pregunta'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  postType === 'achievement'
                    ? 'Comparte cómo lograste este logro...'
                    : 'Escribe tu pregunta sobre ecuaciones diferenciales...'
                }
                rows={4}
                required
              />
            </div>

            <div className="form-group">
              <label>Imágenes (opcional)</label>
              <div className="image-upload-section">
                <label htmlFor="image-upload" className="image-upload-btn">
                  <ImageIcon size={20} />
                  <span>Agregar Imágenes</span>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {images.length > 0 && (
                  <div className="image-preview-grid">
                    {images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="remove-image-btn"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cancel-btn"
              >
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                Publicar
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default CreatePost;

