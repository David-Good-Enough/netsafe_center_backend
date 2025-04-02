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

`
        SELECT 
            comments.*, 
            users.identifiant AS user_name, 
            COUNT(likes.id) AS likes_count
        FROM comments
        WHERE id = $1
        JOIN users ON comments.user_id = users.id
        LEFT JOIN likes ON comments.id = likes.comment_id
        GROUP BY comments.id, users.identifiant
    `, [id]


// Récupérer un commentaire par ID
const getCommentById = async (id) => {
    const result = await pool.query(`
        SELECT 
            comments.*, 
            users.identifiant AS user_name, 
            COUNT(likes.id) AS likes_count
        FROM comments
        WHERE id = $1
        JOIN users ON comments.user_id = users.id
        LEFT JOIN likes ON comments.id = likes.comment_id
        GROUP BY comments.id, users.identifiant
    `, [id]);
    return result.rows[0];
};

// Créer un nouveau commentaire
const createComment = async (content, user_id, post_id) => {
    const result = await pool.query(
        `INSERT INTO comments (content, user_id, post_id, created_at) 
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
        RETURNING *`,
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

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};
