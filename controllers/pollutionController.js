const axios = require("axios");
const { getHealthPrecautions } = require('../utils/healthPrecautions');


const getCoordinates = async (city) => {
  const response = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
  );
  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { lat, lon };
  } else {
    throw new Error("City not found");
  }
};

exports.getPollutionData = async (req, res) => {
  const { city } = req.body;
  try {
    const { lat, lon } = await getCoordinates(city);
    const end = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
    const start = end - 3600 * 24; // 24 hours ago in Unix timestamp
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const data = response.data;
    const pollutionDetails = {
      co: data.list[0].components.co,
      no2: data.list[0].components.no2,
      o3: data.list[0].components.o3,
      pm25: data.list[0].components.pm2_5,
      so2: data.list[0].components.so2,
      precautions: getHealthPrecautions(data.list[0].components),
    };

    res.render("dashboard", {
      user: req.user,
      pollutionData: pollutionDetails,
      city: city,
      error: null,
    });
  } catch (err) {
    console.error(err.message);
    res.render("dashboard", {
      user: req.user,
      pollutionData: null,
      city: null,
      error: err.message === "City not found" ? err.message : "Server error",
    });
  }
};
