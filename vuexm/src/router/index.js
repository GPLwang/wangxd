import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'
import Users from '@/components/page/users/users.vue'
import Goods from '@/components/page/goods/goods.vue'
import Categories from '@/components/page/goods/categories.vue'
import AddGoods from '@/components/page/goods/addgoods.vue'
import { Message } from 'element-ui'
Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home', path: '/home', component: Home,
      children: [
        { path:'/users',component:Users },
        { path:'/goods',component:Goods },
        { path:'/goods/add',component:AddGoods },
        { path:'/categories',component:Categories },
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    var token = window.localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      Message.error('请先进行登录在操作')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router