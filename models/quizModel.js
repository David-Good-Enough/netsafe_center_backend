const pool = require('../db'); // Connexion à PostgreSQL

// Récupérer tous les quizzes
const getAllQuizzes = async () => {
    const result = await pool.query('SELECT * FROM quizzes');
    return result.rows;
};

// Récupérer un quiz par ID
const getQuizById = async (id) => {
    const result = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer un nouveau quiz
const createQuiz = async (title, difficult, level, cours_id) => {
    const result = await pool.query(
        `INSERT INTO quizzes (title, difficult, level, cours_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [title, difficult, level, cours_id]
    );
    return result.rows[0];
};

// Mettre à jour un quiz
const updateQuiz = async (id, title, difficult, level, cours_id) => {
    const result = await pool.query(
        `UPDATE quizzes 
        SET title = $1, difficult = $2, level = $3, cours_id = $4
        WHERE id = $5 
        RETURNING *`,
        [title, difficult, level, cours_id, id]
    );
    return result.rows[0];
};

// Supprimer un quiz
const deleteQuiz = async (id) => {
    const result = await pool.query('DELETE FROM quizzes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// Chequer si utilisateur a fait quizz
const checkQuizCompletion = async (userId, quizTitle) => {
    const result = await pool.query(`
        SELECT
            q.id AS quiz_id,
            q.title AS quiz_title,
            COUNT(DISTINCT quest.id) AS total_questions,
            COUNT(DISTINCT a.question_id) AS user_answers,
            CASE 
                WHEN COUNT(DISTINCT quest.id) = COUNT(DISTINCT a.question_id) 
                THEN true ELSE false 
            END AS is_completed
        FROM quizzes q
        JOIN questions quest ON quest.quize_id = q.id
        LEFT JOIN answers a ON a.question_id = quest.id AND a.user_id = $1
        WHERE q.title = $2
        GROUP BY q.id, q.title;
    `, [userId, quizTitle]);

    return result.rows[0]; // ou [] si pas trouvé
};



module.exports = {
    getAllQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    checkQuizCompletion
};
