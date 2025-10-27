<template>
    <div class="timer-box">
        <div class="timer-label">⏲️ 타이머</div>

        <div class="timer-display">
            <div class="timer-days" v-if="remainedTime.days !== ''">
                {{ remainedTime.days }}<span class="time-unit-label">일</span>
            </div>
            <div class="timer-time">
                <span class="time-segment">{{ remainedTime.hours }}</span>
                <span class="time-colon">:</span>
                <span class="time-segment">{{ remainedTime.minutes }}</span>
                <span class="time-colon">:</span>
                <span class="time-segment">{{ remainedTime.seconds }}</span>
            </div>
        </div>

        <div class="timer-btn-box">
            <button class="timer-btn timer-set-btn" v-if="isTimerSet" @click="showTimerModal">
                <span>⚙️</span>
                <span>타이머설정</span>
            </button>
            <button class="timer-btn timer-reset-btn" v-if="isReSet" @click="resetTimer">
                <span>🔄</span>
                <span>재설정</span>
            </button>
            <button class="timer-btn timer-stop-btn" v-if="isStop" @click="stopTimer">
                <span>⏸</span>
                <span>중지</span>
            </button>
            <button class="timer-btn timer-start-btn" v-if="isStart" @click="startTimer()">
                <span>▶️</span>
                <span>시작</span>
            </button>
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

<style scoped>
.timer-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    min-height: 700px;
    background: linear-gradient(135deg, var(--bg-color-1) 0%, var(--bg-color-2) 100%);
    border-radius: 24px;
    margin: 20px auto;
    padding: 40px;
    color: var(--text-color-1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.timer-box:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.timer-label {
    font-size: 18px;
    margin-bottom: 40px;
    font-weight: 300;
    color: var(--text-color-2);
    letter-spacing: 2px;
    text-transform: uppercase;
}

.timer-display {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 80px;
    animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

.timer-days {
    font-size: 48px;
    font-weight: 300;
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--bg-color-4);
}

.time-unit-label {
    font-size: 24px;
    color: var(--text-color-2);
}

.timer-time {
    display: flex;
    align-items: center;
    font-size: 80px;
    font-weight: 300;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
    background: linear-gradient(135deg, var(--text-color-1) 0%, var(--bg-color-4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.time-segment {
    min-width: 100px;
    text-align: center;
}

.time-colon {
    opacity: 0.5;
    animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.timer-btn-box {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
}

.timer-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    font-size: 16px;
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
}

.timer-set-btn {
    background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.timer-set-btn:hover {
    background: linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

.timer-reset-btn {
    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

.timer-reset-btn:hover {
    background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
}

.timer-stop-btn {
    background: linear-gradient(135deg, var(--bg-color-5) 0%, #F7B628 100%);
    box-shadow: 0 4px 15px rgba(247, 198, 40, 0.4);
}

.timer-stop-btn:hover {
    background: linear-gradient(135deg, var(--bg-hover-color-2) 0%, var(--bg-color-5) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(247, 198, 40, 0.5);
}

.timer-start-btn {
    background: linear-gradient(135deg, var(--bg-color-4) 0%, var(--bg-color-6) 100%);
    box-shadow: 0 4px 15px rgba(103, 205, 253, 0.4);
}

.timer-start-btn:hover {
    background: linear-gradient(135deg, var(--bg-hover-color-1) 0%, var(--bg-color-4) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(103, 205, 253, 0.5);
}

.timer-btn:active {
    transform: translateY(0);
}

@media (max-width: 768px) {
    .timer-box {
        margin: 12px;
        padding: 24px;
    }

    .timer-time {
        font-size: 56px;
    }

    .time-segment {
        min-width: 70px;
    }

    .timer-btn {
        padding: 12px 24px;
        font-size: 14px;
        min-width: 120px;
    }
}
</style>