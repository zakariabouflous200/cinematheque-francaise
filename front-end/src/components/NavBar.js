import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");  
  const [searchResults, setSearchResults] = useState([]);  
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage burger menu

  const handleSearch = async () => {
    if (searchTerm.trim() === "") return;

    try {
      const response = await fetch(`https://cinematheque-francaise.onrender.com/api/movies/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data);  
      setShowResults(true);  
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === "") {
      setShowResults(false);
    }
  };

  const handleMovieClick = (movieTitle) => {
    navigate(`/movieByTitle/${encodeURIComponent(movieTitle)}`);  
    setShowResults(false);
    setSearchTerm("");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 flex justify-between items-center text-white shadow-md relative">
      {/* Logo */}
      <Link 
        to="/" 
        className="font-bold text-xl md:text-2xl transition-colors duration-200 hover:text-yellow-500"
      >
        bouflous-cinema
      </Link>

      {/* Burger Icon */}
      <button 
        className="md:hidden focus:outline-none" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search Bar */}
      <div className="hidden md:flex items-center relative w-full md:w-auto">
        <input 
          type="text" 
          placeholder="Rechercher un film..." 
          value={searchTerm} 
          onChange={handleInputChange} 
          className="w-full md:w-auto bg-gray-900 text-white px-3 py-1 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
        />
        <button 
          onClick={handleSearch}  
          className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Rechercher
        </button>

        {/* Display Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 text-white mt-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            {searchResults.map((movie) => (
              <div 
                key={movie.titre} 
                className="p-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleMovieClick(movie.titre)}
              >
                {movie.titre}
              </div>
            ))}
          </div>
        )}

        {showResults && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 text-white mt-2 rounded-lg shadow-lg p-2">
            Aucun film trouvé.
          </div>
        )}
      </div>

      {/* Menu Links */}
      <div className={`md:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 w-full md:w-auto bg-gray-700 md:bg-transparent p-4 md:p-0 z-20`}>
        {isLoggedIn ? (
          <>
            <Link 
              to="/mylist" 
              className="block md:inline transition-colors duration-200 hover:text-yellow-500 py-2 md:py-0"
            >
              Ma Liste
            </Link>
            <Link 
              to="/cinemas" 
              className="block md:inline transition-colors duration-200 hover:text-yellow-500 py-2 md:py-0"
            >
              Cinemas
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors duration-200"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="block md:inline transition-colors duration-200 hover:text-yellow-500 py-2 md:py-0"
            >
              Connexion
            </Link>
            <Link 
              to="/register" 
              className="block md:inline transition-colors duration-200 hover:text-yellow-500 py-2 md:py-0"
            >
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
