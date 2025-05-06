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

// ✅ Like un commentaire
router.post('/:commentId/like', async (req, res) => {
    const { liked, user_id } = req.body;
    const commentId = req.params.commentId;

    if (liked === undefined || !user_id) {
        return res.status(400).json({ error: 'Champs liked et user_id requis.' });
    }

    try {
        const like = await likeModel.createLike(liked, user_id, null, commentId);
        res.status(201).json(like);
    } catch (error) {
        console.error('Erreur like commentaire :', error);
        res.status(500).json({ error: 'Erreur lors du like du commentaire.' });
    }
});

module.exports = router;
