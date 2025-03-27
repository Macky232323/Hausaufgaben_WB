function getWeather() {
    const weatherInput = document.getElementById("weatherInput").value;
    const weatherOutput = document.getElementById("weather-output");

    // Clear previous results
    weatherOutput.innerHTML = "";

    fetch(`https://wttr.in/${weatherInput}?format=j1`)
        .then(response => response.json())
        .then(data => {
            if (data.nearest_area && data.nearest_area.length > 0) {
                const nearestArea = data.nearest_area[0];
                const current = data.current_condition[0];

                const locationElement = document.createElement("h3");
                locationElement.textContent = `Wetter in ${nearestArea.areaName[0].value}, ${nearestArea.region[0].value}, ${nearestArea.country[0].value}`;

                const tempElement = document.createElement("p");
                tempElement.textContent = `Temperatur: ${current.temp_C}°C`;

                const feelsLikeElement = document.createElement("p");
                feelsLikeElement.textContent = `Gefühlte Temperatur: ${current.FeelsLikeC}°C`;

                const descElement = document.createElement("p");
                descElement.textContent = `Wetterbeschreibung: ${current.weatherDesc[0].value}`;

                const humidityElement = document.createElement("p");
                humidityElement.textContent = `Luftfeuchtigkeit: ${current.humidity}%`;

                const windElement = document.createElement("p");
                windElement.textContent = `Windgeschwindigkeit: ${current.windspeedKmph} km/h`;

                weatherOutput.appendChild(locationElement);
                weatherOutput.appendChild(tempElement);
                weatherOutput.appendChild(feelsLikeElement);
                weatherOutput.appendChild(descElement);
                weatherOutput.appendChild(humidityElement);
                weatherOutput.appendChild(windElement);
            } else {
                const noResults = document.createElement("p");
                noResults.textContent = "Keine Wetterdaten für diesen Ort gefunden.";
                weatherOutput.appendChild(noResults);
            }
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Wetterdaten:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Fehler beim Abrufen der Wetterdaten.";
            weatherOutput.appendChild(errorMessage);
        });
}

const weatherButton = document.getElementById("weatherButton");
weatherButton.addEventListener("click", getWeather);