import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
      meta: {
          title: '首页入口'
      }
  },
  {
    path: '/quhao',//取号
    name: 'Quhao',
    component: () => import(/* webpackChunkName: "about" */ '../components/quhao.vue'),
      meta: {
          title: '取号'
      }
  },
  {
    path: '/jiaohao',//叫号
    name: 'Jiaohao',
    component: () => import(/* webpackChunkName: "about" */ '../components/jiaohao.vue'),
      meta: {
          title: '叫号'
      }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
