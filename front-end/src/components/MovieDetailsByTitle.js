import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetailsByTitle() {
  const { title } = useParams(); // Get the movie title from the URL
  const [movie, setMovie] = useState(null);  // Movie data from TMDb
  const [movieId, setMovieId] = useState(null);  // Movie ID from your backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch movie details from TheMovieDB API and backend (for movieId)
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Fetch movie details from TMDb API
        const tmdbApiKey = 'YOUR_TMDB_API_KEY';  // Replace with your TMDb API key
        const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${tmdbApiKey}`);
        const tmdbData = await tmdbResponse.json();

        if (tmdbData.results && tmdbData.results.length > 0) {
          const movieDetails = tmdbData.results[0];

          // Fetch full movie details from TMDb
          const fullMovieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieDetails.id}?api_key=${tmdbApiKey}`);
          const fullMovieData = await fullMovieResponse.json();

          setMovie(fullMovieData);  // Set the movie data from TMDb
          
          // Fetch movieId from your backend using title
          const backendResponse = await fetch(`https://cinematheque-francaise.onrender.com/api/movies/getMovieByTitle/${encodeURIComponent(title)}`);
          const backendData = await backendResponse.json();
          setMovieId(backendData._id);  // Set the movieId from your backend
        } else {
          throw new Error('Movie not found on TMDb');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [title]);

  // Function to handle adding the movie to the user's lists
  const updateMovieList = async (endpoint) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`https://cinematheque-francaise.onrender.com/api/users/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId })  // Send movieId to your backend
      });

      if (!response.ok) {
        throw new Error('Failed to update the movie list');
      }

      alert('Movie successfully added to your list!');
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  // Functions for adding to different lists
  const addMovieToWatched = () => updateMovieList('addWatchedMovie');
  const addMovieToWatchlist = () => updateMovieList('addMovieToList');
  const addMovieToFavorites = () => updateMovieList('addToFavorites');

  if (loading) return <p className="text-white text-center py-10">Loading movie details...</p>;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  return (
    <div className="relative text-white">
      {/* Hero Section */}
      <div
        className="relative w-full h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Movie Poster */}
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} Poster`}
                  className="w-full max-w-xs rounded-lg shadow-lg mb-6 md:mb-0"
                />
              ) : (
                <div className="w-full max-w-xs h-96 bg-gray-800 flex items-center justify-center text-gray-500 rounded-lg">
                  No Image Available
                </div>
              )}

              {/* Movie Information */}
              <div className="md:ml-10 mt-6 md:mt-0 text-center md:text-left">
                <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                <p className="italic text-gray-300 mb-6">"{movie.tagline || 'No tagline available'}"</p>
                <p className="text-gray-300 mb-4">{movie.overview || 'No overview available'}</p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <p className="font-semibold">Release Date:</p>
                    <p>{movie.release_date || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Rating:</p>
                    <p>{movie.vote_average || 'Not rated'} ({movie.vote_count} votes)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Runtime:</p>
                    <p>{movie.runtime ? `${movie.runtime} min` : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Budget:</p>
                    <p>{movie.budget ? `$${movie.budget.toLocaleString()}` : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Revenue:</p>
                    <p>{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Genres:</p>
                    <p>{movie.genres.map(genre => genre.name).join(', ') || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Companies */}
      {movie.production_companies && movie.production_companies.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gold-500 mb-6">Production Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movie.production_companies.map(company => (
              <div key={company.id} className="flex items-center space-x-3">
                {company.logo_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    className="w-12 h-12 rounded"
                  />
                )}
                <span>{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons to add the movie to lists */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-4">
          <button
            onClick={addMovieToWatched}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            disabled={!movieId}
          >
            Mark as Watched
          </button>
          <button
            onClick={addMovieToWatchlist}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
            disabled={!movieId}
          >
            Add to Watchlist
          </button>
          <button
            onClick={addMovieToFavorites}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
            disabled={!movieId}
          >
            Add to Favorites
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsByTitle;
