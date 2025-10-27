<template>
    <div class="alarm-box" :class="[fullScreen ? 'alarm-box-full' : '', route.path === '/clock' ? 'clock-box-clock': '']">

        <div class="option-box">
            <img class="option-img" src="../../../public/img/icon/share-icon.svg">
            <img class="option-img" src="../../../public/img/icon/+-icon.svg">
            <img class="option-img" src="../../../public/img/icon/--icon.svg">
            <img class="option-img" @click="System.toggleScreen()" src="../../../public/img/icon/expansion-icon.svg">
        </div>

        <div></div>

        <div class="main-content">
            <div class="current-alarm-box" v-if="currentAlarm !== null && route.path === '/'">
                <div class="current-alarm">
                    <div class="alarm-label">⏰ 알람</div>
                    <div class="alarm-countdown">
                        <span class="time-unit">{{remainedTime.hours}}</span>
                        <span class="time-separator">:</span>
                        <span class="time-unit">{{remainedTime.minutes}}</span>
                        <span class="time-separator">:</span>
                        <span class="time-unit">{{remainedTime.seconds}}</span>
                    </div>
                    <div class="alarm-time-info">
                        <img class="alarm-icon" src="../../../public/img/icon/alarm-icon.svg" alt="alarm">
                        <div class="alarm-time-text">{{currentAlarm.amPm + ' ' + currentAlarm.hour + ':' + currentAlarm.minute }}</div>
                    </div>
                    <div class="alarm-name" v-if="currentAlarm.alarmName">{{currentAlarm.alarmName}}</div>
                </div>

                <button class="alarm-stop-btn" @click="clearAlarm">
                    <span>⏹</span>
                    <span>중지</span>
                </button>
            </div>

            <div class="clock-box" :class="{'clock-box-alarm': currentAlarm !== null && route.path === '/'}">
                <div class="clock-label">현재시간</div>
                <div class="clock-time">{{currentTime.time}}</div>
                <div class="clock-date">{{currentTime.date}}</div>
                <button class="alarm-add-btn" @click="showSetAlarmModal" v-if="currentAlarm === null && route.path === '/'">
                    <span>⏰</span>
                    <span>알람설정</span>
                </button>
                <button class="alarm-add-btn clock-add-btn" @click="showAddClockModal" v-if="route.path === '/clock'">
                    <span>➕</span>
                    <span>시계 추가</span>
                </button>
            </div>
        </div>

        <div></div>
        <!-- <img class="alarm-down-arrow" src="../../../public/img/icon/down-arrow-icon.svg" v-show="!fullScreen && route.path === '/'"> -->

        <SetTimeModal @setAlarm="setAlarm" @closeSetAlarmModal="closeSetAlarmModal" v-if="setAlarmModalStatus" />
        
        <AlarmModal :destinationAlarm="destinationAlarm" @confirmAlarm="confirmAlarm" @closeConfirmModal="closeConfirmModal" v-if="confirmModalStatus" />

    </div>
</template>

<script setup>
import { onMounted, ref, computed, watchEffect } from 'vue';
import moment from 'moment-timezone';
import SetTimeModal from '@/components/SetAlarmModal.vue';
import AlarmModal from '@/components/ConfirmAlarmModal.vue';
import {LS} from '@/modules/LocalStorage';
import { System } from '@/modules/System';
import { useStore } from 'vuex';
import {useRoute} from 'vue-router';

const store = useStore();
const route = useRoute();

const fullScreen = computed(() => store.state.systemStore.fullScreen);
const currentMoment = computed(() => store.state.systemStore.moment);

const currentTime = ref({})

const setAlarmModalStatus = ref(false);
const confirmModalStatus = ref(false);

const currentAlarm = ref(null);
const remainedTime = ref('');

const destinationAlarm = ref('');

onMounted(() => {
    getAlarm();
});

const clearAlarm = () => {
    currentAlarm.value = null;
    LS.remove(LS.alarm);
}

