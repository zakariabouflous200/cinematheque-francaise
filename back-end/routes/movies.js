const express = require('express');
const router = express.Router();
const { getAllMovies, details, moviesInCinemas, getMoviesAtFestivals  } = require('../controllers/moviesController'); 

// Route pour obtenir les détails d'un film
router.get('/details', details);

// Route pour obtenir tous les films
router.get('/getAllMovies', getAllMovies);
router.get('/movies-at-festivals', getMoviesAtFestivals);
router.get('/movies-in-cinemas', moviesInCinemas);

module.exports = router;
