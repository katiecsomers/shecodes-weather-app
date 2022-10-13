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
	let city = document.querySelector("#searched-city").value;
	retrieveWeather(city);
}

function retrieveWeather(city) {
	let apiKey = "504de5c3d6be01debd4067f4eb861fb3";
	let units = "metric";
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
	axios.get(url).then(showTemp);
}

function showTemp(position) {
	console.log(position);
	let city = position.data.name;
	let cityTitle = document.querySelector("#city-title");
	cityTitle.innerHTML = `${city}`;

	let hiTemp = Math.round(position.data.main.temp_max);
	let loTemp = Math.round(position.data.main.temp_min);
	let todayTemps = document.querySelector("#today-temps");
	todayTemps.innerHTML = `${loTemp}°|${hiTemp}°`;

	let descriptor = document.querySelector("#descriptor");
	let appDescription = position.data.weather[0].description;
	descriptor.innerHTML = `${appDescription}`;

	let wind = document.querySelector("#wind");
	let windSpeed = Math.round(position.data.wind.speed);
	wind.innerHTML = `${windSpeed}`;

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

let searchCityForm = document.querySelector("#search-city-button");
searchCityForm.addEventListener("click", handleSubmit);

let currentLocationButton = document.querySelector(".current-location-button");
currentLocationButton.addEventListener("click", retrievePosition);

retrieveWeather("Tokyo");
