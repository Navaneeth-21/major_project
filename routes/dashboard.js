const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const { logout } = require('../controllers/authController');


const API_KEY = process.env.OPENWEATHER_API_KEY;

// Dashboard route
router.get('/', auth, (req, res) => {
  res.render('dashboard', { user: req.user, pollutionData: null, city: null, error: null });
});

// Handle city input and get pollution data
router.post('/get-data', auth, async (req, res) => {
  const city = req.body.city;

  try {
    // Get the latitude and longitude for the city
    const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    if (geoResponse.data.length === 0) {
      return res.render('dashboard', { user: req.user, pollutionData: null, city: null, error: 'City not found' });
    }
    const { lat, lon } = geoResponse.data[0];

    // Get the pollution data for the city
    const pollutionResponse = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    const pollutionData = pollutionResponse.data.list[0].components;

    // Render the dashboard with pollution data
    res.render('dashboard', { user: req.user, pollutionData, city, error: null });
  } catch (error) {
    console.error(error);
    res.render('dashboard', { user: req.user, pollutionData: null, city: null, error: 'Server error' });
  }
});

// Logout route
router.get('/logout', logout); // Assuming logout function is exported from authController


module.exports = router;
