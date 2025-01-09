const pool = require('../db'); // Connexion à la base de données PostgreSQL

// Récupérer toutes les questions
const getAllQuestions = async () => {
    const result = await pool.query('SELECT * FROM questions');
    return result.rows;
};

// Récupérer une question par ID
const getQuestionById = async (id) => {
    const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer une nouvelle question
const createQuestion = async (title, content, sequence, quiz_id, cours_id, user_id) => {
    const result = await pool.query(
        'INSERT INTO questions (title, content, sequence, quiz_id, cours_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, sequence, quiz_id, cours_id, user_id]
    );
    return result.rows[0];
};

// Mettre à jour une question
const updateQuestion = async (id, title, content, sequence, quiz_id, cours_id, user_id) => {
    const result = await pool.query(
        'UPDATE questions SET title = $1, content = $2, sequence = $3, quiz_id = $4, cours_id = $5, user_id = $6 WHERE id = $7 RETURNING *',
        [title, content, sequence, quiz_id, cours_id, user_id, id]
    );
    return result.rows[0];
};

// Supprimer une question
const deleteQuestion = async (id) => {
    const result = await pool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
};
