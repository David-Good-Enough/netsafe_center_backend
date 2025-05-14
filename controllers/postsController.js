const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const favoriteModel = require("../models/favoriteModel")


// 📥 GET : Récupérer tous les posts
router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const start = parseInt(req.query.start) || 0;
    const sortBy = req.query.sortBy || 'created_at'; // ou 'likes_count'
    const sortOrder = req.query.sortOrder || 'DESC'; // ou 'ASC'

    try {
        const posts = await postModel.getAllPosts(limit, start, sortBy, sortOrder);
        res.json(posts);
    } catch (error) {
        console.error('Erreur récupération posts avec tri :', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});


// 📥 GET : Récupérer un post par ID
router.get('/:id', async (req, res) => {
    try {
        const post = await postModel.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post non trouvé' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du post' });
    }
});


// ✅ GET : tous les commentaires d’un post avec pagination + tri
router.get('/:postId/comments', async (req, res) => {
    const postId = parseInt(req.params.postId);
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.start) || 0;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'ASC';
    

    try {
        const comments = await commentModel.getCommentsByPost(postId, limit, offset, sortBy, sortOrder);
        res.json(comments);
    } catch (error) {
        console.error('Erreur récupération commentaires :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    }
});

// ajouter un favori
router.post('/:postId/favorite', async (req, res) => {
    const user_id = parseInt(req.body.user_id);
    const post_id = parseInt(req.params.postId);
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    try {
      const fav = await favoriteModel.addPostFavorite(user_id, post_id);
      if (!fav) {
        // déjà en favori
        return res.json({ success: true, message: 'Déjà en favori' });
      }
      res.status(201).json({ success: true, favorite: fav });
    } catch (err) {
      console.error('Error adding favorite:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  







module.exports = router;
