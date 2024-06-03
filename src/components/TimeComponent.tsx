import { useState, useEffect, useMemo, useRef } from 'react';

const TimeComponent = () => {

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  const daysInCurrentMonth = useMemo(() => {
    return new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0).getDate();
  }, [currentDateTime.getDay()]);


  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current!;

    card.addEventListener('mousemove', handleMouseMove);
    function handleMouseMove(event: MouseEvent) {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      const mouseX = event.clientX - cardCenterX;
      const mouseY = event.clientY - cardCenterY;


      const maxRotation = 30; // 最大旋转角度

      const rotateX = (-mouseX / cardRect.width) * maxRotation * 1.5;
      const rotateY = (-mouseY / cardRect.height) * maxRotation * 1.5;




      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'none';
    });



    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [percentOfDay, percentOfWeek] = useMemo(() => {
    const now = currentDateTime;
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffToday = now.getTime() - startOfDay.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const percentOfDay = (diffToday / oneDay) * 100;
    const daysPassedThisWeek = now.getDay() === 0 ? 7 : now.getDay();
    const percentOfWeek = ((daysPassedThisWeek - 1 + percentOfDay / 100) / 7) * 100;
    return [percentOfDay, percentOfWeek];
  }, [currentDateTime]);


  const [daysPassedThisWeek, dayOfWeek] = useMemo(() => {
    const now = currentDateTime;
    const daysPassedThisWeek = now.getDay() === 0 ? 7 : now.getDay();
    const dayOfWeek = daysOfWeek[currentDateTime.getDay()];
    return [daysPassedThisWeek, dayOfWeek];
  }, [currentDateTime.getDay()]);

  const [percentOfMonth, daysPassedThisMonth] = useMemo(() => {
    const daysPassedThisMonth = currentDateTime.getDate();
    return [(daysPassedThisMonth / daysInCurrentMonth) * 100, daysPassedThisMonth];
  }, [currentDateTime.getDay()]);


  const dayOfYear = useMemo(() => {
    const now = currentDateTime;
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, [currentDateTime.getDay()]);




  return (
    <div className='w-full flex justify-center'>
      <div ref={cardRef} className="flex w-4/5 sm:h-64 flex-col sm:flex-row items-center justify-around border p-4 rounded-lg cursor-pointer select-none shadow-md transition-transform ease-in-out duration-0">
        <div className="flex w-1/4 flex-col justify-center items-center">
          <div className="text-4xl mb-4">{currentDateTime.toLocaleTimeString('zh-CN')}</div>
          <div className="text-xl mb-4 text-gray-500">{currentDateTime.toLocaleDateString('zh-CN')}</div>
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
