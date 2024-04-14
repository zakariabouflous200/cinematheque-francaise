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
                // Requête GET pour récupérer la liste de films spécifiée par l'endpoint
        const response = await fetch(`http://localhost:8080/api/users/${endpoint}`, {
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
          setter(data); 
        } catch (error) {
          throw new Error("La réponse reçue n'est pas un JSON valide");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des listes de films:', error);
      }
    };

    // Appel de la fonction pour chaque liste de films
    fetchMoviesList('favoriteMovies', setFavoriteMovies);
    fetchMoviesList('watchedMovies', setWatchedMovies);
    fetchMoviesList('watchlist', setWatchlist);
  }, []);

  return (
    <div>
      <h2>Ma Liste</h2>
      <section>
        <h3>Films Favoris</h3>
        {favoriteMovies.map(movie => <div key={movie._id}>{movie.titre}</div>)}
      </section>
      <section>
        <h3>Films Vus</h3>
        {watchedMovies.map(movie => <div key={movie._id}>{movie.titre}</div>)}
      </section>
      <section>
        <h3>Liste de Visionnage</h3>
        {watchlist.map(movie => <div key={movie._id}>{movie.titre}</div>)}
      </section>
    </div>
  );
}

export default MyListPage;
