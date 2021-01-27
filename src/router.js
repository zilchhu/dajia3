// import App2 from './App2.vue'
import User from './pages/user/User'
import Shop from './pages/shop/Shop'
import Tools from './pages/tools/Tools'
import ToolsFreshMt from './pages/tools/ToolsFreshMt'
import ToolsTests from './pages/tools/ToolsTests'
import Date from './pages/date/Date'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/shop/:shopid(\\d+)', name: 'shop', component: Shop },
  { path: '/user/:username/:date(\\d+)', name: 'user', component: User },
  {
    path: '/tools',
    component: Tools,
    name: 'tools',
    children: [
      { path: 'fresh/mt', name: 'tools-fresh-mt', component: ToolsFreshMt },
      { path: 'tests', name: 'tools-tests', component: ToolsTests }
    ]
  },
  {path: '/date/:day', name: 'date', component: Date},
  { path: '/', name: 'index', redirect: '/date/1' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
