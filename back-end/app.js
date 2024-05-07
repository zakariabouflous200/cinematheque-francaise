const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const importMoviesFromExcel = require('./importMovies');
const watchExcelFile = require('./watchExcel');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const cinemaRoutes = require('./routes/cinema');


// URI de connexion MongoDB
const mongoURI = process.env.MONGO_URI;

// Connexion à MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB');
    // Surveillance et importation des données depuis le fichier Excel après la connexion à MongoDB
    const excelFilePath = './film.xlsx';
    watchExcelFile(excelFilePath);
    return importMoviesFromExcel(excelFilePath);
  })
  .then(() => {
    console.log('Données initiales importées depuis Excel');
    // Démarrer le serveur après l'importation des données
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Serveur en fonctionnement sur le port ${port}...`);
    });
  })
  .catch(err => {
    console.error('Impossible de se connecter à MongoDB:', err);
    process.exit(1);
  });

// Middlewares
app.use(express.json());
app.use(cors());

// Routes de l'API
app.use('/api/users', usersRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/cinemas', cinemaRoutes);


