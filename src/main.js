// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import {get, post} from "./components/axiosHttp";
import Cube from 'cube-ui'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import VueClipboard from 'vue-clipboard2'
import openDoor from './view/components/openDoor'
import success from './view/components/success'
import {scan} from "./components/scanCode"
Vue.prototype.scan = scan
Vue.use(VueClipboard)
Vue.config.productionTip = false
// 引入cube
Vue.use(Cube)
// 引入mintUI
Vue.use(Mint)
// 引入axios
Vue.prototype.axios = axios
// 引入封装接口
Vue.prototype.$get = get
Vue.prototype.$post = post

Vue.component('openDoor', openDoor)
Vue.component('success', success)


router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
