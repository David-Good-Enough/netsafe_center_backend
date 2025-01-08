require('dotenv').config();

const express = require('express');
const cors = require('cors');
//const QuizzController = require("./controllers/QuizzController");
const LoginController = require("./controllers/LoginController");
//const usersController = require('./controllers/usersController');
const postsController = require('./controllers/postsController');
//const commentsController = require('./controllers/commentsController');
//const questionsController = require('./controllers/questionsController');
//const answersController = require('./controllers/answersController');
//const likesController = require('./controllers/likesController');
//const contenuCoursController = require('./controllers/contenuCoursController');
const coursController = require('./controllers/coursController');

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

//app.use('/Quizz', QuizzController);
//app.use('/users', usersController);
app.use('/Login', LoginController);
app.use('/posts', postsController);
//app.use('/comments', commentsController);
//app.use('/questions', questionsController);
//app.use('/answers', answersController);
//app.use('/likes', likesController);
//app.use('/contenu_cours', contenuCoursController);
app.use('/cours', coursController);


app.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});
