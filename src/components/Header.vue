<template>
    <div class="header">
        <div class="header-wrap">
            <router-link to="/" class="logo-link">
                <div class="header-logo">
                    <span class="logo-icon">⏰</span>
                    <span class="logo-text">WWCLOCK</span>
                </div>
            </router-link>

            <nav class="nav-menu">
                <router-link to="/" class="nav-link">
                    <div class="header-btn" :class="{ 'current-page': route.path === '/' }">
                        <span class="nav-icon">⏰</span>
                        <span>알람</span>
                    </div>
                </router-link>
                <router-link to="/timer" class="nav-link">
                    <div class="header-btn" :class="{ 'current-page': route.path === '/timer' }">
                        <span class="nav-icon">⏲️</span>
                        <span>타이머</span>
                    </div>
                </router-link>
                <router-link to="/stopwatch" class="nav-link">
                    <div class="header-btn" :class="{ 'current-page': route.path === '/stopwatch' }">
                        <span class="nav-icon">⏱️</span>
                        <span>스톱워치</span>
                    </div>
                </router-link>
                <router-link to="/clock" class="nav-link">
                    <div class="header-btn" :class="{ 'current-page': route.path === '/clock' }">
                        <span class="nav-icon">🌍</span>
                        <span>시계</span>
                    </div>
                </router-link>
            </nav>

            <div class="setting-box">
                <button
                    class="icon-btn"
                    @click="System.toggleDarkMode()"
                    title="다크모드 전환"
                    aria-label="Toggle dark mode">
                    <img class="icon-img" src="../../public/img/icon/switch-icon.svg" alt="Dark mode toggle">
                </button>
                <button
                    class="icon-btn"
                    @click="openSettings"
                    title="설정"
                    aria-label="Open settings">
                    <img class="icon-img" src="../../public/img/icon/setting-icon.svg" alt="Settings">
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { System } from '@/modules/System';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
    System.init();
});

const openSettings = () => {
    // TODO: 설정 모달 구현
    console.log('Settings opened');
};
</script>
  
<style scoped>
.header {
    background-color: var(--bg-color-2);
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all 0.3s ease;
}

.header-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    height: 70px;
    margin: 0 auto;
    padding: 0 24px;
}

.logo-link {
    text-decoration: none;
    transition: transform 0.3s ease;
}

.logo-link:hover {
    transform: scale(1.05);
}

.header-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--bg-color-4);
    font-size: 24px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logo-icon {
    font-size: 28px;
    animation: pulse 2s ease-in-out infinite;
}

.logo-text {
    background: linear-gradient(135deg, #67CDFD 0%, #0088C7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

.nav-menu {
    display: flex;
    gap: 12px;
}

.nav-link {
    text-decoration: none;
    transition: transform 0.2s ease;
}

.nav-link:hover {
    transform: translateY(-2px);
}

.header-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-color-2);
    font-weight: 600;
    font-size: 15px;
    padding: 10px 18px;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.header-btn:hover {
    color: var(--bg-color-4);
    background-color: var(--bg-color-1);
}

.header-btn::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--bg-color-4), var(--bg-color-6));
    transform: translateX(-50%);
    transition: width 0.3s ease;
}

.current-page {
    color: var(--bg-color-4);
    background-color: var(--bg-color-1);
    font-weight: 700;
}

.current-page::after {
    width: 60%;
}

.nav-icon {
    font-size: 18px;
    transition: transform 0.3s ease;
}

.header-btn:hover .nav-icon {
    transform: scale(1.2);
}

.setting-box {
    display: flex;
    gap: 16px;
    align-items: center;
}

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background-color: var(--bg-color-1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}

.icon-btn:hover {
    background-color: var(--bg-color-4);
    transform: rotate(15deg) scale(1.1);
}

.icon-btn:active {
    transform: rotate(15deg) scale(0.95);
}

.icon-img {
    width: 20px;
    height: 20px;
    transition: filter 0.3s ease;
}

.icon-btn:hover .icon-img {
    filter: brightness(1.2);
}

@media (max-width: 768px) {
    .header-wrap {
        padding: 0 16px;
        height: 60px;
    }

    .header-logo {
        font-size: 20px;
    }

    .logo-icon {
        font-size: 24px;
    }

    .nav-menu {
        gap: 8px;
    }

    .header-btn {
        padding: 8px 12px;
        font-size: 14px;
    }

    .nav-icon {
        display: none;
    }

    .setting-box {
        gap: 12px;
    }

    .icon-btn {
        width: 36px;
        height: 36px;
    }
}
</style>
  