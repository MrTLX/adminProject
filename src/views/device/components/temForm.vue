<template>
  <el-form :model="form" :rules="formRules" ref="temForm" label-width="90px">
    <el-form-item label="设备类型：" prop="devtypeid">
      <el-select size="mini" style="width: 200px" v-model="form.devtypeid" placeholder="请选择设备类型" @change="changeDevtypename">
        <el-option v-for="(item, index) in devtypenameData" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备名称：" prop="devname">
      <el-input size="mini" style="width: 200px" v-model="form.devname" placeholder="请输入设备名称"></el-input>
    </el-form-item>
    <el-form-item label="对应资产：" prop="virDeviceArr">
      <el-input :readonly="true" size="mini" style="width: 200px" v-model="form.virDeviceArr" placeholder="请输入对应资产"></el-input>
    </el-form-item>
    <el-form-item label="安装地点：" prop="temperatureType">
      <el-radio-group v-model="form.temperatureType">
        <el-radio label="0">室内</el-radio>
        <el-radio label="1">室外</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="采集地址：" prop="commaddr">
      <el-input-number style="width: 200px" size="mini" v-model="form.commaddr" controls-position="right" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="通讯方式：" prop="commtype">
      <el-select size="mini" style="width: 200px" v-model="form.commtype" placeholder="请选择">
        <el-option label="LoRa" value="5"></el-option>
        <el-option label="LORA_PUB" value="8"></el-option>
        <el-option label="NB-IOT" value="6"></el-option>
      </el-select>
    </el-form-item>
    <template v-if="Number(form.commtype) === 6">
      <el-form-item label="SN：" prop="networkip">
        <el-input size="mini" style="width: 200px" v-model="form.networkip" placeholder="请输入SN"></el-input>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="网络IP：" prop="networkip">
        <el-input size="mini" style="width: 200px" v-model="form.networkip" placeholder="请输入网络IP"></el-input>
      </el-form-item>
      <el-form-item label="网络端口：" prop="netport">
        <el-input size="mini" style="width: 200px" v-model="form.netport" placeholder="请输入网络端口"></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
export default {
  name: 'temForm',
  data() {
    return {
      fileList: [],
      virDeviceNum: 0,
      formRules: {
        devtypeid: { required: true, message: '请选择设备类型', trigger: 'change' },
        devname: [
          { required: true, message: '请输入设备名称', trigger: ['blur', 'change'] },
          { max: 20, message: '长度不能超出20位' },
        ],
        virDeviceArr: { required: true, message: '请输入对应资产', trigger: 'change' },
        temperatureType: { required: true, message: '请选择安装地点', trigger: 'change' },
        commtype: { required: true, message: '请选择通讯方式', trigger: 'change' },
        networkip: [{ required: true, validator: this.validatorIp, trigger: 'blur' }],
        netport: [
          { required: true, message: '请输入网络端口', trigger: 'blur' },
          { max: 5, message: '长度不能超出5位' },
        ],
        commaddr: { required: true, message: '请输入采集地址', trigger: 'blur' },
      },
      form: {
        type: '3',
        devtypeid: '',
        devtypename: '',
        devstate: 0,
        devname: '',
        virDeviceArr: [],
        temperatureType: '0',
        commtype: '5',
        networkip: '',
        netport: '',
        commaddr: 0,
      },
      devtypenameData: [],
      file: '',
    }
  },
  created() {
    // 获取设备类型
    this.getListDevType()
    // 判断已有设备位数
    this.searchVirHostDevLast()
  },
  methods: {
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
    submitPj() {
      return new Promise((resolve) => {
        this.$refs.temForm.validate((valid) => {
          if (valid) {
            this.$apis.device.addDeviceHostInfo(this.form).then((res) => {
              this.$message({ type: 'success', message: res.data.message || '操作成功' })
              resolve(true)
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    restFrom() {
      this.$refs.temForm.resetFields()
    },
    searchVirHostDevLast() {
      let params = { type: '3' }
      this.$apis.device.searchVirHostDevLast(params).then((res) => {
        this.virDeviceNum = Number(res.data)
      })
    },
    getListDevType() {
      let params = { type: '3' }
      this.$apis.device.listDevType(params).then((res) => {
        let data = res.data
        data.forEach((item) => {
          item.label = item.name
        })
        this.devtypenameData = data
      })
    },
    changeDevtypename(val) {
      let obj = this.devtypenameData.find((item) => item.value === val)
      this.form.devtypename = obj.label
      this.form.devname = obj.label + '-' + (this.virDeviceNum + 1)
      this.form.virDeviceArr = [this.virDeviceNum + 1 + '#温湿度']
    },
    handleChangeFile(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
  },
}
</script>

<style scoped lang="scss">
.el-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .el-form-item {
    width: 50%;
    align-self: flex-start;
  }
}
</style>
