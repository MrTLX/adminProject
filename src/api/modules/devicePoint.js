/**
 * 点位管理
 */
import http from '../../config/http' // 导入http中创建的axios实例
const devicePoint = {
  queryAllByLimit(params) {
    return http.get('iotPointInfo/queryAllByLimit', {
      params,
    })
  },
  selectPointTypeList() {
    return http.get('iotPointInfo/selectPointTypeList')
  },
  selectRelDeviceidTypeList() {
    return http.get('iotPointInfo/selectRelDeviceidTypeList')
  },
  updatePointLimit(data) {
    return http.post('iotPointInfo/updatePointLimit', data)
  },
}
export default devicePoint
