import express from 'express';
import pool from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los temas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             COALESCE(json_agg(
               json_build_object(
                 'id', l.id,
                 'levelNumber', l.level_number,
                 'type', l.type,
                 'description', l.description,
                 'videoUrl', l.video_url,
                 'exerciseImage', l.exercise_image,
                 'solutionImage', l.solution_image,
                 'explanationVideo', l.explanation_video
               ) ORDER BY l.level_number
             ) FILTER (WHERE l.id IS NOT NULL), '[]') as levels
      FROM topics t
      LEFT JOIN levels l ON t.id = l.topic_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);

    const topics = result.rows.map(topic => ({
      id: topic.id.toString(),
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      image: topic.image,
      levels: topic.levels.map(level => ({
        id: level.id.toString(),
        levelNumber: level.levelNumber,
        type: level.type,
        description: level.description,
        videoUrl: level.videoUrl,
        exerciseImage: level.exerciseImage,
        solutionImage: level.solutionImage,
        explanationVideo: level.explanationVideo,
      })),
    }));

    res.json(topics);
  } catch (error) {
    console.error('Error al obtener temas:', error);
    res.status(500).json({ error: 'Error al obtener temas' });
  }
});

// Crear un tema (solo admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Nombre y descripción son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO topics (name, description, icon, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, icon || 'FunctionSquare', image || null]
    );

    const topic = result.rows[0];

    res.status(201).json({
      id: topic.id.toString(),
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      image: topic.image,
      levels: [],
    });
  } catch (error) {
    console.error('Error al crear tema:', error);
    res.status(500).json({ error: 'Error al crear tema' });
  }
});

// Actualizar un tema (solo admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const topicId = req.params.id;
    const { name, description, icon, image } = req.body;

    const result = await pool.query(
      `UPDATE topics 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           icon = COALESCE($3, icon),
           image = COALESCE($4, image)
       WHERE id = $5
       RETURNING *`,
      [name, description, icon, image, topicId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }

    const topic = result.rows[0];

    // Obtener niveles
    const levelsResult = await pool.query(
      'SELECT * FROM levels WHERE topic_id = $1 ORDER BY level_number',
      [topicId]
    );

    res.json({
      id: topic.id.toString(),
      name: topic.name,
      description: topic.description,
      icon: topic.icon,
      image: topic.image,
      levels: levelsResult.rows.map(level => ({
        id: level.id.toString(),
        levelNumber: level.level_number,
        type: level.type,
        description: level.description,
        videoUrl: level.video_url,
        exerciseImage: level.exercise_image,
        solutionImage: level.solution_image,
        explanationVideo: level.explanation_video,
      })),
    });
  } catch (error) {
    console.error('Error al actualizar tema:', error);
    res.status(500).json({ error: 'Error al actualizar tema' });
  }
});

// Eliminar un tema (solo admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const topicId = req.params.id;

    await pool.query('DELETE FROM topics WHERE id = $1', [topicId]);

    res.json({ message: 'Tema eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tema:', error);
    res.status(500).json({ error: 'Error al eliminar tema' });
  }
});

// Agregar nivel a un tema (solo admin)
router.post('/:topicId/levels', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const { levelNumber, type, description, videoUrl, exerciseImage, solutionImage, explanationVideo } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'El tipo de nivel es requerido' });
    }

    const result = await pool.query(
      `INSERT INTO levels (topic_id, level_number, type, description, video_url, exercise_image, solution_image, explanation_video)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [topicId, levelNumber || 0, type, description || null, videoUrl || null, exerciseImage || null, solutionImage || null, explanationVideo || null]
    );

    const level = result.rows[0];

    res.status(201).json({
      id: level.id.toString(),
      levelNumber: level.level_number,
      type: level.type,
      description: level.description,
      videoUrl: level.video_url,
      exerciseImage: level.exercise_image,
      solutionImage: level.solution_image,
      explanationVideo: level.explanation_video,
    });
  } catch (error) {
    console.error('Error al agregar nivel:', error);
    res.status(500).json({ error: 'Error al agregar nivel' });
  }
});

// Actualizar nivel (solo admin)
router.put('/:topicId/levels/:levelId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { topicId, levelId } = req.params;
    const { levelNumber, type, description, videoUrl, exerciseImage, solutionImage, explanationVideo } = req.body;

    const result = await pool.query(
      `UPDATE levels 
       SET level_number = COALESCE($1, level_number),
           type = COALESCE($2, type),
           description = COALESCE($3, description),
           video_url = COALESCE($4, video_url),
           exercise_image = COALESCE($5, exercise_image),
           solution_image = COALESCE($6, solution_image),
           explanation_video = COALESCE($7, explanation_video)
       WHERE id = $8 AND topic_id = $9
       RETURNING *`,
      [levelNumber, type, description, videoUrl, exerciseImage, solutionImage, explanationVideo, levelId, topicId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nivel no encontrado' });
    }

    const level = result.rows[0];

    res.json({
      id: level.id.toString(),
      levelNumber: level.level_number,
      type: level.type,
      description: level.description,
      videoUrl: level.video_url,
      exerciseImage: level.exercise_image,
      solutionImage: level.solution_image,
      explanationVideo: level.explanation_video,
    });
  } catch (error) {
    console.error('Error al actualizar nivel:', error);
    res.status(500).json({ error: 'Error al actualizar nivel' });
  }
});

// Eliminar nivel (solo admin)
router.delete('/:topicId/levels/:levelId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { topicId, levelId } = req.params;

    await pool.query('DELETE FROM levels WHERE id = $1 AND topic_id = $2', [levelId, topicId]);

    res.json({ message: 'Nivel eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar nivel:', error);
    res.status(500).json({ error: 'Error al eliminar nivel' });
  }
});

export default router;

