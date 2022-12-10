<template>
    <div class="header">
        <router-link to="/">
            <div class="header-logo">WWCLOCK</div>
        </router-link>

        <div style="display:flex; gap: 46px">
            <router-link to="/">
                <div class="header-btn">알람</div>
            </router-link>
            <router-link to="/">
                <div class="header-btn">타이머</div>
            </router-link>
            <router-link to="/">
                <div class="header-btn">스톱워치</div>
            </router-link>
            <router-link to="/">
                <div class="header-btn">시계</div>
            </router-link>
        </div>

        <div class="setting"></div>
        <div class="setting"></div>
    </div>
</template>
  
<style>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 67px;
}

.header-logo {
    color: #82D5FC; 
    font-size: 20px;
    cursor: pointer;
}

.header-btn {
    padding: 5px 14px 6px 14px;
    border-radius: 500px;
}

.header-btn:hover {
    background-color: #82D5FC;
    color: #FFFFFF;
}

.setting {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: blanchedalmond;
}
</style>
  