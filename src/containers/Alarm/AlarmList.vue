<template>
    <div class="alarm-list" style="margin: 0 auto 0 auto;">

        <div class="alarm-list-title">최근에 사용한 알람</div>
        <div class="alarm-list-box">
            <div class="alarm-item-box" style="font-size: 14px; font-weight: 700; color: #727270;">
                <div style="flex: 1"></div>
                <div style="flex: 4; text-align: left;">알람이름</div>
                <div style="flex: 2">알람시간</div>
                <div style="flex: 3">설정시간</div>
                <div style="flex: 3">종료시간</div>
            </div>

            <div class="bar" style="margin: 6px 0 6px 0"></div>

            <div class="alarm-item-list">
                <AlarmItem />
                <AlarmItem />
                <AlarmItem />
                <AlarmItem />
            </div>
        </div>

        <div class="delete-alarm-btn">알람삭제</div>
    </div>
</template>

<script setup>
import AlarmItem from '@/components/AlarmItem.vue';


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
}

.alarm-list {
    max-width: 1036px;
    height: 587px;
    background-color: #F7F7F7;
    border-radius: 28px;

    display: flex;
    flex-direction: column;
}


.alarm-list-title {
    display: inline-block;
    width: 100%;
    font-size: 20px;
    text-align: center;
    color: #727270;
    margin: 24px 0 56px 0;
}

.alarm-list-box {
    padding: 0 180px;
}

.delete-alarm-btn {
    background-color: gray;
    color: white;
    border-radius: 500px;
    padding: 9px 18px;
    margin: auto 0 30px 0;
    align-self: center;
    cursor: pointer;
}
</style>