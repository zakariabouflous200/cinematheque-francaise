const express = require('express');
const router = express.Router();
const { getAllMovies, details } = require('../controllers/moviesController'); 

// Route pour obtenir les détails d'un film
router.get('/details', details);

// Route pour obtenir tous les films
router.get('/getAllMovies', getAllMovies);


module.exports = router;
