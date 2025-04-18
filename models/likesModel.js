const pool = require('../db'); // Connexion à PostgreSQL

// Récupérer tous les likes
const getAllLikes = async () => {
    const result = await pool.query('SELECT * FROM likes');
    return result.rows;
};

// Récupérer un like par ID
const getLikeById = async (id) => {
    const result = await pool.query('SELECT * FROM likes WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer un nouveau like
const createLike = async (liked, comment_id, user_id, post_id) => {
    const result = await pool.query(
        `INSERT INTO likes (liked, comment_id, user_id, post_id, created_at) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
        RETURNING *`,
        [liked, comment_id, user_id, post_id]
    );
    return result.rows[0];
};

// Mettre à jour un like
const updateLike = async (id, liked) => {
    const result = await pool.query(
        `UPDATE likes 
         SET liked = $1, created_at = CURRENT_TIMESTAMP 
         WHERE id = $2 RETURNING *`,
        [liked, id]
    );
    return result.rows[0];
};

// Supprimer un like
const deleteLike = async (id) => {
    const result = await pool.query('DELETE FROM likes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllLikes,
    getLikeById,
    createLike,
    updateLike,
    deleteLike
};
