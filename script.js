async function fetchWeather() {
 let searchInput = document.getElementById('search').value; //gets the value from whats typed in the search box
 const weatherDataSection = document.getElementById('weather-data');
 weatherDataSection.style.display = 'block';
 const apiKey = '6af3ef63e72d20359abdc965e6f15519';

 const city = searchInput.trim();
 if (city === "") {
   weatherDataSection.innerHTML = `
   <div>
       <h2>Empty Input</h2>
       <p>Please enter a city name</p>
   </div>
   `;
   return;
 }

 function renderError(title, message) {
   weatherDataSection.innerHTML = `
   <div>
       <h2>${title}</h2>
       <p>${message}</p>
   </div>
   `;
 }

 async function getLonAndLat(query) {
   const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`;
   const response = await fetch(geocodeURL);
   if (!response.ok) {
     console.log("Bad response! ", response.status);
     renderError('Error', 'Could not search that city.');
     return null;
   }
   const data = await response.json();
   if (!Array.isArray(data) || data.length === 0) {
     renderError(`Invalid Input: "${query}"`, 'Please try again with a valid <u>city name</u>.');
     return null;
   }
   return data[0];
 }

 async function getWeatherData(lon, lat) {
   const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
   const response = await fetch(weatherURL);
   if (!response.ok) {
     console.log("Bad response! ", response.status);
     renderError('Error', 'Unable to load weather data.');
     return null;
   }
   const data = await response.json();
   weatherDataSection.style.display = "flex";
   weatherDataSection.innerHTML = `
       <img src="https://openweathermap.org/img/wn/${data.weather?.[0]?.icon}.png" alt="${data.weather?.[0]?.description || ''}" width="100" />
       <div>
           <h2>${data.name}</h2>
           <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
           <p><strong>Description:</strong> ${data.weather?.[0]?.description || ''}</p>
       </div>
   `;
   return data;
 }

 const geocodeData = await getLonAndLat(city);
 if (!geocodeData) {
   return;
 }

 await getWeatherData(geocodeData.lon, geocodeData.lat);
 document.getElementById("search").value = "";
}