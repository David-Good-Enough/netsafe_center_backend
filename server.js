require('dotenv').config();

const express = require('express');
const cors = require('cors');
const TestRoute = require("./routes/Test");

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

app.use('/Test', TestRoute);


app.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});
