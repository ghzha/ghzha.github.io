import React, { useState, useEffect, useRef } from 'react';

const TimeComponent = () => {
  // const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentDateTime(new Date());
  //   }, 1000); // Update every second

  //   return () => clearInterval(interval); // Cleanup function
  // }, []);

  // // Calculate progress
  // const startOfYear: Date = new Date(currentDateTime.getFullYear(), 0, 0);
  // const diff: number = currentDateTime.getTime() - startOfYear.getTime();
  // const oneDay: number = 1000 * 60 * 60 * 24;
  // const dayOfYear: number = Math.floor(diff / oneDay);

  // // Calculate progress for today
  // const startOfDay: Date = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
  // const diffToday: number = currentDateTime.getTime() - startOfDay.getTime();
  // const percentOfDay: number = (diffToday / oneDay) * 100;

  // // Additional calculations
  // const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  // const dayOfWeek = daysOfWeek[currentDateTime.getDay()];
  // const daysPassedThisWeek = currentDateTime.getDay();
  // const daysInCurrentMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0).getDate();
  // const daysPassedThisMonth = currentDateTime.getDate();

  // // Calculate progress for the week
  // const percentOfWeek = (daysPassedThisWeek / 7) * 100;

  // // Calculate progress for the month
  // const percentOfMonth = (daysPassedThisMonth / daysInCurrentMonth) * 100;
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [dayOfYear, setDayOfYear] = useState(0);
  const [percentOfDay, setPercentOfDay] = useState(0);
  const [percentOfWeek, setPercentOfWeek] = useState(0);
  const [percentOfMonth, setPercentOfMonth] = useState(0);

  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const daysInCurrentMonth = useRef(new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0).getDate());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);

      // Calculate progress for the year
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - startOfYear.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      setDayOfYear(Math.floor(diff / oneDay));

      // Calculate progress for today
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffToday = now.getTime() - startOfDay.getTime();
      setPercentOfDay((diffToday / oneDay) * 100);

      // Calculate progress for the week
      const daysPassedThisWeek = now.getDay();
      setPercentOfWeek((daysPassedThisWeek / 7) * 100);

      // Calculate progress for the month
      const daysPassedThisMonth = now.getDate();
      setPercentOfMonth((daysPassedThisMonth / daysInCurrentMonth.current) * 100);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup function
  }, []);

  const dayOfWeek = daysOfWeek[currentDateTime.getDay()];
  const daysPassedThisWeek = currentDateTime.getDay();
  const daysPassedThisMonth = currentDateTime.getDate();


  return (
    <div className='w-full flex justify-center'>
      <div className="flex w-4/5 sm:h-64 flex-col sm:flex-row items-center justify-around border p-4 rounded-lg cursor-pointer select-none">
        <div className="flex w-1/4 flex-col justify-center items-center">
          <div className="text-4xl mb-4">{currentDateTime.toLocaleTimeString()}</div>
          <div className="text-xl mb-4 text-gray-500">{currentDateTime.toLocaleDateString()}</div>
          <div className="mt-2 text-lg text-gray-700 font-bold">
            {dayOfWeek}
          </div>
        </div>

        <div className="w-px bg-gray-300 h-full overflow-visible"></div>

        <div className="flex flex-col justify-center items-center">
          <div className="w-64 bg-green-100 rounded-full mt-4 overflow-hidden">
            <div className="h-2 bg-green-500" style={{ width: `${percentOfDay}%` }}></div>
          </div>
          <div className="mt-2 text-sm text-green-700 font-bold">
            今天已过 {percentOfDay.toFixed(2)}%
          </div>

          <div className="w-64 bg-purple-100 rounded-full overflow-hidden mt-4">
            <div className="h-2 bg-purple-500" style={{ width: `${percentOfWeek}%` }}></div>
          </div>
          <div className="mt-2 text-sm text-purple-800 font-bold">
            本周的第 {daysPassedThisWeek} 天 ({percentOfWeek.toFixed(2)}%)
          </div>

          <div className="w-64 bg-orange-100 rounded-full overflow-hidden mt-4">
            <div className="h-2 bg-orange-500" style={{ width: `${percentOfMonth}%` }}></div>
          </div>
          <div className="mt-2 text-sm text-orange-800 font-bold">
            本月的第 {daysPassedThisMonth} 天 ({percentOfMonth.toFixed(2)}%)
          </div>


          <div className="w-64 bg-blue-100 rounded-full overflow-hidden mt-4">
            <div className="h-2 bg-blue-500" style={{ width: `${(dayOfYear / 365) * 100}%` }}></div>
          </div>
          <div className="mt-2 text-sm text-blue-800 font-bold">
            {currentDateTime.getFullYear()}年的第{dayOfYear}天
          </div>

        </div>
      </div>
    </div>

  );
};

export default TimeComponent;
