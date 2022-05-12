import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import API from './api'
import utils from './utils/utils'

import ElementUI from 'element-ui'

import '../src/assets/styles/cssRest.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/styles/element-ui-mine.scss'
import '../src/assets/styles/common.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$apis = API
Vue.prototype.$utils = utils

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
