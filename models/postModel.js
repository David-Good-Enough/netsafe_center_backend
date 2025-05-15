const pool = require('../db');

// Récupérer tous les posts
const getAllPosts = async (limit = null, offset = 0, sortBy = 'created_at', sortOrder = 'DESC') => {
    // ensure valid sort
    const allowed = ['created_at', 'title'];
    if (!allowed.includes(sortBy)) sortBy = 'created_at';
    sortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
    // build query parts
    const limitClause = limit != null ? 'LIMIT $1 OFFSET $2' : '';
    const params = limit != null ? [limit, offset] : [];
  
    const result = await pool.query(
      `SELECT
         posts.*,
         json_build_object('identifiant', users.identifiant, 'photo', users.photo) AS user,
         COUNT(lp.user_id) AS likes_count
       FROM posts
       JOIN users ON posts.user_id = users.id
       LEFT JOIN like_posts lp ON lp.post_id = posts.id AND lp.liked = true
       GROUP BY posts.id, users.identifiant, users.photo
       ORDER BY ${sortBy} ${sortOrder}
       ${limitClause}`,
      params
    );
    return result.rows;
  };
// Récupérer un post par ID
const getPostById = async (id) => {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer un nouveau post
const createPost = async (title, content, user_id) => {
    const result = await pool.query(
        'INSERT INTO posts (title, content, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [title, content, user_id]
    );
    return result.rows[0];
};

// Mettre à jour un post
const updatePost = async (id, title, content) => {
    const result = await pool.query(
        'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
        [title, content, id]
    );
    return result.rows[0];
};

// Supprimer un post
const deletePost = async (id) => {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Récupérer posts par utilisateur, avec compte des likes
const getPostsByUserId = async (userId) => {
    const result = await pool.query(`
      SELECT
        posts.*,
        json_build_object(
          'identifiant', users.identifiant,
          'photo',       users.photo
        ) AS user,
        COUNT(lp.user_id) AS likes_count
      FROM posts
      JOIN users
        ON posts.user_id = users.id
      LEFT JOIN like_posts lp
        ON lp.post_id = posts.id
       AND lp.liked = true
      WHERE posts.user_id = $1
      GROUP BY posts.id, users.identifiant, users.photo
      ORDER BY posts.created_at DESC
    `, [userId]);
  
    return result.rows;
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsByUserId
};
