import TimeAndDate from "./components/TimeAndDate";
import TemperatureDetails from "./components/TemperatureDetails";
import Forecast from "./components/Forecast";
import Inputs from "./components/inputs";
import { weatherApiKey, weatherBaseURL } from "./services/OpenWeatherApi";
import { useState, useEffect } from "react";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [units, setUnits] = useState("metric");
  const [lastSearchData, setLastSearchData] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Toggle Dark Mode and Save Preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const fetchWeatherData = (lat, lon, units, searchData) => {
    const currentWeatherFetch = fetch(
      `${weatherBaseURL}/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=${units}`
    );
    const forecastFetch = fetch(
      `${weatherBaseURL}/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=${units}`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(console.log);
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    setLastSearchData(searchData);
    fetchWeatherData(lat, lon, units, searchData);
  };

  const handleUnitChange = (newUnits) => {
    setUnits(newUnits);
    if (lastSearchData) {
      const [lat, lon] = lastSearchData.value.split(" ");
      fetchWeatherData(lat, lon, newUnits, lastSearchData);
    }
  };

  return (
    <>    
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-all duration-300">
      {/* Dark Mode Toggle */}

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mt-4 px-4 py-2 bg-gray-800 text-white dark:bg-white dark:text-black rounded-lg shadow-md"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Weather UI Container */}
      <div className="mx-auto max-w-screen-md mt-3 py-4 px-6 sm:px-10 md:px-16 lg:px-32 bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-md rounded-lg drop-shadow-lg transition-all duration-300">
        <Inputs onSearchChange={handleOnSearchChange} onUnitChange={handleUnitChange} />
        {currentWeather && <TimeAndDate data={currentWeather} />}
        {currentWeather && <TemperatureDetails data={currentWeather} units={units} />}
        {forecast && <Forecast data={forecast} units={units} />}
      </div>
    </div>
    </>

);
}

export default App;
