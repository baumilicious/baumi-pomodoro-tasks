
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
}

export enum TimerMode {
  Pomodoro = 'POMODORO',
  ShortBreak = 'SHORT_BREAK',
  LongBreak = 'LONG_BREAK',
}
