<template>
  <div class="v-configuration">
    <div class="content-body">
      <div class="configurationManagement-header">
        <i class="el-icon-folder-opened"></i>
        <div class="big-item_title">项目信息</div>
        <el-button class="my-button" size="mini" type="primary" @click="editProject">修改</el-button>
      </div>
      <div class="the-content project-content">
        <div class="content-item" v-for="(tem, num) in projectData" :key="num">
          <div class="span-title">{{ tem.label }}：</div>
          <div>
            <el-input :readonly="true" size="mini" style="width: 180px" :value="tem.value"></el-input>
          </div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="configurationManagement-header">
        <i class="el-icon-setting"></i>
        <div class="big-item_title">基础信息</div>
      </div>
      <div class="the-content project-content">
        <div class="content-item">
          <div class="span-title">安全剩余空间：</div>
          <div>
            <el-input
              :readonly="true"
              size="mini"
              style="width: 180px"
              :class="{ 'waring-input': true }"
              :value="basicData.safe + 'MB'"
            ></el-input>
          </div>
        </div>
        <div class="content-item">
          <div class="span-title">系统剩余空间：</div>
          <div>
            <el-input :readonly="true" size="mini" style="width: 180px" :value="basicData.free + 'MB'"></el-input>
          </div>
        </div>
        <div class="content-item">
          <el-form class="ntp-from" :model="NTPForm" :rules="NTPFormRules" ref="NTPForm" label-width="120px">
            <el-form-item label="NTP时间同步：" prop="ntp">
              <el-input size="mini" style="width: 180px" v-model="NTPForm.ntp" placeholder="请输入域名或IP"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="ntp-button" type="primary" size="mini" @click="updateNTP()">确定</el-button>
        </div>
      </div>
    </div>
    <div class="content-body big-content_body">
      <div class="configurationManagement-header">
        <i class="el-icon-sort"></i>
        <div class="big-item_title">第三方平台对接</div>
        <el-button style="margin-left: 40px" size="mini" type="primary" @click="addPlatform">添加平台</el-button>
      </div>
      <div style="padding: 10px 20px 20px 20px">
        <el-table height="480" size="small" :data="tableData" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
          <el-table-column sortable prop="third_party_ip" label="第三方平台IP" align="center"> </el-table-column>
          <el-table-column sortable prop="third_party_name" label="登录用户名" align="center"> </el-table-column>
          <el-table-column sortable prop="System_config_client_id" label="客户端IP" align="center"> </el-table-column>
          <el-table-column sortable prop="third_party_type" label="设备编号" align="center"> </el-table-column>
          <el-table-column sortable prop="Reserved1" label="平台类型" align="center"> </el-table-column>
          <el-table-column sortable prop="third_party_state" label="平台使能" align="center">
            <template slot-scope="{ row }">
              <el-switch
                @change="changeSwitch(row)"
                :value="Number(row.third_party_state) === 0 ? true : false"
                :active-text="Number(row.third_party_state) === 0 ? '启用' : '停用'"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="eidtRow(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="editPwd(scope.row)">修改密码</el-button>
              <el-button type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
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
    </div>
    <el-dialog custom-class="my-dialog" title="修改项目信息" center width="45%" :visible.sync="editDialog">
      <el-form :model="projectForm" :rules="projectFormRules" ref="projectForm" label-width="90px">
        <el-form-item label="项目名称：" prop="ProjectName">
          <el-input size="mini" style="width: 200px" v-model="projectForm.ProjectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="上线时间：" prop="StartDate">
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            style="width: 200px"
            v-model="projectForm.StartDate"
            type="date"
            placeholder="选择上线时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所在区域：" prop="Division">
          <el-select size="mini" style="width: 200px" v-model="projectForm.Division">
            <el-option v-for="(item, index) in divisionData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目地点：" prop="Address">
          <el-cascader style="width: 200px" size="mini" :options="options" v-model="projectForm.Address" placeholder="请选择">
          </el-cascader>
        </el-form-item>
        <el-form-item style="width: 100%" label="项目描述：" prop="Overview">
          <el-input type="textarea" :rows="4" placeholder="请输入项目描述" v-model="projectForm.Overview"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitPj">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog custom-class="my-dialog" :title="platformDialogTitle" center width="45%" :visible.sync="addDialog">
      <el-form :model="platformForm" :rules="platformFormRules" ref="platformForm" label-width="100px">
        <el-form-item v-if="platformType === 'add'" label="平台使能：" prop="thirdPartyState">
          <el-radio-group v-model="platformForm.thirdPartyState">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备编号：" prop="thirdPartyType">
          <el-input
            size="mini"
            style="width: 200px"
            v-model.number="platformForm.thirdPartyType"
            oninput="if(value.length>15)value=value.slice(0,15)"
            placeholder="请输入设备编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户端ID：" prop="systemConfigClientId">
          <el-input
            size="mini"
            style="width: 200px"
            v-model.number="platformForm.systemConfigClientId"
            oninput="if(value.length>15)value=value.slice(0,15)"
            placeholder="请输入客户端ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台类型：" prop="reserved1">
          <el-select size="mini" style="width: 200px" v-model="platformForm.reserved1">
            <el-option label="湖南" value="1"></el-option>
            <el-option label="陕西" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台IP地址：" prop="thirdPartyIp">
          <el-input size="mini" style="width: 200px" v-model="platformForm.thirdPartyIp" placeholder="请输入平台IP地址"></el-input>
        </el-form-item>
        <el-form-item label="平台用户名：" prop="thirdPartyName">
          <el-input size="mini" style="width: 200px" v-model="platformForm.thirdPartyName" placeholder="请输入平台用户名"></el-input>
        </el-form-item>
        <el-form-item v-if="platformType === 'add'" label="平台密码：" prop="thirdPartyPwd">
          <el-input
            show-password
            size="mini"
            style="width: 200px"
            v-model="platformForm.thirdPartyPwd"
            placeholder="请输入平台密码"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="platformType === 'add'" label="确认密码：" prop="pwdAgain">
          <el-input show-password size="mini" style="width: 200px" v-model="platformForm.pwdAgain" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitPf">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog custom-class="my-dialog" title="修改密码" center width="480px" :visible.sync="pwdDialog">
      <el-form :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="100px">
        <el-form-item label="平台密码：" prop="oldPassWord" style="width: 100%">
          <el-input show-password size="mini" style="width: 200px" v-model="pwdForm.oldPassWord" placeholder="请输入平台密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="password" style="width: 100%">
          <el-input show-password size="mini" style="width: 200px" v-model="pwdForm.password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="passwordAgain" style="width: 100%">
          <el-input show-password size="mini" style="width: 200px" v-model="pwdForm.passwordAgain" placeholder="请输入确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitPw">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { provinceAndCityData, CodeToText, TextToCode } from 'element-china-area-data'
