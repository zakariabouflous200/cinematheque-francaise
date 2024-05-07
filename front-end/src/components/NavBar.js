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
    <nav className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 flex justify-between items-center text-white shadow-md">
      <Link to="/" className="font-bold text-xl md:text-2xl transition-colors duration-200 hover:text-gold-500">bouflix</Link>
      
      <div className="flex items-center">
        <input type="text" placeholder="Rechercher un film..." className="bg-gray-900 text-white px-3 py-1 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent" />
        <button className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md transition-colors duration-200">Rechercher</button>
      </div>
      <div className="flex items-center">
        {isLoggedIn ? (
          <>
            <Link to="/mylist" className="mr-4 transition-colors duration-200 hover:text-gold-500">Ma Liste</Link>
            <Link to="/cinemas" className="mr-4 transition-colors duration-200 hover:text-gold-500">Cinemas</Link>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors duration-200">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 transition-colors duration-200 hover:text-gold-500">Connexion</Link>
            <Link to="/register" className="transition-colors duration-200 hover:text-gold-500">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
}


export default Navbar;
