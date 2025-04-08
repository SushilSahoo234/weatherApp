import { useState } from 'react';
import PropTypes from 'prop-types';

const CITY_DATA = [
  { id: 1, name: "Lucknow" },
  { id: 2, name: "Raebareli" },
  { id: 3, name: "Pune" },
  { id: 4, name: "Mumbai" },
  { id: 5, name: "Prayagraj" },
];

function Navbar({ onCitySelect }) {
  const [activeCityId, setActiveCityId] = useState(null);

  const handleCitySelection = (city) => {
    setActiveCityId(city.id);
    onCitySelect?.(city.name);
  };

  return (
    <nav className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {CITY_DATA.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCitySelection(city)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeCityId === city.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'
              } text-sm md:text-base font-medium whitespace-nowrap`}
              aria-current={activeCityId === city.id ? "location" : undefined}
              aria-label={`View weather for ${city.name}`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onCitySelect: PropTypes.func,
};

export default Navbar;