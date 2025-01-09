const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

// 📥 Connexion utilisateur
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE mail = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.identifiant },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

// 📥 Inscription utilisateur avec hachage du mot de passe
router.post('/register', async (req, res) => {
    const { identifiant, mail, password, photo } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE identifiant = $1', [identifiant]);

        if (result.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Identifiant déjà utilisé.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertResult = await pool.query(
            `INSERT INTO users (identifiant, mail, password, photo, last_login) 
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
            [identifiant, mail, hashedPassword, photo]
        );

        const token = jwt.sign(
            { userId: insertResult.rows[0].id, username: identifiant },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ success: true, user: insertResult.rows[0], token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l’inscription.' });
    }
});

module.exports = router;
