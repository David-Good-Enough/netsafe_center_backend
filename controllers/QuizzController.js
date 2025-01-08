const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM answers');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({error: 'Erreur lors de la récupération des réponses'});
    }
});

module.exports = router;
