const express = require('express');
const router = express.Router();
const quizModel = require('../models/quizModel');

// 📥 GET : Récupérer tous les quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await quizModel.getAllQuizzes();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des quizzes' });
    }
});

// 📥 GET : Récupérer un quiz par ID
router.get('/:id', async (req, res) => {
    try {
        const quiz = await quizModel.getQuizById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz non trouvé' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du quiz' });
    }
});

// 📤 POST : Créer un nouveau quiz
router.post('/', async (req, res) => {
    const { title, difficult, level, cours_id } = req.body;
    if (!title || !difficult || !level || !cours_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        const newQuiz = await quizModel.createQuiz(title, difficult, level, cours_id);
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du quiz' });
    }
});

// 🛠️ PUT : Mettre à jour un quiz
router.put('/:id', async (req, res) => {
    const { title, difficult, level, cours_id } = req.body;
    try {
        const updatedQuiz = await quizModel.updateQuiz(req.params.id, title, difficult, level, cours_id);
        if (!updatedQuiz) {
            return res.status(404).json({ error: 'Quiz non trouvé' });
        }
        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du quiz' });
    }
});

// 🗑️ DELETE : Supprimer un quiz
router.delete('/:id', async (req, res) => {
    try {
        const deletedQuiz = await quizModel.deleteQuiz(req.params.id);
        if (!deletedQuiz) {
            return res.status(404).json({ error: 'Quiz non trouvé' });
        }
        res.json({ message: 'Quiz supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du quiz' });
    }
});

// ✅ GET : Vérifier si un utilisateur a terminé un quiz par son nom
router.get('/:title/completed/:user_id', async (req, res) => {
    const { title, user_id } = req.params;

    try {
        const status = await quizModel.isQuizCompletedByUser(user_id, title);

        if (!status) {
            return res.status(404).json({ error: 'Quiz non trouvé ou aucune question associée.' });
        }

        res.json(status);
    } catch (error) {
        console.error('Erreur quizController:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification du quiz.' });
    }
});

module.exports = router;
