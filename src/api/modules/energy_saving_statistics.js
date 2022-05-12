/**
 * 节能配置
 */
import http from '../../config/http' // 导入http中创建的axios实例
const energySaving = {
  sysDOAutoL() {
    return http.get('getHais1000SysDOAutoL')
  },
  queryLastType(params) {
    return http.get('queryLastType', {
      params,
    })
  },
  selectSysMonthSavEnergyList(params) {
    return http.get('energySaving/selectSysMonthSavEnergyList', {
      params,
    })
  },
  selectSysMonthSavRateList(params) {
    return http.get('energySaving/selectSysMonthSavRateList', {
      params,
    })
  },
  setSwitch(params) {
    return http.get('setSwitch', {
      params,
    })
  },
  selectSysDateExisting(params) {
    return http.get('energySaving/selectSysDateExisting', {
      params,
    })
  },
  updateType(data) {
    return http.post('energySaving/updateType', data)
  },
  updateDateExist(data) {
    return http.post('energySaving/updateDateExist', data)
  },
  updateSavingRate(data) {
    return http.post('energySaving/updateSavingRate', data)
  },
  updateMonthSavEnergy(data) {
    return http.post('energySaving/updateMonthSavEnergy', data)
  },
}
export default energySaving
