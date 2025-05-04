const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');

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

module.exports = router;
