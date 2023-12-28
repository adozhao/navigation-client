import Vue from 'vue'

import store from '@/store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'

import '../static/iconfont/iconfont.css'
import '../static/theme/index.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
import './permission'

Vue.use(VueAxios, axios);

import '@/styles/index.scss'

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
