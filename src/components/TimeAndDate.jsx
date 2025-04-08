import React from "react";
import { DateTime } from "luxon";

function TimeAndDate({ data }) {
  const { dt, timezone, name: city } = data;

  const getFormattedDateTime = () => {
    return DateTime.fromMillis(dt * 1000)
      .setZone("UTC")
      .plus({ seconds: timezone })
      .toFormat("EEEE, d LLLL yyyy | h:mm a");
  };

  const isoDateTime = DateTime.fromMillis(dt * 1000).toISO();

  return (
    <div className="text-center space-y-3 mb-8">
      <div className="inline-block bg-white/90 dark:bg-gray-800/90 px-5 py-3 rounded-xl shadow-lg">
        <time 
          dateTime={isoDateTime}
          className="text-gray-800 dark:text-gray-100 text-base sm:text-lg font-medium"
        >
          {getFormattedDateTime()}
        </time>
      </div>

      <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">
        {city}
      </h1>
    </div>
  );
}

export default TimeAndDate;