import userAPI from './modules/user'
import systemStatus from './modules/systemStatus'
import configuration from './modules/configuration'
import systemUpgrade from './modules/configuration'
import networkSet from './modules/configuration'
import role from './modules/role'
import pointWarn from './modules/pointWarn'
import energySaving from './modules/energy_saving_statistics'
import energyPolicy from './modules/energy_saving_ruleConfig'
import device_vir from './modules/device_vir'
import device from './modules/device'
import devicePoint from './modules/devicePoint'
import network_set from './modules/network_set'

const API = {
  userAPI,
  systemStatus,
  configuration,
  systemUpgrade,
  networkSet,
  role,
  pointWarn,
  energySaving,
  energyPolicy,
  device_vir,
  device,
  devicePoint,
  network_set,
}

export default API
