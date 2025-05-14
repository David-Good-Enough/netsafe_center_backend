const express = require('express');
const router = express.Router();
const commentModel = require('../models/commentModel');
const likeModel = require('../models/likesModel');

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
    const { user_id, liked } = req.body;
    const commentId = parseInt(req.params.commentId);
  
    if (user_id == null) return res.status(400).json({ error: 'user_id required' });
  
    try {
      const like = await likeModel.createCommentLike(user_id, commentId, liked);
      res.status(201).json(like);
    } catch (error) {
      console.error('Error creating comment like:', error);
      res.status(500).json({ error: 'Server error' });
    }
});

// DELETE a comment like
router.delete('/:commentId/like', async (req, res) => {
    const { user_id } = req.body;
    const commentId = parseInt(req.params.commentId);
  
    if (user_id == null) {
      return res.status(400).json({ error: 'user_id required' });
    }
  
    try {
      const removed = await likeModel.deleteCommentLike(user_id, commentId);
  
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Like non trouvé.' });
      }
  
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting comment like:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
module.exports = router;
