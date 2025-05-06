const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');

// 📥 GET : Récupérer tous les posts
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const start = parseInt(req.query.start) || 0;

    try {
        const rawPosts = await postModel.getAllPosts(limit, start);

        const posts = rawPosts.map(post => {
            const { identifiant, photo, ...rest } = post;
            return {
                ...rest,
                user: {
                    identifiant,
                    photo
                }
            };
        });

        res.json(posts);
    } catch (error) {
        console.error('Erreur getAllPosts :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des posts.' });
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


module.exports = router;
