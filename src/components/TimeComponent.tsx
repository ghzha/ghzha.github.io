import React, { useState, useEffect } from 'react';

const TimeComponent = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup function
  }, []);

  // Calculate progress
  const startOfYear: Date = new Date(currentDateTime.getFullYear(), 0, 0);
  const diff: number = currentDateTime.getTime() - startOfYear.getTime();
  const oneDay: number = 1000 * 60 * 60 * 24;
  const dayOfYear: number = Math.floor(diff / oneDay);

  // Calculate progress for today
  const startOfDay: Date = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
  const diffToday: number = currentDateTime.getTime() - startOfDay.getTime();
  const percentOfDay: number = (diffToday / oneDay) * 100;


  return (
    <div className="flex flex-col items-center justify-center border p-8 rounded-lg">
      <div className="text-4xl mb-4">{currentDateTime.toLocaleTimeString()}</div>
      <div className="text-xl mb-4 text-gray-500">{currentDateTime.toLocaleDateString()}</div>

      <div className="w-64 bg-green-100 rounded-full mt-4 overflow-hidden">
        <div className="h-2 bg-green-500" style={{ width: `${percentOfDay}%` }}></div>
      </div>
      <div className="mt-2 text-sm text-green-700 font-bold">
        今天已过 {percentOfDay.toFixed(2)}%
      </div>

      <div className="w-64 bg-blue-100 rounded-full overflow-hidden mt-4">
        <div className="h-2 bg-blue-500" style={{ width: `${(dayOfYear / 365) * 100}%` }}></div>
      </div>
      <div className="mt-2 text-sm text-blue-800 font-bold">
        今天是{currentDateTime.getFullYear()}年的第{dayOfYear}天
      </div>

    </div>
  );
};

export default TimeComponent;
