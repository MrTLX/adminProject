/**
 * 策略配置
 */
import http from '../../config/http' // 导入http中创建的axios实例
const energyPolicy = {
  selectPolicyConfig() {
    return http.get('selectPolicyConfig')
  },
  switchPolicyConfig(params) {
    return http.get('switchPolicyConfig', {
      params,
    })
  },
  selectPolicyConfigDetails(params) {
    return http.get('selectPolicyConfigDetails', {
      params,
    })
  },
  setRule(params) {
    return http.get('setRule', {
      params,
    })
  },
  setRuleConfigDetails(params) {
    return http.get('setRuleConfigDetails', {
      params,
    })
  },
}
export default energyPolicy
