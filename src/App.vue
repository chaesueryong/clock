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
  cursor: pointer;
}

select:focus {
    outline: none;
}
</style>
