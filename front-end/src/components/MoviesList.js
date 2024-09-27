import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(52);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

    // Fonction fetchData() pour récupérer les données des films depuis l'API
  const fetchData = async () => {
    try {
      const moviesData = await fetchAllMovies();
      const enrichedMoviesData = await enrichMovieData(moviesData);
      setMovies(enrichedMoviesData);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  // Fonction fetchAllMovies() pour récupérer la liste complète des films depuis le serveur
  const fetchAllMovies = async () => {
    try {
      const response = await fetch('https://cinematheque-francaise.onrender.com/api/movies/getAllMovies'); 
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

  // Fonction enrichMovieData() pour enrichir les données des films avec des détails supplémentaires
  const enrichMovieData = async (moviesData) => {
    const enrichedMoviesData = [];
    for (const movie of moviesData) {
      const enrichedMovie = await fetchEnrichedMovieData(movie.titre, movie.titreOriginal);
      enrichedMoviesData.push({ ...movie, enrichedData: enrichedMovie });
    }
    return enrichedMoviesData;
  };

  // Fonction fetchEnrichedMovieData() pour récupérer les détails enrichis d'un film à partir d'une API externe (TMDb)
  const fetchEnrichedMovieData = async (movieTitle, originalTitle) => {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitle)}&api_key=675aefffc28aebcf0d5235bf1de90b15`);
        if (!response.ok) {
            throw new Error('Failed to fetch movie details from TMDb');
        }
        let data = await response.json();
        if (data.results.length > 0) {
            return data.results[0];
        } else if (originalTitle) { 
            
            // Retour à l'API TMDb avec titreOriginal
            response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(originalTitle)}&api_key=675aefffc28aebcf0d5235bf1de90b15`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie details from TMDb with titreOriginal');
            }
            data = await response.json();
            if (data.results.length > 0) {
                return data.results[0];
            } else {
                
                return null;
            }
        } else {
            console.warn('Movie not found on TMDb with titre and no titreOriginal provided', movieTitle);
            return null;
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};
  // Fonction updateMovieList() pour mettre à jour la liste des films de l'utilisateur (films favoris, vus et à voir)
  const updateMovieList = async (movieId, endpoint) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      
      const response = await fetch(`https://https://cinematheque-francaise.onrender.com/api/users/${endpoint}`, {
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
  
// Appel de la fonction pour chaque liste de films
  const addMovieToWatched = (movieId) => {
    updateMovieList(movieId, 'addWatchedMovie');
  };

  const addMovieToList = (movieId) => {
    updateMovieList(movieId, 'addMovieToList');
  };
  const addMovieToFavorites = async (movieId) => {
    updateMovieList(movieId, 'addToFavorites');
  };

  

    // Calcul du nombre total de pages et gestion de l'affichage des boutons de pagination
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const maxPageButtons = 5;
  let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
  let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  if (endPage === totalPages) {
    startPage = Math.max(totalPages - maxPageButtons + 1, 1);
  } else if (endPage === currentPage) {
    endPage = Math.min(currentPage + Math.floor(maxPageButtons / 2), totalPages);
    startPage = Math.max(endPage - maxPageButtons + 1, 1);
  }

    // Fonctions handlePrevPage() et handleNextPage() pour la gestion de la pagination
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="w-full bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-6">Liste des Films</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage).map((movie, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-3">{movie.titre}</h3>
              {movie.enrichedData && (
                <div>
                  {movie.enrichedData.poster_path && (
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.enrichedData.poster_path}`} alt={movie.titre} className="w-full mb-3 rounded-lg" />
                  )}
                  <p className="text-sm text-gray-300 mb-4">{movie.enrichedData.overview}</p>
                </div>
              )}
              <div className="flex justify-between">
                <button onClick={() => addMovieToWatched(movie._id)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Vu</button>
                <button onClick={() => addMovieToList(movie._id)} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">À Voir</button>
                <button onClick={() => addMovieToFavorites(movie._id)} className="bg-gold-500 hover:bg-gold-600 text-white py-2 px-4 rounded-md">Favoris</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="text-black bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-md mx-2">Précédent</button>
          {[...Array(endPage - startPage + 1)].map((_, i) => (
            <button key={startPage + i} onClick={() => setCurrentPage(startPage + i)} className={`px-4 py-2 rounded-md mx-1 ${currentPage === startPage + i ? 'bg-gold-500 text-white' : 'bg-gray-300 text-black'}`}>{startPage + i}</button>
          ))}
          {endPage < totalPages ? (
            <>
              <span className="mx-2">...</span>
              <button onClick={() => setCurrentPage(totalPages)} className="text-black bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-md">{totalPages}</button>
            </>
          ) : null}
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="text-black bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-md mx-2">Suivant</button>
        </div>
      </div>
    </div>
  );
  
}
export default MoviesList;
