import Vue from 'vue'
import VueRouter from 'vue-router'
import userStore from '../store/modules/user'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login/userLogin.vue'),
  },
  {
    path: '/',
    name: 'views',
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue'),
    redirect: '/systemStatus',
    children: [
      /** 系统状态 **/
      {
        label: '系统状态',
        path: '/systemStatus',
        name: 'systemStatus',
        component: () => import(/* webpackChunkName: "about" */ '../views/systemStatus/systemStatus.vue'),
      },
      /** 系统管理 **/
      {
        label: '系统配置',
        path: '/configuration/configuration',
        name: 'configuration',
        component: () => import(/* webpackChunkName: "about" */ '../views/configuration/configuration.vue'),
      },
      {
        label: '网络配置',
        path: '/configuration/network_set',
        name: 'network_set',
        component: () => import(/* webpackChunkName: "about" */ '../views/configuration/network_set.vue'),
      },
      {
        label: '系统升级',
        path: '/configuration/upload_file',
        name: 'upload_file',
        component: () => import(/* webpackChunkName: "about" */ '../views/configuration/upload_file.vue'),
      },
      /** 资产管理 **/
      {
        label: '资产列表',
        path: '/device/device_vir',
        name: 'device_vir',
        component: () => import(/* webpackChunkName: "about" */ '../views/device/device_vir.vue'),
      },
      {
        label: '设备管理',
        path: '/device/device',
        name: 'device',
        component: () => import(/* webpackChunkName: "about" */ '../views/device/device.vue'),
      },
      {
        label: '点位管理',
        path: '/device/devicePoint',
        name: 'devicePoint',
        component: () => import(/* webpackChunkName: "about" */ '../views/device/devicePoint.vue'),
      },
      /** 节能管理 **/
      {
        label: '节能配置',
        path: '/energy/energy_saving_statistics',
        name: 'energy_saving_statistics',
        component: () => import(/* webpackChunkName: "about" */ '../views/energy/energy_saving_statistics.vue'),
      },
      {
        label: '策略配置',
        path: '/energy/energy_saving_ruleConfig',
        name: 'energy_saving_ruleConfig',
        component: () => import(/* webpackChunkName: "about" */ '../views/energy/energy_saving_ruleConfig.vue'),
      },
      /** 报警管理 **/
      {
        label: '报警管理',
        path: '/pointWarn',
        name: 'pointWarn',
        component: () => import(/* webpackChunkName: "about" */ '../views/pointWarn/pointWarn.vue'),
      },
      /** 用户管理 **/
      {
        label: '用户管理',
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "about" */ '../views/role/role.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
// 路由全局拦截处于未登陆状态的全部跳转登陆页面
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !userStore.state.loginState) {
    next({ name: 'login' })
  } else {
    next()
  }
})
export default router
