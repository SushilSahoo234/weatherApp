import axios from "axios";
import { DateTime } from "luxon";

// API Config
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Function to fetch data from OpenWeather API
const getWeatherData = async (endpoint, params) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: { ...params, appid: API_KEY, units: "metric" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch weather data. Check the city name or API key.");
  }
};

// Function to format time
const formatToLocalTime = (secs, timezone, format = "ccc, dd LLL yyyy | hh:mm a") =>
  DateTime.fromSeconds(secs).setZone(timezone).toFormat(format);

// Function to format current weather data
const formatCurrentWeather = (data) => {
  return {
    name: data.name,
    country: data.sys.country,
    timezone: data.timezone,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
};

// Function to format forecast weather
const formatForecastWeather = (data) => {
  const { list } = data;

  // Get next 5 days forecast at 12:00 PM each day
  const daily = list.filter((item) => item.dt_txt.includes("12:00:00")).map((d) => ({
    title: formatToLocalTime(d.dt, data.city.timezone, "ccc"),
    temp: d.main.temp,
    icon: d.weather[0].icon,
  }));

  return { daily };
};

// Function to get weather data (current + forecast)
export const getFormattedWeatherData = async (city) => {
  try {
    // Fetch Current Weather
    const currentWeather = await getWeatherData("weather", { q: city });
    const formattedCurrentWeather = formatCurrentWeather(currentWeather);

    // Fetch 5-Day Forecast
    const forecastWeather = await getWeatherData("forecast", { q: city });
    const formattedForecastWeather = formatForecastWeather(forecastWeather);

    return { ...formattedCurrentWeather, ...formattedForecastWeather };
  } catch (error) {
    throw error;
  }
};
