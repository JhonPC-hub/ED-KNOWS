import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Trash2, Award, HelpCircle, User } from 'lucide-react';
import IconRenderer from './IconRenderer';
import { Post } from '@/types';
import './PostCard.css';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { toggleLike, addComment, deletePost, deleteComment, achievements } = useData();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwner = user?.id === post.userId;
  const isAdmin = user?.role === 'admin';
  const achievement = achievements.find(a => a.id === post.achievementId);

  const handleLike = () => {
    if (user) {
      toggleLike(post.id, user.id);
    }
  };

  const handleComment = () => {
    if (user && commentText.trim()) {
      const newComment = {
        id: `comment-${Date.now()}`,
        postId: post.id,
        userId: user.id,
        username: user.username,
        userProfilePicture: user.profilePicture,
        content: commentText.trim(),
        createdAt: new Date(),
      };
      addComment(post.id, newComment);
      setCommentText('');
    }
  };

  const handleDeletePost = () => {
    if (user?.role !== 'admin') {
      alert('Solo los administradores pueden eliminar posts');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este post? Esta acción no se puede deshacer.')) {
      deletePost(post.id);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('¿Estás seguro de eliminar este comentario?')) {
      deleteComment(post.id, commentId);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;
    return date.toLocaleDateString('es-ES');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="post-card"
    >
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar">
            {post.userProfilePicture ? (
              <img src={post.userProfilePicture} alt={post.username} />
            ) : (
              <User size={24} />
            )}
          </div>
          <div>
            <h3>{post.username}</h3>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleDeletePost} className="delete-post-btn" title="Eliminar post (Solo Admin)">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="post-content">
        {post.type === 'achievement' && achievement && (
          <div className="achievement-badge-post">
            <IconRenderer iconName={achievement.icon} size={32} />
            <div>
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
            </div>
          </div>
        )}
        {post.type === 'question' && (
          <div className="question-indicator">
            <HelpCircle size={24} />
            <span>Pregunta</span>
          </div>
        )}
        <p className="post-text">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="post-images">
            {post.images.length === 1 ? (
              <div className="single-image">
                <img src={post.images[0]} alt="Post image" />
              </div>
            ) : (
              <div className={`images-grid ${post.images.length === 2 ? 'two-images' : post.images.length === 3 ? 'three-images' : 'many-images'}`}>
                {post.images.map((image, index) => (
                  <div key={index} className="post-image-item">
                    <img src={image} alt={`Post image ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="comment-btn"
        >
          <MessageCircle size={20} />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="comments-section"
        >
          <div className="comments-list">
            {post.comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.userProfilePicture ? (
                    <img src={comment.userProfilePicture} alt={comment.username} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
                {(user?.id === comment.userId || isOwner) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="delete-comment-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="comment-input">
            <div className="comment-input-avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} />
              ) : (
                <User size={20} />
              )}
            </div>
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment} className="send-comment-btn">
              Enviar
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;

