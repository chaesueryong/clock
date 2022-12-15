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

.app {
  font-family: 'AppleSDGothicNeo', 'Noto Sans KR', sans-serif;
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
  --bg-color-2: #F7F7F7;
  --bg-color-3: #F7F7F7;
  --bg-color-4: #F7F7F7;
  --bg-color-5: #F7F7F7;
  --bg-color-6: #F7F7F7;
  --bg-color-7: #F7F7F7;
  --bg-color-8: #F7F7F7;
  --bg-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
  --text-color-9: #F7F7F7;
}

:root.dark {
  --bg-color-1: gray;
}



</style>
