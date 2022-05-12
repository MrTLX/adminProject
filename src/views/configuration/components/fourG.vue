<template>
  <div class="v-4G">
    <div class="content-body">
      <div class="configurationManagement-header">
        <i class="el-icon-s-fold"></i>
        <div class="big-item_title">4G配置</div>
      </div>
      <div class="the-content project-content">
        <div class="content-item" v-for="(tem, num) in data" :key="num">
          <div class="span-title">{{ tem.label }}：</div>
          <div>
            <template v-if="tem.key === 'state'">
              <div class="state-div">
                <div class="yuan" :class="tem.value === true ? 'live' : 'unlive'"></div>
                <div>{{ tem.value === true ? '启用(在线)' : '停用(离线)' }}</div>
              </div>
            </template>
            <template v-else>
              <el-input :readonly="true" size="mini" style="width: 180px" :value="tem.value"></el-input>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fourG',
  data() {
    return {
      data: [
        { label: '信息状态', value: false, key: 'state' },
        { label: '运营商', value: '', key: 'operator' },
        { label: 'APN名称', value: '', key: 'apnName' },
        { label: 'SIM卡号', value: '', key: 'number' },
        { label: '信号强度', value: '', key: 'signalStrength' },
      ],
    }
  },
  created() {
    this.get4GInfo()
  },
  methods: {
    get4GInfo() {
      this.$apis.network_set.get4GInfo().then((res) => {
        let data = res.data || []
        this.data.forEach((item) => {
          if (String(data[item.key]) !== 'null') {
            item.value = data[item.key]
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.state-div {
  display: flex;
  align-items: center;
  font-size: 14px;
  .yuan {
    margin-right: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .live {
    background: #67c23a;
  }
  .unlive {
    background: #dcdfe6;
  }
}
</style>
