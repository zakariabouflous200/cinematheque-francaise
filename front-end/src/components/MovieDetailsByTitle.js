import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetailsByTitle() {
  const { title } = useParams(); // Get the movie title from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = '675aefffc28aebcf0d5235bf1de90b15'; // Replace with your TMDb API key
  const navigate = useNavigate();

  // Fetch movie details from TMDb
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log(`Fetching movie details from TMDb for: ${title}`);

        // Step 1: Fetch the movie by title using search API to get the movie ID
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }

        const searchData = await response.json();
        if (searchData.results.length === 0) {
          throw new Error('Movie not found on TMDb');
        }

        // Get the movie ID from the first result
        const movieId = searchData.results[0].id;

        // Step 2: Fetch detailed information using the movie ID
        response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }

        const movieData = await response.json();
        console.log('Full movie details:', movieData);

        setMovie(movieData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie from TMDb:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [title, apiKey]);

  // Handle adding the movie to user's list (watched, to watch, or favorites)
  const updateMovieList = async (movieId, endpoint) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) {
        throw new Error('Failed to update the movie list');
      }

      alert('Movie successfully added to your list!');
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const addMovieToWatched = (movieId) => updateMovieList(movieId, 'addWatchedMovie');
  const addMovieToList = (movieId) => updateMovieList(movieId, 'addMovieToList');
  const addMovieToFavorites = (movieId) => updateMovieList(movieId, 'addToFavorites');

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

                  {/* Production Companies */}
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="col-span-2">
                      <p className="font-semibold">Production Companies:</p>
                      <div className="flex flex-wrap gap-4">
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
                </div>

                {/* Buttons to add the movie to lists */}
                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => addMovieToWatched(movie.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Mark as Watched
                  </button>
                  <button
                    onClick={() => addMovieToList(movie.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Add to Watchlist
                  </button>
                  <button
                    onClick={() => addMovieToFavorites(movie.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition duration-300"
                  >
                    Add to Favorites
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsByTitle;
