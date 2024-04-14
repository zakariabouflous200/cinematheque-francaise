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
      const response = await fetch('http://localhost:8080/api/users/login', {
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email :</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe :</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
