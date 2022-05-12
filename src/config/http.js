/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import Qs from 'qs'
import router from '../router'
import store from '../store'
import { Message } from 'element-ui'
import baseUrl from './baseUrl'
const CancelToken = axios.CancelToken // axios自带用来中断请求的对象
let pending = {} // 对象的key为每个正在请求的接口，value为取消该接口的方法

// 创建axios实例
let instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 60,
})
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// post白名单
const postWhiteList = {
  'upload/AuthorizationFile': true,
  'agreementUpdate/uploadPackageAgreement': true,
}
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 * 如果是post请求 将传入参数表单化（QS）
 */
instance.interceptors.request.use(
  (config) => {
    if (config.method === 'post' && !postWhiteList[config.url]) {
      config.data = Qs.stringify(config.data)
    }
    let key = config.url + '&' + config.method
    // 重复请求执行CancelToken的cancel方法
    cancelPending(key, config)
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  (error) => Promise.error(error)
)
// 响应拦截器
instance.interceptors.response.use(
  // 请求成功(对请求成功中res.data.code不为0的进行处理)
  (res) => {
    let data = res.data
    let key = res.config.url + '&' + res.config.method
    // 响应结束后删除pending对象里该请求对应的key
    removePending(key)
    if (res.status === 200 && (data.success || data.code === 0)) {
      return Promise.resolve(data)
    } else {
      errorHandle(data.code, data.message)
      return Promise.reject(data)
      // 给数据添加data属性后，将错误信息返回，以免页面需要使用
      // data.data = []
      // return Promise.resolve(data)
    }
  },
  // 请求失败
  (error) => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况【待实现】
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)
const cancelPending = (key, config) => {
  if (pending[key]) {
    pending[key]()
  } else {
    config.cancelToken = new CancelToken((c) => {
      pending[key] = c
    })
  }
}
const removePending = (key) => {
  delete pending[key]
}
/**
 * 处理相同弹窗提示，只保留一个相同提示
 * @param {String} type 弹窗类型
 * @param {String} msg 要展示的信息
 * @param {Boolean} silent 是否需要提示信息
 */
let modelInfo = {} // 消除多个相同消息窗口
const oneTip = (type, msg) => {
  let content = msg ? msg : ''
  // 判断是否已经有提示出现
  if (!modelInfo[content]) {
    modelInfo[content] = 1
    // 弹窗提示
    Message({
      message: msg,
      type: type,
      duration: 3 * 1000,
      onClose: () => {
        delete modelInfo[content]
      },
    })
  }
}
/**
 * 跳转登录页
 * 携带当前页面路由，在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath,
    },
  })
}
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 * @param {String} message 请求失败的信息
 */
const errorHandle = (status, message) => {
  // 状态码判断
  switch (status) {
    // 201014: 未登录状态，跳转登录页
    case 201014:
      toLogin()
      break
    // 1008 token过期
    // 清除token并跳转登录页
    case 1008:
      oneTip('error', '登录过期，请重新登录')
      store.commit('loginOut')
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      oneTip('error', '请求的资源不存在')
      break
    default:
      oneTip('error', message || '未知错误')
  }
}

export default instance
