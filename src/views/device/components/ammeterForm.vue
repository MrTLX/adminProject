<template>
  <el-form :model="form" :rules="formRules" ref="ammeterForm" label-width="90px">
    <el-form-item label="主机设备：" prop="parentDevId">
      <el-select size="mini" style="width: 200px" v-model="form.parentDevId" placeholder="请选择主机设备" @change="changeVirdev">
        <el-option v-for="(item, index) in virdevData" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="主机资产：" prop="virdevId">
      <el-select size="mini" style="width: 200px" v-model="form.virdevId" placeholder="请选择主机资产">
        <el-option v-for="(item, index) in virdevIdData" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备类型：" prop="devtypeid">
      <el-select size="mini" style="width: 200px" v-model="form.devtypeid" placeholder="请选择设备类型" @change="changeDevtypename">
        <el-option v-for="(item, index) in devtypenameData" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="资产名称：" prop="devtypename">
      <el-input size="mini" style="width: 200px" v-model="form.devtypename" placeholder="请输入资产名称"></el-input>
    </el-form-item>
    <el-form-item label="对应设备：" prop="virDeviceArr">
      <el-input
        :readonly="true"
        size="mini"
        style="width: 200px"
        v-for="(item, index) in virDeviceArr"
        :key="index"
        v-model="item.value"
        placeholder="请输入对应设备"
      ></el-input>
    </el-form-item>
    <el-form-item label="采集地址：" prop="commAddrArr">
      <el-input-number
        style="width: 200px"
        size="mini"
        v-for="(item, index) in commAddrArr"
        :key="index"
        v-model="item.value"
        controls-position="right"
        :min="0"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="通讯方式：" prop="commtype">
      <el-select size="mini" style="width: 200px" v-model="form.commtype" placeholder="请选择">
        <el-option label="串口" value="1"></el-option>
        <el-option label="网口" value="2"></el-option>
      </el-select>
    </el-form-item>
    <template v-if="Number(form.commtype) === 1">
      <el-form-item label="串口端口：" prop="serialport">
        <el-select size="mini" style="width: 200px" v-model="form.serialport" placeholder="请选择串口端口">
          <el-option v-for="(item, index) in serialbaudData" :key="index" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="波特率：" prop="serialbaud">
        <el-select size="mini" style="width: 200px" v-model="form.serialbaud" placeholder="请选择波特率">
          <el-option label="4800" value="4800"></el-option>
          <el-option label="9600" value="9600"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="校验位：" prop="serialverif">
        <el-select size="mini" style="width: 200px" v-model="form.serialverif" placeholder="请选择校验位">
          <el-option v-for="(item, index) in serialverifData" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="停止位：" prop="serialstop">
        <el-select size="mini" style="width: 200px" v-model="form.serialstop" placeholder="请选择停止位">
          <el-option label="0" value="0"></el-option>
          <el-option label="1" value="1"></el-option>
        </el-select>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="网络IP：" prop="networkipArr">
        <el-input
          size="mini"
          style="width: 200px"
          v-for="(item, index) in networkipArr"
          :key="index"
          v-model="item.value"
          placeholder="请输入网络IP"
        ></el-input>
      </el-form-item>
      <el-form-item label="网络端口：" prop="netportArr">
        <el-input
          size="mini"
          style="width: 200px"
          v-for="(item, index) in netportArr"
          :key="index"
          v-model="item.value"
          placeholder="请输入网络端口"
        ></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
