import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetailsByTitle() {
  const { title } = useParams(); // Get the movie title from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '675aefffc28aebcf0d5235bf1de90b15'; // Replace with your TMDb API key

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

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Movie Title */}
      <h1 className="text-4xl font-bold text-white mb-6">{movie.title}</h1>

      <div className="flex flex-wrap md:flex-nowrap md:space-x-8">
        {/* Poster Image */}
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} Poster`}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="bg-gray-800 h-96 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="w-full md:w-2/3 text-white">
          <p className="text-sm text-gray-300 mb-4">{movie.overview || 'No overview available'}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong className="text-gold-500">Release Date:</strong> {movie.release_date || 'Unknown'}</p>
            <p><strong className="text-gold-500">Rating:</strong> {movie.vote_average || 'Not rated'} ({movie.vote_count} votes)</p>
            <p><strong className="text-gold-500">Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'Unknown'}</p>
            <p><strong className="text-gold-500">Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'Unknown'}</p>
            <p><strong className="text-gold-500">Revenue:</strong> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Unknown'}</p>
            <p><strong className="text-gold-500">Genres:</strong> {movie.genres.map(genre => genre.name).join(', ') || 'Unknown'}</p>
            <p><strong className="text-gold-500">Tagline:</strong> {movie.tagline || 'No tagline available'}</p>
            <p><strong className="text-gold-500">Status:</strong> {movie.status || 'Unknown'}</p>
          </div>

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gold-500 mb-4">Production Companies</h2>
              <ul className="list-disc list-inside text-gray-300">
                {movie.production_companies.map(company => (
                  <li key={company.id} className="mb-1">
                    {company.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        className="inline-block w-8 h-8 mr-2"
                      />
                    )}
                    {company.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsByTitle;