const getAlarm = () => {
    const alarm = LS.get(LS.alarm, null);
    currentAlarm.value = alarm;
}

const confirmAlarm = () => {
    clearAlarm();
    closeConfirmModal();
}

const setDifftime = (currnetMoment, currentTime) => {
    const t1 = moment(currentTime, 'YYYY-MM-DD HH:mm:ss');
    const t2 = moment(currnetMoment.format("YYYY-MM-DD") + ' ' + currentAlarm.value.fullTime, 'YYYY-MM-DD HH:mm:ss');

    const checkT2 = t2.diff(t1) < 0 ?
        moment(currnetMoment.add(1, 'd').format("YYYY-MM-DD") + ' ' + currentAlarm.value.fullTime, 'YYYY-MM-DD HH:mm:ss')
        : t2;

    const days = moment.duration(checkT2.diff(t1)).days();
    const hours = moment.duration(checkT2.diff(t1)).hours();
    const minutes = moment.duration(checkT2.diff(t1)).minutes();
    const seconds = moment.duration(checkT2.diff(t1)).seconds();

    if(checkT2.diff(t1) <= 0){
        remainedTime.value = {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
        }
        currentAlarm.value = null;
        confirmModalStatus.value = true;
        destinationAlarm.value = checkT2;
    }else {
        remainedTime.value = {
            days: days,
            hours: Number(hours) < 10 ? '0' + hours : hours,
            minutes: Number(minutes) < 10 ? '0' + minutes : minutes,
            seconds: Number(seconds) < 10 ? '0' + seconds : seconds,
        }
    }
}

const getCurrentTime = () => {
    if(currentMoment.value === null){
        return;
    }
    const m = currentMoment.value;
    const amOrPm = m.format("a") === 'am' ? '오전' : '오후';
    const date = m.format("YYYY년 MM월 DD일");
    const time = m.format("hh:mm:ss");
    const dayOfTheWeekArr = ['일', '월', '화', '수', '목', '금', '토'];
    currentTime.value = {
        date: date + ' ' + dayOfTheWeekArr[m.day()],
        time: amOrPm + ' ' + time,
    }
    if(currentAlarm.value !== null){
        setDifftime(m, m.format('YYYY-MM-DD HH:mm:ss'));
    }
};

const showSetAlarmModal = () => {
    setAlarmModalStatus.value = true;
}

const showAddClockModal = () => {

}

const closeSetAlarmModal = () => {
    setAlarmModalStatus.value = false;
}

const closeConfirmModal = () => {
    confirmModalStatus.value = false;
}

const setAlarm = (obj) => {
    currentAlarm.value = obj;
    LS.set(LS.alarm, obj);
    closeSetAlarmModal();
    getCurrentTime();
}

watchEffect(() => {
    getCurrentTime();
})
</script>

<style scoped>
.alarm-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    min-height: 700px;
    background: linear-gradient(135deg, var(--bg-color-1) 0%, var(--bg-color-2) 100%);
    border-radius: 24px;
    margin: 20px auto;
    padding: 24px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.alarm-box:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.alarm-box-full {
    position: fixed;
    width: 100vw !important;
    height: 100vh !important;
    top: 0;
    left: 0;
    margin: 0;
    max-width: none;
    border-radius: 0;
}

.option-box {
    display: flex;
    align-items: center;
    gap: 12px;
    position: absolute;
    top: 23px;
    right: 23px;
}

.option-img {
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 8px;
}

.option-img:hover {
    background-color: var(--bg-color-1);
    transform: scale(1.1);
}

.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.current-alarm-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 60px 0 32px 0;
    animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.current-alarm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 320px;
    height: 320px;
    border: 6px solid var(--bg-color-4);
    box-sizing: border-box;
    border-radius: 50%;
    margin-bottom: 24px;
    color: var(--text-color-1);
    background: linear-gradient(135deg, var(--bg-color-2) 0%, var(--bg-color-1) 100%);
    box-shadow: 0 8px 32px rgba(103, 205, 253, 0.3),
                inset 0 0 20px rgba(103, 205, 253, 0.1);
    animation: pulse-ring 2s ease-in-out infinite;
    position: relative;
}

