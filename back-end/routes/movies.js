const express = require('express');
const router = express.Router();
const { getAllMovies, details, moviesInCinemas, getMoviesAtFestivals, searchMovies  } = require('../controllers/moviesController'); 

// Route pour obtenir les détails d'un film
router.get('/details', details);
// Route to search movies by title
router.get('/search', searchMovies);
// Route pour obtenir tous les films
router.get('/getAllMovies', getAllMovies);
router.get('/movies-at-festivals', getMoviesAtFestivals);
router.get('/movies-in-cinemas', moviesInCinemas);

module.exports = router;
