const apiKey = "aeb5b65ba6ebf71fafe6299a0e5ae797"; // Replace with your OpenWeatherMap API Key

async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},NG&units=metric&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  const groupedData = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(item);
  });

  const forecastContainer = document.querySelector(".forecast-container");
  forecastContainer.innerHTML = ""; // Clear old data

  let dayCount = 0;
  for (const date in groupedData) {
    if (dayCount >= 5) break; // Limit to 5 days

    const dailyData = groupedData[date];
    const avgTemp = dailyData.reduce((acc, item) => acc + item.main.temp, 0) / dailyData.length;
    const tempHigh = Math.max(...dailyData.map(item => item.main.temp_max));
    const tempLow = Math.min(...dailyData.map(item => item.main.temp_min));
    const rainfall = dailyData.reduce((acc, item) => acc + (item.rain ? item.rain["3h"] : 0), 0);
    const rainProb = dailyData.some(item => item.rain) ? "Likely" : "Unlikely";

    const weekday = new Date(date).toLocaleString('en-US', { weekday: 'long' });
    const iconMapping = {
      "01": "fa-sun", // clear sky
      "02": "fa-cloud-sun", // few clouds
      "03": "fa-cloud", // scattered clouds
      "04": "fa-cloud-meatball", // broken clouds
      "09": "fa-cloud-rain", // shower rain
      "10": "fa-cloud-showers-heavy", // rain
      "11": "fa-bolt", // thunderstorm
      "13": "fa-snowflake", // snow
      "50": "fa-smog" // mist
    };

    const weatherIconCode = dailyData[0].weather[0].icon.slice(0, 2);
    const dailyForecast = document.createElement("div");
    dailyForecast.className = "daily-forecast";
    dailyForecast.innerHTML = `
      <h3>${weekday}, ${date}</h3>
      <i class="fas ${iconMapping[weatherIconCode] || 'fa-cloud'}"></i>
      <p>High: ${tempHigh.toFixed(2)}°C</p>
      <p>Low: ${tempLow.toFixed(2)}°C</p>
      <p>Rainfall: ${rainfall.toFixed(2)} mm</p>
      <p>Rain Prob: ${rainProb}</p>
    `;

    forecastContainer.appendChild(dailyForecast);
    dayCount++;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const citySelect = document.querySelector("#city-select");
  citySelect.addEventListener("change", function () {
    getWeatherData(this.value);
  });
});

// Initial load for Abuja
window.onload = () => getWeatherData("Abuja");
