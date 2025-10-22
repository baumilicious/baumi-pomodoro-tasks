
import React from 'react';
import { usePomodoro } from '../hooks/usePomodoro';
import { TimerDisplay } from './TimerDisplay';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';
import type { Todo } from '../types';
import { TimerMode } from '../types';


interface PomodoroTimerProps {
  onPomodoroComplete: () => void;
  activeTask: Todo | undefined;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onPomodoroComplete, activeTask }) => {
  const { mode, timeLeft, isActive, pomodoroCount, start, pause, reset, setMode } = usePomodoro(onPomodoroComplete);

  const modeConfig = {
    [TimerMode.Pomodoro]: { label: 'Focus', color: 'bg-red-500', time: 25 * 60 },
    [TimerMode.ShortBreak]: { label: 'Short Break', color: 'bg-green-500', time: 5 * 60 },
    [TimerMode.LongBreak]: { label: 'Long Break', color: 'bg-blue-500', time: 15 * 60 },
  };

  const getModeButtonClass = (buttonMode: TimerMode) => {
    return `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      mode === buttonMode ? `${modeConfig[buttonMode].color} text-white` : 'bg-slate-700 hover:bg-slate-600'
    }`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="mb-6 space-x-2">
        <button onClick={() => setMode(TimerMode.Pomodoro)} className={getModeButtonClass(TimerMode.Pomodoro)}>
          Focus
        </button>
        <button onClick={() => setMode(TimerMode.ShortBreak)} className={getModeButtonClass(TimerMode.ShortBreak)}>
          Short Break
        </button>
        <button onClick={() => setMode(TimerMode.LongBreak)} className={getModeButtonClass(TimerMode.LongBreak)}>
          Long Break
        </button>
      </div>

      <TimerDisplay timeLeft={timeLeft} totalTime={modeConfig[mode].time} />
      
      <div className="mt-6 flex items-center space-x-4">
        <button onClick={reset} className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors duration-200">
          <ResetIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={isActive ? pause : start} 
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg transition-transform transform hover:scale-105 ${modeConfig[mode].color}`}
        >
          {isActive ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
        </button>
      </div>
      
      <div className="mt-8 text-center h-16">
        <p className="text-slate-400">#{pomodoroCount}</p>
        <h2 className="text-lg font-medium text-slate-200 truncate" title={activeTask?.text ?? 'Select a task to focus on'}>
          {activeTask ? activeTask.text : 'Select a task to focus on'}
        </h2>
      </div>
    </div>
  );
};
