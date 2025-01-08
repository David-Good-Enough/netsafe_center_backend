const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE identifiant = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ userId: user.id, username: user.identifiant }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
        }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

module.exports = router;


