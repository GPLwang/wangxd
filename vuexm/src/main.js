// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/assets/css/reset.css'
import Myaxios from '@/assets/js/myaxios.js'
import Bread from '@/layout/bread.vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ElTreeGrid from 'element-tree-grid'
import Echarts from 'echarts'

Vue.component(Bread.name,Bread)
Vue.use(ElementUI)
Vue.use(Myaxios)
Vue.use(require('vue-moment'))
Vue.use(VueQuillEditor)
Vue.component(ElTreeGrid.name, ElTreeGrid)

Vue.prototype.$echarts = Echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
