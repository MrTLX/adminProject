<template>
  <div class="v-systemStatus">
    <div class="content-body" v-for="(item, index) in allData" :key="index">
      <div class="configurationManagement-header">
        <i :class="item.icon"></i>
        <div class="big-item_title">{{ item.name }}</div>
      </div>
      <div class="the-content project-content">
        <div class="content-item" v-for="(tem, num) in item.data" :key="num">
          <div class="span-title">{{ tem.label }}：</div>
          <div>
            <el-input :readonly="true" size="mini" style="width: 180px" :value="tem.unit ? tem.value + tem.unit : tem.value"></el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'systemStatus',
  data() {
    return {
      allData: [
        {
          name: '系统信息',
          icon: 'el-icon-monitor',
          key: 'systemInfoStarus',
          data: [
            { label: '系统版本', value: '' },
            { label: '运行状态', value: '' },
            { label: '云连接状态', value: '' },
            { label: '运行天数', value: '', unit: '天' },
          ],
        },
        {
          name: '项目信息',
          icon: 'el-icon-folder-opened',
          key: 'getProjectInfo',
          data: [
            { label: '项目名称', value: '', key: 'ProjectName' },
            { label: '项目地点', value: '', key: 'Address' },
            { label: '所在区域', value: '', key: 'Division' },
            { label: '上线时间', value: '', key: 'StartDate' },
            { label: '授权截止日期', value: '', key: 'LicenseDate' },
            { label: '项目描述', value: '', key: 'Overview' },
          ],
        },
        {
          name: '资产信息',
          icon: 'el-icon-mobile',
          key: 'searchDeviceNum',
          data: [
            { label: '主机数量', value: '', unit: '台' },
            { label: '电表数量', value: '', unit: '台' },
            { label: '温湿度设备数量', value: '', unit: '台' },
          ],
        },
        {
          name: '节能信息',
          icon: 'el-icon-data-analysis',
          key: 'energySavingNum',
          data: [
            { label: '累计能耗', value: '', unit: 'kWh' },
            { label: '累计节能量', value: '', unit: 'kWh' },
            { label: '节能率', value: '' },
          ],
        },
        {
          name: '报警信息',
          icon: 'el-icon-bell',
          key: 'warnInfoNum',
          data: [
            { label: '年度报警次数', value: '', unit: '次' },
            { label: '月度报警次数', value: '', unit: '次' },
            { label: '季度报警次数', value: '', unit: '次' },
          ],
        },
      ],
      valueJson: {
        Runing: '运行中',
        ConnectFalse: '连接断开',
        ConnectTrue: '已连接',
      },
      divisionJson: {
        1: '华中',
        2: '华北',
        3: '华南',
        4: '华西',
        5: '华东',
      },
    }
  },
  computed: {
    ...mapGetters(['projectInfo']),
  },
  watch: {
    // 项目信息
    projectInfo: {
      handler(val) {
        if (val) {
          this.setData(val, 'getProjectInfo')
        }
      },
      immediate: true,
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 系统信息
      this.systemInfoStarus()
      // 资产信息
      this.searchDeviceNum()
      // 节能信息
      this.energySavingNum()
      // 报警信息
      this.warnInfoNum()
    },
    systemInfoStarus() {
      this.$apis.systemStatus.systemInfoStarus().then((res) => {
        let data = res.data || []
        this.setData(data, 'systemInfoStarus')
      })
    },
    searchDeviceNum() {
      this.$apis.systemStatus.searchDeviceNum().then((res) => {
        let data = res.data || []
        this.setData(data, 'searchDeviceNum')
      })
    },
    energySavingNum() {
      this.$apis.systemStatus.energySavingNum().then((res) => {
        let data = res.data || []
        this.setData(data, 'energySavingNum')
      })
    },
    warnInfoNum() {
      this.$apis.systemStatus.warnInfoNum().then((res) => {
        let data = res.data || []
        this.setData(data, 'warnInfoNum')
      })
    },
    setData(data, key) {
      let obj = this.allData.find((item) => item.key === key)
      if (obj) {
        obj.data.forEach((item, index) => {
          if (item.key) {
            item.value = ''
            // eslint-disable-next-line valid-typeof
            if (typeof data[item.key] != null) {
              let value = data[item.key]
              if (item.key === 'Division') {
                value = this.divisionJson[value] || ''
              }
              item.value = value
            }
          } else {
            if (typeof data[index] !== 'undefined') {
              let value = this.valueJson[data[index]] || data[index]
              item.value = value
            } else {
              item.value = ''
            }
          }
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-systemStatus {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: auto !important;
  .content-body {
    margin-bottom: 20px;
    min-height: 180px;
    width: calc(50% - 10px);
    background: #fff;
    border-radius: 5px;
  }
  .configurationManagement-header {
    padding: 20px 20px 10px 20px;
    display: flex;
    align-items: center;
    background: #fff;
    position: relative;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .my-button {
      position: absolute;
      top: 15px;
      right: 20px;
    }
    i {
      margin-right: 5px;
      font-size: 20px;
    }
  }
  .the-content {
    margin-bottom: 15px;
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: #fff;
    > div {
      width: 50%;
    }
    .content-item {
      display: flex;
      align-items: center;
      height: 50px;
      /deep/.el-input.is-disabled .el-input__inner {
        background-color: #fff;
        color: #606266;
        border-color: #dcdfe6;
      }
    }
    .span-title {
      font-size: 14px;
      margin-right: 5px;
      width: 115px;
      text-align: right;
    }
    .span-text {
      min-width: 115px;
      font-size: 14px;
    }
  }
  /deep/.el-input__inner:focus {
    border-color: #dcdfe6;
  }
}
</style>
