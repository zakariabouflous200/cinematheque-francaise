import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [successMsg, setSuccessMsg] = useState(''); 

    // Fonction pour mettre à jour les données du formulaire à chaque changement
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

    // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
            // Requête POST pour s'inscrire avec les données du formulaire
      const response = await fetch('cinematheque-francaise-production.up.railway.app/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) { 
        console.log('Inscription réussie');
        setSuccessMsg('Inscription réussie. Vous allez être redirigé vers la page de connexion...');
                // Redirection vers la page de connexion après 3 secondes
        setTimeout(() => navigate('/login'), 3000); 
      } else {
        
        const data = await response.json(); 
        console.log('Échec de inscription:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Inscription</h2>
        {successMsg && <div className="mb-4 text-green-500 text-center">{successMsg}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-gold-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-md transition-colors duration-200"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default Register;
