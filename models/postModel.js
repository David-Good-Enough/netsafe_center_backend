const pool = require('../db');

// Récupérer tous les posts
const getAllPosts = async (limit = 10, offset = 0) => {
    const result = await pool.query(`
        SELECT 
            posts.*, 
            json_build_object(
                'identifiant', users.identifiant,
                'photo', users.photo
            ) AS user,
            COUNT(likes.id) AS likes_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id, users.identifiant, users.photo
        ORDER BY posts.created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);

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

// Récupérer posts par utilisateur
const getPostsByUserId = async (userId) => {
    const result = await pool.query(`
        SELECT 
            posts.*, 
            json_build_object(
                'identifiant', users.identifiant,
                'photo', users.photo
            ) AS user,
            COUNT(likes.id) AS likes_count
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
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
