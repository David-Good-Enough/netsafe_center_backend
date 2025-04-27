const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');

// 📤 POST : Créer une nouvelle question
router.post('/', async (req, res) => {
    const { title, content, sequence, quiz_id, cours_id, user_id } = req.body;
    if (!title || !content || !sequence || !quiz_id || !cours_id || !user_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        const newQuestion = await questionModel.createQuestion(title, content, sequence, quiz_id, cours_id, user_id);
        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de la question.' });
    }
});

// 🛠️ PUT : Mettre à jour une question
router.put('/:id', async (req, res) => {
    const { title, content, sequence, quiz_id, cours_id, user_id } = req.body;
    try {
        const updatedQuestion = await questionModel.updateQuestion(req.params.id, title, content, sequence, quiz_id, cours_id, user_id);
        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question non trouvée.' });
        }
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la question.' });
    }
});

// 🗑️ DELETE : Supprimer une question
router.delete('/:id', async (req, res) => {
    try {
        const deletedQuestion = await questionModel.deleteQuestion(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ error: 'Question non trouvée.' });
        }
        res.json({ message: 'Question supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la question.' });
    }
});

module.exports = router;