import App2 from './App2.vue'
import User from './pages/user/User'
import Shop from './pages/shop/Shop'
// import Date from './pages/date/Date'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/shop/:shopid(\\d+)', name: 'shop', component: Shop },
  { path: '/user/:username/:date(\\d+)', name: 'user', component: User },
  { path: '/', name: 'index', component: App2 }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
