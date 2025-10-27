<template>
    <div class="stop-watch-box">
        <div class="stop-watch-label">⏱️ 스톱워치</div>

        <div class="stop-watch-display">
            <div class="main-time">
                <span class="time-main">{{ displayTime.minutes }}:{{ displayTime.seconds }}</span>
                <span class="time-ms">.{{ displayTime.milliseconds }}</span>
            </div>
        </div>

        <div class="stop-watch-btn-box">
            <button class="sw-btn sw-record-btn" v-if="isRecord" @click="recordStopWatch">
                <span>📝</span>
                <span>기록</span>
            </button>
            <button class="sw-btn sw-stop-btn" v-if="isStop" @click="stopStopWatch">
                <span>⏸</span>
                <span>중지</span>
            </button>
            <button class="sw-btn sw-reset-btn" v-if="isReset" @click="resetStopWatch">
                <span>🔄</span>
                <span>초기화</span>
            </button>
            <button class="sw-btn sw-start-btn" v-if="isStart" @click="startStopWatch()">
                <span>{{ startBtn === '시작' ? '▶️' : '▶️' }}</span>
                <span>{{ startBtn }}</span>
            </button>
        </div>

        <div class="lap-times-container" v-if="lapTimes.length > 0">
            <div class="lap-times-header">
                <h3>랩 타임 기록</h3>
                <button class="clear-laps-btn" @click="clearLaps" title="기록 지우기">🗑️</button>
            </div>
            <div class="lap-times-list">
                <div class="lap-item" v-for="(lap, index) in lapTimes" :key="index" :class="{'fastest': lap.isFastest, 'slowest': lap.isSlowest}">
                    <div class="lap-number">#{{ lapTimes.length - index }}</div>
                    <div class="lap-time">{{ lap.time }}</div>
                    <div class="lap-diff" v-if="lap.diff">{{ lap.diff }}</div>
                </div>
            </div>
        </div>
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
const lapTimes = ref([]);
const lastLapTime = ref(0);

onMounted(() => {
    getTimer();
    loadLapTimes();
});

const recordStopWatch = () => {
    const currentTimeMs = pauseTime.value - startTime.value;
    const lapTimeMs = currentTimeMs - lastLapTime.value;

    const lapTime = formatTime(lapTimeMs);
    const totalTime = formatTime(currentTimeMs);

    let diff = '';
    if (lapTimes.value.length > 0) {
        const prevLapMs = lapTimes.value[0].ms;
        const diffMs = lapTimeMs - prevLapMs;
        diff = (diffMs >= 0 ? '+' : '') + formatTimeDiff(Math.abs(diffMs));
    }

    lapTimes.value.unshift({
        time: lapTime,
        totalTime: totalTime,
        ms: lapTimeMs,
        diff: diff,
        isFastest: false,
        isSlowest: false
    });

    lastLapTime.value = currentTimeMs;
    saveLapTimes();
    updateLapHighlights();
};

const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    const m = minutes < 10 ? "0" + minutes : minutes;
    const s = seconds < 10 ? "0" + seconds : seconds;
    const msStr = milliseconds < 10 ? "0" + milliseconds : milliseconds;

    return `${m}:${s}.${msStr}`;
};

