import React, { useState, useEffect } from 'react';

const CinemaList = ({ canUseLocation }) => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://cinematheque-francaise.onrender.com/api/cinemas/ile-de-france') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load cinemas');
                }
                return response.json();
            })
            .then(data => {
                setCinemas(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch cinemas:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [canUseLocation]);  // Re-fetch when location permissions change

    if (loading) return <p>Loading cinemas...</p>;
    if (error) return <p>Error loading cinemas: {error}</p>;
    if (!cinemas.length) return <p>No cinemas found.</p>;

    return (
        <ul>
            {cinemas.map(cinema => (
                <li key={cinema.recordid}>{cinema.fields.nom_etablissement} - {cinema.fields.adresse}</li>
            ))}
        </ul>
    );
};

export default CinemaList;
