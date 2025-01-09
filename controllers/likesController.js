const express = require('express');
const router = express.Router();
const likesModel = require('../models/likesModel');

// 📥 GET : Récupérer tous les likes
router.get('/', async (req, res) => {
    try {
        const likes = await likesModel.getAllLikes();
        res.json(likes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des likes.' });
    }
});

// 📥 GET : Récupérer un like par ID
router.get('/:id', async (req, res) => {
    try {
        const like = await likesModel.getLikeById(req.params.id);
        if (!like) {
            return res.status(404).json({ error: 'Like non trouvé.' });
        }
        res.json(like);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du like.' });
    }
});

// 📤 POST : Créer un nouveau like
router.post('/', async (req, res) => {
    const { liked, comment_id, user_id, post_id } = req.body;
    if (liked === undefined || !user_id || (!comment_id && !post_id)) {
        return res.status(400).json({ error: 'Tous les champs requis ne sont pas remplis.' });
    }

    try {
        const newLike = await likesModel.createLike(liked, comment_id, user_id, post_id);
        res.status(201).json(newLike);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du like.' });
    }
});

// 🛠️ PUT : Mettre à jour un like
router.put('/:id', async (req, res) => {
    const { liked } = req.body;
    try {
        const updatedLike = await likesModel.updateLike(req.params.id, liked);
        if (!updatedLike) {
            return res.status(404).json({ error: 'Like non trouvé.' });
        }
        res.json(updatedLike);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du like.' });
    }
});

// 🗑️ DELETE : Supprimer un like
router.delete('/:id', async (req, res) => {
    try {
        const deletedLike = await likesModel.deleteLike(req.params.id);
        if (!deletedLike) {
            return res.status(404).json({ error: 'Like non trouvé.' });
        }
        res.json({ message: 'Like supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du like.' });
    }
});

module.exports = router;
