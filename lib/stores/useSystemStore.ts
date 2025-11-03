import { create } from 'zustand';
import moment from 'moment-timezone';

interface SystemState {
  currentMoment: moment.Moment;
  darkMode: boolean;
  fullScreen: boolean;
  timeZone: string;
  updateMoment: () => void;
  toggleDarkMode: () => void;
  toggleFullScreen: () => void;
  setTimeZone: (tz: string) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  currentMoment: moment.tz('Asia/Seoul'),
  darkMode: false,
  fullScreen: false,
  timeZone: 'Asia/Seoul',

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
}));
