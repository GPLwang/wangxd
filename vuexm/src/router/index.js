import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'

import { Message } from 'element-ui'
Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { name: 'login', path: '/login', component: Login },
    { name:'home',path:'/home',component:Home }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    var token = window.localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      Message.error('请先进行登录在操作')
    }else{
      next()
    }
  }else{
    next()
  }
})

export default router