const device = {
  state: {
    commtypeData: [
      { label: '无', value: '0' },
      { label: '串口', value: '1' },
      { label: '网口', value: '2' },
      { label: '混合', value: '3' },
      { label: '直连', value: '4' },
      { label: 'LoRa', value: '5' },
      { label: 'NB-IOT', value: '6' },
      { label: 'IO', value: '7' },
    ],
    devstateData: [
      { label: '未采集', value: '0' },
      { label: '正常', value: '1' },
      { label: '通信失败', value: '2' },
      { label: '警告', value: '3' },
      { label: '告警', value: '4' },
      { label: '检测', value: '5' },
    ],
    typeData: [
      { label: '主机', value: '1' },
      { label: '电表', value: '2' },
      { label: '温湿度', value: '3' },
    ],
    hostMax: false,
  },
  getters: {
    commtypeData: (state) => state.commtypeData,
    devstateData: (state) => state.devstateData,
    typeData: (state) => state.typeData,
    hostMax: (state) => state.hostMax,
  },
  actions: {},
  mutations: {
    setHostMax: (state, bol) => {
      state.hostMax = bol
    },
  },
}
export default device
