import { DateTime } from "luxon";

function Forecast({ data, units }) {
  const getStartOfLocalDay = (timestamp, timezone) => {
    return DateTime.fromSeconds(timestamp)
      .setZone("UTC")
      .plus({ seconds: timezone })
      .startOf("day");
  };

  const currentDay = DateTime.local().startOf("day");
  const upcomingForecasts = data.list.filter(item => {
    const forecastDay = getStartOfLocalDay(item.dt, data.city.timezone);
    return forecastDay >= currentDay;
  });

  const formatForecastTime = (timestamp, timezoneOffset) => {
    const forecastTime = DateTime.fromSeconds(timestamp)
      .setZone("UTC")
      .plus({ seconds: timezoneOffset });

    const isToday = forecastTime.hasSame(DateTime.now(), "day");
    return {
      time: forecastTime.toFormat("h:mm a"),
      date: isToday ? "Today" : forecastTime.toFormat("EEE, dd MMM")
    };
  };

  const temperatureSymbol = units === "metric" ? "°C" : "°F";
  const displayForecasts = upcomingForecasts.slice(0, 6);

  return (
    <section className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-xl p-6 shadow-lg">
      <header className="mb-6">
        <h2 className="text-white font-semibold text-2xl">Daily Forecast</h2>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayForecasts.map((forecast, index) => {
          const { time, date } = formatForecastTime(forecast.dt, data.city.timezone);

          return (
            <article 
              key={`forecast-${index}`}
              className="flex flex-col items-center bg-gray-800 bg-opacity-50 rounded-xl p-4 shadow-md hover:scale-105 transition-transform"
            >
              <time className="text-gray-300 text-sm font-medium">
                {date}
                <span className="block text-gray-400 text-xs">{time}</span>
              </time>

              <img
                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].main}
                className="w-16 my-2"
                loading="lazy"
              />

              <div className="text-white font-bold text-2xl">
                {Math.round(forecast.main.temp)}{temperatureSymbol}
              </div>

              <p className="text-gray-300 text-sm capitalize">
                {forecast.weather[0].description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Forecast;