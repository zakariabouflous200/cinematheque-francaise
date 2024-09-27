import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import L from 'leaflet';
import 'leaflet.awesome-markers';

// Configure Leaflet.awesome-markers
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa'; // Using FontAwesome icons

const CinemaMap = ({ cinemas }) => {
    const [allMovies, setAllMovies] = useState([]);
    const [moviesByCinema, setMoviesByCinema] = useState({});
    const [festivalMovies, setFestivalMovies] = useState([]);
    const [loadingFestivals, setLoadingFestivals] = useState(false);
    const [errorFestivals, setErrorFestivals] = useState('');

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const response = await axios.get('https://cinematheque-francaise.onrender.com/api/movies/getAllMovies');
                console.log('All movies data:', response.data);
                setAllMovies(response.data);
            } catch (error) {
                console.error('Error fetching all movies:', error);
            }
        };

        const fetchFestivalMovies = async () => {
            setLoadingFestivals(true);
            try {
                const response = await axios.get('https://cinematheque-francaise.onrender.com/api/movies/movies-at-festivals');
                console.log('Festival movies data:', response.data);
                setFestivalMovies(response.data);
                setLoadingFestivals(false);
            } catch (error) {
                console.error('Error fetching festival movies:', error);
                setErrorFestivals('Failed to load movies from festivals');
                setLoadingFestivals(false);
            }
        };

        fetchAllMovies();
        fetchFestivalMovies();
    }, []);

    if (!cinemas || cinemas.length === 0) {
        return <p>No cinema data available.</p>;
    }

    const center = [
        cinemas[0].geometry.coordinates[1], // Latitude
        cinemas[0].geometry.coordinates[0]  // Longitude
    ];

    const cinemaIcon = L.AwesomeMarkers.icon({
        icon: 'film',
        markerColor: 'red',
        prefix: 'fa',
        spin: false
    });

    return (
        <div>
            <MapContainer center={center} zoom={12} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {cinemas.map((cinema, index) => (
                    <Marker key={index} position={[
                        cinema.geometry.coordinates[1],
                        cinema.geometry.coordinates[0]
                    ]} icon={cinemaIcon}>
                        <Popup>
                            <strong>{cinema.fields.nom}</strong><br />
                            {cinema.fields.adresse}<br />
                            {cinema.fields.commune && `City: ${cinema.fields.commune}`}
                            <strong>Movies Showing:</strong>
                            <ul>
                                {moviesByCinema[cinema.fields.nom]?.map(movie => (
                                    <li key={movie._id}>{movie.titre}</li>
                                ))}
                            </ul>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div style={{ marginTop: '20px' }}>
                <h2>Festival Movies</h2>
                {loadingFestivals ? <p>Loading festival movies...</p> : (
                    errorFestivals ? <p>{errorFestivals}</p> : (
                        festivalMovies.length > 0 ? (
                            <ul>
                                {festivalMovies.map(movie => (
                                    <li key={movie._id}>{movie.titre}</li>
                                ))}
                            </ul>
                        ) : <p>No festival movies found.</p>
                    )
                )}
            </div>
        </div>
    );
};

export default CinemaMap;
