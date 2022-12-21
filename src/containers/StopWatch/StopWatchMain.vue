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
            <div class="stop-watch-record-btn" @click="recordStopWatch">기록</div>
            <div class="stop-watch-stop-btn" @click="stopStopWatch">중지</div>
            <div class="stop-watch-start-btn" @click="startStopWatch">시작</div>
            <div class="stop-watch-reset-btn" @click="resetStopWatch">초기화</div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const interval = ref(null);
const displayTime = ref({
    hours: '00',
    minutes: '00',
    seconds: '00',
    milliseconds: '000'
});

const startTime = ref(null);
const endTime = ref(null);

onMounted(() => {
    if(interval.value !== null) {
        clearInterval(interval.value)
    }
})

const stopStopWatch = () => {
    if(startTime.value){
        clearInterval(interval.value);

        endTime.value = Date.now();
    }
}

const recordStopWatch = () => {
    const record = displayTime.value;
}

const resetStopWatch = () => {
    if(startTime.value){
        clearInterval(interval.value);

        startTime.value = null;
        displayTime.value = {
            hours: '00',
            minutes: '00',
            seconds: '00',
            milliseconds: '000'
        };
    }
}

const startStopWatch = () => {
    if(interval.value !== null) {
        clearInterval(interval.value)
    }

    	
    if(!startTime.value) {
        startTime.value = Date.now();
    } else {
        startTime.value += (Date.now() - endTime.value);
    }

    interval.value = setInterval(() => {
        updateStopWatch();
    }, 1);
}

const updateStopWatch = () => {
    const nowTime = new Date(Date.now() - startTime.value);

    const timeZoneOffset = nowTime.getTimezoneOffset() / 60;

    const hours = nowTime.getHours();
    const minutes = nowTime.getMinutes();
    const seconds = nowTime.getSeconds();
    const milliseconds = nowTime.getMilliseconds();
    console.log(milliseconds)
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

    displayTime.value = {
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

</style>