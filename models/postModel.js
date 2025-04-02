const pool = require('../db'); // Connexion à PostgreSQL

// Récupérer tous les posts
const getAllPosts = async () => {
    const result = await pool.query(`
        SELECT 
            posts.*, 
            users.identifiant AS user_name, 
            COUNT(likes.id) AS likes_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id, users.identifiant
    `);
    return result.rows;
};

// Récupérer un post par son ID
const getPostById = async (id) => {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
};

// Récupérer les commentaires d'un post
const getCommentsByPost = async (id) => {
    const result = await pool.query(`
        SELECT 
            comments.*, 
            users.identifiant AS user_name, 
            COUNT(likes.id) AS likes_count
        FROM comments
        JOIN users ON comments.user_id = users.id
        LEFT JOIN likes ON comments.id = likes.comment_id
        WHERE comments.post_id = $1
        GROUP BY comments.id, users.identifiant
        ORDER BY comments.created_at
    `, [id]);
    return result.rows;
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

module.exports = {
    getAllPosts,
    getPostById,
    getCommentsByPost,
    createPost,
    updatePost,
    deletePost
};
