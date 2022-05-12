<template>
  <div class="v-WIFI">
    <div class="content-body">
      <div class="configurationManagement-header">
        <i class="el-icon-s-fold"></i>
        <div class="big-item_title">WIFI配置</div>
      </div>
      <div class="the-content project-content">
        <div class="content-item" v-for="(tem, num) in data" :key="num">
          <div class="span-title">{{ tem.label }}：</div>
          <div>
            <el-input :readonly="true" size="mini" style="width: 180px" :value="tem.value"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body big-content_body">
      <div class="configurationManagement-header">
        <i class="el-icon-s-unfold"></i>
        <div class="big-item_title">接入IP列表</div>
      </div>
      <div style="padding: 10px 0 0 0">
        <el-table height="418" size="small" :data="tableData" border style="width: 100%">
          <el-table-column sortable prop="ip" label="IP" align="center"> </el-table-column>
          <el-table-column sortable prop="mac" label="MAC地址" align="center"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WIFI',
  data() {
    return {
      data: [
        { label: 'WiFi名称', value: '', key: 'wifiName' },
        { label: '安全性', value: '', key: 'safety' },
        { label: 'WiFi密码', value: '', key: 'wifiPwd' },
        { label: 'IP地址', value: '', key: 'ip' },
        { label: '连接数量', value: '', key: 'connect' },
        { label: '子网掩码', value: '', key: 'netMask' },
        { label: '路由地址', value: '', key: 'gateWay' },
      ],
      tableData: [],
    }
  },
  created() {
    this.getWlanInfo()
    this.getWlanList()
  },
  methods: {
    getWlanInfo() {
      this.$apis.network_set.getWlanInfo().then((res) => {
        let data = res.data || []
        this.data.forEach((item) => {
          if (String(data[item.key])) {
            item.value = data[item.key]
          }
        })
      })
    },
    getWlanList() {
      let params = {
        page: 1,
        limit: 999,
      }
      this.$apis.network_set.getWlanList(params).then((res) => {
        this.tableData = res.data || []
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.v-WIFI {
  .the-content {
    width: 50%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > div {
      width: 50%;
    }
  }
}
</style>
