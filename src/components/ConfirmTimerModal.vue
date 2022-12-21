<template>
    <div class="confirm-alarm-modal">
        <div class="confirm-alarm-background" @click="confirmTimer"></div>

        <div class="confirm-alarm-content">

            <img class="content-x-btn" src="../../public/img/icon/x-icon.svg" @click="confirmTimer">

            <div class="modal-title">타이머</div>
            <div class="bar"></div>

            <div class="confirm-alarm-content-box">
                <img style="margin-bottom: 31px" src="../../public/img/icon/alarm-1-icon.svg">
                <div style="font-size: 36px;">Time's up</div>
                <div>{{setteingTime}}</div>
            </div>

            <div class="confirm-alarm-content-btn-box">
                <div class="confirm-alarm-btn" @click="confirmTimer">확인</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, ref } from "vue";

const setteingTime = ref('00:00:00');

onMounted(() => {
    if(props.settingTimer){
        const hours = props.settingTimer.hours < 10 ? '0' + props.settingTimer.hours : props.settingTimer.hours;
        const minutes = props.settingTimer.minutes < 10 ? '0' + props.settingTimer.minutes : props.settingTimer.minutes;
        const seconds = props.settingTimer.seconds < 10 ? '0' + props.settingTimer.seconds : props.settingTimer.seconds;

        setteingTime.value = hours + ':' + minutes + ':' + seconds;
    }
})

const props = defineProps([
    'settingTimer'
]);

const emit = defineEmits([
    'confirmTimer',
]);

const confirmTimer = () => {
    emit('confirmTimer');
}


</script>
  
<style>
.confirm-alarm-modal {
    position: fixed;
}

.confirm-alarm-background {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--modal-bg-color-1);
}

.confirm-alarm-content {
    z-index: 100;
    position: fixed;
    max-width: 512px;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bg-color-2);
    border-radius: 8px;

    padding: 0 23px;
}

.content-x-btn {
    position: absolute;
    top: 16px;
    right: 25px;
    cursor: pointer;
}

.modal-title {
    text-align: center;
    margin: 29px 0 10px 0;
    font-weight: 700;
    color: var(--text-color-2);
    font-size: 14px;
}

.bar {
    border-bottom: 1px solid var(--border-color-2);
}

.confirm-alarm-content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 50px 0 30px 0;
    padding: 0 70px;
    color: var(--text-color-3);
}


.confirm-alarm-content-btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
}

.confirm-alarm-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: var(--bg-color-4);
    width: 83px;
    height: 28px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
}


.confirm-alarm-btn:hover {
    background-color: var(--bg-hover-color-1);
}
</style>
  