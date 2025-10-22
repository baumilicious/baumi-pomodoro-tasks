import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode } from '../types';

const POMODORO_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const POMODOROS_PER_SET = 4;

const playSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1);
};


export const usePomodoro = (onPomodoroComplete: () => void) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.Pomodoro);
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const switchMode = useCallback(() => {
    if (mode === TimerMode.Pomodoro) {
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);
      onPomodoroComplete();
      
      if (newPomodoroCount % POMODOROS_PER_SET === 0) {
        setMode(TimerMode.LongBreak);
        setTimeLeft(LONG_BREAK_TIME);
      } else {
        setMode(TimerMode.ShortBreak);
        setTimeLeft(SHORT_BREAK_TIME);
      }
    } else { // After a break
      setMode(TimerMode.Pomodoro);
      setTimeLeft(POMODORO_TIME);
    }
  }, [mode, pomodoroCount, onPomodoroComplete]);


  useEffect(() => {
    if (timeLeft <= 0) {
      playSound();
      switchMode();
    }
  }, [timeLeft, switchMode]);

  const cleanupInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      cleanupInterval();
    }
    return cleanupInterval;
  }, [isActive]);
  
  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);

  const reset = useCallback(() => {
    setIsActive(false);
    switch (mode) {
      case TimerMode.Pomodoro:
        setTimeLeft(POMODORO_TIME);
        break;
      case TimerMode.ShortBreak:
        setTimeLeft(SHORT_BREAK_TIME);
        break;
      case TimerMode.LongBreak:
        setTimeLeft(LONG_BREAK_TIME);
        break;
    }
  }, [mode]);

  const handleSetMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    switch (newMode) {
      case TimerMode.Pomodoro:
        setTimeLeft(POMODORO_TIME);
        break;
      case TimerMode.ShortBreak:
        setTimeLeft(SHORT_BREAK_TIME);
        break;
      case TimerMode.LongBreak:
        setTimeLeft(LONG_BREAK_TIME);
        break;
    }
  }

  return { mode, timeLeft, isActive, pomodoroCount, start, pause, reset, setMode: handleSetMode };
};
