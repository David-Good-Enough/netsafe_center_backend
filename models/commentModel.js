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
const getCommentsByPost = async (postId, limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'ASC') => {
    const allowedSortFields = ['created_at', 'likes_count'];
    const allowedSortOrder = ['ASC', 'DESC'];

    if (!allowedSortFields.includes(sortBy)) sortBy = 'created_at';
    if (!allowedSortOrder.includes(sortOrder.toUpperCase())) sortOrder = 'ASC';

    let orderClause;
    if (sortBy === 'likes_count') {
        orderClause = `ORDER BY COUNT(likes.id) ${sortOrder}`;
    } else {
        orderClause = `ORDER BY ${sortBy} ${sortOrder}`;
    }

    const result = await pool.query(`
        SELECT 
            comments.*,
            json_build_object(
                'identifiant', users.identifiant,
                'photo', users.photo
            ) AS user,
            COUNT(likes.id) AS likes_count
        FROM comments
        JOIN users ON comments.user_id = users.id
        LEFT JOIN likes ON comments.id = likes.comment_id
        WHERE comments.post_id = $1
        GROUP BY comments.id, users.identifiant, users.photo
        ${orderClause}
        LIMIT $2 OFFSET $3
    `, [postId, limit, offset]);

    return result.rows;
};




module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPost
};
