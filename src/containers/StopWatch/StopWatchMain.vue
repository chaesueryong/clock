<template>
    <div class="stop-watch-box">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: 200;">스톱워치</div>

        <div style="font-size: 72px; margin-bottom: 80px; font-weight: 400;">00:00:00</div>
        <div class="alarm-add-btn" @click="showModal">시작</div>

        <div v-if="modalStatus">

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SetTimeModal from '@/components/SetAlarmModal.vue';

const modalStatus = ref(false);

</script>

<style>
.stop-watch-box {
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