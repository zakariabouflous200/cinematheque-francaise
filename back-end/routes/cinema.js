// cinemaRoutes.js

const express = require('express');
const router = express.Router();
const cinemaController = require('../controllers/cinemaController');

router.get('/ile-de-france', cinemaController.getCinemasInIleDeFrance);

module.exports = router;

// Route to get detailed information about a specific cinema
router.get('/details/:cinemaId', cinemaController.getCinemaDetails);
router.get('/:cinemaId/movies', cinemaController.getMoviesShowingInCinema);

module.exports = router;
