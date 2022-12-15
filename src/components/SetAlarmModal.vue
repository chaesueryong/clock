<template>
    <div class="set-time-modal">
        <div class="background" @click="closeModal"></div>

        <div class="content">

            <img class="content-x-btn" src="../../public/img/icon/x-icon.svg" @click="closeModal">

            <div class="modal-title">알람설정</div>
            <div class="bar"></div>

            <div class="content-box">
                <div class="content-item-box">
                    <div class="content-item-title">시간선택</div>
                    <div style="display: flex; flex: 1">
                        <select class="select-am-pm" v-model="amPm">
                            <option>오전</option>
                            <option>오후</option>
                        </select>
         
                        <div class="content-time-box" style="margin-right: 7px;">
                            <select class="select-time" v-model="hour">
                                <option>01</option>
                                <option>02</option>
                                <option>03</option>
                                <option>04</option>
                                <option>05</option>
                                <option>06</option>
                                <option>07</option>
                                <option>08</option>
                                <option>09</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                            </select>
                            <div>시</div>
                        </div>
                        <div class="content-time-box">
                            <select class="select-time" v-model="minute">
                                <option>00</option>
                                <option>01</option>
                                <option>02</option>
                                <option>03</option>
                                <option>04</option>
                                <option>05</option>
                                <option>06</option>
                                <option>07</option>
                                <option>08</option>
                                <option>09</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                                <option>13</option>
                                <option>14</option>
                                <option>15</option>
                                <option>16</option>
                                <option>17</option>
                                <option>18</option>
                                <option>19</option>
                                <option>20</option>
                                <option>21</option>
                                <option>22</option>
                                <option>23</option>
                                <option>24</option>
                                <option>25</option>
                                <option>26</option>
                                <option>27</option>
                                <option>28</option>
                                <option>29</option>
                                <option>30</option>
                                <option>31</option>
                                <option>32</option>
                                <option>33</option>
                                <option>34</option>
                                <option>35</option>
                                <option>36</option>
                                <option>37</option>
                                <option>38</option>
                                <option>39</option>
                                <option>40</option>
                                <option>41</option>
                                <option>42</option>
                                <option>43</option>
                                <option>44</option>
                                <option>45</option>
                                <option>46</option>
                                <option>47</option>
                                <option>48</option>
                                <option>49</option>
                                <option>50</option>
                                <option>51</option>
                                <option>52</option>
                                <option>53</option>
                                <option>54</option>
                                <option>55</option>
                                <option>56</option>
                                <option>57</option>
                                <option>58</option>
                                <option>59</option>
                            </select>
                            <div>분</div>
                        </div>
                    </div>
                </div>

                <div class="content-item-box">
                    <div class="content-item-title">알림음</div>
                    <div style="display: flex; flex: 1; align-items: center; justify-content: space-between">
                        <select class="select-alarm-music" v-model="alarmMusic">
                            <option>새소리</option>
                        </select>

                        <div style="display: flex; gap: 2px; margin: 0 auto 0 8px;">
                            <div class="icon-box">
                                <img style="margin-left: 3px;" src="../../public/img/icon/play-icon.svg">
                            </div>

                            <div class="icon-box">
                                <img style="margin-left: 1px;" src="../../public/img/icon/upload-icon.svg">
                            </div>
                        </div>

                        <div style="display: flex; gap: 5px; align-items: center;">
                            <div class="check-icon-box">
                                <img src="../../public/img/icon/check-0-icon.svg">
                            </div>
                            <div style="font-size: 12px; color: #242627">반복재생</div>
                        </div>
                    </div>
                </div>

                <div class="content-item-box">
                    <div class="content-item-title">알람이름</div>
                    <input class="input-alarm-name" placeholder="알람 이름을 입력하세요." v-model="alarmName">
                </div>

            </div>

            <div class="content-btn-box">
                <div class="modal-cancel" @click="closeModal">취소</div>
                <div class="modal-add-alarm-btn" @click="settingAlarm">설정하기</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, onMounted, ref } from "vue";

const amPm = ref('오전');
const hour = ref('01');
const minute = ref('00');
const alarmMusic = ref('새소리');
const alarmName = ref('');

const emit = defineEmits([
  'setAlarm',
  'closeSetAlarmModal'
]);

const closeModal = () => {
    emit('closeSetAlarmModal');
}

const settingAlarm = () => {
    emit('setAlarm', {
        amPm: amPm.value,
        hour: hour.value,
        minute: minute.value,
        alarmMusic: alarmMusic.value,
        alarmName: alarmName.value,
        fullTime: amPm.value === '오전' ?
         hour.value + '-' + minute.value
         : String(Number(hour.value) + 12) + '-' + minute.value
    });
}

onMounted(() => {

})

</script>
  
<style>
.set-time-modal {

}

.background {
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.4;
}

.content {
    z-index: 100;
    position: fixed;
    max-width: 688px;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #F7F7F7;
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
    color: #727270;
    font-size: 14px;
}

.bar {
    border-bottom: 1px solid #BFBFBF;
}

.content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin: 30px 0 22px 0;
    padding: 0 70px;
}


.content-item-box {
    display: flex;
    width: 100%;
    align-items: center;
}


.select-am-pm {
    width: 82px;
    height: 28px;
    text-align: center;
    border-radius: 500px;
    margin-right: auto;
    font-size: 12px;
    border: 0.5px solid #BFBFBF;
}

.select-time {
    width: 113px;
    height: 28px;
    text-align: center;
    border-radius: 500px;
    font-size: 12px;
    border: 0.5px solid #BFBFBF;
}


.content-time-box {
    display: flex;
    align-items: center;
    color: #242627;
    font-size: 14px;
    gap: 5px;
}

.content-item-title {
    width: 95px;
    font-size: 12px;
    color: #242627;
}

.select-alarm-music {
    width: 217px;
    height: 28px;
    border-radius: 500px;
    box-sizing: border-box;
    font-size: 12px;
    padding: 0 16px;
    border: 0.5px solid #BFBFBF;
}

.icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border: 0.5px solid #BFBFBF;
    border-radius: 50%;
    cursor: pointer;
}

.icon-box:hover {
    background-color: #eeeeee;
}

.check-icon-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    border: 0.5px solid #BFBFBF;
    border-radius: 50%;
    cursor: pointer;
}

.check-icon-box:hover { 
    background-color: #eeeeee;
}



.input-alarm-name {
    height: 28px;
    flex: 1;
    border-radius: 500px;
    box-sizing: border-box;
    font-size: 10px;
    border: 0.5px solid #BFBFBF;
    padding: 0 18px;
}


.content-btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
}

.modal-cancel {
    cursor: pointer;
    font-size: 12px;
    color: #727270;
}

.modal-add-alarm-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #67CDFD;
    width: 83px;
    height: 28px;
    border-radius: 500px;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
}


.modal-add-alarm-btn:hover {
    background-color: #67CDFDB8;
}
</style>
  