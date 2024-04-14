const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  id: Number,
  titre: String,
  titreOriginal: String,
  realisateurs: String, 
  anneeDeProduction: Number,
  nationalite: String, 
  duree: String, 
  genre: [String], 
  synopsis: String,
  
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
