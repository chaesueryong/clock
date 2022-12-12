import { createRouter, createWebHistory } from 'vue-router';
import Alarm from '@/views/Alarm.vue';
import Timer from '@/views/Timer.vue';
import StopWatch from '@/views/StopWatch.vue';
import Clock from '@/views/Clock.vue';

const routes = [
  {
    path: '/',
    component: Alarm
  },
  {
    path: '/timer',
    component: Timer
  },
  {
    path: '/stopwatch',
    component: StopWatch
  },
  {
    path: '/clock',
    component: Clock
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
