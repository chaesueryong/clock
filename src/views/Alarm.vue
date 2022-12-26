<template>
    <div class="alarm">

        <AlarmClock />
        <!-- <AlarmList /> -->

    </div>
</template>

<script setup>
import AlarmClock from '@/containers/Alarm/AlarmClock.vue';
import AlarmList from '@/containers/Alarm/AlarmList.vue';

</script>

<style>
.alarm {
    overflow: auto;
}

</style>