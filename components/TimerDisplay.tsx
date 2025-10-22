
import React from 'react';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, totalTime }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = ((totalTime - timeLeft) / totalTime) * circumference;

  return (
    <div className="relative w-64 h-64">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
        <circle
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="10"
          className="text-slate-700"
          fill="transparent"
          stroke="currentColor"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="10"
          strokeLinecap="round"
          className="text-red-500"
          fill="transparent"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-bold tracking-tighter text-slate-100">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
