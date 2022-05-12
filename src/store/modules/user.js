const userStore = {
  state: {
    token: '',
    loginState: localStorage.getItem('loginState') || false, // 登陆状态
    userName: localStorage.getItem('userName') || '',
    menuList: [
      { label: '系统状态', path: '/systemStatus', icon: 'el-icon-first-aid-kit' },
      {
        label: '系统管理',
        path: '/configuration',
        icon: 'el-icon-setting',
        children: [
          { label: '系统配置', path: '/configuration' },
          { label: '网络配置', path: '/network_set' },
          { label: '系统升级', path: '/upload_file' },
        ],
      },
      {
        label: '资产管理',
        path: '/device',
        icon: 'el-icon-receiving',
        children: [
          { label: '资产列表', path: '/device_vir' },
          { label: '设备管理', path: '/device' },
          { label: '点位管理', path: '/devicePoint' },
        ],
      },
      {
        label: '节能管理',
        path: '/energy',
        icon: 'el-icon-data-line',
        children: [
          { label: '节能配置', path: '/energy_saving_statistics' },
          { label: '策略配置', path: '/energy_saving_ruleConfig' },
        ],
      },
      { label: '报警管理', path: '/pointWarn', icon: 'el-icon-bell' },
      { label: '用户管理', path: '/role', icon: 'el-icon-user' },
    ],
    projectInfo: null,
  },
  actions: {},
  mutations: {
    setUserName(state, payload) {
      state.userName = payload
      localStorage.setItem('userName', payload)
    },
    setProjectInfo(state, payload) {
      state.projectInfo = payload
      let obj = JSON.stringify(payload)
      localStorage.setItem('projectInfo', obj)
    },
    setLoginState(state, payload) {
      state.loginState = payload
      localStorage.setItem('loginState', payload)
    },
    setToken(state, str) {
      state.token = str
      localStorage.setItem('token', str)
    },
    setMenuList(state, arr) {
      state.menuList = arr
      localStorage.setItem('menuList', JSON.stringify(arr))
    },
  },
  getters: {
    loginState: (state) => state.loginState,
    userName: (state) => state.userName,
    projectInfo: (state) => {
      if (localStorage.getItem('projectInfo')) {
        let obj = JSON.parse(localStorage.getItem('projectInfo'))
        return obj
      } else {
        return state.projectInfo
      }
    },
    token: (state) => {
      if (localStorage.getItem('token')) {
        return localStorage.getItem('token')
      } else {
        return state.token
      }
    },
    menuList: (state) => {
      if (localStorage.getItem('menuList')) {
        return JSON.parse(localStorage.getItem('menuList'))
      } else {
        return state.menuList
      }
    },
  },
}
export default userStore
