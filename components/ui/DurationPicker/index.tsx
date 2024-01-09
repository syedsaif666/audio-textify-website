import React, { useState, useEffect } from 'react';

const DurationPicker = ({
  setIsSummarizeEnabled,
  onDurationChange,
  limit
}: {
  setIsSummarizeEnabled: Function;
  onDurationChange: Function;
  limit: number;
}) => {

  const secondsToTime = (limit: number) => new Date(limit * 1000).toISOString().split("T")[1]?.split('.')[0]

  const [startTime, setStartTime] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [endTime, setEndTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  const timeToSeconds = (time: any) => {
    return parseInt(time.hours, 10) * 3600 + parseInt(time.minutes, 10) * 60 + parseInt(time.seconds, 10);
  };

  const updateEndTime = (newStartTime: React.SetStateAction<{ hours: string; minutes: string; seconds: string; }>) => {
    if (timeToSeconds(newStartTime) > timeToSeconds(endTime)) {
      setEndTime(newStartTime);
    }
  }



  const handleStartTimeChange = (name: string, value: string) => {
    const numericValue = Math.max(0, Math.min(parseInt(value, 10) || 0, name === 'hours' ? 23 : 59));
    const formattedValue = numericValue.toString().padStart(2, '0');
    let newStartTime = { ...startTime, [name]: formattedValue };
    const newStartTimeInSeconds = timeToSeconds(newStartTime);

    if (newStartTimeInSeconds > limit) {
      const updatedTimeString = secondsToTime(limit)
      newStartTime = { hours: `${updatedTimeString[0]}${updatedTimeString[1]}`, minutes: `${updatedTimeString[3]}${updatedTimeString[4]}`, seconds: `${updatedTimeString[6]}${updatedTimeString[7]}` }
    }
    setStartTime(newStartTime);
  };

  const handleEndTimeChange = (name: string, value: string) => {
    const numericValue = Math.max(0, Math.min(parseInt(value, 10) || 0, name === 'hours' ? 23 : 59));
    const formattedValue = numericValue.toString().padStart(2, '0');
    let newEndTime = { ...endTime, [name]: formattedValue };
    const newEndTimeInSeconds = timeToSeconds(newEndTime);
    if (newEndTimeInSeconds > limit) {
      const updatedTimeString = secondsToTime(limit)
      newEndTime = { hours: `${updatedTimeString[0]}${updatedTimeString[1]}`, minutes: `${updatedTimeString[3]}${updatedTimeString[4]}`, seconds: `${updatedTimeString[6]}${updatedTimeString[7]}` }
    }
    setEndTime(newEndTime);
  };

  useEffect(() => {
    updateEndTime(startTime);
  }, [startTime]);

  useEffect(() => {
    if (timeToSeconds(startTime) < timeToSeconds(endTime)) {
      setIsSummarizeEnabled(true);
    } else {
      setIsSummarizeEnabled(false);
    }
    onDurationChange({ startTime, endTime });
  }, [startTime, endTime])

  useEffect(() => {
    const formattedTime = secondsToTime(limit)
    console.log(limit);
    console.log(formattedTime)
    setEndTime({ hours: `${formattedTime[0]}${formattedTime[1]}`, minutes: `${formattedTime[3]}${formattedTime[4]}`, seconds: `${formattedTime[6]}${formattedTime[7]}` })
  }, []);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-1.5">
        {Object.keys(startTime).map((name) => (
          <React.Fragment key={name}>
            {name !== 'hours' && (
              <div className='flex flex-col gap-[0.4rem]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                  <circle cx="2" cy="2" r="2" fill="#313538"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                  <circle cx="2" cy="2" r="2" fill="#313538"/>
                </svg>
              </div>
            )}
            <label>{''}
              <input
                name={name}
                value={startTime[name as 'hours' | 'minutes' | 'seconds']}
                onChange={(e) => handleStartTimeChange(name, e.target.value)}
                className="bg-transparent w-10 h-10 font-[0.9375rem] font-Urbanist text-[#fff] placeholder:text-[#313538] tracking-[0.00469rem] rounded-lg border border-[#313538] outline-none focus-none text-center"
              />
           </label>
          </React.Fragment>
        ))}
      </div>

      <span className='flex items-center gap-1.5'>-</span>

      <div className="flex items-center gap-1.5">
        {Object.keys(endTime).map((name) => (
          <React.Fragment key={name}>
            {name !== 'hours' && (
              <div className='flex flex-col gap-[0.4rem]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                  <circle cx="2" cy="2" r="2" fill="#313538"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
                  <circle cx="2" cy="2" r="2" fill="#313538"/>
                </svg>
              </div>
            )}
            <label>{''}
              <input
                name={name}
                value={endTime[name as 'hours' | 'minutes' | 'seconds']}
                onChange={(e) => handleEndTimeChange(name, e.target.value)}
                className="bg-transparent w-10 h-10 font-[0.9375rem] font-Urbanist text-[#fff] placeholder:text-[#313538] tracking-[0.00469rem] rounded-lg border border-[#313538] outline-none focus-none text-center"
              />
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DurationPicker;

