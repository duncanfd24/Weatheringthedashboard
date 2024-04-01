const apiKey = '26c75a706b8456d7356e8d0192ee9a86';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?q={cityname}&appid={APIkey}&units=imperial';
const forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q={cityname}&appid={APIkey}&units=imperial'
let searchHistory = [];

function searchWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (city === '') return;

  const url = baseURL.replace('{cityname}', city).replace('{APIkey}', apiKey);
  const forecastdata = forecastURL.replace('{cityname}', city).replace('{APIkey}', apiKey);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayWeather(data);
      addToHistory(city);
    })
    .catch(error => console.error('Error fetching weather:', error));

    fetch(forecastdata)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      forecastCall(data)
    })
    .catch(error => console.error('Error fetching weather:', error));  
}

document.getElementById('cityInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    searchWeather();
  }
});

function displayWeather(data) {
  const cityName = data.name;
  const icon = data.weather[0].icon;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

//Controls date functionality for the city selected.
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  const currentWeatherDisplay = document.getElementById('currentWeather');
  currentWeatherDisplay.innerHTML = `
    <div class="weather-card">
      <h2>${cityName} (${formattedDate})</h2>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
      <p>Temperature: ${temperature} F</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    </div>
  `;
}

function forecastCall(data){

  const fiveDayForecastDisplay = document.getElementById('fiveDayForecast');
  fiveDayForecastDisplay.innerHTML = '<h2>5-Day Forecast</h2>';
  
  for(let i = 5; i < data.list.length; i += 8){

    //console.log(data.list[i])
    // grab data points from each list index that we iterate over in loop
    const forecastDate = new Date(data.list[i].dt * 1000).toLocaleDateString();
    const forecastIcon = data.list[i].weather[0].icon;
    const forecastTemp = data.list[i].main.temp;
    const forecastHumidity = data.list[i].main.humidity;
    const forecastWindSpeed = data.list[i].wind.speed;

    const forecastItem = document.createElement('div');
    forecastItem.classList.add('weather-card');
    forecastItem.innerHTML = `
      <h3>${forecastDate}</h3>
      <img src="https://openweathermap.org/img/wn/${forecastIcon}.png" alt="Weather Icon">
      <p>Temperature: ${forecastTemp} F</p>
      <p>Humidity: ${forecastHumidity}%</p>
      <p>Wind Speed: ${forecastWindSpeed} m/s</p>
    `;
    fiveDayForecastDisplay.appendChild(forecastItem);
  }

}

function addToHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    updateHistoryDisplay();
  }
}

function updateHistoryDisplay() {
  const historyDisplay = document.getElementById('searchHistory');
  historyDisplay.innerHTML = '<h2>Search History</h2>';

  searchHistory.forEach(city => {
    const historyItem = document.createElement('div');
    historyItem.textContent = city;
    historyItem.classList.add('search-history-item');
    historyItem.onclick = () => searchWeather(city);
    historyDisplay.appendChild(historyItem);
  });
}