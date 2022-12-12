<template>
    <div class="alarm-box">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">현재시간</div>
        <div style="font-size: 72px; margin-bottom: 20px; font-weight: 400;">{{currentTime.time}}</div>
        <div style="font-size: 20px; margin-bottom: 58px; font-weight: 200;">{{currentTime.date}}</div>
        <div class="alarm-add-btn" @click="showModal">알람설정</div>

        <div v-if="modalStatus">
            <SetTimeModal @addAlarm="addAlarm" @closeModal="closeModal" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment-timezone';
import SetTimeModal from '@/components/SetTimeModal.vue';

const currentTime = ref({});
const modalStatus = ref(false);

onMounted(() => {
    getCurrentTime();
    setInterval(() => {
        getCurrentTime();
    }, 1000);
})

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
};

const showModal = () => {
    modalStatus.value = true;
}

const closeModal = () => {
    modalStatus.value = false;
}

const addAlarm = () => {
    console.log('addAlarm');
}
</script>

<style>
.alarm-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1036px;
    height: 587px;
    background-color: #F7F7F7;
    border-radius: 28px;
    margin: 12px auto 8px auto;
}

.alarm-add-btn {
    display: flex;
    font-size: 14px;
    padding: 10px 26px;
    color: white;
    background-color: #67CDFD;
    border-radius: 500px;
    font-weight: 700;
    cursor: pointer;
}

.alarm-add-btn:hover {
    background-color: #67CDFDB8;
}
</style>