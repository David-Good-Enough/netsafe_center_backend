const pool = require('../db'); // Connexion à la base PostgreSQL

// Récupérer toutes les réponses
const getAllAnswers = async () => {
    const result = await pool.query('SELECT * FROM answers');
    return result.rows;
};

// Récupérer une réponse par ID
const getAnswerById = async (id) => {
    const result = await pool.query('SELECT * FROM answers WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer une nouvelle réponse
const createAnswer = async (response, is_right, attempt_number, user_id, question_id) => {
    const result = await pool.query(
        `INSERT INTO answers (response, is_right, attempt_number, completed_at, user_id, question_id)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5) 
        RETURNING *`,
        [response, is_right, attempt_number, user_id, question_id]
    );
    return result.rows[0];
};

// Mettre à jour une réponse
const updateAnswer = async (id, response, is_right, attempt_number) => {
    const result = await pool.query(
        `UPDATE answers 
        SET response = $1, is_right = $2, attempt_number = $3, completed_at = CURRENT_TIMESTAMP
        WHERE id = $4 RETURNING *`,
        [response, is_right, attempt_number, id]
    );
    return result.rows[0];
};

// Supprimer une réponse
const deleteAnswer = async (id) => {
    const result = await pool.query('DELETE FROM answers WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllAnswers,
    getAnswerById,
    createAnswer,
    updateAnswer,
    deleteAnswer
};
