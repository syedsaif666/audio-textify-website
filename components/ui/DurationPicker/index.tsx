// import React, { useState } from 'react';

// interface DigitInputProps {
//   value: number;
//   onChange: (index: number, value: number) => void;
//   index: number;
//   max: number;
// }

// const DigitInput: React.FC<DigitInputProps> = ({ value, onChange, index, max }) => {
//   const formatValue = (val: number) => val < 10 ? `0${val}` : val.toString();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let val = parseInt(e.target.value, 10);
//     if (isNaN(val)) val = 0;
//     if (val > max) val = max;
//     if (val < 0) val = 0;
//     onChange(index, val);
//   };

//   return (
//     <label>{''}
//       <input
//         className="bg-transparent w-10 h-10 font-[0.9375rem] font-Urbanist text-[#fff] placeholder:text-[#313538] tracking-[0.00469rem] rounded-lg border border-[#313538] outline-none focus-none text-center"
//         value={formatValue(value)}
//         onChange={handleChange}
//         min="00"
//         placeholder="00"
//         max={formatValue(max)}
//       />
//     </label>
//   );
// };

// const DurationPicker = () => {
//   const [timeDigits, setTimeDigits] = useState([0, 0, 0, 0, 0, 0]);

//   const handleDigitChange = (index: number, value: number) => {
//     const newTimeDigits = [...timeDigits];
//     newTimeDigits[index] = value;
//     setTimeDigits(newTimeDigits);
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <div className="flex items-center gap-1.5">
//         {[2, 9, 5].map((max, index) => (
//           <React.Fragment key={index}>
//             {index > 0 ? <div className='flex flex-col gap-[0.4rem]'>
              // <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
              //   <circle cx="2" cy="2" r="2" fill="#313538"/>
              // </svg>
              // <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none">
              //   <circle cx="2" cy="2" r="2" fill="#313538"/>
              // </svg>
//             </div>: null}
//             <DigitInput
//               value={timeDigits[index]}
//               onChange={(value) => handleDigitChange(index, value)}
//               index={index}
//               max={max}
//             />
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DurationPicker;
import React, { useState, useEffect } from 'react';

const DurationPicker = ({
  setIsSummarizeEnabled
}: {
  setIsSummarizeEnabled: Function
}) => {
  const [startTime, setStartTime] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [endTime, setEndTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  const timeToSeconds = (time: any) => {
    return parseInt(time.hours, 10) * 3600 + parseInt(time.minutes, 10) * 60 + parseInt(time.seconds, 10);
  };

  const updateEndTime = (newStartTime: React.SetStateAction<{ hours: string; minutes: string; seconds: string; }>) => {
    if (timeToSeconds(newStartTime) > timeToSeconds(endTime)) {
      setEndTime(newStartTime);
    }
  };

  const handleStartTimeChange = (name: string, value: string) => {
    const numericValue = Math.max(0, Math.min(parseInt(value, 10) || 0, name === 'hours' ? 23 : 59));
    const formattedValue = numericValue.toString().padStart(2, '0');
    setStartTime((prevStartTime) => {
      const newStartTime = { ...prevStartTime, [name]: formattedValue };
      updateEndTime(newStartTime);
      return newStartTime;
    });
  };

  const handleEndTimeChange = (name: string, value: string) => {
    const numericValue = Math.max(0, Math.min(parseInt(value, 10) || 0, name === 'hours' ? 23 : 59));
    const formattedValue = numericValue.toString().padStart(2, '0');
    setEndTime((prevEndTime) => {
      const newEndTime = { ...prevEndTime, [name]: formattedValue };
      return newEndTime;
    });
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
  }, [startTime, endTime])

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

