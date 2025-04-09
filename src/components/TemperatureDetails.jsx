import { DateTime } from "luxon";
import {
  UilThermometer,  // Alternative for UilTemperature
  UilRaindrops,    // Alternative for UilTear
  UilWind,         // Should still work
  UilSun,         
  UilSunset,       
  UilArrowUp,     
  UilArrowDown,   
  UilSearch,      
  UilLocationPoint
} from "@iconscout/react-unicons";

function TemperatureDetails({ data, units }) {
  const formatTime = (timestamp, timezone) => (
    DateTime.fromSeconds(timestamp)
      .setZone("UTC")
      .plus({ seconds: timezone })
      .toFormat("h:mm a")
  );

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windSpeed = units === "metric" 
    ? data.wind.speed 
    : (data.wind.speed * 2.237).toFixed(1);
  const windUnit = units === "metric" ? "m/s" : "mph";

  const weatherStats = [
    { 
      icon: <UilThermometer className="text-white" />,
      label: "Feels Like", 
      value: `${Math.round(data.main.feels_like)}${tempUnit}`
    },
    { 
      icon: <UilRaindrops className="text-white" />,
      label: "Humidity", 
      value: `${data.main.humidity}%` 
    },
    { 
      icon: <UilWind className="text-white" />,
      label: "Wind", 
      value: `${windSpeed} ${windUnit}` 
    }
  ];

  const sunAndTempInfo = [
    { 
      icon: <UilSun className="text-yellow-400" />, 
      label: "Sunrise", 
      value: formatTime(data.sys.sunrise, data.timezone) 
    },
    { 
      icon: <UilSunset className="text-orange-400" />, 
      label: "Sunset", 
      value: formatTime(data.sys.sunset, data.timezone) 
    },
    { 
      icon: <UilArrowUp className="text-red-400" />, 
      label: "High", 
      value: `${Math.round(data.main.temp_max)}${tempUnit}` 
    },
    { 
      icon: <UilArrowDown className="text-blue-400" />, 
      label: "Low", 
      value: `${Math.round(data.main.temp_min)}${tempUnit}` 
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-80 backdrop-blur-lg shadow-xl rounded-2xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-cyan-300 text-xl font-semibold uppercase">
          {data.weather[0].main}
        </h2>
        <div className="flex items-center justify-center mt-4 gap-4">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            className="w-24 drop-shadow-lg"
            loading="lazy"
          />
          <span className="text-6xl font-extrabold text-white">
            {Math.round(data.main.temp)}{tempUnit}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {weatherStats.map((stat, index) => (
          <div 
            key={`stat-${index}`}
            className="flex flex-col items-center bg-gray-700 bg-opacity-50 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-all"
          >
            <div className="flex items-center mb-2">
              {stat.icon}
              <span className="ml-2 text-sm text-white">{stat.label}</span>
            </div>
            <span className="text-xl font-semibold text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sunAndTempInfo.map((info, index) => (
          <div 
            key={`info-${index}`}
            className="flex items-center bg-gray-700 bg-opacity-50 rounded-lg p-3 shadow-md hover:bg-gray-600 transition-all"
          >
            {info.icon}
            <div className="ml-2">
              <div className="text-gray-300 text-sm">{info.label}</div>
              <div className="text-white font-medium">{info.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemperatureDetails;