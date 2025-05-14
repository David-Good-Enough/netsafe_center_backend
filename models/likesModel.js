// models/likeModel.js
const pool = require('../db');

// Like a post
const createPostLike = async (user_id, post_id, liked = true) => {
  const result = await pool.query(
    `INSERT INTO like_posts (user_id, post_id, liked, created_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, post_id) DO UPDATE SET liked = EXCLUDED.liked, created_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [user_id, post_id, liked]
  );
  return result.rows[0];
};

// Unlike a post
const deletePostLike = async (user_id, post_id) => {
  const result = await pool.query(
    `DELETE FROM like_posts WHERE user_id = $1 AND post_id = $2 RETURNING *`,
    [user_id, post_id]
  );
  return result.rows[0];
};

// Like a comment
const createCommentLike = async (user_id, comment_id, liked = true) => {
  const result = await pool.query(
    `INSERT INTO like_comments (user_id, comment_id, liked, created_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, comment_id) DO UPDATE SET liked = EXCLUDED.liked, created_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [user_id, comment_id, liked]
  );
  return result.rows[0];
};

// Unlike a comment
const deleteCommentLike = async (user_id, comment_id) => {
  const result = await pool.query(
    `DELETE FROM like_comments WHERE user_id = $1 AND comment_id = $2 RETURNING *`,
    [user_id, comment_id]
  );
  return result.rows[0];
};

// récupérer like de Posts par users
const getLikedPostIdsByUser = async (userId) => {
    const result = await pool.query(
      `SELECT post_id
       FROM like_posts
       WHERE user_id = $1
         AND liked = true
       ORDER BY created_at DESC`,
      [userId]
    );
  
    // Ne renvoyer que les valeurs post_id
    return result.rows.map(row => row.post_id);
};

// récupérer like de Comment par users
const getLikedcommentIdsByUser = async (userId) => {
    const result = await pool.query(
      `SELECT comment_id
       FROM like_comments
       WHERE user_id = $1
         AND liked = true
       ORDER BY created_at DESC`,
      [userId]
    );
  
    // Ne renvoyer que les valeurs comment_id
    return result.rows.map(row => row.comment_id);
};

module.exports = {
  createPostLike,
  deletePostLike,
  createCommentLike,
  deleteCommentLike,
  getLikedPostIdsByUser,
  getLikedcommentIdsByUser

};
