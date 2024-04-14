const fetch = require('node-fetch');

// La fonction ci-dessous récupère les détails d'un film à partir de l'API The Movie Database (TMDb) en utilisant son titre
const fetchMovieDetailsByTitle = async (movieTitre) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitre)}&api_key=675aefffc28aebcf0d5235bf1de90b15`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details from TMDb');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

module.exports = { fetchMovieDetailsByTitle };