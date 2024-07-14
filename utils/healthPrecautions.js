// Function to get health precautions
const getHealthPrecautions = (components) => {
  const { co, no2, o3, so2, pm2_5, pm10, nh3 } = components;
  let precautions = '<ul>';

  if (co > 10)
    precautions += '<li>High CO levels: Avoid outdoor activities, use air purifiers indoors.</li>';
  if (no2 > 10)
    precautions += '<li>High NO2 levels: Avoid heavy traffic areas, stay indoors.</li>';
  if (o3 > 10)
    precautions += '<li>High O3 levels: Avoid strenuous outdoor activities.</li>';
  if (so2 > 10)
    precautions += '<li>High SO2 levels: People with respiratory issues should stay indoors.</li>';
  if (pm2_5 > 10)
    precautions += '<li>High PM2.5 levels: Wear masks outdoors, use air purifiers indoors.</li>';
  if (pm10 > 10)
    precautions += '<li>High PM10 levels: Avoid outdoor activities, especially if you have asthma.</li>';
  if (nh3 > 10)
    precautions += '<li>High NH3 levels: Avoid agricultural areas, stay indoors.</li>';

  precautions += '</ul>';
  return precautions;
};

module.exports = { getHealthPrecautions };
