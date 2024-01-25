export function getForecast(key, city) {
    return new Promise((res, rej) => {
        fetch(`https://corsproxy.io/?https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&aqi=yes&days=3&now=${Date.now()}`)
            .then(r => r.json())
            .then(data => {
                const current = parseCurrent(data.current);

                const forecasts = [];
                for (const day of data.forecast.forecastday) {
                    forecasts.push(parseForecast(day));
                }
                forecasts[0].date = "Today";
                forecasts[1].date = "Tomorrow";

                res({
                    lastUpdated: data.current.last_updated,
                    current,
                    forecasts,
                });
            })
            .catch(rej);
    });
}

function parseCurrent(data) {
    // const day = data.current.is_day;
    return {
        temp: [
            data.temp_c,      //°C
            data.temp_f,      //°F
        ],
        feelsLike: [
            data.feelslike_c,      //°C
            data.feelslike_f,      //°F
        ],
        condition: data.condition,   // text icon code
    };
}
function parseForecast(data) {
    // const day = data.current.is_day;
    return {
        date: data.date,
        temp: {
            max: [
                data.day.maxtemp_c,      //°C
                data.day.maxtemp_f,      //°F
            ],
            min: [
                data.day.mintemp_c,      //°C
                data.day.mintemp_f,      //°F
            ],
            avg: [
                data.day.avgtemp_c,      //°C
                data.day.avgtemp_f,      //°F
            ],
        },
        moon: {
            phase: data.astro.moon_phase,
            illumination: data.astro.moon_illumination,
        },
        condition: data.day.condition,   // text icon code
    };
}