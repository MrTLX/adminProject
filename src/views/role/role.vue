<template>
  <div class="v-role">
    <div class="the-header-line">
      <i class="el-icon-document"></i>
      <div class="big-item_title">用户列表</div>
    </div>
    <div style="padding: 10px 20px">
      <el-table size="small" :data="tableData" border height="760" style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
        <el-table-column sortable prop="username" label="用户名" align="center"> </el-table-column>
        <el-table-column sortable prop="userlevel" label="用户等级" align="center"> </el-table-column>
        <el-table-column sortable prop="lastlogintime" label="登录时间" align="center"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updatePS(scope.row)">修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog custom-class="my-dialog" title="修改密码" center width="450px" :visible.sync="editDialog">
      <el-form :rules="formRules" :model="form" ref="userDialogFrom" label-width="120px">
        <el-form-item label="旧密码：" prop="oldPassWord">
          <el-input size="mini" placeholder="请输入密码" v-model="form.oldPassWord" style="width: 220px" show-password></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input size="mini" placeholder="请输入密码" v-model="form.password" style="width: 220px" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="passwordAgain">
          <el-input size="mini" placeholder="请输入密码" v-model="form.passwordAgain" style="width: 220px" show-password></el-input>
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
  name: 'role',
  data() {
    return {
      params: {
        page: 1,
        limit: 15,
      },
      formRules: {
        oldPassWord: [{ required: true, validator: this.validateOldPass, trigger: 'blur' }],
        password: [{ required: true, validator: this.validatePass, trigger: 'blur' }],
        passwordAgain: [{ required: true, validator: this.validatePass2, trigger: 'blur' }],
      },
      form: {
        oldPassWord: '',
        password: '',
        passwordAgain: '',
      },
      editDialog: false,
      tableData: [],
      defaultRow: {},
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.$apis.role.getUser(this.params).then((res) => {
        this.tableData = res.data
      })
    },
    submitPj() {
      this.$refs.userDialogFrom.validate((validate) => {
        if (validate) {
          let params = {
            passWord: this.form.password,
            oldPassWord: this.form.oldPassWord,
            userid: this.defaultRow.userid,
          }
          this.$apis.role.updatePassword(params).then((res) => {
            this.getTableData()
            this.editDialog = false
            this.$message.success(res.message)
          })
        } else {
          return false
        }
      })
    },
    updatePS(row) {
      this.defaultRow = row
      this.editDialog = true
      this.$nextTick(() => {
        this.$refs.userDialogFrom.resetFields()
      })
    },
    validateOldPass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
        if (!reg.test(value)) {
          callback(new Error('密码的格式为6-12位，包含字母和数字'))
        } else if (this.form.password === value) {
          callback(new Error('新密码不能与旧密码一致'))
        } else {
          callback()
        }
      }
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
        if (!reg.test(value)) {
          callback(new Error('密码的格式为6-12位，包含字母和数字'))
        } else if (this.form.passwordAgain !== '') {
          this.$refs.userDialogFrom.validateField('passwordAgain')
        } else if (this.form.oldPassWord === value) {
          callback(new Error('新密码不能与旧密码一致'))
        } else {
          callback()
        }
      }
    },
    validatePass2(rule, value, callback) {
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (!reg.test(value)) {
        callback(new Error('密码的格式为6-12位，包含字母和数字'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-role {
  background: #fff;
  border-radius: 5px;
}
</style>
