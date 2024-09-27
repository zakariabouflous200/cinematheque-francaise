// MovieDetailsByTitle.js
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
        console.log(`Fetching movie details from TMDb for: ${title}`);  // Log the title being searched

        // Fetch from TMDb API using the movie title
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }

        const data = await response.json();
        console.log('TMDb movie details:', data);

        if (data.results.length === 0) {
          throw new Error('Movie not found on TMDb');
        }

        // Use the first result from TMDb
        const movieData = data.results[0];
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
      <p><strong>Rating:</strong> {movie.vote_average || 'Not rated'}</p>
    </div>
  );
}

export default MovieDetailsByTitle;
