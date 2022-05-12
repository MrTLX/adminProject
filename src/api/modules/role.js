/**
 * 用户管理
 */
import http from '../../config/http' // 导入http中创建的axios实例
const role = {
  getUser(params) {
    return http.get('getUser', {
      params,
    })
  },
  updatePassword(params) {
    return http.get('updatePassword', {
      params,
    })
  },
}
export default role
