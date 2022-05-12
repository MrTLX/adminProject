/**
 * 接口域名的管理
 */
const env = process.env
let baseUrl = ''
// 代理配置
if (env.NODE_ENV === 'development') {
  baseUrl = `/api` // 开发环境地址
} else if (env.NODE_ENV === 'production') {
  baseUrl = `` //生产环境地址
} else if (env.NODE_ENV === 'test') {
  baseUrl = `` //测试环境地址
}
export default baseUrl
