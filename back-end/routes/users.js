const express = require('express');
const router = express.Router();
const { register, login, addMovieToWatchlist, addWatchedMovie, addMovieToFavorites, getFavoriteMovies, getWatchedMovies, getWatchlistMovies} = require('../controllers/usersController');
const authMiddleware = require('../auth');

// Route d'inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

// Route pour ajouter un film à la liste de films à regarder
router.post('/addMovieToList',authMiddleware, addMovieToWatchlist);

// Route pour ajouter un film regardé
router.post('/addWatchedMovie', authMiddleware, addWatchedMovie);

// Route pour ajouter un film aux favoris
router.post('/addToFavorites', authMiddleware, addMovieToFavorites);

// Route pour obtenir les films favoris
router.get('/favoriteMovies', authMiddleware, getFavoriteMovies);

// Route pour obtenir les films regardés
router.get('/watchedMovies', authMiddleware, getWatchedMovies);

// Route pour obtenir les films à regarder
router.get('/watchlist', authMiddleware, getWatchlistMovies);



module.exports = router;
