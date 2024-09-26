import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // Fonction pour mettre à jour le state local avec les valeurs des champs du formulaire lors de leur modification
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const Navigate = useNavigate();
  // Fonction pour gérer la soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('cinematheque-francaise-production.up.railway.app/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.token) {
        // Stockage du token JWT dans le stockage local
        localStorage.setItem('token', data.token);
        console.log('Connexion réussie:', data);
        // Redirection vers la page d'accueil après la connexion réussie
        Navigate('/');
      } else {
        console.log('Échec de la connexion:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Connexion</h2>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-800">Email :</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded shadow focus:outline-none focus:border-gold-500" />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-800">Mot de passe :</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded shadow focus:outline-none focus:border-gold-500" />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-black rounded hover:bg-gray-900 focus:outline-none focus:shadow-outline">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
