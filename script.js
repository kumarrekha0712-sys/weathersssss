
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityButtons = document.querySelectorAll(".city-btn");

const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherCard");
const error = document.getElementById("error");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const condition = document.getElementById("condition");

async function fetchWeather(city){

  loading.classList.remove("hidden");
  weatherCard.classList.add("hidden");
  error.classList.add("hidden");

  try{

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    const geoResponse = await fetch(geoUrl);

    if(!geoResponse.ok){
      throw new Error("Failed to fetch city data");
    }

    const geoData = await geoResponse.json();

    if(!geoData.results || geoData.results.length === 0){
      throw new Error("City not found");
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const cityReal = geoData.results[0].name;

    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

    const weatherResponse = await fetch(weatherUrl);

    if(!weatherResponse.ok){
      throw new Error("Weather data unavailable");
    }

    const weatherData = await weatherResponse.json();

    cityName.textContent = `📍 ${cityReal}`;
    temperature.textContent =
      `🌡 Temperature: ${weatherData.current.temperature_2m} °C`;

    humidity.textContent =
      `💧 Humidity: ${weatherData.current.relative_humidity_2m}%`;

    wind.textContent =
      `🌬 Wind Speed: ${weatherData.current.wind_speed_10m} km/h`;

    let temp = weatherData.current.temperature_2m;

    if(temp > 35){
      condition.textContent = "🔥 Hot Weather";
    }
    else if(temp < 20){
      condition.textContent = "❄ Cold Weather";
    }
    else{
      condition.textContent = "🌤 Moderate Weather";
    }

    weatherCard.classList.remove("hidden");

  }
  catch(err){
    error.textContent = err.message;
    error.classList.remove("hidden");
  }
  finally{
    loading.classList.add("hidden");
  }
}

searchBtn.addEventListener("click", ()=>{
  const city = cityInput.value.trim();

  if(city === ""){
    error.textContent = "Please enter a city name";
    error.classList.remove("hidden");
    return;
  }

  fetchWeather(city);
});

cityInput.addEventListener("keypress", (e)=>{
  if(e.key === "Enter"){
    searchBtn.click();
  }
});

cityButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    fetchWeather(btn.textContent);
  });
});
