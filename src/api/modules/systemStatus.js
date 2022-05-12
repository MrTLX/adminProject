/**
 * 系统状态
 */
import http from '../../config/http' // 导入http中创建的axios实例
const systemStatus = {
  systemInfoStarus() {
    return http.get('systemInfoStarus')
  },
  getProjectInfo() {
    return http.get('getProjectInfo')
  },
  searchDeviceNum() {
    return http.get('searchDeviceNum')
  },
  energySavingNum() {
    return http.get('energySavingNum')
  },
  warnInfoNum() {
    return http.get('warnInfoNum')
  },
}
export default systemStatus
