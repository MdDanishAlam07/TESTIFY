import { useState, useEffect } from 'react';

const Timer = ({ initialTime, onTimeOut }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time <= 0) {
      onTimeOut();
      return;
    }
    const timer = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time, onTimeOut]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return <div>Time left: {formatTime(time)}</div>;
};

export default Timer;