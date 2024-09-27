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
        const tmdbApiKey = '675aefffc28aebcf0d5235bf1de90b15';  // Replace with your TMDb API key
        const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${tmdbApiKey}`);
        const tmdbData = await tmdbResponse.json();

        if (tmdbData.results && tmdbData.results.length > 0) {
          const movieDetails = tmdbData.results[0];
          setMovie(movieDetails);  // Set the movie data from TMDb
          
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
      {/* Movie Details Section */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
        {movie.poster_path && (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="w-full max-w-xs rounded-lg shadow-lg mb-6"
          />
        )}
        <p className="text-gray-300 mb-6">{movie.overview}</p>

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