const formatTimeDiff = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds < 10 ? "0" + milliseconds : milliseconds}s`;
};

const updateLapHighlights = () => {
    if (lapTimes.value.length < 2) return;

    let fastestMs = Infinity;
    let slowestMs = 0;
    let fastestIndex = -1;
    let slowestIndex = -1;

    lapTimes.value.forEach((lap, index) => {
        lap.isFastest = false;
        lap.isSlowest = false;
        if (lap.ms < fastestMs) {
            fastestMs = lap.ms;
            fastestIndex = index;
        }
        if (lap.ms > slowestMs) {
            slowestMs = lap.ms;
            slowestIndex = index;
        }
    });

    if (fastestIndex >= 0) lapTimes.value[fastestIndex].isFastest = true;
    if (slowestIndex >= 0) lapTimes.value[slowestIndex].isSlowest = true;
};

const clearLaps = () => {
    lapTimes.value = [];
    lastLapTime.value = 0;
    saveLapTimes();
};

const saveLapTimes = () => {
    LS.set('stopwatch_laps', lapTimes.value);
    LS.set('stopwatch_last_lap', lastLapTime.value);
};

const loadLapTimes = () => {
    const savedLaps = LS.get('stopwatch_laps', null);
    const savedLastLap = LS.get('stopwatch_last_lap', null);
    if (savedLaps) {
        lapTimes.value = savedLaps;
        updateLapHighlights();
    }
    if (savedLastLap) {
        lastLapTime.value = savedLastLap;
    }
};

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

    clearLaps();
};

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

<style scoped>
.stop-watch-box {
    display: flex;
    flex-direction: column;
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

.stop-watch-box:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.stop-watch-label {
    font-size: 18px;
    margin-bottom: 40px;
    font-weight: 300;
    color: var(--text-color-2);
    letter-spacing: 2px;
    text-transform: uppercase;
}

.stop-watch-display {
    margin-bottom: 60px;
    animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

.main-time {
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.time-main {
    font-size: 80px;
    font-weight: 300;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
    background: linear-gradient(135deg, var(--text-color-1) 0%, var(--bg-color-4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.time-ms {
    font-size: 36px;
    font-weight: 300;
    color: var(--text-color-2);
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
}

.stop-watch-btn-box {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 40px;
}

.sw-btn {
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
    min-width: 130px;
}

.sw-record-btn {
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.sw-record-btn:hover {
    background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.sw-stop-btn {
    background: linear-gradient(135deg, var(--bg-color-5) 0%, #F7B628 100%);
    box-shadow: 0 4px 15px rgba(247, 198, 40, 0.4);
}

.sw-stop-btn:hover {
    background: linear-gradient(135deg, var(--bg-hover-color-2) 0%, var(--bg-color-5) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(247, 198, 40, 0.5);
}

.sw-reset-btn {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.sw-reset-btn:hover {
    background: linear-gradient(135deg, #F87171 0%, #EF4444 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}

.sw-start-btn {
    background: linear-gradient(135deg, var(--bg-color-4) 0%, var(--bg-color-6) 100%);
    box-shadow: 0 4px 15px rgba(103, 205, 253, 0.4);
}

.sw-start-btn:hover {
    background: linear-gradient(135deg, var(--bg-hover-color-1) 0%, var(--bg-color-4) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(103, 205, 253, 0.5);
}

.sw-btn:active {
    transform: translateY(0);
}

.lap-times-container {
    width: 100%;
    max-width: 600px;
    margin-top: 20px;
}

.lap-times-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 16px;
}

.lap-times-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color-1);
    margin: 0;
}

.clear-laps-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.clear-laps-btn:hover {
    background-color: var(--bg-color-1);
    transform: scale(1.1);
}

.lap-times-list {
    max-height: 300px;
    overflow-y: auto;
    background-color: var(--bg-color-2);
    border-radius: 16px;
    padding: 8px;
}

.lap-times-list::-webkit-scrollbar {
    width: 8px;
}

.lap-times-list::-webkit-scrollbar-track {
    background: var(--bg-color-1);
    border-radius: 4px;
}

.lap-times-list::-webkit-scrollbar-thumb {
    background: var(--bg-color-4);
    border-radius: 4px;
}

.lap-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 4px;
    background-color: var(--bg-color-1);
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.lap-item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lap-item.fastest {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, var(--bg-color-1) 100%);
    border-left: 4px solid #10B981;
}

.lap-item.slowest {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, var(--bg-color-1) 100%);
    border-left: 4px solid #EF4444;
}

.lap-number {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color-2);
    min-width: 40px;
}

.lap-time {
    font-size: 18px;
    font-weight: 500;
    color: var(--text-color-1);
    flex: 1;
    text-align: center;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
}

.lap-diff {
    font-size: 14px;
    color: var(--text-color-2);
    min-width: 80px;
    text-align: right;
}

@media (max-width: 768px) {
    .stop-watch-box {
        margin: 12px;
        padding: 24px;
    }

    .time-main {
        font-size: 56px;
    }

    .time-ms {
        font-size: 28px;
    }

    .sw-btn {
        padding: 12px 24px;
        font-size: 14px;
        min-width: 110px;
    }

    .lap-times-list {
        max-height: 200px;
    }

    .lap-time {
        font-size: 16px;
    }
}
</style>