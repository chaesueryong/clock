<template>
    <div class="alarm" style="margin-bottom: 8px;">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">현재시간</div>
        <div style="font-size: 72px; margin-bottom: 20px; font-weight: 400;">{{currentTime.time}}</div>
        <div style="font-size: 20px; margin-bottom: 58px; font-weight: 200;">{{currentTime.date}}</div>
        <div class="alarm-setting-btn">알람설정</div>
    </div>

    <div class="alarm"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment-timezone';

const currentTime = ref({});

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
</script>

<style>
.alarm {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 587px;
    background-color: #F7F7F7;
    border-radius: 28px;
}

.alarm-setting-btn {
    display: flex;
    font-size: 12px;
    padding: 7px 22px;
    color: #727270;
    border-radius: 500px;
    border: 1px solid #707070;
    font-weight: 400;
    cursor: pointer;
}

.alarm-setting-btn:hover {
    background-color: #727270;
    color: white;
}
</style>