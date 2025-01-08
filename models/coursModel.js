const pool = require('../db'); // Connexion à la base de données PostgreSQL

// Récupérer tous les cours
const getAllCours = async () => {
    const result = await pool.query('SELECT * FROM cours');
    return result.rows;
};

// Récupérer un cours par ID
const getCoursById = async (id) => {
    const result = await pool.query('SELECT * FROM cours WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer un nouveau cours
const createCours = async (title, description) => {
    const result = await pool.query(
        'INSERT INTO cours (title, description) VALUES ($1, $2) RETURNING *',
        [title, description]
    );
    return result.rows[0];
};

// Mettre à jour un cours
const updateCours = async (id, title, description) => {
    const result = await pool.query(
        'UPDATE cours SET title = $1, description = $2 WHERE id = $3 RETURNING *',
        [title, description, id]
    );
    return result.rows[0];
};

// Supprimer un cours
const deleteCours = async (id) => {
    const result = await pool.query('DELETE FROM cours WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllCours,
    getCoursById,
    createCours,
    updateCours,
    deleteCours
};
