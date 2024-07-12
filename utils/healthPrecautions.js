// utils/healthPrecautions.js

const getHealthPrecautions = (components) => {
  const { co, no2, o3, pm2_5, so2 } = components;

  // Define thresholds for each pollutant component
  const thresholds = {
    co: 200, // Carbon monoxide
    no2: 100, // Nitrogen dioxide
    o3: 50, // Ozone
    pm2_5: 25, // Particulate matter < 2.5 µm
    so2: 20, // Sulfur dioxide
  };

  // Generate precautions based on component values
  let precautions = "";

  if (co > thresholds.co) {
    precautions += "Avoid outdoor activities and use air purifiers. ";
  } else {
    precautions += "Normal outdoor activities can be carried out. ";
  }

  if (no2 > thresholds.no2) {
    precautions += "Wear a mask and avoid strenuous outdoor activities. ";
  } else {
    precautions += "Consider using a mask in crowded or polluted areas. ";
  }

  if (o3 > thresholds.o3) {
    precautions += "Limit outdoor activities, especially in the afternoon. ";
  } else {
    precautions += "Enjoy outdoor activities during suitable times. ";
  }

  if (pm2_5 > thresholds.pm2_5) {
    precautions += "Use air purifiers indoors and keep windows closed. ";
  } else {
    precautions +=
      "Ventilate your home regularly to improve indoor air quality. ";
  }

  if (so2 > thresholds.so2) {
    precautions += "Avoid areas with heavy traffic and industrial zones. ";
  } else {
    precautions +=
      "Monitor outdoor air quality and adjust activities accordingly. ";
  }

  return precautions.trim(); // Trim to remove extra whitespace
};

module.exports = { getHealthPrecautions };
