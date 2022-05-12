<template>
  <div class="v-device_vir">
    <div class="the-header-line">
      <i class="el-icon-document"></i>
      <div class="big-item_title">资产列表</div>
    </div>
    <div style="padding: 10px 20px">
      <div class="search-div">
        <div class="search-div_left">
          <div>
            <label class="search-div_label">资产名称:</label>
            <el-input size="mini" style="width: 180px" v-model="params.virdevname" placeholder="请输入资产名称" clearable></el-input>
          </div>
          <div>
            <label class="search-div_label">资产类型:</label>
            <el-select size="mini" style="width: 180px" v-model="params.type">
              <el-option label="全部" value=""></el-option>
              <el-option label="主机" value="1"></el-option>
              <el-option label="电表" value="2"></el-option>
              <el-option label="温湿度" value="3"></el-option>
            </el-select>
          </div>
          <el-button size="mini" type="primary" class="mr-4" @click="getTableData">查询</el-button>
        </div>
        <div class="search-div_right"></div>
      </div>
      <el-table size="small" height="710" :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
        <el-table-column sortable prop="virdevname" label="资产名称" align="center"> </el-table-column>
        <el-table-column sortable prop="type" label="资产类型" align="center">
          <template slot-scope="scope">
            {{ typeJson[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column sortable prop="paramName" label="关键参数" align="center"> </el-table-column>
        <el-table-column sortable prop="paramValue" label="关键参数值" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkRow(scope.row)">{{ scope.row.virdevname }}详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog custom-class="my-dialog" :title="dialogTitle" center width="50%" :visible.sync="checkDialog" @close="closeCheckDialog">
      <el-table v-if="checkDialog" size="small" :data="dialogTableData" border height="452" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="paramName" label="参数名称" align="center"> </el-table-column>
        <el-table-column sortable prop="paramValue" label="参数值" align="center"> </el-table-column>
        <el-table-column sortable prop="pointUnit" label="单位" align="center"> </el-table-column>
        <el-table-column sortable prop="valueExplain" label="值解释" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'device_vir',
  data() {
    return {
      typeJson: {
        1: '主机',
        2: '电表',
        3: '温湿度',
      },
      checkDialog: false,
      dialogTitle: '',
      params: {
        type: '',
        virdevname: '',
        page: 1,
        limit: 999,
      },
      tableData: [],
      paramsOne: {
        page: 1,
        limit: 10,
        virDevId: '',
      },
      dialogTableData: [],
      dialogPaginationParams: {
        currentPage: 0,
        totalCount: 0,
        pageSize: 0,
      },
      spanArr: [],
      pos: 0,
      timer: null,
      timer1: null,
    }
  },
  created() {
    this.getTableData()
    this.timer = setInterval(() => {
      this.getTableData()
    }, 1000 * 60)
  },
  methods: {
    getTableData() {
      this.spanArr = []
      this.pos = 0
      this.tableData = []
      this.$apis.device_vir.selectVirDevicetable(this.params).then((res) => {
        let data = res.data || []
        this.getSpanArr(data)
        this.tableData = data
      })
    },
    checkRow(row) {
      this.dialogTitle = row.virdevname
      this.checkDialog = true
      this.paramsOne.pageNum = 1
      this.paramsOne.pageSize = 10
      this.paramsOne.virDevId = row.virdevid
      this.getTableDataOne()
      this.timer1 = setInterval(() => {
        this.getTableDataOne()
      }, 1000 * 60)
    },
    closeCheckDialog() {
      if (this.timer1) {
        clearInterval(this.timer1)
      }
    },
    getTableDataOne() {
      this.$apis.device_vir.selectVirHostParam(this.paramsOne).then((res) => {
        this.dialogTableData = res.data || []
      })
    },
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableDataOne()
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 4) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    // 计算需要合并的单元格
    getSpanArr(data) {
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].virdevname === data[i - 1].virdevname) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.timer1) {
      clearInterval(this.timer1)
    }
  },
}
</script>

<style lang="scss" scoped>
.v-device_vir {
  background: #fff;
  border-radius: 5px;
}
</style>
