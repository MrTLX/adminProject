<template>
  <div class="v-pointWarn">
    <div class="the-header-line">
      <i class="el-icon-document"></i>
      <div class="big-item_title">报警列表</div>
    </div>
    <div style="padding: 10px 20px">
      <div class="search-div">
        <div class="search-div_left">
          <div>
            <label class="search-div_label">点解释:</label>
            <el-input size="mini" style="width: 200px" v-model="params.pointName" placeholder="请输入点名称" clearable></el-input>
          </div>
          <div>
            <label class="search-div_label">报警级别:</label>
            <el-select size="mini" style="width: 150px" v-model="params.alarmLevel">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in alarmLevelData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <el-button size="mini" type="primary" class="mr-4" @click="searchTable">查询</el-button>
          <el-button size="mini" type="primary" class="mr-4" @click="addRow">添加报警</el-button>
        </div>
        <div class="search-div_right"></div>
      </div>
      <el-table height="670" size="small" :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="Description" label="点解释" align="center"> </el-table-column>
        <el-table-column sortable prop="AlarmContent" label="报警内容" align="center"> </el-table-column>
        <el-table-column sortable prop="DevName" label="设备名称" align="center"> </el-table-column>
        <el-table-column sortable prop="ActivatEnable" label="激活使能" align="center">
          <template slot-scope="scope">
            <el-tag :type="Number(scope.row.ActivatEnable) === 0 ? 'success' : 'danger'" size="mini" effect="dark">
              {{ Number(scope.row.ActivatEnable) == 0 ? '激活' : '关闭' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable prop="AlarmLevel" label="报警级别" align="center">
          <template slot-scope="scope">
            <span :style="{ color: getAlarmLevelColor(scope.row.AlarmLevel) }">{{
              getLabelByVal(alarmLevelData, scope.row.AlarmLevel)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="TriggerCondition" label="逻辑符号" align="center">
          <template slot-scope="scope">
            {{ triggerConditionJson[scope.row.TriggerCondition] }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="RelationValue" label="逻辑值" align="center"> </el-table-column>
        <el-table-column sortable prop="PointName" label="点名称" align="center" width="240"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" v-if="Number(scope.row.delFlag) === 1 ? false : true">
            <el-button type="text" size="small" @click="startRow(scope.row)">
              {{ Number(scope.row.ActivatEnable) === 0 ? '关闭' : '激活' }}
            </el-button>
            <el-button type="text" size="small" @click="editRow(scope.row)"> 编辑 </el-button>
            <el-button type="text" size="small" @click="deleteRow(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotal"
      >
      </el-pagination>
    </div>
    <el-dialog
      custom-class="my-dialog"
      :close-on-click-modal="false"
      :title="addDialogTitle + '报警'"
      center
      width="500px"
      :visible.sync="addDialog"
    >
      <el-form :model="form" :rules="formRules" ref="alarmForm" label-width="100px">
        <template v-if="addDialogTitle === '编辑'">
          <el-form-item label="点解释："> {{ ponitDescriptio }} </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="设备名称：" prop="devName">
            <el-select size="mini" style="width: 250px" v-model="form.devName" placeholder="请选择设备类型" @change="changeDevName">
              <el-option v-for="(item, index) in devNameData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="点名称：" prop="pointName">
            <el-select
              style="width: 250px"
              v-model="form.pointName"
              filterable
              placeholder="请输入点名称"
              :remote-method="remoteMethodPoint"
              :loading="loadingPoint"
              size="mini"
            >
              <el-option v-for="(item, index) in optionsPoint" :key="index" :label="item.name" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="逻辑符号：" prop="triggerCondition">
          <el-radio-group v-model="form.triggerCondition">
            <el-radio label="0">> (大于)</el-radio>
            <el-radio label="1">= (等于)</el-radio>
            <el-radio label="2">< (小于)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="逻辑值：" prop="relationValue">
          <el-input
            size="mini"
            type="number"
            style="width: 200px"
            v-model.number="form.relationValue"
            oninput="if(value.length>8)value=value.slice(0,8)"
            placeholder="请输入逻辑值"
          ></el-input>
        </el-form-item>
        <el-form-item label="报警级别：" prop="alarmLevel">
          <el-radio-group v-model="form.alarmLevel">
            <el-radio v-for="(item, index) in alarmLevelData" :key="index" :label="item.value"
              >{{ item.value }} {{ `(${item.label})` }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报警内容：" prop="alarmContent">
          <el-input
            size="mini"
            type="textarea"
            :rows="3"
            style="width: 320px"
            v-model="form.alarmContent"
            placeholder="请输入报警内容"
          ></el-input>
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
  name: 'pointWarn',
  data() {
    return {
      tableTotal: 0,
      addDialogTitle: '',
      triggerConditionJson: {
        0: '>',
        1: '=',
        2: '<',
      },
      alarmLevelData: [],
      formRules: {
        devName: { required: true, message: '请选择设备名称', trigger: 'change' },
        pointName: { required: true, message: '请输入点名称', trigger: ['blur', 'change'] },
        triggerCondition: { required: true, message: '请选择逻辑符号', trigger: 'change' },
        relationValue: { required: true, message: '请输入逻辑值', trigger: 'blur' },
        alarmLevel: { required: true, message: '请选择报警级别', trigger: 'change' },
        alarmContent: [
          { required: true, message: '请输入报警内容', trigger: 'blur' },
          { max: 200, message: '长度不能超出200位' },
        ],
      },
      form: {
        devName: '',
        pointName: '',
        relationValue: '',
        triggerCondition: '0',
        alarmLevel: '',
        alarmContent: '',
      },
      addDialog: false,
      params: {
        pointName: '',
        alarmLevel: '',
        page: 1,
        limit: 10,
      },
      ponitDescriptio: '',
      tableData: [],
      devNameData: [],
      loadingPoint: false,
      optionsPoint: [],
      defaultAlarmLevel: '',
      chooseRow: {},
    }
  },
  created() {
    // 获取报警级别list
    this.selectAlarmLevelSetList()
    //获取设备名称list
    this.selectHostDeviceSelect()
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.$apis.pointWarn.selectDevicePoint(this.params).then((res) => {
        this.tableData = res.data || []
        this.tableTotal = res.count
      })
    },
    searchTable() {
      this.params.page = 1
      this.params.limit = 10
      this.getTableData()
    },
    selectAlarmLevelSetList() {
      let params = {
        page: 1,
        limit: 999,
      }
      this.$apis.pointWarn.selectAlarmLevelSetList(params).then((res) => {
        let data = res.data
        let arr = []
        data.forEach((item) => {
          let obj = { label: item.levelDes, value: item.alarmLevel + '' }
          arr.push(obj)
        })
        this.alarmLevelData = arr
        if (arr.length > 0) {
          this.defaultAlarmLevel = arr[0].value
        }
      })
    },
    startRow(row) {
      let s = 0
      if (row.ActivatEnable == 0) {
        s = 1
      }
      let params = {
        alarmRuleID: row.AlarmRuleID,
        activatEnable: s,
        relationValue: row.RelationValue,
      }
      this.$apis.pointWarn.updateAlarmRule(params).then((res) => {
        this.getTableData()
        this.$message.success(res.message)
      })
    },
    editRow(row) {
      this.addDialogTitle = '编辑'
      this.chooseRow = row
      this.ponitDescriptio = row.Description
      for (let key in this.form) {
        if (String(row[key]) !== 'null' || String(row[key]) !== 'undefined') {
          let rowKey = key[0].toUpperCase() + key.substr(1)
          this.form[key] = String(row[rowKey])
        } else {
          this.form[key] = ''
        }
      }
      if (row.devName) {
        // 获取 optionsPoint
        let obj = this.devNameData.find((item) => item.label === row.devName)
        let params = {
          devId: obj.value,
        }
        this.remoteMethodPoint(params)
      } else {
        let params = {
          tableType: 'mid',
        }
        this.remoteMethodPoint(params)
      }
      this.addDialog = true
    },
    deleteRow(row) {
      this.$confirm(`是否删除：${row.Description}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = {
          alarmRuleID: row.AlarmRuleID,
        }
        this.$apis.pointWarn.delAlarmRule(params).then((res) => {
          this.getTableData()
          this.$message.success(res.message)
        })
      })
    },
    addRow() {
      this.addDialogTitle = '添加'
      this.ponitDescriptio = ''
      for (let key in this.form) {
        if (key === 'triggerCondition') {
          this.form[key] = '0'
        } else if (key === 'alarmLevel') {
          this.form[key] = this.defaultAlarmLevel
        } else {
          this.form[key] = ''
        }
      }
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs.alarmForm.clearValidate()
      })
      // 默认查询所有点
      let params = {
        tableType: 'mid',
      }
      this.remoteMethodPoint(params)
    },
    selectHostDeviceSelect() {
      this.$apis.pointWarn.selectHostDeviceSelect().then((res) => {
        let data = res.data
        let arr = []
        data.forEach((item) => {
          let obj = { label: item.name, value: item.value }
          arr.push(obj)
        })
        this.devNameData = arr
      })
    },
    submitPj() {
      this.$refs.alarmForm.validate((validate) => {
        if (validate) {
          let params = this.form
          if (this.addDialogTitle === '添加') {
            this.$apis.pointWarn.addAlarmRule(params).then((res) => {
              this.addDialog = false
              this.$message.success(res.message)
              this.getTableData()
            })
          } else {
            params.alarmRuleID = this.chooseRow.AlarmRuleID
            params.pointName = this.chooseRow.PointName
            this.$apis.pointWarn.updateAlarmRule(params).then((res) => {
              this.addDialog = false
              this.$message.success(res.message)
              this.getTableData()
            })
          }
        } else {
          return false
        }
      })
    },
    getAlarmLevelColor(val) {
      let color = ''
      switch (Number(val)) {
        case 1:
          color = '#67c23a'
          break
        case 2:
          color = '#e6a23c'
          break
        case 3:
          color = '#f56c6c'
          break
      }
      return color
    },
    getLabelByVal(arr, val) {
      let obj = arr.find((item) => Number(item.value) === Number(val))
      if (obj) {
        return obj.label
      } else {
        return ''
      }
    },
    changeDevName(val) {
      this.form.pointName = ''
      let params = {
        devId: val,
      }
      this.remoteMethodPoint(params)
    },
    remoteMethodPoint(params) {
      this.loadingPoint = true
      this.$apis.pointWarn.selectPointByDev(params).then((res) => {
        this.loadingPoint = false
        this.optionsPoint = res.data
      })
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    },
  },
}
</script>

<style lang="scss" scoped>
.v-pointWarn {
  background: #fff;
  border-radius: 5px;
}
</style>
