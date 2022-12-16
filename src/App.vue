<template>
  <div class="app">
    <HeaderVue />

    <router-view/>
  </div>
</template>

<script setup>
import HeaderVue from './components/Header.vue';
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  line-height: 1;
}

div {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  height: 100%;
}

.app {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'AppleSDGothicNeo', 'Noto Sans KR', sans-serif;
  height: 100%;
  background-color: var(--bg-color-2);
}

a:-webkit-any-link {
    cursor: pointer;
    text-decoration: none;
}

a:link {
    color: black;
    text-decoration: none;
}

a:visited {
    color: black;
    text-decoration: none;
}

a:hover {
    color: black;
    text-decoration: none;
}

a:active {
    color: black;
    text-decoration: none;
}

select {
  -webkit-appearance: none; /* for chrome */
  -moz-appearance: none; /*for firefox*/
  appearance: none;
  background: url('../public/img/icon/drop-down-arrow-icon.svg') no-repeat right 10px center/10px auto;
  cursor: pointer;
  padding: 0 25px 0 10px;
}

select:focus {
    outline: none;
}


:root {
  --bg-color-1: #F7F7F7;
  --bg-color-2: #FFFFFF;
  --bg-color-3: #A0A0A0;
  --bg-color-4: #67CDFD;
  --bg-color-5: #F7C628;
  --bg-color-6: #0088C7;
  --bg-color-7: #FFFFFF;
  --bg-hover-color-1: #8FD9FB;
  --bg-hover-color-2: #F7D461;
  --bg-hover-color-3: #B8B8B8;
  --bg-hover-color-4: #3FA1CE;
  --border-color-1: #67CDFD3D;
  --border-color-2: #BFBFBF;
  --text-color-1: #242627;
  --text-color-2: #727270;

  --modal-bg-color-1: #45454580;
}

:root.dark {
  --bg-color-1: #464849;
  --bg-color-2: #242627;
  --bg-color-3: #A0A0A0;
  --bg-color-4: #67CDFD;
  --bg-color-5: #F7C628;
  --bg-color-6: #0088C7;
  --bg-color-7: #F7F7F7;
  --bg-hover-color-1: #8FD9FB;
  --bg-hover-color-2: #F7D461;
  --bg-hover-color-3: #B8B8B8;
  --bg-hover-color-4: #3FA1CE;
  --border-color-1: #67CDFD3D;
  --border-color-2: #DEDEDE;
  --text-color-1: #FFFFFF;
  --text-color-2: #BFBFBF;
}



</style>
