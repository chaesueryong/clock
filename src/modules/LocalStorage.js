export class LS {
    static alarm = 'alarm';
    static timer = 'timer';

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