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
      const response = await fetch('http://localhost:8080/api/users/register', {
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-center">Inscription</h2>
        {successMsg && <div className="mb-4 text-green-500">{successMsg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="text" name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md focus:outline-none">S'inscrire</button>
        </form>
      </div>
    </div>

  );
}

export default Register;
