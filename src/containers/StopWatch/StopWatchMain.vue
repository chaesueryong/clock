<template>
    <div class="stop-watch-box">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">스톱워치</div>

        <div style="display: flex; font-size: 72px; margin-bottom: 80px; font-weight: 400;">
            <div>
                {{ displayTime.minutes + ':' + displayTime.seconds }}
            </div>
            <div style="margin-left: 10px; font-size: 32px; align-self: flex-end;">{{ displayTime.milliseconds }}</div>
        </div>

        <div class="stop-watch-btn-box">
            <div class="stop-watch-record-btn" :class="[isRecord ? '' : 'display-none']" @click="recordStopWatch">기록</div>
            <div class="stop-watch-stop-btn" :class="[isStop ? '' : 'display-none']" @click="stopStopWatch">중지</div>
            <div class="stop-watch-reset-btn" :class="[isReset ? '' : 'display-none']" @click="resetStopWatch">RESET</div>
            <div class="stop-watch-start-btn" :class="[isStart ? '' : 'display-none']" @click="startStopWatch()">{{startBtn}}</div>        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LS } from '../../modules/LocalStorage';

const interval = ref(null);
const displayTime = ref({
    days: '',
    hours: '00',
    minutes: '00',
    seconds: '00',
    milliseconds: '00'
});

const startBtn = ref('시작');

const isRecord = ref(false);
const isStop = ref(false);
const isStart = ref(true);
const isReset = ref(false);

const startTime = ref(null);
const pauseTime = ref(null);

onMounted(() => {
    getTimer();
})

const recordStopWatch = () => {
    const record = displayTime.value;
}

const getTimer = () => {
    if(interval.value !== null) {
        clearInterval(interval.value)
    }
    const startDate = LS.get(LS.stopWatchStartDate, null);
    const pauseDate = LS.get(LS.stopWatchPauseDate, null);

    if(startDate){
        startTime.value = startDate;

        if(pauseDate){
            pauseTime.value = pauseDate;
            isReset.value = true;
            startBtn.value = '재시작';
            updateStopWatch(pauseDate);
        }else{
            startStopWatch(true);
        }
    }
}

const resetStopWatch = () => {
    clearInterval(interval.value);

    isRecord.value = false;
    isStop.value = false;

    isStart.value = true;
    startBtn.value = '시작';
    isReset.value = false;

    LS.remove(LS.stopWatchStartDate);
    LS.remove(LS.stopWatchPauseDate);
    startTime.value = null;
    displayTime.value = {
        days: '',
        hours: '00',
        minutes: '00',
        seconds: '00',
        milliseconds: '00'
    };
}

const stopStopWatch = () => {
    clearInterval(interval.value);

    isRecord.value = false;
    isStop.value = false;

    isStart.value = true;
    startBtn.value = '재시작';

    isReset.value = true;

    LS.set(LS.stopWatchPauseDate, pauseTime.value);
}

const startStopWatch = (backgroundMode = false) => {
    if(interval.value !== null) {
        clearInterval(interval.value)
    }

    isRecord.value = true;
    isStop.value = true;
    isStart.value = false;

    if(!startTime.value) {
        if(backgroundMode === false){
            startTime.value = Date.now();   
        }
    }else {
        isReset.value = false;
        if(backgroundMode === false){
            startTime.value += (Date.now() - pauseTime.value);
        }
    }
    LS.remove(LS.stopWatchPauseDate);
    LS.set(LS.stopWatchStartDate, startTime.value);

    interval.value = setInterval(() => {
        updateStopWatch(Date.now());
    }, 10);
}

const updateStopWatch = (date) => {
    pauseTime.value = date;
    const dateGap = date - startTime.value;
    const timeGap = new Date(0, 0, 0, 0, 0, 0, date - startTime.value);

    const days = Math.floor(dateGap / (1000 * 60 * 60 * 24));     
    const hours = timeGap.getHours();    
    const minutes = timeGap.getMinutes();     
    const seconds = timeGap.getSeconds();      
    const milliseconds = timeGap.getMilliseconds();     

    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    let ms = '';
    if(milliseconds <= 10){
        ms = "0" + Math.ceil(milliseconds / 10);
    }
    else if(milliseconds > 990){
        ms = "99";
    }
    else if(milliseconds > 90){
        ms = Math.ceil(milliseconds / 10);
    }else {
        ms ="0" + Math.ceil(milliseconds / 10);
    }

    displayTime.value = {
        days: days,
        hours: h,
        minutes: m,
        seconds: s,
        milliseconds: ms
    }
}

</script>

<style>
.stop-watch-box {
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

.stop-watch-btn-box {
    display: flex;
    gap: 10px;
}


.stop-watch-record-btn, .stop-watch-stop-btn, .stop-watch-start-btn, .stop-watch-reset-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 100px;
    height: 32px;
    color: white;
    border-radius: 500px;
    font-weight: 700;
    cursor: pointer;
}

.stop-watch-record-btn {
    background-color: var(--bg-color-4);
}

.stop-watch-stop-btn {
    background-color: var(--bg-color-5);
}

.stop-watch-start-btn {
    background-color: var(--bg-color-4);
}

.stop-watch-record-btn:hover {
    background-color: var(--bg-hover-color-1);
}
.stop-watch-stop-btn:hover {
    background-color: var(--bg-hover-color-2);
}
.stop-watch-start-btn:hover {
    background-color: var(--bg-hover-color-1);
}

.display-none {
    display: none;
}

</style>