<template>
  <div class="v-device">
    <div class="the-header-line">
      <i class="el-icon-document"></i>
      <div class="big-item_title">设备列表</div>
    </div>
    <div style="padding: 10px 20px">
      <div class="search-div">
        <div class="search-div_left">
          <div>
            <label class="search-div_label">设备名称:</label>
            <el-input size="mini" style="width: 150px" v-model="params.devname" placeholder="请输入设备名称" clearable></el-input>
          </div>
          <div>
            <label class="search-div_label">设备所属:</label>
            <el-select size="mini" style="width: 150px" v-model="params.type">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in typeData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <label class="search-div_label">设备类型:</label>
            <el-select size="mini" style="width: 150px" v-model="params.devtypename">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in devtypenameData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <label class="search-div_label">设备状态:</label>
            <el-select size="mini" style="width: 150px" v-model="params.devState">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in devstateData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <label class="search-div_label">通讯类型:</label>
            <el-select size="mini" style="width: 150px" v-model="params.commtype">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in commtypeData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <el-button size="mini" type="primary" class="mr-4" @click="getTableData">查询</el-button>
          <el-button size="mini" type="primary" class="mr-4" @click="addDialog = true">添加设备</el-button>
        </div>
        <div class="search-div_right"></div>
      </div>
      <el-table height="710" size="small" :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="devname" label="设备名称" align="center"> </el-table-column>
        <el-table-column sortable prop="type" label="设备所属" align="center">
          <template slot-scope="{ row }">
            {{ getLabelByVal(typeData, row.type) }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="devtypename" label="设备类型" align="center"></el-table-column>
        <el-table-column sortable prop="devstate" label="设备状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="Number(scope.row.devstate) === 0 ? 'info' : Number(scope.row.devstate) === 1 ? 'success' : 'danger'"
              size="mini"
              effect="dark"
            >
              {{ getLabelByVal(devstateData, scope.row.devstate) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable prop="commtype" label="通讯类型" align="center">
          <template slot-scope="scope">{{ getLabelByVal(commtypeData, scope.row.commtype) }}</template>
        </el-table-column>
        <el-table-column sortable prop="commaddr" label="采集地址" align="center"> </el-table-column>
        <el-table-column sortable prop="devenable" label="设备使能" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="changeSwitch(scope.row)"
              :value="Number(scope.row.devenable) === 1 ? true : false"
              :active-text="Number(scope.row.devenable) === 1 ? '启用' : '停用'"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkMore(scope.row)">通讯参数</el-button>
            <el-button v-if="Number(scope.row.devenable) === 1 ? true : false" type="text" size="small" @click="checkRow(scope.row)">
              点位详情
            </el-button>
            <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      custom-class="my-dialog"
      title="添加设备"
      center
      width="700px"
      :visible.sync="addDialog"
      :destroy-on-close="true"
      @close="closeDialog"
    >
      <div class="form-item">
        <label>设备所属：</label>
        <el-select size="mini" style="width: 200px" v-model="deviceManageType">
          <el-option label="主机" value="hostForm"></el-option>
          <el-option label="电表" value="ammeterForm"></el-option>
          <el-option label="温湿度" value="temForm"></el-option>
        </el-select>
      </div>
      <component ref="component" :is="deviceManageType"></component>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="hostMax" size="mini" type="primary" @click="submitPj">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog custom-class="my-dialog" :title="dialogTitle" center width="50%" :visible.sync="checkDialog" @close="closeCheckDialog">
      <el-table
        v-if="checkDialog"
        size="small"
        :data="dialogTableData"
        border
        :default-sort="{ prop: 'csz', order: 'descending' }"
        :height="480"
        style="width: 100%"
      >
        <el-table-column sortable type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="devChName" label="通道名称" align="center"> </el-table-column>
        <el-table-column sortable prop="pointName" label="关联点名" align="center"> </el-table-column>
        <el-table-column sortable prop="value" label="通道值" align="center">
          <!--          <template slot-scope="scope">-->
          <!--            {{ getValueByName(scope.row.value, scope.row.devChName) }}-->
          <!--          </template>-->
        </el-table-column>
        <el-table-column sortable prop="chType" label="通道类型" align="center">
          <template slot-scope="{ row }">
            {{ chTypeJson[row.chType] }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="hlRange" label="量程上限" align="center"> </el-table-column>
        <el-table-column sortable prop="llRange" label="量程下限" align="center"> </el-table-column>
        <el-table-column sortable prop="direction" label="量程朝向" align="center">
          <template slot-scope="scope">
            {{ Number(scope.row.direction) === 0 ? '正向' : '反向' }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="chState" label="通道状态" align="center">
          <template slot-scope="scope">
            {{ Number(scope.row.chState) === 0 ? '正常' : '异常' }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="dialogSizeChange"
        @current-change="dialogCurrentChange"
        :current-page="checkParams.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dialogTableTotal"
      >
      </el-pagination>
    </el-dialog>
    <el-dialog custom-class="my-dialog" title="通讯参数" center width="400px" :visible.sync="moreDialog">
      <el-form label-width="100px">
        <template v-if="Number(commtypeTu) === 1">
          <el-form-item label="串口端口：">
            <el-input size="mini" style="width: 200px" :value="moreForm.serialport" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="波特率：">
            <el-input size="mini" style="width: 200px" :value="moreForm.serialbaud" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="校验位：">
            <el-input size="mini" style="width: 200px" :value="moreForm.serialverif" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="停止位：">
            <el-input size="mini" style="width: 200px" :value="moreForm.serialstop" :readonly="true"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="Number(commtypeTu) === 6">
          <el-form-item label="SN：">
            <el-input size="mini" style="width: 200px" :value="moreForm.networkip" :readonly="true"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="网络IP：">
            <el-input size="mini" style="width: 200px" :value="moreForm.networkip"></el-input>
          </el-form-item>
          <el-form-item label="网络端口：">
            <el-input size="mini" style="width: 200px" :value="moreForm.netport"></el-input>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import hostForm from './components/hostForm'
import temForm from './components/temForm'
import ammeterForm from './components/ammeterForm'
import { mapGetters } from 'vuex'
export default {
  name: 'device',
  components: { hostForm, temForm, ammeterForm },
  data() {
    return {
      commtypeTu: '',
      chTypeJson: {
        1: 'DI',
        2: 'DO',
        3: 'AI',
        4: 'AO',
        5: '数值型输入',
        6: '数值型输出',
        7: '中间点',
        8: '中间数据库点',
      },
      dataJson: {
        机组报警状态: { 0: '无报警', 1: '报警' },
        蒸发器水流开关状态: { 0: '断开', 1: '闭合' },
        通讯状态: { 0: '未采集', 1: '正常采集', 2: '通讯故障' },
        冷凝器水流开关状态: { 0: '断开', 1: '闭合' },
        机组运行模式: { 0: '制冷', 1: '制热', 2: '制冰', 3: '自然冷却' },
        机组运行状态: { 0: '停止', 1: '运行' },
      },
      checkParams: {
        devID: '',
        page: 1,
        limit: 10,
      },
      deviceManageType: 'hostForm',
      addDialog: false,
      checkDialog: false,
      moreDialog: false,
      moreForm: {
        serialport: '',
        serialbaud: '',
        serialverif: '',
        serialstop: '',
        networkip: '',
        netport: '',
      },
      dialogTitle: '',
      params: {
        devname: '',
        type: '',
        devtypename: '',
        devState: '',
        commtype: '',
        page: 1,
        limit: 999,
      },
      paginationParams: {
        currentPage: 0,
        totalCount: 0,
        pageSize: 0,
      },
      tableData: [],
      devtypenameData: [],
      dialogTableData: [],
      dialogTableTotal: 0,
      timer1: null,
      timer2: null,
    }
  },
  computed: {
    ...mapGetters(['commtypeData', 'devstateData', 'typeData', 'hostMax']),
  },
  watch: {
    'params.type': {
      handler(val) {
        if (val !== '') {
          let params = { type: val }
          this.$apis.device.listDevType(params).then((res) => {
            let data = res.data
            data.forEach((item) => {
              item.label = item.name
            })
            this.devtypenameData = data
          })
        }
      },
    },
  },
  created() {
    this.getTableData()
    this.timer1 = setInterval(() => {
      this.getTableData()
    }, 1000 * 60)
  },
  methods: {
    getValueByName(value, name) {
      if (this.dataJson[name] && this.dataJson[name][value]) {
        value = Number(value)
        return this.dataJson[name][value]
      } else {
        return value
      }
    },
    getTableData() {
      this.$apis.device.selectDevicetable(this.params).then((res) => {
        this.tableData = res.data || []
      })
    },
    checkMore(row) {
      this.commtypeTu = row.commtype
      this.moreDialog = true
      for (let key in this.moreForm) {
        this.moreForm[key] = row[key]
      }
      // this.moreForm.serialport = row.serialport
      // this.moreForm.serialbaud = row.serialbaud
      // this.moreForm.serialverif = row.serialverif
      // this.moreForm.serialstop = row.serialstop
    },
    checkRow(row) {
      this.dialogTitle = row.devname
      this.checkDialog = true
      this.checkParams.devID = row.devid
      this.checkParams.pageNum = 1
      this.checkParams.pageSize = 10
      this.selectPointChListByDevID()
      this.timer2 = setInterval(() => {
        this.selectPointChListByDevID()
      }, 1000 * 60)
    },
    closeCheckDialog() {
      if (this.timer2) {
        clearInterval(this.timer2)
      }
    },
    selectPointChListByDevID() {
      this.$apis.device.selectPointChListByDevID(this.checkParams).then((res) => {
        this.dialogTableData = res.data || []
        this.dialogTableTotal = res.count
      })
    },
    deleteRow(row) {
      this.$confirm(`是否删除：${row.devname}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = { devid: row.devid }
        this.$apis.device.deleteDeviceInfo(params).then((res) => {
          this.getTableData()
          this.$message({ type: 'success', message: res.message || '操作成功' })
        })
      })
    },
    dialogSizeChange(val) {
      this.checkParams.limit = val
      this.selectPointChListByDevID()
    },
    dialogCurrentChange(val) {
      this.checkParams.page = val
      this.selectPointChListByDevID()
    },
    handleSizeChange(val) {
      this.params.limit = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getTableData()
    },
    async submitPj() {
      let state = await this.$refs.component.submitPj()
      if (state) {
        this.closeDialog()
        this.getTableData()
      }
    },
    closeDialog() {
      this.addDialog = false
    },
    getLabelByVal(arr, val) {
      let obj = arr.find((item) => item.value == val)
      if (obj) {
        return obj.label
      } else {
        return ''
      }
    },
    changeSwitch(row) {
      let sbsn = ''
      if (Number(row.devenable) === 1) {
        sbsn = '0'
      } else {
        sbsn = '1'
      }
      let params = { devid: row.devid, devenable: sbsn }
      this.$apis.device.updateDevEnable(params).then((res) => {
        this.getTableData()
        this.$message({ type: 'success', message: res.message })
      })
    },
  },
  destroyed() {
    if (this.timer1) {
      clearInterval(this.timer1)
    }
    if (this.timer2) {
      clearInterval(this.timer2)
    }
  },
}
</script>

<style lang="scss" scoped>
.v-device {
  background: #fff;
  border-radius: 5px;
  .my-dialog {
    .form-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      label {
        width: 80px;
        text-align: right;
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 14px;
        color: #606266;
        padding: 0 5px 0 0;
      }
    }
  }
}
</style>
