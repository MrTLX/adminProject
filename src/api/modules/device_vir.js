/**
 * 资产列表
 */
import http from '../../config/http' // 导入http中创建的axios实例
const device_vir = {
  selectVirDevicetable(params) {
    return http.get('selectVirDevicetable', {
      params,
    })
  },
  selectVirHostParam(params) {
    return http.get('iotDeviceInfo/selectVirHostParam', {
      params,
    })
  },
}
export default device_vir
