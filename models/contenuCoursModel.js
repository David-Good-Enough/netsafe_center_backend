const pool = require('../db'); // Connexion à la base PostgreSQL

// Récupérer tous les contenus de cours
const getAllContenuCours = async () => {
    const result = await pool.query('SELECT * FROM contenu_cours');
    return result.rows;
};

// Récupérer un contenu par ID
const getContenuCoursById = async (id) => {
    const result = await pool.query('SELECT * FROM contenu_cours WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer un nouveau contenu de cours
const createContenuCours = async (contenu_id, contenu, completed, cours_id, user_id) => {
    const result = await pool.query(
        `INSERT INTO contenu_cours (contenu_id, contenu, completed, cours_id, user_id) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [contenu_id, contenu, completed, cours_id, user_id]
    );
    return result.rows[0];
};

// Mettre à jour un contenu de cours
const updateContenuCours = async (id, contenu, completed) => {
    const result = await pool.query(
        `UPDATE contenu_cours 
        SET contenu = $1, completed = $2 
        WHERE id = $3 
        RETURNING *`,
        [contenu, completed, id]
    );
    return result.rows[0];
};

// Supprimer un contenu de cours
const deleteContenuCours = async (id) => {
    const result = await pool.query('DELETE FROM contenu_cours WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllContenuCours,
    getContenuCoursById,
    createContenuCours,
    updateContenuCours,
    deleteContenuCours
};
