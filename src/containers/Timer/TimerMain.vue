<template>
    <div class="timer-box">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">타이머</div>

        <div style="font-size: 72px; margin-bottom: 80px; font-weight: 400;">
            {{ remainedTime.hours + ':' + remainedTime.minutes + ':' + remainedTime.seconds }}
        </div>
        <div class="open-timer-modal-btn" style="margin-bottom: 5px" @click="showTimerModal">타이머설정</div>
        <div class="stop-timer-btn" @click="clearTimer">취소</div>

        <SetTimerModal @setTimer="setTimer" @closeTimerModal="closeTimerModal" v-if="timerModalStatus" />

        <ConfirmTimerModal @confirmTimer="confirmTimer" :settingTimer="timerObj" v-if="confirmTimerModalStatus" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment-timezone';
import SetTimerModal from '@/components/SetTimerModal.vue';
import ConfirmTimerModal from '@/components/ConfirmTimerModal.vue';
import { LS } from '../../modules/LocalStorage';

const store = useStore();

const timerModalStatus = ref(false);
const confirmTimerModalStatus = ref(false);

const currentMoment = computed(() => store.state.systemStore.moment);

const endMoment = ref(null);
const remainedTime = ref({
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
        });

const timerObj = ref(null);

const showTimerModal = () => {
    return;
    timerModalStatus.value = true;
}

const closeTimerModal = () => {
    timerModalStatus.value = false;
}

const setTimer = (obj) => {
    console.log(currentMoment)
    const m = currentMoment.value;
    m.add(obj.hours, 'hours');
    m.add(obj.minutes, 'minutes');
    m.add(obj.seconds, 'seconds');
    endMoment.value = m;
    console.log(endMoment.value.format('YYYY-MM-DD HH:mm:ss'))
    timerObj.value = obj;

    LS.set(LS.timer, obj);
    closeTimerModal();
}

const confirmTimer = () => {
    confirmTimerModalStatus.value = false;
    clearTimer();
}

const clearTimer = () => {
    return;
    LS.remove(LS.timer);
}

const getTimer = () => {
    const timer = LS.get(LS.timer, null);
    console.log(timer);
    if(timer !== null){
        console.log('asdfasdf');
        const m = currentMoment.value.clone();
        m.add(timer.hours, 'hours');
        m.add(timer.minutes, 'minutes');
        m.add(timer.seconds, 'seconds');
        endMoment.value = m;
    }

    timerObj.value = timer;
}

const updateTimer = () => {
    if(timerObj.value === null){
        return;
    }

    console.log(currentMoment.value.format('YYYY-MM-DD HH:mm:ss'))
    console.log(endMoment.value.format('YYYY-MM-DD HH:mm:ss'))

    timerDiff();
}

const timerDiff = () => {
    const t1 = moment(currentMoment.value.format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
    const t2 = moment(endMoment.value.format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');

    const days = moment.duration(t2.diff(t1)).days();
    const hours = moment.duration(t2.diff(t1)).hours();
    const minutes = moment.duration(t2.diff(t1)).minutes();
    const seconds = moment.duration(t2.diff(t1)).seconds();

    if(t2.diff(t1) <= 0){
        remainedTime.value = {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
        }
        timerObj.value = null;
        confirmTimerModalStatus.value = true;
    }else {
        remainedTime.value = {
            days: days,
            hours: Number(hours) < 10 ? '0' + hours : hours,
            minutes: Number(minutes) < 10 ? '0' + minutes : minutes,
            seconds: Number(seconds) < 10 ? '0' + seconds : seconds,
        }
    }
}

onMounted(() => {
    getTimer();
});

watchEffect(() => {
    updateTimer();
})

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