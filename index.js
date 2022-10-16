function currentTime(date) {
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	let day = days[date.getDay()];
	let hour = date.getHours();
	if (hour < 10) {
		hour = `0${hour}`;
	}
	let minute = date.getMinutes();
	if (minute < 10) {
		minute = `0${minute}`;
	}
	return `${day} ${hour}:${minute}`;
}
function handleSubmit(event) {
	event.preventDefault();
	cityInputElement = document.querySelector("#searched-city").value;
	retrieveWeather(cityInputElement);
	form = document.querySelector(".search-form");
	form.reset();
}

function retrieveWeather(city) {
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
	axios.get(url).then(showTemp);
}

function showTemp(position) {
	console.log(position);
	cityInputElement = position.data.name;
	let cityTitle = document.querySelector("#city-title");
	cityTitle.innerHTML = `${cityInputElement}`;

	hicelsiusTemp = position.data.main.temp_max;
	locelsiusTemp = position.data.main.temp_min;
	let loTemp = Math.round(locelsiusTemp);
	let hiTemp = Math.round(hicelsiusTemp);
	let todayTemps = document.querySelector("#today-temps");
	todayTemps.innerHTML = `${loTemp}/${hiTemp}`;

	let descriptor = document.querySelector("#descriptor");
	let appDescription = position.data.weather[0].description;
	descriptor.innerHTML = `${appDescription}`;

	let wind = document.querySelector("#wind");
	let windSpeed = Math.round(position.data.wind.speed);

	if (units == "metric") {
		wind.innerHTML = `${windSpeed * 3.6}km/h`;
	} else if (units == "imperial") {
		wind.innerHTML = `${windSpeed}mph`;
	}

	let humidity = document.querySelector("#humidity");
	let humidityValue = position.data.main.humidity;
	humidity.innerHTML = `${humidityValue}`;

	let icon = document.querySelector("#current-icon");
	let iconValue = position.data.weather[0].icon;
	icon.setAttribute(
		"src",
		`http://openweathermap.org/img/wn/${iconValue}@2x.png`
	);
	let dateDisplay = document.querySelector(".time");
	let date = new Date(position.data.dt * 1000);
	dateDisplay.innerHTML = currentTime(date);

	retrieveCoordinates(position.data.coord);
}

function retrievePosition(event) {
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(feedbackPostion);
}
function feedbackPostion(location) {
	let apiKey = "504de5c3d6be01debd4067f4eb861fb3";
	let units = "metric";
	let lat = location.coords.latitude;
	let lon = location.coords.longitude;
	let positionUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

	axios.get(positionUrl).then(showTemp);
}

function updateFarenheit(event) {
	event.preventDefault();
	celsiusLink.classList.remove("inactive");
	farenheitLink.classList.add("inactive");
	units = "imperial";
	retrieveWeather(cityInputElement);
}

function updateCelsius(event) {
	event.preventDefault();
	celsiusLink.classList.add("inactive");
	farenheitLink.classList.remove("inactive");
	units = "metric";
	retrieveWeather(cityInputElement);
}

function retrieveCoordinates(event) {
	let lat = event.lat;
	let lon = event.lon;

	let positionUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=hourly,minutely&appid=${apiKey}`;

	axios.get(positionUrl).then(displayForecast);
}

function formatDay(timestamp) {
	let day = new Date(timestamp * 1000);
	let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	return days[day.getDay()];
}

function displayForecast(event) {
	let forecast = event.data.daily;
	let forecastElement = document.querySelector(".forecast");
	let forecastHTML = `<div class="row">`;

	forecast.forEach(function (dayForecast, index) {
		if (index < 5) {
			forecastHTML =
				forecastHTML +
				`
	<div class="col">
		<h1>${formatDay(dayForecast.dt)}</h1>
		<p>
			<span>${Math.round(
				dayForecast.temp.min
			)}</span>/<span class="higher">${Math.round(dayForecast.temp.max)}°</span>
			<br />
			<span class="symbol"><img src="http://openweathermap.org/img/wn/${
				dayForecast.weather[0].icon
			}@2x.png" alt="weather icon"/>
			</span>
		</p>
	</div>
`;
		}
	});
	forecastHTML = forecastHTML + `</div>`;
	forecastElement.innerHTML = forecastHTML;
}

let searchCityForm = document.querySelector("#search-city-button");
searchCityForm.addEventListener("click", handleSubmit);

let currentLocationButton = document.querySelector(".current-location-button");
currentLocationButton.addEventListener("click", retrievePosition);

let apiKey = "a43564c91a6c605aeb564c9ed02e3858";
let units = "metric";
let cityInputElement = "Kyoto";
let farenheitLink = document.querySelector(".farenheit-link");
farenheitLink.addEventListener("click", updateFarenheit);
let celsiusLink = document.querySelector(".celsius-link");
celsiusLink.addEventListener("click", updateCelsius);

let loCelsiusTemp = null;
let hiCelsiusTemp = null;

retrieveWeather("Kyoto");
