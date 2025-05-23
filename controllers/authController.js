const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

let refreshTokens = []; // Stocker les refresh tokens temporairement (préférer une DB)

// ✅ Connexion utilisateur avec récupération des variables d'environnement
router.post('/login', async (req, res) => {
    const { mail, password } = req.body;

    try {
        // 1️⃣ Première requête : récupérer seulement le mot de passe
        const passwordResult = await pool.query('SELECT password FROM users WHERE mail = $1', [mail]);

        if (passwordResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }

        const hashedPassword = passwordResult.rows[0].password;

        // Comparer les mots de passe
        const isValidPassword = await bcrypt.compare(password, hashedPassword);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
        }

        // 2️⃣ Deuxième requête : récupérer les infos utilisateur sans password et last_login
        const userResult = await pool.query(
            'SELECT id, identifiant, mail, photo FROM users WHERE mail = $1',
            [mail]
        );

        const user = userResult.rows[0];

        // ✅ Génération des tokens
        const accessToken = jwt.sign(
            { userId: user.id, mail: user.mail },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, mail: user.mail },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        // Stocker le refresh token
        refreshTokens.push(refreshToken);

        // ✅ Renvoyer l'utilisateur sans password ni last_login
        res.json({
            success: true,
            accessToken,
            refreshToken,
            accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
            refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,
            user: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});


// 📥 Inscription utilisateur avec hachage du mot de passe et génération de tokens
router.post('/register', async (req, res) => {
    const { identifiant, mail, password, photo } = req.body;

    try {
        // ✅ Vérifier si l'utilisateur existe déjà
        const existingUser = await pool.query('SELECT * FROM users WHERE identifiant = $1', [identifiant]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Identifiant déjà utilisé.' });
        }

        // ✅ Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insérer l'utilisateur dans la base de données
        const insertResult = await pool.query(
            `INSERT INTO users (identifiant, mail, password, photo, last_login) 
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
            [identifiant, mail, hashedPassword, photo]
        );

        const user = insertResult.rows[0];

        // ✅ Générer les tokens avec les durées depuis .env
        const accessToken = jwt.sign(
            { userId: user.id, mail: user.identifiant },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION } // Utilisation de l'expiration définie dans le .env
        );

        const refreshToken = jwt.sign(
            { userId: user.id, mail: user.identifiant },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
        );

        // ✅ Stocker temporairement le refresh token (à stocker en BDD dans un projet réel)
        refreshTokens.push(refreshToken);

        // ✅ Réponse avec les tokens et durées d'expiration
        res.status(201).json({
            success: true,
            user,
            accessToken,
            refreshToken,
            accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
            refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur lors de l’inscription.' });
    }
});

// 📥 Rafraîchir le token d'accès
router.post('/refresh', (req, res) => {
    const { token } = req.body;

    if (!token || !refreshTokens.includes(token)) {
        return res.status(403).json({ success: false, message: 'Refresh token invalide.' });
    }

    try {
        const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken(verified);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ success: false, message: 'Refresh token expiré.' });
    }
});

// 📥 Déconnexion (Supprimer le refresh token)
router.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.json({ success: true, message: 'Déconnexion réussie.' });
});

// ✅ Fonctions de génération de tokens
function generateAccessToken(user) {
    return jwt.sign(
        { userId: user.id, mail: user.mail }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { userId: user.id, mail: user.mail }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
}

module.exports = router;
