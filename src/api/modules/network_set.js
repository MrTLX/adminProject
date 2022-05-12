/**
 * 网络配置
 */
import http from '../../config/http' // 导入http中创建的axios实例
const network_set = {
  getRouteTable(params) {
    return http.get('getRouteTable', {
      params,
    })
  },
  get4GInfo() {
    return http.get('get4GInfo')
  },
  getWlanInfo() {
    return http.get('getWlanInfo')
  },
  getWlanList(params) {
    return http.get('getWlanList', {
      params,
    })
  },
  getNetWorkCount() {
    return http.get('getNetWorkCount')
  },
  getNetworkConfigFprm() {
    return http.get('getNetworkConfigFprm')
  },
  setNetworkConfigFprm(params) {
    return http.get('setNetworkConfigFprm', {
      params,
    })
  },
  setNetworkConfigFprm2(params) {
    return http.get('setNetworkConfigFprm2', {
      params,
    })
  },
  delRoute(params) {
    return http.get('delRoute', {
      params,
    })
  },
}
export default network_set
