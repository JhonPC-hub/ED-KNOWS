import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.username,
        u.profile_picture as user_profile_picture,
        COUNT(DISTINCT l.user_id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id, u.username, u.profile_picture
      ORDER BY p.created_at DESC
    `);

    const posts = await Promise.all(
      result.rows.map(async (post) => {
        // Obtener likes
        const likesResult = await pool.query(
          'SELECT user_id FROM likes WHERE post_id = $1',
          [post.id]
        );

        // Obtener comentarios
        const commentsResult = await pool.query(
          `SELECT c.*, u.username, u.profile_picture as user_profile_picture
           FROM comments c
           JOIN users u ON c.user_id = u.id
           WHERE c.post_id = $1
           ORDER BY c.created_at ASC`,
          [post.id]
        );

        return {
          id: post.id.toString(),
          userId: post.user_id.toString(),
          username: post.username,
          userProfilePicture: post.user_profile_picture,
          type: post.type,
          content: post.content,
          images: post.images || [],
          achievementId: post.achievement_id,
          achievementName: post.achievement_name,
          createdAt: post.created_at,
          likes: likesResult.rows.map(l => l.user_id.toString()),
          comments: commentsResult.rows.map(c => ({
            id: c.id.toString(),
            postId: c.post_id.toString(),
            userId: c.user_id.toString(),
            username: c.username,
            userProfilePicture: c.user_profile_picture,
            content: c.content,
            createdAt: c.created_at,
          })),
        };
      })
    );

    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ error: 'Error al obtener posts' });
  }
});

// Crear un post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, content, images, achievementId, achievementName } = req.body;

    if (!content || !type) {
      return res.status(400).json({ error: 'Contenido y tipo son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO posts (user_id, type, content, images, achievement_id, achievement_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, type, content, images || [], achievementId || null, achievementName || null]
    );

    const post = result.rows[0];

    // Obtener información del usuario
    const userResult = await pool.query(
      'SELECT username, profile_picture FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    res.status(201).json({
      id: post.id.toString(),
      userId: post.user_id.toString(),
      username: user.username,
      userProfilePicture: user.profile_picture,
      type: post.type,
      content: post.content,
      images: post.images || [],
      achievementId: post.achievement_id,
      achievementName: post.achievement_name,
      createdAt: post.created_at,
      likes: [],
      comments: [],
    });
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ error: 'Error al crear post' });
  }
});

// Eliminar un post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Verificar que el post pertenece al usuario o es admin
    const postResult = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    if (postResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ error: 'Error al eliminar post' });
  }
});

// Dar like a un post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Verificar si ya dio like
    const likeCheck = await pool.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, req.user.id]
    );

    if (likeCheck.rows.length > 0) {
      // Quitar like
      await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, req.user.id]);
      res.json({ liked: false });
    } else {
      // Dar like
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, req.user.id]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({ error: 'Error al dar like' });
  }
});

// Agregar comentario
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'El contenido del comentario es requerido' });
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [postId, req.user.id, content]
    );

    const comment = result.rows[0];

    // Obtener información del usuario
    const userResult = await pool.query(
      'SELECT username, profile_picture FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];

    res.status(201).json({
      id: comment.id.toString(),
      postId: comment.post_id.toString(),
      userId: comment.user_id.toString(),
      username: user.username,
      userProfilePicture: user.profile_picture,
      content: comment.content,
      createdAt: comment.created_at,
    });
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
});

// Eliminar comentario
router.delete('/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Verificar que el comentario pertenece al usuario o es admin
    const commentResult = await pool.query(
      'SELECT user_id FROM comments WHERE id = $1 AND post_id = $2',
      [commentId, postId]
    );

    if (commentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    if (commentResult.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);

    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

export default router;

