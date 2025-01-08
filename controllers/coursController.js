const express = require('express');
const router = express.Router();
const coursModel = require('../models/coursModel');

// 📥 GET : Récupérer tous les cours
router.get('/', async (req, res) => {
    try {
        const cours = await coursModel.getAllCours();
        res.json(cours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
    }
});

// 📥 GET : Récupérer un cours par ID
router.get('/:id', async (req, res) => {
    try {
        const cours = await coursModel.getCoursById(req.params.id);
        if (!cours) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }
        res.json(cours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du cours' });
    }
});

// 📤 POST : Créer un nouveau cours
router.post('/', async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Le titre et la description sont requis' });
    }
    try {
        const newCours = await coursModel.createCours(title, description);
        res.status(201).json(newCours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du cours' });
    }
});

// 🛠️ PUT : Mettre à jour un cours
router.put('/:id', async (req, res) => {
    const { title, description } = req.body;
    try {
        const updatedCours = await coursModel.updateCours(req.params.id, title, description);
        if (!updatedCours) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }
        res.json(updatedCours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du cours' });
    }
});

// 🗑️ DELETE : Supprimer un cours
router.delete('/:id', async (req, res) => {
    try {
        const deletedCours = await coursModel.deleteCours(req.params.id);
        if (!deletedCours) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }
        res.json({ message: 'Cours supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du cours' });
    }
});

module.exports = router;
