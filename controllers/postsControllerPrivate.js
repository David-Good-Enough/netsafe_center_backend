const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const likeModel = require('../models/likesModel');

// 📤 POST : Créer un nouveau post
router.post('/', async (req, res) => {
    const { title, content, user_id } = req.body;

    if (!title || !content || !user_id) {
        return res.status(400).json({ error: 'Les champs title, content et user_id sont requis.' });
    }

    try {
        const newPost = await postModel.createPost(title, content, user_id);
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du post.' });
    }
});

// 🛠️ PUT : Mettre à jour un post
router.put('/:id', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Les champs title et content sont requis.' });
    }

    try {
        const updatedPost = await postModel.updatePost(req.params.id, title, content);
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post non trouvé.' });
        }
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du post.' });
    }
});

// 🗑️ DELETE : Supprimer un post
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await postModel.deletePost(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post non trouvé.' });
        }
        res.json({ message: 'Post supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression du post.' });
    }
});

// créer un commentaire dans un post
router.post('/:postId/comments', async (req, res) => {
    const { content, user_id } = req.body;
    const { postId } = req.params;
    

    if (!content || !user_id) {
        return res.status(400).json({ error: 'Contenu et user_id requis.' });
    }

    try {
        const newComment = await commentModel.createComment(content, user_id, postId);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Erreur création commentaire:', error);
        res.status(500).json({ error: 'Erreur lors de la création du commentaire.' });
    }
});

// ✅ Like un post
router.post('/:postId/like', async (req, res) => {
    const { user_id, liked } = req.body;
    const postId = parseInt(req.params.postId);
  
    if (user_id == null) return res.status(400).json({ error: 'user_id required' });
  
    try {
      const like = await likeModel.createPostLike(user_id, postId, liked);
      res.status(201).json(like);
    } catch (error) {
      console.error('Error creating post like:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// DELETE a post like
router.delete('/:postId/like', async (req, res) => {
    const { user_id } = req.body;
    const postId = parseInt(req.params.postId);
  
    if (user_id == null) {
      return res.status(400).json({ error: 'user_id required' });
    }
  
    try {
      const removed = await likeModel.deletePostLike(user_id, postId);
  
      if (!removed) {
        // aucun like trouvé à supprimer
        return res.status(404).json({ success: false, message: 'Like non trouvé.' });
      }
  
      // succès
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting post like:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;
