<template>
    <div class="alarm-box" :class="[fullScreen ? 'alarm-box-full' : '']">

        <div class="option-box">
            <img class="option-img" src="../../../public/img/icon/share-icon.svg">
            <img class="option-img" src="../../../public/img/icon/+-icon.svg">
            <img class="option-img" src="../../../public/img/icon/--icon.svg">
            <img class="option-img" @click="setFullScreen" src="../../../public/img/icon/expansion-icon.svg">
        </div>

        <div></div>

        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="current-alarm-box" v-if="currentAlarm !== null">
                <div class="current-alarm">
                    <div style="font-size: 14px; margin-bottom: 24px; font-weight: 200;">알람</div>
                    <div style="font-size: 56px; margin-bottom: 25px; font-weight: 400;">{{remainedTime.hours + ':' + remainedTime.minutes + ':' + remainedTime.seconds}}</div>
                    <div style="display: flex; align-items: center;">
                        <img style="margin-right: 5px;" src="../../../public/img/icon/alarm-icon.svg">
                        <div style="font-size: 20px; font-weight: 200;">{{currentAlarm.amPm + ' ' + currentAlarm.hour + ':' + currentAlarm.minute }}</div>
                    </div>
                </div>

                <div class="alarm-stop-btn" @click="clearAlarm">중지</div>
            </div>

            <div class="clock-box" :class="[currentAlarm !== null ? 'clock-box-alarm' : '']">
                <div style="font-size: 1em; margin-bottom: 12px; font-weight: 200;">현재시간</div>
                <div style="font-size: 4em; margin-bottom: 20px; font-weight: 400;">{{currentTime.time}}</div>
                <div style="font-size: 1.2em; margin-bottom: 58px; font-weight: 200;">{{currentTime.date}}</div>
                <div class="alarm-add-btn" @click="showModal" v-if="currentAlarm === null">알람설정</div>
            </div>
        </div>

        <div v-show="fullScreen"></div>
        <img class="alarm-down-arrow" src="../../../public/img/icon/down-arrow-icon.svg" v-show="!fullScreen">

        <SetTimeModal @setAlarm="setAlarm" @closeSetAlarmModal="closeSetAlarmModal" v-if="setAlarmModalStatus" />
        
        <AlarmModal :destinationAlarm="destinationAlarm" @confirmAlarm="confirmAlarm" @closeConfirmModal="closeConfirmModal" v-if="confirmModalStatus" />

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment-timezone';
import SetTimeModal from '@/components/SetAlarmModal.vue';
import AlarmModal from '@/components/ConfirmAlarmModal.vue';
import {LS} from '@/modules/LocalStorage';

const fullScreen = ref(false);

const currentTime = ref({});

const setAlarmModalStatus = ref(false);
const confirmModalStatus = ref(false);

const currentAlarm = ref(null);
const currentSetInterVal = ref(null);
const remainedTime = ref('');

const destinationAlarm = ref('');

onMounted(() => {
    getAlarm();
    setCurrentTime();
    window.addEventListener('resize', function () {
        if ((screen.availHeight || screen.height - 30) <= window.innerHeight) {
            fullScreen.value = true;
        }
        else {
            fullScreen.value = false;
        }
    });
})

const setFullScreen = () => {
    fullScreen.value = !fullScreen.value;
    if(fullScreen.value === true){
        document.documentElement.requestFullscreen();
    }else{
        document.exitFullscreen();
    }
}

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

const setCurrentTime = () => {
    getCurrentTime();
    currentSetInterVal.value = setInterval(() => {
        getCurrentTime();
    }, 1000);
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
    const m = moment().tz("Asia/Seoul");
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

const showModal = () => {
    setAlarmModalStatus.value = true;
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
</script>

<style>
.alarm-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    max-width: 1036px;
    height: 696px;
    background-color: var(--bg-color-1);
    border-radius: 8px;
    margin: 12px auto 18px auto;
}

.alarm-box-full {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    margin: 0;
    max-width: none;
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
}

.current-alarm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 279px;
    height: 279px;
    border: 8px solid var(--border-color-1);
    box-sizing: border-box;
    border-radius: 50%;
    margin-bottom: 10px;
    color: var(--text-color-2);
}

.alarm-stop-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 32px;
    color: white;
    background-color: var(--bg-color-5);
    border-radius: 500px;
    font-size: 14px;
    cursor: pointer;
}

.alarm-stop-btn:hover {
    background-color: var(--bg-hover-color-2);
}

.current-alarm-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 110px 0 42px 0;
}

.clock-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: var(--text-color-1);
}

.clock-box-alarm {
    font-size: 10px;
    color: var(--text-color-2);
}

.alarm-down-arrow {
    margin-bottom: 30px;
}

.alarm-add-btn {
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

.alarm-add-btn:hover {
    background-color: var(--bg-hover-color-1);
}
</style>