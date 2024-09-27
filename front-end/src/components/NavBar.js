// NavBar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");  
  const [searchResults, setSearchResults] = useState([]);  
  const [showResults, setShowResults] = useState(false);

  // Function to handle search
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
    navigate(`/movieByTitle/${encodeURIComponent(movieTitle)}`);  // Navigate using the title
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
      <Link to="/" className="font-bold text-xl md:text-2xl transition-colors duration-200 hover:text-gold-500">bouflous-cinema</Link>
      
      <div className="flex items-center relative">
        <input 
          type="text" 
          placeholder="Rechercher un film..." 
          value={searchTerm} 
          onChange={handleInputChange} 
          className="bg-gray-900 text-white px-3 py-1 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent" 
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
                onClick={() => handleMovieClick(movie.titre)}  // Use title instead of ID
              >
                {movie.titre}
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showResults && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 text-white mt-2 rounded-lg shadow-lg p-2">
            Aucun film trouvé.
          </div>
        )}
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
