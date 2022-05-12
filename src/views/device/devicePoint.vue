<template>
  <div class="v-devicePoint">
    <div class="the-header-line">
      <i class="el-icon-document"></i>
      <div class="big-item_title">点位列表</div>
    </div>
    <div style="padding: 10px 20px">
      <div class="search-div">
        <div class="search-div_left">
          <div>
            <label class="search-div_label">点值类型:</label>
            <el-select size="mini" style="width: 180px" v-model="params.basictype">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in basictypeData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <label class="search-div_label">设备名称:</label>
            <el-select size="mini" style="width: 180px" v-model="params.devname">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in devnameData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <label class="search-div_label">点名称:</label>
            <el-input size="mini" style="width: 180px" v-model="params.pointname" placeholder="请输入点名称" clearable></el-input>
          </div>
          <el-button size="mini" type="primary" class="mr-4" @click="searchTable">查询</el-button>
        </div>
        <div class="search-div_right"></div>
      </div>
      <el-table height="670" size="small" :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="description" label="点说明" align="center"> </el-table-column>
        <el-table-column sortable prop="devname" label="关联设备名称" align="center"> </el-table-column>
        <el-table-column sortable prop="pointname" label="点名称" align="center" width="240"> </el-table-column>
        <el-table-column sortable prop="basictype" label="点值类型" align="center">
          <template slot-scope="scope">
            {{ getLabelByval(basictypeData, scope.row.basictype) }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="midtype" label="中间点类型" align="center">
          <template slot-scope="scope">
            {{ getLabelByval(midtypeData, scope.row.midtype) }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="startValue" label="点值" align="center"> </el-table-column>
        <el-table-column sortable prop="pointunit" label="单位" align="center"> </el-table-column>
        <el-table-column sortable prop="description" label="点解释" align="center"> </el-table-column>
        <el-table-column sortable prop="maxlimit" label="最大值" align="center"> </el-table-column>
        <el-table-column sortable prop="minlimit" label="最小值" align="center"> </el-table-column>
        <el-table-column sortable prop="reldevicech" label="通道编号" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editRow(scope.row)">编辑</el-button>
            <!--            <el-button v-if=" Number(scope.row.basictype) !== 5" type="text" size="small" @click="controlRow(scope.row)">控制</el-button>-->
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
    <el-dialog custom-class="my-dialog" :title="dialogtTitle" center width="400px" :visible.sync="editDialog">
      <el-form :model="form" :rules="formRules" ref="dialogFrom" label-width="100px">
        <el-form-item label="点名称：">
          <el-input size="mini" style="width: 200px" :value="form.pointname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="点说明：">
          <el-input size="mini" style="width: 200px" :value="form.description" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="最小值：" prop="minlimit">
          <el-input
            type="number"
            size="mini"
            style="width: 200px"
            v-model.number="form.minlimit"
            oninput="if(value.length>8)value=value.slice(0,8)"
            controls-position="right"
          ></el-input>
        </el-form-item>
        <el-form-item label="最大值：" prop="maxlimit">
          <el-input
            type="number"
            size="mini"
            style="width: 200px"
            v-model.number="form.maxlimit"
            oninput="if(value.length>8)value=value.slice(0,8)"
            controls-position="right"
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
  name: 'devicePoint',
  data() {
    return {
      basictypeTu: '',
      //中间点类型0:普通,1:系统统计点,2:电能统计点,3:天然气统计点,4:节能统计点;5:系统时间,6:系统日期
      midtypeData: [
        { label: '普通', value: '0' },
        { label: '系统统计点', value: '1' },
        { label: '电能统计点', value: '2' },
        { label: '天然气统计点', value: '3' },
        { label: '节能统计点', value: '4' },
        { label: '系统时间', value: '5' },
        { label: '系统日期', value: '6' },
      ],
      basictypeData: [],
      devnameData: [],
      dialogtTitle: '',
      editDialog: false,
      formRules: {
        minlimit: [{ required: true, validator: this.validateMinLimit, trigger: 'blur' }],
        maxlimit: [{ required: true, validator: this.validateMaxLimit, trigger: 'blur' }],
      },
      form: {
        pointguid: '',
        pointname: '',
        description: '',
        minlimit: '',
        maxlimit: '',
        startvalue: '',
      },
      dialogTitle: '',
      params: {
        basictype: '',
        devname: '',
        pointname: '',
        page: 1,
        limit: 10,
      },
      tableData: [],
      tableTotal: 0,
      dialogTableData: [
        {
          csmc: '参数名称',
          csz: '参数值',
          unit: '单位',
          zjs: '值解释',
        },
      ],
      dialogPaginationParams: {
        currentPage: 0,
        totalCount: 0,
        pageSize: 0,
      },
      timer: null,
    }
  },
  created() {
    // 获取设备名称list
    this.selectRelDeviceidTypeList()
    // 获取点值类型list
    this.selectPointTypeList()
    this.getTableData()
    this.timer = setInterval(() => {
      this.getTableData()
    }, 1000 * 60)
  },
  methods: {
    getTableData() {
      this.$apis.devicePoint.queryAllByLimit(this.params).then((res) => {
        this.tableData = res.data || []
        this.tableTotal = res.count
      })
    },
    searchTable() {
      this.params.page = 1
      this.params.limit = 10
      this.getTableData()
    },
    selectRelDeviceidTypeList() {
      this.$apis.devicePoint.selectRelDeviceidTypeList().then((res) => {
        let data = res.data
        let arr = []
        data.forEach((item) => {
          item.label = item.devname
          item.value = item.devname
          arr.push(item)
        })
        this.devnameData = arr
      })
    },
    selectPointTypeList() {
      this.$apis.devicePoint.selectPointTypeList().then((res) => {
        let data = res.data
        let arr = []
        data.forEach((item) => {
          item.label = item.basicTypeVo
          item.value = item.basicType
          arr.push(item)
        })
        this.basictypeData = arr
      })
    },
    editRow(row) {
      this.basictypeTu = Number(row.basictype)
      this.editDialog = true
      let str = this.basictypeTu === 5 ? '点编辑-' : '点控制-'
      this.dialogtTitle = str + row.description
      this.$nextTick(() => {
        this.$refs.dialogFrom.clearValidate()
      })
      for (let key in this.form) {
        this.form[key] = row[key]
      }
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getTableData()
    },
    handleSizeChange(val) {
      this.params.limit = val
      this.getTableData()
    },
    submitPj() {
      this.$refs.dialogFrom.validate((validate) => {
        if (validate) {
          if (this.dialogtTitle.includes('编辑')) {
            let params = {
              pointguid: this.form.pointguid,
              minlimit: this.form.minlimit,
              maxlimit: this.form.maxlimit,
            }
            this.$apis.devicePoint.updatePointLimit(params).then((res) => {
              this.editDialog = false
              this.getTableData()
              this.$message({ type: 'success', message: res.message || '操作成功' })
            })
          }
        } else {
          return false
        }
      })
    },
    // 验证点上限
    validateMaxLimit(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入最大值'))
      } else {
        if (this.form.minlimit !== '' && Number(value) < Number(this.form.minlimit)) {
          callback(new Error('不能低于最小值'))
        } else {
          callback()
        }
      }
    },
    // 验证点下限
    validateMinLimit(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入最小值'))
      } else {
        if (this.form.maxlimit !== '' && Number(value) > Number(this.form.maxlimit)) {
          callback(new Error('不能高于最大值'))
        } else {
          callback()
        }
      }
    },
    getLabelByval(data, val) {
      let obj = data.find((item) => Number(item.value) === Number(val))
      if (obj) {
        return obj.label
      } else {
        return ''
      }
    },
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
}
</script>

<style lang="scss" scoped>
.v-devicePoint {
  background: #fff;
  border-radius: 5px;
}
</style>
