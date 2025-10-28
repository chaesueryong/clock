export interface Alarm {
  id: string;
  amPm: string;
  hour: string;
  minute: string;
  alarmMusic: string;
  alarmName: string;
  fullTime: string;
  enabled: boolean;
  repeat?: string[];
  createdAt: number;
}

export interface TimerObj {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimerPreset {
  id: string;
  name: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface LapTime {
  time: string;
  totalTime: string;
  ms: number;
  diff: string;
  isFastest: boolean;
  isSlowest: boolean;
}

export interface WorldClock {
  id: string;
  timezone: string;
  city: string;
  country: string;
}

export interface AlarmSound {
  id: string;
  name: string;
  url: string;
  isCustom: boolean;
}
