<template>
    <div class="header">
        <div class="header-wrap">
            <a href="/" replace>
                <div class="header-logo">WWCLOCK</div>
            </a>

            <div style="display:flex; gap: 46px">
                <router-link to="/">
                    <div class="header-btn" :class="[ route.path === '/' ? 'current-page' : '' ]">알람</div>
                </router-link>
                <router-link to="/timer">
                    <div class="header-btn" :class="[ route.path === '/timer' ? 'current-page' : '' ]">타이머</div>
                </router-link>
                <router-link to="/stopwatch">
                    <div class="header-btn" :class="[ route.path === '/stopwatch' ? 'current-page' : '' ]">스톱워치</div>
                </router-link>
                <router-link to="/clock">
                    <div class="header-btn" :class="[ route.path === '/clock' ? 'current-page' : '' ]">시계</div>
                </router-link>
            </div>

            <div class="setting-box">
                <img class="switch-mode" @click="System.toggleDarkMode()" src="../../public/img/icon/switch-icon.svg" >
                <img class="setting"  src="../../public/img/icon/setting-icon.svg" >
            </div>
        </div>
    </div>
</template>

<script setup>
import { System } from '@/modules/System';
import { onMounted } from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();

onMounted(() => {
    System.init();
})

</script>
  
<style>
.header {
    box-shadow: 0px 2px 4px #00000029;
}

.header-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1036px;
    height: 67px;
    margin: 0 auto;
}

.header-logo {
    color: #82D5FC; 
    font-size: 20px;
    cursor: pointer;
}

.header-btn {
    color: #727270;
    font-weight: 700;
}

.header-btn:hover {
    color: #82D5FC;
}

.current-page {
    color: #82D5FC;
}

.setting-box {
    display: flex;
    gap: 32px;
}

.switch-mode, .setting {
    cursor: pointer;
}

</style>
  