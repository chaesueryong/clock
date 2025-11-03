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

export interface SegmentColors {
  active: string;        // 활성화된 세그먼트 색상
  inactive: string;      // 비활성화된 세그먼트 색상
  background: string;    // 배경 색상
  glow: string;         // 글로우 효과 색상
}

export interface AppSettings {
  segmentColors: SegmentColors;
  displayType: 'digital' | 'analog' | 'text';
  showSeconds: boolean;
  use24Hour: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  enableAnimations: boolean;
}
