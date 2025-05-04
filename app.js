
// main Variable
let cityInput = document.querySelector(".city-input");
let searchBtn = document.querySelector(".search-btn");
let weatherInfo = document.querySelector(".weather-info");
let notFoundSection = document.querySelector(".not-found");
let searchCitySection = document.querySelector(".search-city");

let countryTxt = document.querySelector(".country-txt");
let currentDateTxt = document.querySelector(".current-date-txt");
let tempTxt = document.querySelector(".temp-txt");
let conditionTxt = document.querySelector(".condition-txt");
let humidityValueTxt = document.querySelector(".humidity-value-txt");
let windValueTxt = document.querySelector(".wind-value-txt");
let weatherSummaryImg = document.querySelector(".weather-summary-img");

let forecastItemContainer = document.querySelector(".forecast-item-container");


// Fetch API in Weathere App
let apiKey = "c17416b25aa2db6162497b39beee9888";


searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != "") {

        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    };
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    };
});

async function getfetch(endPoint, city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    let response = await fetch(apiUrl);
    return response.json();
};

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm';
    if (id <= 321) return 'drizzle';
    if (id <= 531) return 'rain';
    if (id <= 622) return 'snow';
    if (id <= 781) return 'atmosphere';
    if (id <= 800) return 'clear';
    else return 'clouds';
};

function getCurrentData() {
    const currentData = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentData.toLocaleDateString('en-GB', options);
};

async function updateWeatherInfo(city) {

    const weatherData = await getfetch('weather', city);
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return
    }
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData;
    // console.log(weatherData);

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' ℃';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + "%";
    windValueTxt.textContent = speed + "M/s";

    currentDateTxt.textContent = getCurrentData();

    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}.svg`;

    await updateForecastInfo(city);

    showDisplaySection(weatherInfo);
};

async function updateForecastInfo(city) {
    const forecastsData = await getfetch('forecast', city);
    // console.log(forecastsData);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItemContainer.innerHTML = "";
    forecastsData.list.forEach((forecastWeather) => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItem(forecastWeather);
        };
    });
    // console.log(forecastsData);
};

function updateForecastItem(weatherDate) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp },
    } = weatherDate;
    // console.log(weatherDate);

    const dateTaken = new Date(date);
    const options = {
        day: '2-digit',
        month: 'short'
    };
    const dateResult = dateTaken.toLocaleDateString('en-US', options);

    // const forecastItem2 = `
        // <div class="forecast-item">
            // <h5 class="forecast-item-date">${dateResult}</h5>
            // <img src="assets/weather/${getWeatherIcon(id)}.svg" alt="Photo Weather" class="forecast-item-img">
            // <h5 class="forwcast-item-temp">${Math.round(temp)} ℃</h5>
        // </div>
    // `;
    // forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem);
    
    let forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";

    let forecastItemDate = document.createElement("h5");
    forecastItemDate.className = "forecast-item-date";
    let forecastItemDateTxt = document.createTextNode(`${dateResult}`);
    forecastItemDate.appendChild(forecastItemDateTxt);

    let forecastItemImg = document.createElement("img");
    forecastItemImg.className = "forecast-item-img" ;
    // forecastItemImg.setAttribute('src',`assets/weather/${getWeatherIcon(id)}.svg`);
    forecastItemImg.src = `assets/weather/${getWeatherIcon(id)}.svg`;
    forecastItemImg.alt = "Photo Weather" ;

    let forwcastIemTemp = document.createElement("h5");
    forwcastIemTemp.className = "forwcast-item-temp";
    let forwcastIemTempTxt = document.createTextNode(`${Math.round(temp)} ℃`);
    forwcastIemTemp.appendChild(forwcastIemTempTxt);

    forecastItem.appendChild(forecastItemDate);
    forecastItem.appendChild(forecastItemImg);
    forecastItem.appendChild(forwcastIemTemp);

    forecastItemContainer.appendChild(forecastItem);

};

function showDisplaySection(section) {
    [notFoundSection, searchCitySection, weatherInfo].forEach((section) => {
        section.style.display = "none";
    });
    section.style.display = 'block';
}
