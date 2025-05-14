const pool = require('../db');

// Ajouter un post aux favoris
const addPostFavorite = async (user_id, post_id) => {
  const result = await pool.query(
    `INSERT INTO post_favorites (user_id, post_id, created_at)
     VALUES ($1, $2, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, post_id) DO NOTHING
     RETURNING *`,
    [user_id, post_id]
  );
  return result.rows[0];
};

// Retirer un post des favoris
const removePostFavorite = async (user_id, post_id) => {
  const result = await pool.query(
    `DELETE FROM post_favorites
     WHERE user_id = $1 AND post_id = $2
     RETURNING *`,
    [user_id, post_id]
  );
  return result.rows[0];
};

// Lister tous les favoris d’un utilisateur
const getFavoritesByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT
       pf.post_id,
       p.title,
       p.content,
       p.created_at,
       json_build_object('identifiant', u.identifiant, 'photo', u.photo) AS author
     FROM post_favorites pf
     JOIN posts p   ON pf.post_id = p.id
     JOIN users u   ON p.user_id = u.id
     WHERE pf.user_id = $1
     ORDER BY pf.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = {
  addPostFavorite,
  removePostFavorite,
  getFavoritesByUser
};
