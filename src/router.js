// import App2 from './App2.vue'
import User from './pages/user/User'
import UserActsOvTable from './pages/user/UserActsOvTable'
import Shop from './pages/shop/Shop'
import FreshShop from './pages/shop/FreshShop'
import Tools from './pages/tools/Tools'
import ToolsAddFresh from './pages/tools/ToolsAddFresh'
import ToolsAddFengniao from './pages/tools/ToolsAddFengniao'
import ToolsFreshMt from './pages/tools/ToolsFreshMt'
import ToolsFreshElm from './pages/tools/ToolsFreshElm'
import ToolsTests from './pages/tools/ToolsTests'
import Date from './pages/date/Date'
import Sum from './pages/date/Sum'
import Sum2 from './pages/date/Sum2'
import Perf from './pages/date/Perf'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/shop/:shopid(\\d+)', name: 'shop', component: Shop },
  { path: '/user/:username/:date(\\d+)', name: 'user', component: User },
  { path: '/user/:username/acts', name: 'user-acts', component: UserActsOvTable },
  {
    path: '/tools',
    component: Tools,
    name: 'tools',
    children: [
      { path: 'add/fresh', name: 'tools-add-fresh', component: ToolsAddFresh },
      { path: 'add/fengniao', name: 'tools-add-fengniao', component: ToolsAddFengniao },
      { path: 'fresh/mt', name: 'tools-fresh-mt', component: ToolsFreshMt },
      { path: 'fresh/elm', name: 'tools-fresh-elm', component: ToolsFreshElm },
      { path: 'tests', name: 'tools-tests', component: ToolsTests }
    ]
  },
  {path: '/date/:day', name: 'date', component: Date},
  {path: '/sum/:day', name: 'sum', component: Sum},
  {path: '/sum2', name: 'sum2', component: Sum2},
  {path: '/perf/:day', name: 'perf', component: Perf},
  {path: '/freshshop', name: 'fresh-shop', component: FreshShop},
  { path: '/', name: 'index', redirect: '/date/1' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
