import React, { useState, useEffect } from 'react';

function MyListPage() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchMoviesList = async (endpoint, setter) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Utilisateur non connecté');
        return;
      }

      try {
        const response = await fetch(`https://cinematheque-francaise.onrender.com/api/users/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Échec de la récupération : ${response.statusText}`);
        }

        const responseBody = await response.text();
        try {
          const data = JSON.parse(responseBody);
          const moviesWithTMDbData = await Promise.all(data.map(async (movie) => {
            let tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=675aefffc28aebcf0d5235bf1de90b15&query=${encodeURIComponent(movie.titre)}`);
            let tmdbData = await tmdbResponse.json();

            // If no results found for titre, search by titreoriginal
            if (tmdbData.results.length === 0) {
              tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=675aefffc28aebcf0d5235bf1de90b15&query=${encodeURIComponent(movie.titreoriginal)}`);
              tmdbData = await tmdbResponse.json();
            }

            return {
              ...movie,
              tmdb: tmdbData.results[0]
            };
          }));
          setter(moviesWithTMDbData);
        } catch (error) {
          throw new Error("La réponse reçue n'est pas un JSON valide");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des listes de films:', error);
      }
    };

    fetchMoviesList('favoriteMovies', setFavoriteMovies);
    fetchMoviesList('watchedMovies', setWatchedMovies);
    fetchMoviesList('watchlist', setWatchlist);
  }, []);

  // Remove movie from a list
  const removeMovieFromList = async (movieId, endpoint, setter, listState, setListState) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://cinematheque-francaise.onrender.com/api/users/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieId })
      });
      if (!response.ok) throw new Error('Failed to remove movie');
      const updatedList = await response.json();

      // Update the state to reflect the change
      setter(updatedList);

      // Remove the corresponding movie from the frontend state
      const updatedMovies = listState.filter(movie => movie._id !== movieId);
      setListState(updatedMovies);

      // Remove the corresponding TMDB data from the frontend state
      const updatedMoviesWithTMDBData = updatedMovies.map(movie => {
        if (movie.tmdb && movie.tmdb.id === movieId) {
          return {
            ...movie,
            tmdb: null // Remove TMDB data for the deleted movie
          };
        }
        return movie;
      });
      setListState(updatedMoviesWithTMDBData);

    } catch (error) {
      console.error('Error removing movie:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Films Favoris</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMovies.map(movie => (
            <div key={movie._id} className="bg-gray-800 text-white rounded-lg shadow-xl p-4 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-lg font-semibold mb-3">{movie.titre}</h4>
              {movie.tmdb && (
                <div>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.tmdb.poster_path}`} alt={`${movie.titre} Poster`} className="rounded-lg mb-4" />
                  <p className="text-sm">{movie.tmdb.overview}</p>
                </div>
              )}
              <button onClick={() => removeMovieFromList(movie._id, 'removeFromFavorites', setFavoriteMovies, favoriteMovies, setFavoriteMovies)} className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Remove</button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Films Vus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchedMovies.map(movie => (
            <div key={movie._id} className="bg-gray-800 text-white rounded-lg shadow-xl p-4 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-lg font-semibold mb-3">{movie.titre}</h4>
              {movie.tmdb && (
                <div>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.tmdb.poster_path}`} alt={`${movie.titre} Poster`} className="rounded-lg mb-4" />
                  <p className="text-sm">{movie.tmdb.overview}</p>
                </div>
              )}
              <button onClick={() => removeMovieFromList(movie._id, 'removeWatchedMovie', setWatchedMovies, watchedMovies, setWatchedMovies)} className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Remove</button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Liste de Visionnage</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map(movie => (
            <div key={movie._id} className="bg-gray-800 text-white rounded-lg shadow-xl p-4 hover:shadow-2xl transition-shadow duration-300">
              <h4 className="text-lg font-semibold mb-3">{movie.titre}</h4>
              {movie.tmdb && (
                <div>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.tmdb.poster_path}`} alt={`${movie.titre} Poster`} className="rounded-lg mb-4" />
                  <p className="text-sm">{movie.tmdb.overview}</p>
                </div>
              )}
              <button onClick={() => removeMovieFromList(movie._id, 'removeFromWatchlist', setWatchlist, watchlist, setWatchlist)} className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Remove</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
  
}

export default MyListPage;
