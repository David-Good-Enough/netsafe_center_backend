const express = require('express');
const router = express.Router();
const contenuCoursModel = require('../models/contenuCoursModel');

// 📥 GET : Récupérer tous les contenus de cours
router.get('/', async (req, res) => {
    try {
        const contenuCours = await contenuCoursModel.getAllContenuCours();
        res.json(contenuCours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des contenus de cours' });
    }
});

// 📥 GET : Récupérer un contenu de cours par ID
router.get('/:id', async (req, res) => {
    try {
        const contenuCours = await contenuCoursModel.getContenuCoursById(req.params.id);
        if (!contenuCours) {
            return res.status(404).json({ error: 'Contenu de cours non trouvé' });
        }
        res.json(contenuCours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du contenu de cours' });
    }
});

// 📤 POST : Créer un nouveau contenu de cours
router.post('/', async (req, res) => {
    const { contenu_id, contenu, completed, cours_id, user_id } = req.body;
    if (!contenu_id || !contenu || !cours_id || !user_id) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        const newContenuCours = await contenuCoursModel.createContenuCours(contenu_id, contenu, completed, cours_id, user_id);
        res.status(201).json(newContenuCours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du contenu de cours' });
    }
});

// 🛠️ PUT : Mettre à jour un contenu de cours
router.put('/:id', async (req, res) => {
    const { contenu, completed } = req.body;
    try {
        const updatedContenuCours = await contenuCoursModel.updateContenuCours(req.params.id, contenu, completed);
        if (!updatedContenuCours) {
            return res.status(404).json({ error: 'Contenu de cours non trouvé' });
        }
        res.json(updatedContenuCours);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du contenu de cours' });
    }
});

// 🗑️ DELETE : Supprimer un contenu de cours
router.delete('/:id', async (req, res) => {
    try {
        const deletedContenuCours = await contenuCoursModel.deleteContenuCours(req.params.id);
        if (!deletedContenuCours) {
            return res.status(404).json({ error: 'Contenu de cours non trouvé' });
        }
        res.json({ message: 'Contenu de cours supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du contenu de cours' });
    }
});

module.exports = router;
