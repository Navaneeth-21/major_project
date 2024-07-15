const axios = require('axios');
const {getHealthPrecautions} = require('../utils/healthPrecautions');

const getCoordinates = async (city) => {
  const response = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
  );
  if (response.data && response.data.length > 0) {
    const { lat, lon } = response.data[0];
    return { lat, lon };
  } else {
    throw new Error('City not found');
  }
};


exports.getPollutionData = async (req, res) => {
  const { city } = req.body;
  try {
    const { lat, lon } = await getCoordinates(city);
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const data = response.data;
    const pollutionDetails = {
      co: data.list[0].components.co,
      no2: data.list[0].components.no2,
      o3: data.list[0].components.o3,
      pm2_5: data.list[0].components.pm2_5,
      so2: data.list[0].components.so2,
      pm10: data.list[0].components.pm10,
      nh3: data.list[0].components.nh3,
      precautions: getHealthPrecautions(data.list[0].components),
      lat,
      lon
    };

    res.render('dashboard', {
      user: req.user,
      pollutionData: pollutionDetails,
      city: city,
      lat : lat,
      lon : lon,
      error: null,
    });
  } catch (err) {
    console.error(err.message);
    res.render('dashboard', {
      user: req.user,
      pollutionData: null,
      city: null,
      lat : null,
      lon : null,
      error: err.message === 'City not found' ? err.message : 'Server error',
    });
  }
};
