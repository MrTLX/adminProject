/**
 * 设备管理
 */
import http from '../../config/http' // 导入http中创建的axios实例
const device = {
  selectDevicetable(params) {
    return http.get('selectDevicetable', {
      params,
    })
  },
  listDevType(params) {
    return http.get('iotDeviceInfo/listDevType', {
      params,
    })
  },
  searchVirHost(params) {
    return http.get('searchVirHost', {
      params,
    })
  },
  addDeviceHostInfo(data) {
    return http.post('addDeviceHostInfo', data)
  },
  deleteDeviceInfo(data) {
    return http.post('iotDeviceInfo/deleteDeviceInfo', data)
  },
  updateDevEnable(data) {
    return http.post('iotDeviceInfo/updateDevEnable', data)
  },
  selectPointChListByDevID(params) {
    return http.get('iotPointInfo/selectPointChListByDevID', {
      params,
    })
  },
  selectHostDevice(params) {
    return http.get('iotDeviceInfo/selectHostDevice', {
      params,
    })
  },
  searchVirHostDevLast(params) {
    return http.get('searchVirHostDevLast', {
      params,
    })
  },
}
export default device
