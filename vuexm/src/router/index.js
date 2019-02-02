import Vue from 'vue'
import Router from 'vue-router'
<<<<<<< HEAD
import HelloWorld from '@/components/HelloWorld'

=======
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'

import { Message } from 'element-ui'
>>>>>>> parent of ab38048... home
Vue.use(Router)

export default new Router({
  routes: [
<<<<<<< HEAD
<<<<<<< HEAD
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
=======
    { path: '/', redirect: '/home' },
    { name: 'login', path: '/login', component: Login },
    { name:'home',path:'/home',component:Home }
>>>>>>> parent of ab38048... home
  ]
})
=======
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
>>>>>>> parent of ab38048... home
