export class LS {
    static alarm = 'alarm';
    static timerObj = 'timer_obj';
    static timerEndDate = 'timer_end_date';
    static timerPauseTime = 'timer_pause_time';
    static stopWatchStartDate = 'stop_watch_start_date';
    static stopWatchPauseDate = 'stop_watch_pause_date';

    static get(key, defaultValue = '') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key){
        localStorage.removeItem(key);
    }
}