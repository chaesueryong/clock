import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Alarm.vue'

const routes = [
  {
    path: '/',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
