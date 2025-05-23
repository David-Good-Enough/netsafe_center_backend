require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importation des contrôleurs
const quizController = require("./controllers/quizController");
const authController = require("./controllers/authController");
const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');
const commentsController = require('./controllers/commentsController');
const questionsController = require('./controllers/questionsController');
const answersController = require('./controllers/answersController');
const likesController = require('./controllers/likesController');
const contenuCoursController = require('./controllers/contenuCoursController');
const coursController = require('./controllers/coursController');
const postsControllerPrivate = require('./controllers/postsControllerPrivate');

// Importation du middleware JWT
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Routes publiques (accessibles sans token)
app.use('/Login', authController); // Connexion & Inscription
app.use('/posts', postsController);

// ✅ Middleware global : protège toutes les routes suivantes
app.use(authenticateToken); 

// ✅ Routes protégées (nécessitent un token valide)
app.use('/users', usersController); 
app.use('/quizzes', quizController);
app.use('/comments', commentsController);
app.use('/questions', questionsController);
app.use('/answers', answersController);
app.use('/likes', likesController);
app.use('/contenu_cours', contenuCoursController);
app.use('/cours', coursController);
app.use('/posts', postsControllerPrivate);

// ✅ Route de test pour vérifier le token
app.get('/protected', (req, res) => {
    res.json({success: true , message: `Bienvenue, ${req.user.username}. Vous êtes authentifié.` });
});

// ✅ Démarrage du serveur
// app.listen(port, () => {
//     console.log(`✅ Serveur sécurisé actif sur http://localhost:${port}`);
// });

module.exports = app;
