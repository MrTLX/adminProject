/**
 * 用来存放跟用户相关的接口文件
 */
import http from '../../config/http' // 导入http中创建的axios实例
const userAPI = {
  login(data) {
    return http.post('/login', data)
  },
}
export default userAPI
