const pool = require('../db'); // Connexion à PostgreSQL

// Récupérer tous les posts
const getAllPosts = async () => {
    const result = await pool.query('SELECT * FROM posts JOIN users ON posts.user_id = users.id');
    return result.rows;
};

// Récupérer un post par son ID
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

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
