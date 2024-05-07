// cinemaController.js

const fetch = require('node-fetch');

exports.getCinemasInIleDeFrance = async (req, res) => {
    const url = 'https://data.culture.gouv.fr/api/records/1.0/search/?dataset=etablissements-cinematographiques&q=&rows=100';
    
    try {
        const apiResponse = await fetch(url);
        if (!apiResponse.ok) {
            throw new Error(`API responded with status ${apiResponse.status}`);
        }
        const data = await apiResponse.json();

        if (!data.records || data.records.length === 0) {
            console.log("No records found in API response:", data);
            res.status(404).json({ message: "No cinema data available" });
        } else {
            res.status(200).json(data.records);
        }
    } catch (error) {
        console.error('Failed to fetch data from OpenDataSoft:', error);
        res.status(500).json({ message: "Failed to fetch cinema data", error: error.message });
    }
};

// Function to get detailed cinema info (example placeholder)
exports.getCinemaDetails = async (req, res) => {
    const { cinemaId } = req.params;
    try {
        const url = `https://somecinemadetailsapi.com/api/cinemas/${cinemaId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch cinema details');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching cinema details:', error);
        res.status(500).json({ message: "Failed to fetch cinema details." });
    }
};

// cinemaController.js

exports.getMoviesShowingInCinema = async (req, res) => {
    // Mock data for cinema showtimes
    const mockShowtimes = {
        'cinema1': ['Inception', 'Interstellar'],
        'cinema2': ['The Matrix', 'Avatar']
    };

    const cinemaId = req.params.cinemaId;
    try {
        const showtimes = mockShowtimes[cinemaId] || [];
        const movies = await Movie.find({ titre: { $in: showtimes } });
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies for cinema:', error);
        res.status(500).json({ message: "Failed to fetch movies for cinema", error: error.message });
    }
};
