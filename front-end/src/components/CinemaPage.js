import React, { useState, useEffect } from 'react';
import CinemaMap from './CinemaMap';

const CinemaPage = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://cinematheque-francaise.onrender.com/api/cinemas/ile-de-france') // Make sure this URL is correct
            .then(response => response.json())
            .then(data => {
                setCinemas(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch cinemas:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h1>Explore Cinemas</h1>
            {loading && <p>Loading cinemas...</p>}
            {error && <p>Error loading cinemas: {error}</p>}
            
            <CinemaMap cinemas={cinemas} />
        </div>
    );
};

export default CinemaPage;
