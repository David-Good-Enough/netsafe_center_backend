const pool = require('../db'); // Connexion à la base PostgreSQL

// Récupérer tous les commentaires
const getAllComments = async () => {
    const result = await pool.query(`
        SELECT 
            comments.*, 
            users.identifiant AS user_name, 
            COUNT(likes.id) AS likes_count
        FROM comments
        JOIN users ON comments.user_id = users.id
        LEFT JOIN likes ON comments.id = likes.comment_id
        GROUP BY comments.id, users.identifiant
    `);
    return result.rows;
};

// Créer un nouveau commentaire
const createComment = async (content, user_id, post_id) => {
    const result = await pool.query(
        `INSERT INTO comments (content, user_id, post_id, created_at)
         VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [content, user_id, post_id]
    );
    return result.rows[0];
};

// Mettre à jour un commentaire
const updateComment = async (id, content) => {
    const result = await pool.query(
        `UPDATE comments 
        SET content = $1, created_at = CURRENT_TIMESTAMP
        WHERE id = $2 
        RETURNING *`,
        [content, id]
    );
    return result.rows[0];
};

// Supprimer un commentaire
const deleteComment = async (id) => {
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Récupérer les commentaire d'un post pour tri et limit
const getCommentsByPost = async (postId, limit = null, offset = 0, sortBy = 'created_at', sortOrder = 'ASC') => {
    const allowed = ['created_at'];
    if (!allowed.includes(sortBy)) sortBy = 'created_at';
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
    const limitClause = limit != null ? 'LIMIT $2 OFFSET $3' : '';
    const params = limit != null ? [postId, limit, offset] : [postId];
  
    const result = await pool.query(
      `SELECT
         comments.*,
         json_build_object('identifiant', users.identifiant, 'photo', users.photo) AS user,
         COUNT(lc.user_id) AS likes_count
       FROM comments
       JOIN users ON comments.user_id = users.id
       LEFT JOIN like_comments lc ON lc.comment_id = comments.id AND lc.liked = true
       WHERE comments.post_id = $1
       GROUP BY comments.id, users.identifiant, users.photo
       ORDER BY ${sortBy} ${sortOrder}
       ${limitClause}`,
      params
    );
    return result.rows;
  };




module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPost
};
