<template>
  <div class="v-energy_saving_ruleConfig">
    <div class="the-header-line">
      <i class="el-icon-document"></i>
      <div class="big-item_title">策略列表</div>
    </div>
    <div style="padding: 10px 20px">
      <el-table size="small" height="760" :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="Description" label="策略描述" align="center"> </el-table-column>
        <el-table-column sortable prop="ActiveState" label="激活状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="Number(scope.row.ActiveState) === 1 ? 'success' : 'danger'" size="mini" effect="dark">
              {{ Number(scope.row.ActiveState) === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable prop="RunInterval" label="规则运行周期(秒)" align="center"> </el-table-column>
        <el-table-column sortable prop="StartWaitTime" label="规则起始延迟时间(秒)" align="center"> </el-table-column>
        <el-table-column sortable prop="RunType" label="AI模块运行类型(单次/持续)" align="center">
          <template slot-scope="scope">
            <el-tag :type="Number(scope.row.RunType) === 1 ? 'success' : 'dark'" size="mini" effect="dark">
              {{ Number(scope.row.RunType) === 1 ? '持续' : '单次' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="startRow(scope.row)">
              {{ Number(scope.row.ActiveState) === 0 ? '启用' : '停用' }}
            </el-button>
            <el-button type="text" size="small" @click="checkRow(scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog custom-class="my-dialog" :title="checkDialogTitle" center width="50%" :visible.sync="checkDialog">
      <el-table size="small" v-if="checkDialog" :data="dialogTableData" border style="width: 100%" :height="452">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="ParamName" label="参数名称" align="center" width="200px"> </el-table-column>
        <el-table-column sortable prop="ParamType" label="参数类型" align="center">
          <template slot-scope="scope" style="display: table-cell">
            {{ paramTypeJson[scope.row.ParamType] }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="PointName" label="点名称" align="center" width="200px"> </el-table-column>
        <el-table-column sortable prop="StartValue" label="点值" align="center"> </el-table-column>
        <el-table-column sortable prop="PointUnit" label="点单位" align="center">
          <template slot-scope="scope">
            {{ pointUnitJson[scope.row.PointUnit] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" v-if="Number(scope.row.ParamType) === 3">
            <el-button type="text" size="mini" style="padding: 4px 15px" @click="editCheckRow(scope.row)">控制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="dialogSizeChange"
        @current-change="dialogCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dialogTableTotal"
      >
      </el-pagination>
      <el-dialog custom-class="my-dialog" title="点值控制" center width="400px" :visible.sync="editDialogIn" append-to-body>
        <el-form :model="inForm" :rules="inFormRules" ref="inDialogFrom" label-width="120px">
          <el-form-item label="点值" prop="StartValue">
            <el-input-number
              size="mini"
              :precision="2"
              style="width: 200px"
              v-model="inForm.StartValue"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="submitIn">提交</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog custom-class="my-dialog" title="编辑规则" center width="400px" :visible.sync="editDialog">
      <el-form :model="form" :rules="formRules" ref="dialogFrom" label-width="120px">
        <el-form-item label="运行周期：" prop="runInterval">
          <el-input
            size="mini"
            type="number"
            style="width: 200px"
            v-model.number="form.runInterval"
            oninput="if(value.length>8)value=value.slice(0,8)"
            placeholder="请输入运行周期"
          ></el-input>
        </el-form-item>
        <el-form-item label="起始延迟时间：" prop="startWaitTime">
          <el-input
            size="mini"
            type="number"
            style="width: 200px"
            v-model.number="form.startWaitTime"
            oninput="if(value.length>8)value=value.slice(0,8)"
            placeholder="请输入起始延迟时间"
          ></el-input>
        </el-form-item>
        <el-form-item label="运行类型：">
          <el-select size="mini" style="width: 200px" v-model="form.runType" placeholder="请选择">
            <el-option label="单次" :value="0"></el-option>
            <el-option label="持续" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitPj">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'energy_saving_ruleConfig',
  data() {
    return {
      dialogTableTotal: 0,
      //参数单位(0：无单位；1、%；2、℃；3、Hour；4、KJ；5、KW；6、KWh；7、s；8、m³；9、m³/h；10、Nm³；11、Sec ）
      pointUnitJson: {
        0: '无单位',
        1: '%',
        2: '℃',
        3: 'Hour',
        4: 'KJ',
        5: 'KW',
        6: 'KWh',
        7: 'S',
        8: 'm³',
        9: 'm³/h',
        10: 'Nm³',
        11: 'Sec',
      },
      paramTypeJson: {
        1: '入参',
        2: '出参',
        3: '中间点',
      },
      editDialog: false,
      formRules: {
        runInterval: [{ required: true, message: '请输入运行周期', trigger: 'blur' }],
        startWaitTime: [{ required: true, message: '请输入延迟时间', trigger: 'blur' }],
      },
      form: {
        ruleID: '',
        runInterval: '',
        startWaitTime: '',
        runType: '',
      },
      editDialogIn: false,
      inFormRules: {
        StartValue: [{ required: true, validator: this.validatorStartValue, trigger: ['blur', 'change'] }],
      },
      inForm: {
        PointName: '',
        StartValue: '',
      },
      checkDialogTitle: '',
      checkDialog: false,
      dialogParams: {
        RuleID: '',
        limit: 10,
        page: 1,
      },
      dialogTableData: [],
      dialogPaginationParams: {
        currentPage: 0,
        totalCount: 0,
        pageSize: 0,
      },
      params: {
        pageSize: 1,
        pageNum: 10,
      },
      tableData: [],
      paginationParams: {
        currentPage: 0,
        totalCount: 0,
        pageSize: 0,
      },
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    validatorStartValue(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入点值'))
      } else {
        if (value < 0 || value > 99999) {
          callback(new Error('数值范围：0~99999'))
        }
        callback()
      }
    },
    getTableData() {
      this.$apis.energyPolicy.selectPolicyConfig().then((res) => {
        this.tableData = res.data || []
      })
    },
    startRow(row) {
      let s = 0
      if (Number(row.ActiveState) === 0) {
        s = 1
      }
      let params = {
        id: row.RuleID,
        state: s,
      }
      this.$apis.energyPolicy.switchPolicyConfig(params).then((res) => {
        this.getTableData()
        this.$message.success(res.message)
      })
      // switchPolicyConfig(params).then(res => {
      //   if (res.data.success) {
      //     this.getTableData()
      //     this.$message({ type: 'success', message: res.data.message })
      //   }
      // })
    },
    checkRow(row) {
      this.dialogParams.pageNum = 1
      this.dialogParams.pageSize = 10
      this.dialogParams.RuleID = row.RuleID
      this.checkDialogTitle = row.Description
      this.checkDialog = true
      this.selectPolicyConfigDetails()
    },
    selectPolicyConfigDetails() {
      this.$apis.energyPolicy.selectPolicyConfigDetails(this.dialogParams).then((res) => {
        this.dialogTableData = res.data || []
        this.dialogTableTotal = res.count
      })
    },
    editRow(row) {
      this.form.ruleID = row.RuleID
      this.form.runInterval = row.RunInterval
      this.form.runType = row.RunType
      this.form.startWaitTime = row.StartWaitTime
      this.editDialog = true
      this.$nextTick(() => {
        this.$refs.dialogFrom.clearValidate()
      })
    },
    editCheckRow(row) {
      this.editDialogIn = true
      this.inForm.PointName = row.PointName
      this.inForm.StartValue = row.StartValue
    },
    submitPj() {
      this.$apis.energyPolicy.setRule(this.form).then((res) => {
        this.getTableData()
        this.editDialog = false
        this.$message.success(res.message)
      })
    },
    submitIn() {
      this.$refs.inDialogFrom.validate((validate) => {
        if (validate) {
          this.$apis.energyPolicy.setRuleConfigDetails(this.inForm).then((res) => {
            this.selectPolicyConfigDetails()
            this.editDialogIn = false
            this.$message.success(res.message)
          })
        } else {
          return false
        }
      })
    },
    dialogCurrentChange(val) {
      this.dialogParams.page = val
      this.selectPolicyConfigDetails()
    },
    dialogSizeChange(val) {
      this.dialogParams.limit = val
      this.selectPolicyConfigDetails()
    },
  },
}
</script>

<style lang="scss" scoped>
.v-energy_saving_ruleConfig {
  background: #fff;
  border-radius: 5px;
}
</style>
