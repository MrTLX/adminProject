<template>
  <div class="v-energy_saving_statistics">
    <div class="the-header" style="margin-bottom: 10px">
      <i class="el-icon-data-board"></i>
      <div class="big-item_title">节能模式选择</div>
    </div>
    <div class="mode-selection">
      <div>
        <label>AI节能模式使能</label>
        <el-switch v-model="showContext" active-text="激活" :active-value="1" :inactive-value="0" @change="changeSwitch"> </el-switch>
      </div>
      <div v-if="showContext === 1">
        <label>节能测算模式</label>
        <el-radio-group v-model="radio">
          <el-radio :label="0">节能率</el-radio>
          <el-radio :label="1">基准能耗</el-radio>
        </el-radio-group>
        <el-button type="primary" size="mini" @click="toDo">应用</el-button>
      </div>
    </div>
    <div class="table-div" v-if="showContext === 1">
      <div class="table-div-left">
        <div class="the-header">
          <i class="el-icon-data-line"></i>
          <div class="big-item_title">核定节能率</div>
          <div class="button-div">
            <el-button type="primary" size="mini" @click="checkOtherTable">既有模式清单</el-button>
          </div>
        </div>
        <el-table size="small" :data="tableData" border style="width: 100%; margin-top: 10px">
          <el-table-column sortable prop="statisticsmonth" label="月份" align="center"> </el-table-column>
          <el-table-column sortable prop="savingrate" label="节能率" align="center"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-div-right">
        <div class="the-header">
          <i class="el-icon-data-analysis"></i>
          <div class="big-item_title">基准能耗设置</div>
        </div>
        <el-table size="small" :data="tableDataOne" border style="width: 100%; margin-top: 10px">
          <el-table-column sortable prop="statisticsdate" label="月份" align="center"> </el-table-column>
          <el-table-column sortable prop="outlettemperature" label="基准能耗(kWh)" align="center"> </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editRowOne(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog custom-class="my-dialog" title="主机既有模式清单" center width="50%" :visible.sync="checkDialog">
      <el-table size="mini" :data="dialogTableData" border style="width: 100%">
        <el-table-column sortable prop="setmonth" label="月份" align="center"> </el-table-column>
        <el-table-column sortable prop="outlettemperature" label="出水温度(℃)" align="center"> </el-table-column>
        <el-table-column sortable prop="qhDate" label="既有模式切换日" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editDialogRow(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog custom-class="my-dialog" :title="editDialogInTitle" center width="400px" :visible.sync="editDialogIn" append-to-body>
        <el-form :model="inForm" :rules="inFormRules" ref="inDialogFrom" label-width="120px">
          <el-form-item label="出水温度：" prop="jyValue">
            <el-input-number size="mini" style="width: 200px" v-model="inForm.jyValue" controls-position="right"></el-input-number>
          </el-form-item>
          <el-form-item label="既有模式切换日：">
            <el-input size="mini" style="width: 200px" :value="inForm.dayValue" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitIn">提交</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog custom-class="my-dialog" :title="dialogTitle" center width="400px" :visible.sync="editDialog">
      <el-form :model="outForm" :rules="outFormRules" ref="outDialogFrom" label-width="100px">
        <el-form-item label="节能率：" v-if="defaultEditDialog === editDialogType[0]" prop="savingrate">
          <el-input-number
            size="mini"
            style="width: 200px"
            v-model.number="outForm.savingrate"
            controls-position="right"
            :precision="2"
            :step="0.1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="基准能耗：" v-if="defaultEditDialog === editDialogType[1]" prop="outlettemperature">
          <el-input-number
            size="mini"
            style="width: 200px"
            v-model.number="outForm.outlettemperature"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitOut">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'energy_saving_statistics',
  data() {
    return {
      outFormRules: {
        savingrate: [{ required: true, validator: this.validatorSavingrate, trigger: ['blur', 'change'] }],
        outlettemperature: [{ required: true, validator: this.validatorTem, trigger: ['blur', 'change'] }],
      },
      dialogTitle: '',
      editDialogIn: false,
      editDialogInTitle: '',
      inFormRules: {
        jyValue: [{ required: true, validator: this.validatorJyValue, trigger: ['blur', 'change'] }],
      },
      inForm: {
        id: '',
        setmonth: '',
        jyValue: '',
        dayValue: '',
      },
      editDialog: false,
      editDialogType: ['one', 'two'],
      defaultEditDialog: '',
      outForm: {
        statisticsdate: '',
        statisticsmonth: '',
        savingrate: '',
        outlettemperature: '',
      },
      checkDialog: false,
      showContext: 0,
      radio: 0,
      dialogTableData: [],
      tableData: [],
      tableDataOne: [],
      editObj: '',
      paramsOther: {
        page: 1,
        limit: 999,
      },
    }
  },
  watch: {
    showContext: {
      handler(val) {
        if (Number(val) === 1) {
          // 获取节能测算模式状态
          this.queryLastType()
          // 获取核定节能率表格
          this.selectSysMonthSavRateList()
          // 获取基准能耗设置表格
          this.selectSysMonthSavEnergyList()
        }
      },
    },
  },
  created() {
    // 获取AI节能模式使能状态
    this.sysDOAutoL()
  },
  methods: {
    validatorJyValue(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入出水温度'))
      } else {
        if (value < 0 || value > 100) {
          callback(new Error('数值范围：0~100'))
        }
        callback()
      }
    },
    validatorTem(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入基准能耗'))
      } else {
        if (value < 0 || value > 9999999) {
          callback(new Error('数值范围：0~9999999'))
        }
        callback()
      }
    },
    validatorSavingrate(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入节能率'))
      } else {
        if (value < -1 || value > 1) {
          callback(new Error('数值范围：-1~1'))
        }
        callback()
      }
    },
    toDo() {
      let params = {
        statisticsdate: this.getYYMM().yy + '-' + this.getYYMM().mm,
        type: this.radio,
      }
      this.$apis.energySaving.updateType(params).then((res) => {
        this.queryLastType()
        this.$message.success(res.message)
      })
    },
    selectSysMonthSavEnergyList() {
      let params = { ...this.paramsOther, searchType: '1', statisticsdate: '' }
      params.statisticsdate = this.getYYMM().yy
      this.$apis.energySaving.selectSysMonthSavEnergyList(params).then((res) => {
        this.tableDataOne = res.data || []
      })
    },
    selectSysMonthSavRateList() {
      let params = { ...this.paramsOther, searchType: '1', statisticsmonth: '', startDate: '', endDate: '' }
      params.statisticsmonth = this.getYYMM().yy
      params.startDate = this.getYYMM().yy + '-01'
      params.endDate = this.getYYMM().yy + '-' + this.getYYMM().mm
      this.$apis.energySaving.selectSysMonthSavRateList(params).then((res) => {
        this.tableData = res.data || []
      })
    },
    sysDOAutoL() {
      this.$apis.energySaving.sysDOAutoL().then((res) => {
        this.showContext = Number(res.data.StartValue)
      })
    },
    queryLastType() {
      let params = { startDate: new Date().format('yyyy-MM') }
      this.$apis.energySaving.queryLastType(params).then((res) => {
        this.radio = Number(res.data)
      })
    },
    // 获取既有模式表格
    selectSysDateExisting() {
      let params = { searchType: '1', year: '', startDate: '', endDate: '', page: 1, limit: 15 }
      params.year = this.getYYMM().yy
      params.startDate = this.getYYMM().yy + '-01'
      params.endDate = this.getYYMM().yy + '-' + this.getYYMM().mm
      this.$apis.energySaving.selectSysDateExisting(params).then((res) => {
        this.dialogTableData = res.data || []
      })
    },
    checkOtherTable() {
      this.checkDialog = true
      this.selectSysDateExisting()
    },
    changeSwitch(val) {
      this.showContext = 0
      let params = {
        state: val,
      }
      if (val === 1) {
        this.showContext = 0
      } else {
        this.showContext = 1
      }
      // 如果是关闭。给个提示弹框
      if (val === 0) {
        this.$confirm(`关闭后，部分功能可以无法正常使用,是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.setSwitch(params)
        })
      } else {
        this.setSwitch(params)
      }
    },
    setSwitch(params) {
      this.$apis.energySaving.setSwitch(params).then((res) => {
        this.showContext = params.state === 1 ? 0 : 1
        this.sysDOAutoL()
        this.$message.success(res.message)
      })
    },
    editRow(row) {
      this.editObj = '核定节能率'
      this.dialogTitle = row.statisticsmonth
      this.outForm.statisticsmonth = row.statisticsmonth
      this.outForm.savingrate = row.savingrate
      this.editDialog = true
      this.defaultEditDialog = this.editDialogType[0]
    },
    editRowOne(row) {
      this.editObj = '基准能耗'
      this.dialogTitle = row.statisticsdate + '月份'
      this.outForm.statisticsdate = row.statisticsdate
      this.outForm.outlettemperature = row.outlettemperature
      this.editDialog = true
      this.defaultEditDialog = this.editDialogType[1]
    },
    editDialogRow(row) {
      this.editDialogIn = true
      this.editDialogInTitle = row.setmonth + '月份'
      this.inForm.id = row.id || ''
      this.inForm.setmonth = row.setmonth || ''
      this.inForm.jyValue = row.outlettemperature || ''
      this.inForm.dayValue = row.qhDate || ''
    },
    submitOut() {
      this.$refs.outDialogFrom.validate((validate) => {
        if (validate) {
          if (this.editObj.includes('核定节能率')) {
            let params = {
              statisticsmonth: this.outForm.statisticsmonth,
              savingrate: this.outForm.savingrate,
            }
            this.$apis.energySaving.updateSavingRate(params).then((res) => {
              this.selectSysMonthSavRateList()
              this.editDialog = false
              this.$message.success(res.message)
            })
          } else {
            let params = {
              statisticsdate: this.outForm.statisticsdate,
              outlettemperature: this.outForm.outlettemperature,
            }
            this.$apis.energySaving.updateMonthSavEnergy(params).then((res) => {
              this.editDialog = false
              this.selectSysMonthSavEnergyList()
              this.$message.success(res.message)
            })
          }
        } else {
          return false
        }
      })
    },
    submitIn() {
      this.$refs.inDialogFrom.validate((validate) => {
        if (validate) {
          this.$apis.energySaving.updateDateExist(this.inForm).then((res) => {
            this.selectSysDateExisting()
            this.editDialogIn = false
            this.$message.success(res.message)
          })
          // })
        } else {
          return false
        }
      })
    },
    getYYMM() {
      // 获取当前年
      let yy = new Date().getFullYear()
      // 获取当前月份
      let mm = new Date().getMonth() + 1 > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      return { yy: yy, mm: mm }
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.v-energy_saving_statistics {
  padding: 10px 20px 20px 20px;
  background: #fff;
  border-radius: 5px;
  .mode-selection {
    display: flex;
    margin-bottom: 50px;
    > div {
      margin-right: 50px;
      display: flex;
      align-items: center;
      label {
        font-size: 14px;
        margin-right: 20px;
      }
    }
  }
  .table-div {
    display: flex;
    justify-content: space-between;
    > div {
      width: 48%;
    }
  }
  .the-header {
    position: relative;
    .button-div {
      position: absolute;
      right: 0;
    }
  }
}
</style>
