import moment from 'moment';
import Store from '../store/index';
import { LS } from './LocalStorage';

export class System {
    static timeInterval = null;

    static checkScreenStatus() {
        window.addEventListener('resize', function () {
            if ((screen.availHeight || screen.height - 30) <= window.innerHeight) {
                Store.commit('systemStore/setFullScreen', true);
            }
            else {
                Store.commit('systemStore/setFullScreen', false);
            }
        });
    }

    static toggleScreen() {
        const isFullScreen = Store.state.systemStore.fullScreen;

        if(isFullScreen === true){
            Store.commit('systemStore/setFullScreen', false);
            document.exitFullscreen();
        }else{
            Store.commit('systemStore/setFullScreen', true);
            document.documentElement.requestFullscreen();
        }
    }

    static toggleDarkMode() {
        const isDark = document.documentElement.classList.contains('dark');

        if(isDark){
            LS.set('dark', 'false');
        }else{
            LS.set('dark', 'true');
        }
        document.documentElement.classList.toggle('dark');
    }

    static setDarkMode() {
        const isDark = LS.get('dark');
        if(isDark === 'true'){
             document.documentElement.classList.add('dark');
        }else {
             document.documentElement.classList.remove('dark');
        }
    }

    static setTime () {
        if(this.timeInterval !== null){
            clearInterval(this.timeInterval);
        }

        Store.commit('systemStore/setMoment', moment().tz(Store.state.systemStore.timeZone));
        this.timeInterval = setInterval(() => {
            Store.commit('systemStore/setMoment', moment().tz(Store.state.systemStore.timeZone));
        }, 1000);
    }

    static init() {
        this.setTime();
        this.setDarkMode();
        this.checkScreenStatus();
    }
}