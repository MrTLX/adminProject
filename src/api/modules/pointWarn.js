/**
 * 报警管理
 */
import http from '../../config/http' // 导入http中创建的axios实例
const pointWarn = {
  selectAlarmLevelSetList(params) {
    return http.get('warnLevel/selectAlarmLevelSetList', {
      params,
    })
  },
  selectDevicePoint(params) {
    return http.get('iotPointInfo/selectDevicePoint', {
      params,
    })
  },
  selectHostDeviceSelect(params) {
    return http.get('iotDeviceInfo/selectHostDeviceSelect', {
      params,
    })
  },
  selectPointByDev(params) {
    return http.get('iotDeviceInfo/selectPointByDev', {
      params,
    })
  },
  addAlarmRule(data) {
    return http.post('warnLevel/addAlarmRule', data)
  },
  updateAlarmRule(data) {
    return http.post('warnLevel/updateAlarmRule', data)
  },
  delAlarmRule(data) {
    return http.post('warnLevel/delAlarmRule', data)
  },
}
export default pointWarn
