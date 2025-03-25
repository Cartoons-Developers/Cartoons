// get_info.js

const express = require('express');
const router = express.Router();
const Movie = require('./main'); // Adjust the path as needed

// GET /api/movie/get_info
router.get('/get_info', async (req, res) => {
    const movieId = req.query.id;
    if (!movieId) {
        return res.status(400).send('Movie ID is required');
    }

    try {
        const movieData = await Movie.meta(movieId);
        res.json(movieData);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).send('Failed to fetch movie data');
    }
});

module.exports = router;