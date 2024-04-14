const mongoose = require('mongoose');
const readXlsxFile = require('read-excel-file/node');
const Movie = require('./models/movie'); 

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Impossible de se connecter à MongoDB', err));

function importMoviesFromExcel(filePath) {
  readXlsxFile(filePath).then((rows) => {
    // Ignorer les en-têtes, traiter les lignes
    const movies = rows.slice(1).map(row => ({
      id: row[0],
      titre: row[1],
      titreOriginal: row[2],
      realisateurs: row[3], 
      anneeDeProduction: row[4],
      nationalite: row[5], 
      duree: row[6],
      genre: row[7], 
      synopsis: row[8],
    }));

    // Vider la collection avant l'importation pour éviter les doublons
    Movie.deleteMany({})
      .then(() => {
        Movie.insertMany(movies)
          .then(() => console.log('Films importés avec succès'))
          .catch(err => console.error('Échec de l importation des films', err));
      });
  });
}

module.exports = importMoviesFromExcel;
