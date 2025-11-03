import { create } from 'zustand';
import moment from 'moment-timezone';
import { AppSettings } from '../types';

interface SystemState {
  currentMoment: moment.Moment;
  darkMode: boolean;
  fullScreen: boolean;
  timeZone: string;
  settings: AppSettings;
  updateMoment: () => void;
  toggleDarkMode: () => void;
  toggleFullScreen: () => void;
  setTimeZone: (tz: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  segmentColors: {
    active: '#3b82f6',      // 파란색
    inactive: '#374151',    // 어두운 회색
    background: 'transparent',
    glow: '#3b82f6',
  },
  displayType: 'text',
  showSeconds: true,
  use24Hour: false,
  theme: 'auto',
  fontSize: 'large',
  enableAnimations: true,
};

export const useSystemStore = create<SystemState>((set) => ({
  currentMoment: moment.tz('Asia/Seoul'),
  darkMode: false,
  fullScreen: false,
  timeZone: 'Asia/Seoul',
  settings: defaultSettings,

  updateMoment: () => set({ currentMoment: moment.tz('Asia/Seoul') }),

  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.darkMode;
      if (typeof window !== 'undefined') {
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('dark', String(newDarkMode));
      }
      return { darkMode: newDarkMode };
    }),

  toggleFullScreen: () =>
    set((state) => {
      const newFullScreen = !state.fullScreen;
      if (typeof document !== 'undefined') {
        if (newFullScreen) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
      return { fullScreen: newFullScreen };
    }),

  setTimeZone: (tz: string) => set({ timeZone: tz }),

  updateSettings: (newSettings: Partial<AppSettings>) =>
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
      }
      return { settings: updatedSettings };
    }),

  resetSettings: () =>
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_settings', JSON.stringify(defaultSettings));
      }
      return { settings: defaultSettings };
    }),
}));

export { defaultSettings };
