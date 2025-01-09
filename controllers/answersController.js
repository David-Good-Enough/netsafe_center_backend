const express = require('express');
const router = express.Router();
const answersModel = require('../models/answersModel');

// 📥 GET : Récupérer toutes les réponses
router.get('/', async (req, res) => {
    try {
        const answers = await answersModel.getAllAnswers();
        res.json(answers);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des réponses.' });
    }
});

// 📥 GET : Récupérer une réponse par ID
router.get('/:id', async (req, res) => {
    try {
        const answer = await answersModel.getAnswerById(req.params.id);
        if (!answer) {
            return res.status(404).json({ error: 'Réponse non trouvée.' });
        }
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de la réponse.' });
    }
});

// 📤 POST : Créer une nouvelle réponse
router.post('/', async (req, res) => {
    const { response, is_right, attempt_number, user_id, question_id } = req.body;
    if (!response || is_right === undefined || !attempt_number || !user_id || !question_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        const newAnswer = await answersModel.createAnswer(response, is_right, attempt_number, user_id, question_id);
        res.status(201).json(newAnswer);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la réponse.' });
    }
});

// 🛠️ PUT : Mettre à jour une réponse
router.put('/:id', async (req, res) => {
    const { response, is_right, attempt_number } = req.body;
    try {
        const updatedAnswer = await answersModel.updateAnswer(req.params.id, response, is_right, attempt_number);
        if (!updatedAnswer) {
            return res.status(404).json({ error: 'Réponse non trouvée.' });
        }
        res.json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la réponse.' });
    }
});

// 🗑️ DELETE : Supprimer une réponse
router.delete('/:id', async (req, res) => {
    try {
        const deletedAnswer = await answersModel.deleteAnswer(req.params.id);
        if (!deletedAnswer) {
            return res.status(404).json({ error: 'Réponse non trouvée.' });
        }
        res.json({ message: 'Réponse supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la réponse.' });
    }
});

module.exports = router;
