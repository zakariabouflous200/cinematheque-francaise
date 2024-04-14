const Movie = require('../models/movie');
const { fetchMovieDetailsByTitle } = require('../services/tmdbService');

// Fonction pour récupérer tous les films
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}); 
    res.json(movies); 
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// Fonction pour récupérer uniquement les titres de tous les films
exports.getMovieTitles = async () => {
  try {
    const movies = await Movie.find({}, 'titre'); 
    return movies.map(movie => movie.titre);
  } catch (error) {
    console.error('Error fetching movie titles:', error);
    return [];
  }
};
exports.details = async (req, res) => {
  try {
    const movieTitles = await getMovieTitles();
    const movieDetails = await Promise.all(movieTitles.map(fetchMovieDetailsByTitle));
    res.json(movieDetails);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};







