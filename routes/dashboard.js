const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");
const { logout } = require("../controllers/authController");
const {getHealthPrecautions} = require('../utils/healthPrecautions');

const API_KEY = process.env.OPENWEATHER_API_KEY;

// // Function to get health precautions
// const getHealthPrecautions = (components) => {
//   const { co, no2, o3, so2, pm2_5, pm10, nh3 } = components;
//   let precautions = '<ul>';

//   if (co > 10)
//     precautions += '<li>High CO levels: Avoid outdoor activities, use air purifiers indoors.</li>';
//   if (no2 > 10)
//     precautions += '<li>High NO2 levels: Avoid heavy traffic areas, stay indoors.</li>';
//   if (o3 > 10)
//     precautions += '<li>High O3 levels: Avoid strenuous outdoor activities.</li>';
//   if (so2 > 10)
//     precautions += '<li>High SO2 levels: People with respiratory issues should stay indoors.</li>';
//   if (pm2_5 > 10)
//     precautions += '<li>High PM2.5 levels: Wear masks outdoors, use air purifiers indoors.</li>';
//   if (pm10 > 10)
//     precautions += '<li>High PM10 levels: Avoid outdoor activities, especially if you have asthma.</li>';
//   if (nh3 > 10)
//     precautions += '<li>High NH3 levels: Avoid agricultural areas, stay indoors.</li>';

//   precautions += '</ul>';
//   return precautions;
// };

// Dashboard route
router.get("/", auth, (req, res) => {
  res.render("dashboard", {
    user: req.user,
    pollutionData: null,
    city: null,
    error: null,
  });
});

// Handle city input and get pollution data
router.post("/get-data", auth, async (req, res) => {
  const city = req.body.city;

  try {
    // Get the latitude and longitude for the city
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    if (geoResponse.data.length === 0) {
      return res.render("dashboard", {
        user: req.user,
        pollutionData: null,
        city: null,
        error: "City not found",
      });
    }
    const { lat, lon } = geoResponse.data[0];

    // Get the pollution data for the city
    const pollutionResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    const pollutionData = pollutionResponse.data.list[0].components;

    // Calculate health precautions
    const precautions = getHealthPrecautions(pollutionData);

    // Render the dashboard with pollution data
    res.render("dashboard", {
      user: req.user,
      pollutionData: { ...pollutionData, precautions },
      city,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render("dashboard", {
      user: req.user,
      pollutionData: null,
      city: null,
      error: "Server error",
    });
  }
});

// Logout route
router.get("/logout", logout); // Assuming logout function is exported from authController

module.exports = router;
