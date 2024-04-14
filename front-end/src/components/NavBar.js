import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  

    // Vérification de la connexion de l'utilisateur en vérifiant la présence du token JWT dans le stockage local
  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link to="/" className="text-white text-2xl font-bold">bouflix</Link>
      <div className="flex items-center">
        <input type="text" placeholder="Rechercher un film..." className="bg-gray-700 text-white px-3 py-1 rounded-md mr-2" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Rechercher</button>
      </div>
      <div className="flex items-center">
        {isLoggedIn ? (
          <>
            <Link to="/mylist" className="text-white mr-4">Ma Liste</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white mr-4">Connexion</Link>
            <Link to="/register" className="text-white">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}


export default Navbar;
