<template>
    <div class="timer-box">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">타이머</div>

        <div style="display: flex; font-size: 72px; margin-bottom: 80px; font-weight: 400;">
            <div style="margin-right: 30px" v-if="remainedTime.days !== ''">
                {{ remainedTime.days }}일
            </div>
            <div>
                {{ remainedTime.hours + ':' + remainedTime.minutes + ':' + remainedTime.seconds }}
            </div>
        </div>

        <div class="stop-watch-btn-box">
            <div class="open-timer-modal-btn" :class="[isTimerSet ? '' : 'display-none']" @click="showTimerModal">타이머설정</div>
            <div class="open-timer-modal-btn" :class="[isReSet ? '' : 'display-none']" @click="resetTimer">재설정</div>
            <div class="open-timer-modal-btn" :class="[isStop ? '' : 'display-none']" @click="stopTimer">중지</div>
            <div class="open-timer-modal-btn" :class="[isStart ? '' : 'display-none']" @click="startTimer()">시작</div>
        </div>

        <SetTimerModal @setTimer="setTimer" @closeTimerModal="closeTimerModal" v-if="timerModalStatus" />

        <ConfirmTimerModal @confirmTimer="confirmTimer" :settingTimer="timerObj" v-show="confirmTimerModalStatus" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SetTimerModal from '@/components/SetTimerModal.vue';
import ConfirmTimerModal from '@/components/ConfirmTimerModal.vue';
import { LS } from '../../modules/LocalStorage';

const timerModalStatus = ref(false);
const confirmTimerModalStatus = ref(false);

const isTimerSet = ref(true);
const isReSet = ref(false);
const isStop = ref(false);
const isStart = ref(false);

const interval = ref(null);

const endTime = ref(null);
const pauseTime = ref(null);

const remainedTime = ref({
    days: '',
    hours: '00',
    minutes: '00',
    seconds: '00'
})

const timerObj = ref(null);

onMounted(() => {
    getTimer();
});

const showTimerModal = () => {
    timerModalStatus.value = true;
}

const closeTimerModal = () => {
    timerModalStatus.value = false;
}

const resetTimer = () => {
    startTimer(false, false, true);
    updateTimer(Date.now());
    stopTimer();
    isTimerSet.value = true;
    isReSet.value = false;
    isStop.value = false;
    isStart.value = true;
}

const stopTimer = () => {
    clearInterval(interval.value);
    isTimerSet.value = true;
    isStop.value = false;
    isStart.value = true;
    isReSet.value = true;
    LS.set(LS.timerPauseTime, pauseTime.value);
}

const setTimer = (obj) => {
    timerObj.value = obj;

    LS.set(LS.timerObj, obj);

    startTimer(false, true);
    closeTimerModal();
}

const startTimer = (backgroundMode = false, setNew = false, reset = false) => {
    if(interval.value !== null) {
        clearInterval(interval.value)
    }

    isTimerSet.value = false;
    isReSet.value = false;
    isStop.value = true;
    isStart.value = false;

    if(!endTime.value || setNew === true || reset === true) {
        if(backgroundMode === false){
            const nowDate = new Date();
            const endDate = new Date(nowDate);

            const { hours, minutes, seconds } = timerObj.value;
            endDate.setHours(nowDate.getHours() + hours);
            endDate.setMinutes(nowDate.getMinutes() + minutes);
            endDate.setSeconds(nowDate.getSeconds() + seconds + 1);

            endTime.value = endDate.getTime();
        }
    }else {
        if(backgroundMode === false){
            endTime.value += (Date.now() - pauseTime.value);
        }
    }

    LS.remove(LS.timerPauseTime);
    LS.set(LS.timerEndDate, endTime.value);

    if(!reset){
        interval.value = setInterval(() => {
            updateTimer(Date.now());
        }, 100);
    }
    
    
    
    
    
    
    
    
}

const confirmTimer = () => {
    confirmTimerModalStatus.value = false;
    clearTimer();
}

const clearTimer = () => {
    remainedTime.value = {
        days: '',
        hours: '00',
        minutes: '00',
        seconds: '00'
    }
    endTime.value = null;
    pauseTime.value = null;

    isTimerSet.value = true;
    isReSet.value = true;
    isStop.value = false;
    isStart.value = false;

    LS.remove(LS.timerEndDate);
    LS.remove(LS.timerPauseTime);
    clearInterval(interval.value);
}

const getTimer = () => {
    const timer = LS.get(LS.timerObj, null);
    const timerEndTime = LS.get(LS.timerEndDate, null);
    const timerPauseTime = LS.get(LS.timerPauseTime, null);
    timerObj.value = timer;

    if(timerEndTime){
        endTime.value = timerEndTime;

        if(timerPauseTime){
            pauseTime.value = timerPauseTime;
            isTimerSet.value = true;
            isReSet.value = true;
            isStop.value = false;
            isStart.value = true;
            updateTimer(timerPauseTime);
        }else{
            startTimer(true);
        }
    }
}

const updateTimer = (date) => {
    pauseTime.value = date;
    const dateGap = endTime.value - date;
    const timeGap = new Date(0, 0, 0, 0, 0, 0, endTime.value - date);

    if(dateGap <= 1000 ){
        confirmTimerModalStatus.value = true;
        clearTimer();
    }

    const days = Math.floor(dateGap / (1000 * 60 * 60 * 24));     
    const hours = timeGap.getHours();    
    const minutes = timeGap.getMinutes();     
    const seconds = timeGap.getSeconds();      

    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    remainedTime.value = {
        days: days === 0 ? '' : days,
        hours: h,
        minutes: m,
        seconds: s,
    }
}
</script>

<style>
.timer-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1036px;
    height: 696px;
    background-color: var(--bg-color-1);
    border-radius: 8px;
    margin: 12px auto 8px auto;

    color: var(--text-color-1);
}

.open-timer-modal-btn, .stop-timer-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 100px;
    height: 32px;
    color: white;
    background-color: var(--bg-color-4);
    border-radius: 500px;
    font-weight: 700;
    cursor: pointer;
}

.open-timer-modal-btn:hover, .stop-timer-btn:hover {
    background-color: var(--bg-hover-color-1);
}

</style>