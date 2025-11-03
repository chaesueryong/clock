// LocalStorage utility for browser storage
export class LS {
  static alarm = 'alarm';
  static alarms = 'alarms'; // For multiple alarms
  static timerObj = 'timer_obj';
  static timerEndDate = 'timer_end_date';
  static timerPauseTime = 'timer_pause_time';
  static timerPresets = 'timer_presets'; // For timer presets
  static stopWatchStartDate = 'stop_watch_start_date';
  static stopWatchPauseDate = 'stop_watch_pause_date';
  static stopwatchLaps = 'stopwatch_laps';
  static stopwatchLastLap = 'stopwatch_last_lap';
  static dark = 'dark';
  static worldClocks = 'world_clocks'; // For world clocks
  static alarmSounds = 'alarm_sounds'; // For custom alarm sounds

  static get<T>(key: string, defaultValue: T | null = null): T | null {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
    }
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }
}
