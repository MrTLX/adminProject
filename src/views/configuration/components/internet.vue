<template>
  <div class="v-internet">
    <div class="content-body">
      <div class="configurationManagement-header">
        <i class="el-icon-s-fold"></i>
        <div class="big-item_title">网络配置</div>
      </div>
      <div class="the-content project-content">
        <div>
          <div class="content-item">
            <div class="span-title">网卡类别：</div>
            <div>
              {{ netWorkType === 1 ? '单网卡' : '双网卡' }}
            </div>
          </div>
        </div>
        <template v-if="interData.length > 0">
          <div v-for="(item, index) in interData" :key="index">
            <div class="content-item">
              <div class="span-title">IP 地址：</div>
              <div>
                <el-input :readonly="true" size="mini" style="width: 180px" :value="item.netCardIp"></el-input>
              </div>
            </div>
            <div class="content-item">
              <div class="span-title">子网掩码：</div>
              <div>
                <el-input :readonly="true" size="mini" style="width: 180px" :value="item.subnetMask"></el-input>
              </div>
            </div>
            <div class="content-item">
              <div class="span-title">默认网关：</div>
              <div>
                <el-input :readonly="true" size="mini" style="width: 180px" :value="item.gateway"></el-input>
              </div>
            </div>
            <el-button class="my-button" size="mini" type="primary" @click="editInter(item)">修改</el-button>
          </div>
        </template>
      </div>
    </div>
    <div class="content-body big-content_body">
      <div class="configurationManagement-header">
        <i class="el-icon-s-unfold"></i>
        <div class="big-item_title">路由表信息</div>
        <el-button style="margin-left: 40px" size="mini" type="primary" @click="addPlatform">添加路由</el-button>
      </div>
      <div style="padding: 10px 0 0 0">
        <el-table height="480" size="small" :data="tableData" border style="width: 100%">
          <el-table-column sortable prop="destination" label="目的地址" align="center"> </el-table-column>
          <el-table-column sortable prop="genmask" label="子网掩码" align="center"> </el-table-column>
          <el-table-column sortable prop="gateway" label="网关地址" align="center"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope" v-if="scope.row.gateway !== '0.0.0.0'">
              <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog custom-class="my-dialog" :close-on-click-modal="false" title="修改网络配置" center width="500px" :visible.sync="editDialog">
      <el-form :model="editForm" :rules="formRules" ref="editForm" label-width="150px">
        <el-form-item label="IP 地址：" prop="netCardIp">
          <el-input size="mini" style="width: 200px" v-model="editForm.netCardIp" placeholder="请输入目的地址"></el-input>
        </el-form-item>
        <el-form-item label="子网掩码：" prop="subnetMask">
          <el-input size="mini" style="width: 200px" v-model="editForm.subnetMask" placeholder="请输入子网掩码"></el-input>
        </el-form-item>
        <el-form-item label="默认网关：" prop="gateway">
          <el-input size="mini" style="width: 200px" v-model="editForm.gateway" placeholder="请输入网关地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitLw">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog custom-class="my-dialog" :close-on-click-modal="false" title="添加路由" center width="500px" :visible.sync="addDialog">
      <el-form :model="form" :rules="formRules" ref="alarmForm" label-width="150px">
        <el-form-item label="目的地址：" prop="netCardIp">
          <el-input size="mini" style="width: 200px" v-model="form.netCardIp" placeholder="请输入目的地址"></el-input>
        </el-form-item>
        <el-form-item label="子网掩码：" prop="subnetMask">
          <el-input size="mini" style="width: 200px" v-model="form.subnetMask" placeholder="请输入子网掩码"></el-input>
        </el-form-item>
        <el-form-item label="网关地址：" prop="gateway">
          <el-input size="mini" style="width: 200px" v-model="form.gateway" placeholder="请输入网关地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitTj">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'internet',
  data() {
    return {
      editForm: {
        netCardName: '',
        netCardIp: '',
        subnetMask: '',
        gateway: '',
      },
      netWorkType: 1, // 网卡类别
      interData: [],
      editDialog: false,
      addDialog: false,
      form: {
        netCardIp: '',
        subnetMask: '',
        gateway: '',
      },
      formRules: {
        netCardIp: { required: true, validator: this.validatorIp, trigger: 'blur' },
        subnetMask: { required: true, validator: this.validatorIp, trigger: 'blur' },
        gateway: { required: true, validator: this.validatorIp, trigger: 'blur' },
      },
      tableData: [],
    }
  },
  created() {
    this.getNetWorkCount()
    this.getRouteTable()
  },
  methods: {
    getNetWorkCount() {
      // 判断是单网卡还是多网卡
      this.$apis.network_set.getNetWorkCount().then((res) => {
        this.netWorkType = res.data
        this.$apis.network_set.getNetworkConfigFprm().then((res) => {
          // 根据netWorkType，截取对应数据
          let data = res.data || []
          let newData = []
          if (data.length > 0) {
            let start = data.length - this.netWorkType
            newData = data.slice(start, data.length)
          }
          this.interData = newData
        })
      })
    },
    getRouteTable() {
      let params = {
        page: 1,
        limit: 15,
      }
      this.$apis.network_set.getRouteTable(params).then((res) => {
        this.tableData = res.data || []
      })
    },
    editInter(item) {
      for (let key in this.editForm) {
        if (String(item[key]) !== 'null' || String(item[key]) !== 'undefined') {
          this.editForm[key] = item[key]
        }
      }
      this.editDialog = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    addPlatform() {
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs.alarmForm.resetFields()
      })
    },
    deleteRow(row) {
      let params = {
        destination: row.destination,
        gateway: row.gateway,
        genmask: row.genmask,
      }
      this.$confirm(`是否删除：${row.gateway}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$apis.network_set.delRoute(params).then((res) => {
          this.getRouteTable()
          this.$message.success(res.message || '操作成功')
        })
      })
    },
    submitLw() {
      this.$refs.editForm.validate((validate) => {
        if (validate) {
          this.$apis.network_set.setNetworkConfigFprm(this.editForm).then((res) => {
            this.getNetWorkCount()
            this.editDialog = false
            this.$message.success(res.message || '操作成功')
          })
        } else {
          return false
        }
      })
    },
    submitTj() {
      this.$refs.alarmForm.validate((validate) => {
        if (validate) {
          this.$apis.network_set.setNetworkConfigFprm2(this.form).then((res) => {
            this.getRouteTable()
            this.addDialog = false
            this.$message.success(res.message || '操作成功')
          })
        } else {
          return false
        }
      })
    },
    validatorIp(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入网络IP'))
      } else {
        if (!this.$utils.regIp(value)) {
          callback(new Error('请输入合法网络IP'))
        }
        callback()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-internet {
  .the-content {
    > div {
      display: flex;
      align-items: center;
    }
  }
  .my-button {
    margin-left: 30px;
    height: 28px;
  }
}
</style>