@keyframes pulse-ring {
    0%, 100% {
        box-shadow: 0 8px 32px rgba(103, 205, 253, 0.3),
                    inset 0 0 20px rgba(103, 205, 253, 0.1);
    }
    50% {
        box-shadow: 0 8px 32px rgba(103, 205, 253, 0.5),
                    inset 0 0 30px rgba(103, 205, 253, 0.2);
    }
}

.alarm-label {
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 300;
    opacity: 0.8;
    letter-spacing: 1px;
}

.alarm-countdown {
    font-size: 52px;
    margin-bottom: 20px;
    font-weight: 300;
    display: flex;
    align-items: center;
    gap: 4px;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
}

.time-unit {
    min-width: 60px;
    text-align: center;
    font-weight: 400;
}

.time-separator {
    opacity: 0.5;
    animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.alarm-time-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.alarm-icon {
    width: 20px;
    height: 20px;
}

.alarm-time-text {
    font-size: 20px;
    font-weight: 300;
}

.alarm-name {
    font-size: 14px;
    color: var(--text-color-2);
    margin-top: 8px;
    font-style: italic;
}

.alarm-stop-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 12px 32px;
    color: white;
    background: linear-gradient(135deg, var(--bg-color-5) 0%, #F7B628 100%);
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(247, 198, 40, 0.4);
}

.alarm-stop-btn:hover {
    background: linear-gradient(135deg, var(--bg-hover-color-2) 0%, var(--bg-color-5) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(247, 198, 40, 0.5);
}

.alarm-stop-btn:active {
    transform: translateY(0);
}

.clock-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: var(--text-color-1);
    padding: 40px;
    animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.clock-label {
    font-size: 1em;
    margin-bottom: 16px;
    font-weight: 300;
    color: var(--text-color-2);
    letter-spacing: 2px;
    text-transform: uppercase;
}

.clock-time {
    font-size: 4.5em;
    margin-bottom: 16px;
    font-weight: 300;
    background: linear-gradient(135deg, var(--text-color-1) 0%, var(--bg-color-4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
}

.clock-date {
    font-size: 1.3em;
    margin-bottom: 48px;
    font-weight: 300;
    color: var(--text-color-2);
}

.clock-box-alarm {
    font-size: 12px;
    color: var(--text-color-3);
    padding: 20px;
}

.clock-box-alarm .clock-time {
    font-size: 3em;
}

.clock-box-clock {
    min-height: 490px;
}

.alarm-add-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 14px 36px;
    color: white;
    background: linear-gradient(135deg, var(--bg-color-4) 0%, var(--bg-color-6) 100%);
    border: none;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(103, 205, 253, 0.4);
}

.alarm-add-btn:hover {
    background: linear-gradient(135deg, var(--bg-hover-color-1) 0%, var(--bg-color-4) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(103, 205, 253, 0.5);
}

.alarm-add-btn:active {
    transform: translateY(0);
}

.clock-add-btn {
    background: linear-gradient(135deg, #5ABD8C 0%, #34A853 100%);
    box-shadow: 0 4px 15px rgba(52, 168, 83, 0.4);
}

.clock-add-btn:hover {
    background: linear-gradient(135deg, #6DD5A1 0%, #5ABD8C 100%);
    box-shadow: 0 6px 20px rgba(52, 168, 83, 0.5);
}

@media (max-width: 768px) {
    .alarm-box {
        margin: 12px;
        min-height: 600px;
    }

    .current-alarm {
        width: 260px;
        height: 260px;
    }

    .alarm-countdown {
        font-size: 42px;
    }

    .time-unit {
        min-width: 50px;
    }

    .clock-time {
        font-size: 3.5em;
    }
}
</style>