import { UilSearch, UilLocationPoint } from "@iconscout/react-unicons";
import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { geoApiURL, geoApiOptions } from "../services/GeoDBApi";

function Inputs({ onSearchChange, onUnitChange }) {
  const [search, setSearch] = useState(null);
  const [isMetric, setIsMetric] = useState(true);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const toggleTemperatureUnit = () => {
    const newUnit = isMetric ? "imperial" : "metric";
    setIsMetric(!isMetric);
    onUnitChange(newUnit);
  };

  const fetchCityOptions = async (searchQuery) => {
    if (!searchQuery.trim()) return { options: [] };

    try {
      const response = await fetch(
        `${geoApiURL}/cities?minPopulation=1000000&namePrefix=${searchQuery}`,
        geoApiOptions
      );
      const { data } = await response.json();
      
      return {
        options: data.map(city => ({
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        })),
      };
    } catch (error) {
      console.error("City search error:", error);
      return { options: [] };
    }
  };

  const handleLocationSearch = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const locationData = {
        value: `${position.coords.latitude} ${position.coords.longitude}`,
        label: "Current Location",
      };

      setSearch(locationData);
      onSearchChange(locationData);
    } catch (error) {
      console.error("Location error:", error);
      alert("Couldn't retrieve your location. Please check permissions.");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const getSelectStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    const focusColor = isDarkMode ? "#818CF8" : "#4F46E5";
    const bgColor = isDarkMode ? "#1F2937" : "black";
    const textColor = isDarkMode ? "white" : "white";

    return {
      control: (base) => ({
        ...base,
        backgroundColor: bgColor,
        color: textColor,
        borderColor: isDarkMode ? "#374151" : "#D1D5DB",
        "&:hover": { borderColor: focusColor },
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: bgColor,
        color: textColor,
      }),
      option: (base, { isFocused }) => ({
        ...base,
        backgroundColor: isFocused ? (isDarkMode ? "#374151" : "#E5E7EB") : "transparent",
        color: textColor,
      }),
    };
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center my-6 gap-4 max-w-4xl mx-auto px-4" >
      <div className="flex flex-row w-full sm:w-3/4 items-center gap-3">
        <div className="flex-1 w-full sm:w-80 md:w-96 lg:w-[30rem]">
          <AsyncPaginate
            placeholder="🔍 Search city..."
            debounceTimeout={400}
            value={search}
            onChange={(selected) => {
              setSearch(selected);
              onSearchChange(selected);
            }}
            loadOptions={fetchCityOptions}
            classNamePrefix="react-select"
            styles={getSelectStyles()}
            noOptionsMessage={() => "Type to search cities"}
          />
        </div>

        <button
          className="p-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors shadow-md"
          aria-label="Search"
        >
          <UilSearch size={22} className="text-white" />
        </button>

        <button
          onClick={handleLocationSearch}
          disabled={isFetchingLocation}
          className={`p-3 rounded-lg transition-colors shadow-md ${
            isFetchingLocation 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-500 hover:bg-green-600"
          }`}
          aria-label="Use my location"
        >
          {isFetchingLocation ? (
            <span className="text-white text-sm">...</span>
          ) : (
            <UilLocationPoint size={22} className="text-white" />
          )}
        </button>
      </div>

      <div className="flex w-full sm:w-1/4 justify-center sm:justify-end">
        <button
          onClick={toggleTemperatureUnit}
          className={`w-12 h-12 rounded-full transition-colors text-white font-medium text-lg shadow-lg ${
            isMetric ? "bg-indigo-500 hover:bg-indigo-600" : "bg-red-500 hover:bg-red-600"
          }`}
          aria-label={`Switch to ${isMetric ? "Fahrenheit" : "Celsius"}`}
        >
          {isMetric ? "°C" : "°F"}
        </button>
      </div>
    </div>
  );
}

export default Inputs;