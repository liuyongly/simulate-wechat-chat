import { createRouter, createWebHistory } from 'vue-router'
import chat from '../views/chat.vue'
import yiyan from '../views/yiyan.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: chat
    },
    {
      path: '/yy',
      name: 'yiyan',
      component: () => yiyan
    }
  ]
})

export default router
