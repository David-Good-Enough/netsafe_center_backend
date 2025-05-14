const pool = require('../db'); // Connexion à la base PostgreSQL
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la gestion des tokens JWT
require('dotenv').config();

const SALT_ROUNDS = 10; // Niveau de complexité du hachage

// Récupérer tous les utilisateurs
const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

// Récupérer un utilisateur par ID
const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

// Créer un nouvel utilisateur avec hachage du mot de passe et génération de token JWT
const createUser = async (identifiant, mail, password, photo) => {
    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Insérer l'utilisateur dans la base de données
        const result = await pool.query(
            `INSERT INTO users (identifiant, mail, password, photo, last_login) 
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
            [identifiant, mail, hashedPassword, photo]
        );

        // Générer le token JWT
        const token = jwt.sign(
            { userId: result.rows[0].id, username: identifiant },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user: result.rows[0], token }; // Retourner l'utilisateur et le token
    } catch (error) {
        throw new Error('Erreur lors de la création de l’utilisateur.');
    }
};

// Mettre à jour un utilisateur avec hachage conditionnel
const updateUserPartial = async (id, fields) => {
    // Génère dynamiquement les clauses SET et les paramètres
    const keys   = Object.keys(fields);
    const sets   = keys.map((key, idx) => `${key} = $${idx + 1}`);
    const values = keys.map(key => fields[key]);
  
    // Ajoute l'ID comme dernier paramètre
    values.push(id);
  
    const sql = `
      UPDATE users
      SET ${sets.join(', ')}
      WHERE id = $${values.length}
      RETURNING id, identifiant, mail, photo, last_login
    `;
  
    const result = await pool.query(sql, values);
    return result.rows[0];
  };

// Supprimer un utilisateur
const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

// sheach user
const searchUsers = async (query) => {
    // Utilisation de ILIKE pour une recherche insensible à la casse
    const sql = `SELECT identifiant, mail, photo FROM users WHERE identifiant ILIKE $1`;
    const result = await pool.query(sql, [`%${query}%`]);
    return result.rows;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserPartial,
    deleteUser,
    searchUsers
};