export default {
  name: 'ammeterForm',
  data() {
    return {
      fileList: [],
      virdevIdData: [], // 主机资产
      virdevData: [], // 主机设备
      devtypenameData: [],
      virDeviceArr: [{ value: '' }],
      commAddrArr: [{ value: 0 }],
      networkipArr: [{ value: '' }],
      netportArr: [{ value: '' }],
      serialverifData: [
        { label: 'NONE', value: '0' },
        { label: 'ODD', value: '1' },
        { label: 'EVEN', value: '2' },
      ],
      formRules: {
        parentDevId: { required: true, message: '请选择主机设备', trigger: 'change' },
        virdevId: { required: true, message: '请选择主机资产', trigger: 'change' },
        devtypeid: { required: true, message: '请选择设备类型', trigger: 'change' },
        devtypename: [
          { required: true, message: '请输入资产名称', trigger: ['blur', 'change'] },
          { max: 20, message: '长度不能超出20位' },
        ],
        virDeviceArr: { required: true, message: '请输入设备名称', trigger: 'change' },
        commAddrArr: { required: true, message: '请输入采集地址', trigger: 'blur' },
        commtype: { required: true, message: '请选择通讯方式', trigger: 'change' },
        serialport: { required: true, message: '请选择串口端口', trigger: 'change' },
        serialbaud: { required: true, message: '请选择波特率', trigger: 'change' },
        serialverif: { required: true, message: '请选择校验位', trigger: 'change' },
        serialstop: { required: true, message: '请选择停止位', trigger: 'change' },
        networkipArr: [{ required: true, validator: this.validatorIp, trigger: 'blur' }],
        netportArr: [
          { required: true, message: '请输入网络端口', trigger: 'blur' },
          { max: 5, message: '长度不能超出5位' },
        ],
      },
      form: {
        virdevId: '',
        parentDevId: '',
        type: '2',
        devtypeid: '',
        devtypename: '',
        devstate: 0,
        commtype: '1',
        serialport: '',
        serialbaud: '',
        serialverif: '',
        serialstop: '',
        virDeviceArr: [],
        commAddrArr: [],
        networkipArr: [],
        netportArr: [],
      },
    }
  },
  computed: {
    serialbaudData() {
      let arr = []
      for (let i = 1; i < 9; i++) {
        arr.push('RS485-' + i)
      }
      return arr
    },
  },
  watch: {
    virDeviceArr: {
      handler(val) {
        let arr = []
        val.forEach((item) => {
          arr.push(item.value)
        })
        this.form.virDeviceArr = arr
      },
    },
    commAddrArr: {
      handler(val) {
        let arr = []
        val.forEach((item) => {
          arr.push(item.value)
        })
        this.form.commAddrArr = arr
      },
    },
    networkipArr: {
      handler(val) {
        let arr = []
        val.forEach((item) => {
          arr.push(item.value)
        })
        this.form.networkipArr = arr
      },
      immediate: true,
      deep: true,
    },
    netportArr: {
      handler(val) {
        let arr = []
        val.forEach((item) => {
          arr.push(item.value)
        })
        this.form.netportArr = arr
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // 获取主机设备
    this.selectHostDevice()
    // 获取设备类型
    this.getListDevType()
  },
  methods: {
    validatorIp(rule, value, callback) {
      let obj = value.find((item) => item === '')
      if (obj) {
        callback(new Error('请输入网络IP'))
      } else {
        let state = true
        value.forEach((item) => {
          if (!this.$utils.regIp(item)) {
            state = false
            return false
          }
        })
        if (!state) {
          callback(new Error('请输入合法网络IP'))
        }
        callback()
      }
    },
    submitPj() {
      return new Promise((resolve) => {
        this.$refs.ammeterForm.validate((valid) => {
          if (valid) {
            this.$apis.device.addDeviceHostInfo(this.form).then((res) => {
              this.$message({ type: 'success', message: res.message || '操作成功' })
              resolve(true)
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    selectHostDevice() {
      let params = { type: 1 }
      this.$apis.device.selectHostDevice(params).then((res) => {
        let nameArr = []
        let data = res.data
        data.forEach((item) => {
          let obj = { label: item.name, value: item.value }
          nameArr.push(obj)
        })
        this.virdevData = nameArr
      })
    },
    getListDevType() {
      let params = { type: '2' }
      this.$apis.device.listDevType(params).then((res) => {
        let data = res.data
        data.forEach((item) => {
          item.label = item.name
        })
        this.devtypenameData = data
      })
    },
    changeVirdev(val) {
      // 初始化 主机资产 设备类型 资产名称 对应设备
      this.form.virdevId = ''
      this.form.devtypeid = ''
      this.form.devtypename = ''
      this.virDeviceArr = [{ value: '' }]
      this.commAddrArr = [{ value: '' }]
      let params = { devid: val }
      this.$apis.device.searchVirHost(params).then((res) => {
        let nameArr = []
        let data = res.data
        data.forEach((item) => {
          let obj = { label: item.name, value: item.value }
          nameArr.push(obj)
        })
        this.virdevIdData = nameArr
      })
    },
    changeDevtypename(val) {
      let obj = this.devtypenameData.find((item) => item.value === val)
      this.form.devtypename = obj.label
      // 对应设备 = “主机资产” + ”设备类型“ ps:['6#主机电表-1', '6#主机电表-2']
      let obj1 = this.virdevIdData.find((item) => item.value === this.form.virdevId)
      let virdevLabel = ''
      if (obj1) {
        virdevLabel = obj1.label
      }
      let len = obj.label.split('in')[0]
      let arr = []
      let arr1 = []
      let arr2 = []
      let arr3 = []
      for (let i = 0; i < Number(len); i++) {
        let str = virdevLabel + '电表-' + (i + 1)
        arr.push({ value: str })
        arr1.push({ value: 0 })
        arr2.push({ value: '' })
        arr3.push({ value: '' })
      }
      this.virDeviceArr = arr
      this.commAddrArr = arr1
      this.netportArr = arr2
      this.networkipArr = arr3
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
  .upload-demo {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    /deep/.el-upload-list__item:first-child {
      margin-top: 0;
    }
    /deep/.el-upload-list {
      height: 40px;
      display: flex;
      align-items: center;
    }
    /deep/.el-upload-list__item {
      transition: none !important;
    }
    /deep/.el-upload-list__item-name {
      width: 108px;
    }
  }
}
</style>