import { mapGetters } from 'vuex'
export default {
  name: 'configuration',
  data() {
    return {
      pwdDialog: false,
      pwdForm: {
        oldPassWord: '',
        password: '',
        passwordAgain: '',
      },
      pwdFormRules: {
        oldPassWord: { required: true, validator: this.validateOldPass, trigger: 'blur' },
        password: { required: true, validator: this.validatePwd, trigger: 'blur' },
        passwordAgain: { required: true, validator: this.validatePwd2, trigger: 'blur' },
      },
      NTPFormRules: {
        ntp: { required: true, validator: this.validateNtp, trigger: 'blur' },
      },
      NTPForm: {
        ntp: '',
      },
      options: provinceAndCityData,
      editDialog: false,
      projectForm: {
        ProjectName: '',
        Division: '', // 区域
        Overview: '',
        Address: '',
        StartDate: '',
      },
      projectData: [
        { label: '项目名称', value: '', key: 'ProjectName' },
        { label: '项目地点', value: '', key: 'Address' },
        { label: '所在区域', value: '', key: 'Division' },
        { label: '上线时间', value: '', key: 'StartDate' },
        { label: '项目描述', value: '', key: 'Overview' },
      ],
      platformType: 'add',
      platformDialogTitle: '',
      platformForm: {
        thirdPartyState: 0,
        thirdPartyType: '',
        thirdPartyIp: '',
        thirdPartyName: '',
        thirdPartyPwd: '',
        pwdAgain: '',
        systemConfigClientId: '',
        reserved1: '',
      },
      addDialog: false,
      platformFormRules: {
        thirdPartyType: { required: true, message: '请输入设备编号', trigger: 'blur' },
        systemConfigClientId: { required: true, message: '请输入客户端ID', trigger: 'blur' },
        reserved1: { required: true, message: '请选择平台类型', trigger: 'change' },
        thirdPartyIp: { required: true, validator: this.validateIP, trigger: 'blur' },
        thirdPartyName: { required: true, message: '请输入平台用户名', trigger: 'blur' },
        thirdPartyPwd: { required: true, validator: this.validatePass, trigger: 'blur' },
        pwdAgain: { required: true, validator: this.validatePass2, trigger: 'blur' },
      },
      projectFormRules: {
        ProjectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { max: 20, message: '长度不能超出20位' },
        ],
        StartDate: { required: true, message: '请输入上线时间', trigger: 'change' },
        Address: [{ required: true, message: '请选择项目地点', trigger: 'change' }],
        Division: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
        Overview: [
          { required: true, message: '请输入项目描述', trigger: 'blur' },
          { max: 200, message: '长度不能超出200位' },
        ],
      },
      divisionData: [
        { label: '华中', value: '1' },
        { label: '华北', value: '2' },
        { label: '华南', value: '3' },
        { label: '华西', value: '4' },
        { label: '华东', value: '5' },
      ],
      NTP: '',
      basicData: {
        safe: '100',
        free: '',
      },
      params: {
        page: 1,
        limit: 15,
      },
      tableTotal: 0,
      tableData: [],
      checkRow: {},
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
          let data = val
          this.projectData.forEach((item) => {
            if (data[item.key]) {
              let value = data[item.key]
              if (item.key === 'Division') {
                value = this.$utils.getLabelByval(this.divisionData, value)
              }
              item.value = value
            } else {
              item.value = ''
            }
          })
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
      // 基础配置
      this.getBasicInfo()
      // 第三方平台列表
      this.selectSystemConfigInfo()
    },
    getBasicInfo() {
      // this.$apis.configuration.getBasicConfig().then((res) => {
      //   let data = res.data || {}
      //   this.NTPForm.ntp = data.ntp || ''
      // })
      this.$apis.configuration.SystemTunerPro().then((res) => {
        let data = res.data || {}
        this.basicData.free = data.memory.free
      })
    },
    selectSystemConfigInfo() {
      this.$apis.configuration.selectSystemConfigInfo(this.params).then((res) => {
        this.tableTotal = res.count
        this.tableData = res.data
      })
    },
    validateNtp(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入域名或IP'))
      } else {
        let hostReg =
          /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        let regIp =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (hostReg.test(value) || regIp.test(value)) {
          callback()
        } else {
          callback(new Error('域名或IP不合法'))
        }
      }
    },
    validateIP(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入平台IP地址'))
      } else {
        let regIp =
          /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (regIp.test(value)) {
          callback()
        } else {
          callback(new Error('IP不合法'))
        }
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入平台密码'))
      } else {
        if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度为6-20位'))
        } else if (this.platformForm.pwdAgain !== '') {
          this.$refs.platformForm.validateField('pwdAgain')
        }
        callback()
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度为6-20位'))
      } else if (value !== this.platformForm.thirdPartyPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    validateOldPass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入平台密码'))
      } else {
        // 密码长度最少为6位
        if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度为6-20位'))
        } else if (this.pwdForm.password === value) {
          callback(new Error('新密码不能与旧密码一致'))
        } else {
          callback()
        }
      }
    },
    validatePwd(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (value.length < 6 || value.length > 20) {
          callback(new Error('密码长度为6-20位'))
        } else if (this.pwdForm.passwordAgain !== '') {
          this.$refs.pwdForm.validateField('passwordAgain')
        } else if (this.pwdForm.oldPassWord === value) {
          callback(new Error('新密码不能与旧密码一致'))
        } else {
          callback()
        }
      }
    },
    validatePwd2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度为6-20位'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    editProject() {
      //address转code
      let newArr = []
      let newProjectInfo = this.$utils.deepClone(this.projectInfo)
      if (newProjectInfo.Address !== '') {
        let arr = this.projectInfo.Address.split('/')
        let a = TextToCode[arr[0]].code
        let b = TextToCode[arr[0]][arr[1]].code
        // let c = TextToCode[arr[0]][arr[1]][arr[2]].code
        newArr = [a, b]
      }
      newProjectInfo.Address = newArr
      this.projectForm = JSON.parse(JSON.stringify(newProjectInfo))
      this.editDialog = true
      this.$nextTick(() => {
        this.$refs.projectForm.resetFields()
      })
    },
    updateNTP() {
      this.$refs.NTPForm.validate((validate) => {
        if (validate) {
          let params = { url: this.NTPForm.ntp }
          this.$apis.configuration.updateDate(params).then((res) => {
            this.$message.success(res.message)
          })
        } else {
          return false
        }
      })
    },
    addPlatform() {
      this.platformDialogTitle = '添加平台'
      this.platformType = 'add'
      this.addDialog = true
      this.platformForm = {
        thirdPartyState: 0,
        thirdPartyType: '',
        thirdPartyIp: '',
        thirdPartyName: '',
        thirdPartyPwd: '',
        pwdAgain: '',
        systemConfigClientId: '',
        reserved1: '',
      }
    },
    eidtRow(row) {
      this.checkRow = row
      this.platformDialogTitle = '编辑平台'
      this.platformType = 'edit'
      this.addDialog = true
      this.platformForm.thirdPartyType = row.third_party_type
      this.platformForm.systemConfigClientId = row.System_config_client_id
      this.platformForm.reserved1 = row.Reserved1
      this.platformForm.thirdPartyIp = row.third_party_ip
      this.platformForm.thirdPartyName = row.third_party_name
    },
    editPwd(row) {
      this.checkRow = row
      this.pwdDialog = true
      this.$nextTick(() => {
        this.$refs.pwdForm.resetFields()
      })
    },
    deleteRow(row) {
      this.$confirm(`是否删除：${row.third_party_ip}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let params = { id: row.System_config_client_id }
        this.$apis.configuration.delSystemConfig(params).then((res) => {
          this.$message.success(res.message)
          this.selectSystemConfigInfo()
        })
      })
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    submitPj() {
      this.$refs.projectForm.validate((validate) => {
        if (validate) {
          // 对address进行转码
          let newParams = this.$utils.deepClone(this.projectForm)
          let addressCode = newParams.Address
          let addressText = ''
          addressCode.forEach((item) => {
            addressText += CodeToText[item] + '/'
          })
          addressText = addressText.substring(0, addressText.length - 1)
          newParams.Address = addressText
          this.$apis.configuration.setProjectInfo(newParams).then((res) => {
            this.$message.success(res.message)
            this.editDialog = false
            this.getProjectInfo()
          })
        } else {
          return false
        }
      })
    },
    submitPf() {
      this.$refs.platformForm.validate((validate) => {
        if (validate) {
          let params = this.$utils.deepClone(this.platformForm)
          delete params.pwdAgain
          if (this.platformType === 'add') {
            this.$apis.configuration.addSystemConfig(params).then((res) => {
              this.$message.success(res.message)
              this.addDialog = false
              this.selectSystemConfigInfo()
            })
          } else {
            delete params.thirdPartyState
            delete params.thirdPartyPwd
            params.systemConfigId = this.checkRow.System_config_client_id
            this.$apis.configuration.editSystemConfig(params).then((res) => {
              this.$message.success(res.message)
              this.addDialog = false
              this.selectSystemConfigInfo()
            })
          }
        } else {
          return false
        }
      })
    },
    submitPw() {
      let params = {
        thirdPartyPwd: this.pwdForm.password,
        systemConfigId: this.checkRow.System_config_client_id,
      }
      this.$apis.configuration.editSystemConfig(params).then((res) => {
        this.$message.success(res.message)
        this.pwdDialog = false
        this.selectSystemConfigInfo()
      })
    },
    changeSwitch(row) {
      let params = { state: row.third_party_state, id: row.System_config_id }
      this.$apis.configuration.switchSystemConfigInfo(params).then((res) => {
        this.$message.success(res.message)
        this.selectSystemConfigInfo()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.v-configuration {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 100%;
  .content-body {
    margin-bottom: 20px;
    min-height: 180px;
    width: calc(50% - 10px);
    background: #fff;
    border-radius: 5px;
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
        position: relative;
        display: flex;
        align-items: center;
        height: 50px;
        .ntp-from {
          margin-top: 10px;
          /deep/.el-form-item__label {
            padding-right: 5px;
            color: #000;
          }
        }
        .ntp-button {
          position: absolute;
          top: 6px;
          right: 20px;
        }
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
  }
  .big-content_body {
    margin-bottom: 0;
    width: 100%;
  }
  .waring-input {
    /deep/.el-input__inner {
      color: #f56c6c;
    }
  }
  .my-dialog {
    .el-form {
      padding: 0 40px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-form-item {
        width: 50%;
        /deep/.el-form-item__label {
          padding: 0 5px 0 0;
        }
      }
    }
    .dialog-div {
      > div {
        height: 50px;
        display: flex;
        align-items: center;
      }
      .upload-demo {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
      }
      .el-upload-list__item:first-child {
        margin-top: 0;
      }
    }
    .dialog-footer {
      .el-button--primary {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }
  /deep/.el-input__inner:focus {
    border-color: #dcdfe6;
  }
}
</style>
