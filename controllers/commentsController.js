const express = require('express');
const router = express.Router();
const commentModel = require('../models/commentModel');

// 📥 GET : Récupérer tous les commentaires
router.get('/', async (req, res) => {
    try {
        const comments = await commentModel.getAllComments();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
    }
});

// 📥 GET : Récupérer un commentaire par ID
router.get('/:id', async (req, res) => {
    try {
        const comment = await commentModel.getCommentById(req.params.id);
        if (!comment) {
            return res.status(404).json({ error: 'Commentaire non trouvé' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du commentaire' });
    }
});

// 📤 POST : Créer un nouveau commentaire
router.post('/', async (req, res) => {
    const { content, user_id, post_id } = req.body;
    if (!content || !user_id || !post_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        const newComment = await commentModel.createComment(content, user_id, post_id);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
    }
});

// 🛠️ PUT : Mettre à jour un commentaire
router.put('/:id', async (req, res) => {
    const { content } = req.body;
    try {
        const updatedComment = await commentModel.updateComment(req.params.id, content);
        if (!updatedComment) {
            return res.status(404).json({ error: 'Commentaire non trouvé' });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du commentaire' });
    }
});

// 🗑️ DELETE : Supprimer un commentaire
router.delete('/:id', async (req, res) => {
    try {
        const deletedComment = await commentModel.deleteComment(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ error: 'Commentaire non trouvé' });
        }
        res.json({ message: 'Commentaire supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
    }
});

module.exports = router;
