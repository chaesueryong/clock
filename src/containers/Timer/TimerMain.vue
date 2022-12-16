<template>
    <div class="timer-box">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">타이머</div>

        <div style="font-size: 72px; margin-bottom: 80px; font-weight: 400;">00:00:00</div>
        <div class="alarm-add-btn" @click="showModal">타이머설정</div>

        <div v-if="modalStatus">
            <SetTimeModal @addAlarm="addAlarm" @closeModal="closeModal" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SetTimeModal from '@/components/SetAlarmModal.vue';

const modalStatus = ref(false);

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

</style>