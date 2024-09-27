import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10); 
  const [loading, setLoading] = useState(false); 
  const [totalPages, setTotalPages] = useState(1); 
  const maxVisiblePages = 5; // Maximum number of pages to show between first and last
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    setLoading(true); 
    try {
      const moviesData = await fetchAllMovies(page, moviesPerPage);
      const enrichedMoviesData = await enrichMovieData(moviesData.movies); 
      setMovies(enrichedMoviesData);  
      setTotalPages(moviesData.totalPages);  
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
    setLoading(false); 
  };

  const fetchAllMovies = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`https://cinematheque-francaise.onrender.com/api/movies/getAllMovies?page=${page}&limit=${limit}`); 
      if (!response.ok) {
        throw new Error('Problème lors de la récupération des films');
      }
      const data = await response.json();
      return data;  
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
      return [];
    }
  };

  const enrichMovieData = async (moviesData) => {
    const enrichedMoviesData = [];
    for (const movie of moviesData) {
      const enrichedMovie = await fetchEnrichedMovieData(movie.titre, movie.titreOriginal);
      enrichedMoviesData.push({ ...movie, enrichedData: enrichedMovie });
    }
    return enrichedMoviesData;
  };

  const fetchEnrichedMovieData = async (movieTitle, originalTitle) => {
    try {
      const apiKey = '675aefffc28aebcf0d5235bf1de90b15'; 
      let response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitle)}&api_key=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details from TMDb');
      }
      
      let data = await response.json();
      
      if (data.results.length > 0) {
        return data.results[0];  
      } else if (originalTitle) {
        response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(originalTitle)}&api_key=${apiKey}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details from TMDb with original title');
        }
        
        data = await response.json();
        
        if (data.results.length > 0) {
          return data.results[0];
        } else {
          console.warn('No matching movie found on TMDb', movieTitle);
          return null;  
        }
      } else {
        console.warn('No matching movie found and no original title provided', movieTitle);
        return null;
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  const updateMovieList = async (movieId, endpoint) => {
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
        body: JSON.stringify({ movieId })
      });

      if (!response.ok) {
        throw new Error(`Problème lors de l'ajout du film à la liste`);
      }

      alert('Film mis à jour dans votre liste avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du film:', error);
    }
  };

  const addMovieToWatched = (movieId) => {
    updateMovieList(movieId, 'addWatchedMovie');
  };

  const addMovieToList = (movieId) => {
    updateMovieList(movieId, 'addMovieToList');
  };

  const addMovieToFavorites = (movieId) => {
    updateMovieList(movieId, 'addToFavorites');
  };

  // Generate page numbers for pagination with logic to handle first/last pages
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 2); // At least page 2
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1); // At least 2 pages before last

    // Always show the first page
    pageNumbers.push(
      <button
        key={1}
        onClick={() => setCurrentPage(1)}
        className={`px-4 py-2 rounded-md mx-1 ${currentPage === 1 ? 'bg-gold-500 text-white' : 'bg-gray-300 text-black'}`}
      >
        1
      </button>
    );

    // Show "..." if we're not near the first page
    if (startPage > 2) {
      pageNumbers.push(<span key="start-dots">...</span>);
    }

    // Loop through the visible pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 rounded-md mx-1 ${currentPage === i ? 'bg-gold-500 text-white' : 'bg-gray-300 text-black'}`}
        >
          {i}
        </button>
      );
    }

    // Show "..." if there are more pages after the visible range
    if (endPage < totalPages - 1) {
      pageNumbers.push(<span key="end-dots">...</span>);
    }

    // Always show the last page
    pageNumbers.push(
      <button
        key={totalPages}
        onClick={() => setCurrentPage(totalPages)}
        className={`px-4 py-2 rounded-md mx-1 ${currentPage === totalPages ? 'bg-gold-500 text-white' : 'bg-gray-300 text-black'}`}
      >
        {totalPages}
      </button>
    );

    return pageNumbers;
  };

  // Navigate to movie details page when a movie is clicked
  const goToMovieDetails = (movieTitle) => {
    navigate(`/movies/${encodeURIComponent(movieTitle)}`);
  };
return (
  <div className="w-full bg-black text-white">
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">Liste des Films</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <div 
            key={index} 
            className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer" 
            onClick={() => goToMovieDetails(movie.titre)} // Redirect to details page
          >
            <h3 className="text-xl font-semibold mb-3">{movie.titre}</h3>
            {movie.enrichedData && (
              <div>
                {movie.enrichedData.poster_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w500/${movie.enrichedData.poster_path}`} 
                    alt={movie.titre} 
                    className="w-full mb-3 rounded-lg" 
                  />
                ) : (
                  <img 
                    src="https://via.placeholder.com/500x750?text=No+Image+Available" 
                    alt="Placeholder"
                    className="w-full mb-3 rounded-lg" 
                  />
                )}
                <p className="text-sm text-gray-300 mb-4">{movie.enrichedData.overview || 'No overview available'}</p>
              </div>
            )}
            <div className="flex justify-between">
              <button onClick={(e) => { e.stopPropagation(); addMovieToWatched(movie._id); }} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Vu</button>
              <button onClick={(e) => { e.stopPropagation(); addMovieToList(movie._id); }} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">À Voir</button>
              <button onClick={(e) => { e.stopPropagation(); addMovieToFavorites(movie._id); }} className="bg-gold-500 hover:bg-gold-600 text-white py-2 px-4 rounded-md">Favoris</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {renderPageNumbers()}
      </div>
    </div>
  </div>
);
