const Movie = require('../models/movie');
const { fetchMovieDetailsByTitle,  } = require('../services/tmdbService');

// Fonction pour récupérer tous les films
exports.getAllMovies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page=1 and limit=10
    const movies = await Movie.find({})
      .skip((page - 1) * limit)  // Skip previous pages
      .limit(parseInt(limit));  // Limit the number of movies returned

    const totalMovies = await Movie.countDocuments();  // Get total number of movies for pagination
    res.json({
      movies,
      totalPages: Math.ceil(totalMovies / limit),
      currentPage: parseInt(page)
    });
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

exports.moviesInCinemas = async (req, res) => {
  try {
    // Fetch cinemas from the external API
    const apiResponse = await axios.get('https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques&q=&rows=100');
    const cinemas = apiResponse.data.records;

    // Prepare to fetch movies for these cinemas
    let moviesInCinemas = {};
    for (let cinema of cinemas) {
        const cinemaName = cinema.fields.nom;
        const movies = await Movie.find({ cinemaName: cinemaName }); // Fetch movies from your DB that are linked to this cinema
        moviesInCinemas[cinemaName] = movies;
    }

    res.json(moviesInCinemas);
} catch (error) {
    console.error('Failed to fetch movies for cinemas:', error);
    res.status(500).send('Server error');
}
};


exports.getMoviesAtFestivals = async (req, res) => {
  const url = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?limit=100';
  
  try {
      const festivalResponse = await fetch(url);
      const festivalsData = await festivalResponse.json();

      // Log the entire raw festival data to inspect the structure
      console.log("Raw festival data:", JSON.stringify(festivalsData, null, 2)); // Use JSON.stringify for better formatting

      if (!festivalResponse.ok) {
          throw new Error(`HTTP error! Status: ${festivalResponse.status}`);
      }

      if (!festivalsData.records || !Array.isArray(festivalsData.records)) {
          throw new Error("Expected 'records' key with array format was not found in the data");
      }

      let festivalMovies = [];
      festivalsData.records.forEach(record => {
          // Assuming each record might have a list of films or something similar
          if (record.fields && record.fields.film_titles) {
              festivalMovies.push(...record.fields.film_titles);
          }
      });

      console.log("Processed festival movies list:", festivalMovies);

      const movies = await Movie.find({ titre: { $in: festivalMovies } });
      res.json(movies);
  } catch (error) {
      console.error('Failed to fetch movies at festivals:', error.message);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};
