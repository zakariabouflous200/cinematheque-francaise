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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{movie.title}</h1>
      {movie.poster_path && (
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} Poster`} className="rounded-lg mb-4" />
      )}

      <p className="text-sm mb-4">{movie.overview || 'No overview available'}</p>

      <p><strong>Release Date:</strong> {movie.release_date || 'Unknown'}</p>
      <p><strong>Rating:</strong> {movie.vote_average || 'Not rated'} ({movie.vote_count} votes)</p>
      <p><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'Unknown'}</p>
      <p><strong>Budget:</strong> {movie.budget ? `$${movie.budget.toLocaleString()}` : 'Unknown'}</p>
      <p><strong>Revenue:</strong> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Unknown'}</p>
      <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ') || 'Unknown'}</p>
      <p><strong>Production Companies:</strong> {movie.production_companies.map(company => company.name).join(', ') || 'Unknown'}</p>
      <p><strong>Tagline:</strong> {movie.tagline || 'No tagline available'}</p>
      <p><strong>Status:</strong> {movie.status || 'Unknown'}</p>
    </div>
  );
}

export default MovieDetailsByTitle;
