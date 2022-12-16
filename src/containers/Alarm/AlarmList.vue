<template>
    <div class="alarm-list" style="margin: 0 auto 0 auto;">

        <div class="alarm-list-title">최근에 사용한 알람</div>
        <div class="alarm-list-box">
            <div class="alarm-item-box">
                <div style="flex: 1;">알람이름</div>
                <div style="flex: 1">알람시간</div>
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
.alarm-list {
    display: flex;
    flex-direction: column;
    max-width: 1036px;
    height: auto;
    background-color: var(--bg-color-1);
    border-radius: 8px;
}


.alarm-list-title {
    display: inline-block;
    width: 100%;
    font-size: 20px;
    text-align: center;
    color: var(--text-color-2);
    margin: 24px 0 56px 0;
}

.alarm-list-box {
    padding: 0 180px;
}

.alarm-item-box {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-color-2);
}

.delete-alarm-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    width: 100px;
    height: 30px;
    background-color: var(--bg-color-3);
    color: white;
    border-radius: 500px;
    margin: 60px 0 30px 0;
    align-self: center;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
}

.delete-alarm-btn:hover {
    background-color: var(--bg-hover-color-3);
}
</style>