import Vue from 'vue'
import Vuex from 'vuex'
import userStore from './modules/user'
import device from './modules/device'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: { userStore, device },
})
