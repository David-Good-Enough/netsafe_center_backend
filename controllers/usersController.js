const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const postModel = require('../models/postModel')


router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Veuillez fournir un critère de recherche via le paramètre "query".' });
    }
    try {
        const users = await userModel.searchUsers(query);
        res.json(users);    
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la recherche des utilisateurs' });
    }
});

// 📥 GET : Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

// 📥 GET : Récupérer un utilisateur par ID
router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
});

// 📤 POST : Créer un nouvel utilisateur
router.post('/', async (req, res) => {
    const { identifiant, mail, password, photo } = req.body;
    if (!identifiant || !mail || !password) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    try {
        const newUser = await userModel.createUser(identifiant, mail, password, photo);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
});

// 🛠️ PUT : Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
    const { identifiant, mail, password, photo } = req.body;
    try {
        const updatedUser = await userModel.updateUser(req.params.id, identifiant, mail, password, photo);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
});

// 🗑️ DELETE : Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await userModel.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
});

// ✅ GET : Tous les posts d’un utilisateur
router.get('/:id/posts', async (req, res) => {
    const { id } = req.params;

    try {
        const posts = await postModel.getPostsByUserId(id);
        
        if (posts.length === 0) {
            return res.status(404).json({ message: "Aucun post trouvé pour cet utilisateur." });
        }

        res.json(posts);
    } catch (error) {
        console.error('Erreur lors de la récupération des posts de l’utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// GET la liste des favoris d’un utilisateur
router.get('/:userId/favorites', async (req, res) => {
    try {
      const user_id = parseInt(req.params.userId);
      // Vérifier droits…
      const list = await favoriteModel.getFavoritesByUser(user_id);
      res.json({ success: true, favorites: list });
    } catch (err) {
      console.error('Error fetching favorites:', err);
      res.status(500).json({ error: 'Server error' });
    }
});
  
// DELETE un favori pour un post donné
router.delete('/:userId/favorites/:postId', async (req, res) => {
    try {
      const user_id = parseInt(req.params.userId);
      const post_id = parseInt(req.params.postId);
      // Vérifier droits…
      const removed = await favoriteModel.removePostFavorite(user_id, post_id);
      if (!removed) {
        return res.status(404).json({ success: false, message: 'Favori non trouvé' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Error removing favorite:', err);
      res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
