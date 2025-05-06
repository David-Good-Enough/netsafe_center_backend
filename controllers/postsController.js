const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');


// 📥 GET : Récupérer tous les posts
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
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

// 📥 GET : Récupérer les commentaires d'un post
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await postModel.getCommentsByPost(req.params.id);
        if (!comments.length) {
            return res.status(404).json({ error: 'Commentaires non trouvés' });
        }
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
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


module.exports = router;
