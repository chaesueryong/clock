<template>
    <div class="timer-modal">
        <div class="timer-modal-background" @click="closeModal"></div>

        <div class="timer-modal-content">

            <img class="timer-modal-content-x-btn" src="../../public/img/icon/x-icon.svg" @click="closeModal">

            <div class="timer-modal-title">타이머설정</div>
            <div class="timer-modal-bar"></div>

            <div class="timer-modal-content-box">
                <div class="timer-modal-content-item-box">
                    <div class="timer-modal-content-item-title">시간선택</div>
                    <div style="display: flex; flex: 1">

                        <div class="timer-modal-content-time-box" style="margin-right: 7px;">
                            <select class="timer-modal-select-am-pm" v-model="hours">
                                <option v-for="(item, i) in selectHours" :key="i">{{ item }}</option>
                            </select>
                            <div>시간</div>
                        </div>
         
                        <div class="timer-modal-content-time-box" style="margin-right: 7px;">
                            <select class="timer-modal-select-time" v-model="minutes">
                                <option v-for="(item, i) in selectMinutes" :key="i">{{ item }}</option>
                            </select>
                            <div>분</div>
                        </div>
                        <div class="content-time-box">
                            <select class="timer-modal-select-time" v-model="seconds">
                                <option v-for="(item, i) in selectSeconds" :key="i">{{ item }}</option>
                            </select>
                            <div>초</div>
                        </div>
                    </div>
                </div>

                <div class="timer-modal-content-item-box">
                    <div class="timer-modal-content-item-title">알림음</div>
                    <div style="display: flex; flex: 1; align-items: center; justify-content: space-between">
                        <select class="timer-modal-select-alarm-music" v-model="alarmMusic">
                            <option>새소리</option>
                        </select>

                        <div style="display: flex; gap: 2px; margin: 0 auto 0 8px;">
                            <div class="timer-modal-icon-box">
                                <img style="margin-left: 3px;" src="../../public/img/icon/play-icon.svg">
                            </div>

                            <div class="timer-modal-icon-box">
                                <img style="margin-left: 1px;" src="../../public/img/icon/upload-icon.svg">
                            </div>
                        </div>

                        <div class="timer-modal-repeat-box">
                            <div class="timer-modal-check-icon-box">
                                <img src="../../public/img/icon/check-0-icon.svg">
                            </div>
                            <div>반복재생</div>
                        </div>
                    </div>
                </div>

                <div class="timer-modal-content-item-box">
                    <div class="timer-modal-content-item-title">알람이름</div>
                    <input class="timer-modal-input-alarm-name" placeholder="알람 이름을 입력하세요." v-model="alarmName">
                </div>

            </div>

            <div class="timer-modal-content-btn-box">
                <div class="timer-modal-cancel" @click="closeModal">취소</div>
                <div class="timer-modal-set-timer" @click="setTimer">설정하기</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, onMounted, ref, computed } from "vue";

const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');
const alarmMusic = ref('새소리');
const alarmName = ref('');

const selectHours = computed(() => {
    let arr = [];
    for(let i = 0; i < 100; i++){
        let item = '';
        if(i < 10){
            item = '0';
        }
        item += i;
        arr.push(item);
    }
    return arr;
});

const selectMinutes = computed(() => {
    let arr = [];
    for(let i = 0; i < 60; i++){
        let item = '';
        if(i < 10){
            item = '0';
        }
        item += i;
        arr.push(item);
    }
    return arr;
});

const selectSeconds = computed(() => {
    let arr = [];
    for(let i = 0; i < 60; i++){
        let item = '';
        if(i < 10){
            item = '0';
        }
        item += i;
        arr.push(item);
    }
    return arr;
});

const emit = defineEmits([
  'setTimer',
  'closeTimerModal'
]);

const closeModal = () => {
    emit('closeTimerModal');
}

const setTimer = () => {
    emit('setTimer', {
        hours: Number(hours.value),
        minutes: Number(minutes.value),
        seconds: Number(seconds.value),
        alarmMusic: alarmMusic.value,
        alarmName: alarmName.value
    });
}

onMounted(() => {

})

</script>
  
<style>
.timer-modal {
    position: fixed;
}

.timer-modal-background {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--modal-bg-color-1);
}

.timer-modal-content {
    z-index: 100;
    position: fixed;
    max-width: 688px;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bg-color-2);
    border-radius: 8px;

    padding: 0 23px;
}

.timer-modal-content-x-btn {
    position: absolute;
    top: 16px;
    right: 25px;
    cursor: pointer;
}

.timer-modal-title {
    text-align: center;
    margin: 29px 0 10px 0;
    font-weight: 700;
    color: var(--text-color-2);
    font-size: 14px;
}

.timer-modal-bar {
    border-bottom: 1px solid var(--border-color-2);
}

.timer-modal-content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 30px 0 22px 0;
    padding: 0 70px;
}


.timer-modal-content-item-box {
    display: flex;
    width: 100%;
    align-items: center;
}


.timer-modal-select-am-pm {
    width: 113px;
    height: 28px;
    text-align: center;
    border-radius: 500px;
    margin-right: auto;
    font-size: 12px;
    border: 0.5px solid var(--border-color-2);
    color: #242627;
    background-color: var(--bg-color-7);
}

.timer-modal-select-time {
    width: 113px;
    height: 28px;
    text-align: center;
    border-radius: 500px;
    font-size: 12px;
    border: 0.5px solid var(--border-color-2);
    color: #242627;
    background-color: var(--bg-color-7);
}


.timer-modal-content-time-box {
    display: flex;
    align-items: center;
    color: var(--text-color-1);
    font-size: 14px;
    gap: 5px;
}

.timer-modal-content-item-title {
    width: 95px;
    font-size: 12px;
    color: var(--text-color-1);
}

.timer-modal-select-alarm-music {
    width: 217px;
    height: 28px;
    border-radius: 500px;
    box-sizing: border-box;
    font-size: 12px;
    padding: 0 16px;
    border: 0.5px solid var(--border-color-2);
    color: #242627;
    background-color: var(--bg-color-7);
}

.timer-modal-icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border: 0.5px solid var(--border-color-2);
    border-radius: 50%;
    cursor: pointer;
}

.timer-modal-icon-box:hover {
    background-color: #eeeeee;
}

.timer-modal-check-icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    border: 0.5px solid var(--border-color-2);
    border-radius: 50%;
    cursor: pointer;
}

.timer-modal-check-icon-box:hover { 
    background-color: #eeeeee;
}

.timer-modal-repeat-box {
    display: flex;
    gap: 5px; 
    align-items: center;
    font-size: 12px;
    color: var(--text-color-1);
}



.timer-modal-input-alarm-name {
    height: 28px;
    flex: 1;
    border-radius: 500px;
    box-sizing: border-box;
    font-size: 10px;
    border: 0.5px solid var(--border-color-2);
    padding: 0 18px;
}


.timer-modal-content-btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
}

.timer-modal-cancel {
    cursor: pointer;
    font-size: 12px;
    color: var(--text-color-1);
}

.timer-modal-set-timer {
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


.timer-modal-set-timer:hover {
    background-color: var(--bg-hover-color-1);
}
</style>
  