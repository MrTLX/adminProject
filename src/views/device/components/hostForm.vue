<template>
  <el-form :model="form" :rules="formRules" ref="hostForm" label-width="90px">
    <el-form-item label="设备类型：" prop="devtypeid">
      <el-select size="mini" style="width: 200px" v-model="form.devtypeid" placeholder="请选择" @change="changeDevtypename">
        <el-option v-for="(item, index) in devtypenameData" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="设备名称：" prop="devname">
      <el-input size="mini" style="width: 200px" v-model="form.devname" placeholder="请输入设备名称"></el-input>
    </el-form-item>
    <el-form-item label="对应资产：" prop="virDeviceArr">
      <template v-if="!hostMax">
        <el-input
          :readonly="true"
          v-for="(item, index) in virDeviceArr"
          :key="index"
          size="mini"
          style="width: 200px"
          v-model="item.value"
          placeholder="请输入对应资产"
        ></el-input>
      </template>
      <template v-else>
        <span style="color: #f56c6c">对应资产超出限制（最多10个）</span>
      </template>
    </el-form-item>
    <el-form-item label="采集地址：" prop="commaddr">
      <el-input-number style="width: 200px" size="mini" v-model="form.commaddr" controls-position="right" :min="0"></el-input-number>
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
      <el-form-item label="网络IP：" prop="networkip">
        <el-input size="mini" style="width: 200px" v-model="form.networkip" placeholder="请输入网络IP"></el-input>
      </el-form-item>
      <el-form-item label="网络端口：" prop="netport">
        <el-input size="mini" style="width: 200px" v-model="form.netport" placeholder="请输入网络端口"></el-input>
      </el-form-item>
    </template>
    <el-form-item label="设备铭牌：" v-if="false">
      <el-upload
        ref="theUpload"
        style="width: 200px"
        class="upload-demo"
        action=""
        :auto-upload="false"
        multiple
        :file-list="fileList"
        :on-change="handleChangeFile"
      >
        <el-button slot="trigger" size="mini">选择</el-button>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'hostForm',
  data() {
    return {
      fileList: [],
      formRules: {
        devtypeid: { required: true, message: '请选择设备类型', trigger: 'change' },
        devname: { required: true, message: '请输入设备名称', trigger: ['blur', 'change'] },
        commaddr: { required: true, message: '请输入采集地址', trigger: 'blur' },
        virDeviceArr: { required: true, message: '请输入对应资产', trigger: 'change' },
        commtype: { required: true, message: '请选择通讯方式', trigger: 'change' },
        serialport: { required: true, message: '请选择串口端口', trigger: 'change' },
        serialbaud: { required: true, message: '请选择波特率', trigger: 'change' },
        serialverif: { required: true, message: '请选择校验位', trigger: 'change' },
        serialstop: { required: true, message: '请选择停止位', trigger: 'change' },
        networkip: [{ required: true, validator: this.validatorIp, trigger: 'blur' }],
        netport: [
          { required: true, message: '请输入网络端口', trigger: 'blur' },
          { max: 5, message: '长度不能超出5位' },
        ],
      },
      virDeviceArr: [{ value: '' }],
      form: {
        devname: '',
        type: '1',
        devtypeid: '',
        devtypename: '',
        devstate: 0,
        commtype: '1',
        commaddr: '',
        networkip: '',
        netport: '',
        serialport: '',
        serialbaud: '',
        serialstop: '',
        serialverif: '',
        virDeviceArr: [],
      },
      devtypenameData: [],
      serialverifData: [
        { label: 'NONE', value: '0' },
        { label: 'ODD', value: '1' },
        { label: 'EVEN', value: '2' },
      ],
    }
  },
  computed: {
    ...mapGetters(['hostMax']),
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
  },
  created() {
    // 获取设备类型
    this.getListDevType()
    // 初始化
    this.setHostMax(false)
  },
  methods: {
    ...mapMutations(['setHostMax']),
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
        this.$refs.hostForm.validate((valid) => {
          if (valid) {
            let formData = {}
            for (let key in this.form) {
              if (this.form[key] !== '') {
                formData[key] = this.form[key]
              }
            }
            this.$apis.device.addDeviceHostInfo(this.form).then((res) => {
              this.$message({ type: 'success', message: res.message })
              resolve(true)
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    getListDevType() {
      let params = { type: '1' }
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
      this.form.devname = obj.label
      this.form.devtypename = obj.label
      // 根据设备大类获取资产，自动生产资产名称（如果数据顺序完整，名称自动加1；如果有缺失，自动填补）
      let params = { type: 1 }
      this.$apis.device.searchVirHost(params).then((res) => {
        let nameArr = []
        let data = res.data
        data.forEach((item) => {
          nameArr.push(item.virdevname)
        })
        this.virDeviceArr = this.getVirdevName(nameArr, val, '#')
      })
    },
    getVirdevName(nameArr, len, f) {
      len = Number(len)
      if (nameArr.length === 0) {
        return this.getName(0, len, f)
      } else {
        //（如果数据顺序完整，名称自动加1；如果有缺失，自动填补）
        let arr = []
        nameArr.forEach((item) => {
          arr.push(Number(item.split(f)[0]))
        })
        arr.sort(function (a, b) {
          return a - b
        })
        // 判断数据的格式
        if (arr.length === 1) {
          // arr只有一个数据的情况 arr = [3]
          let result = this.sortOnlyOne(arr, len, f)
          return result
        } else {
          // 判断数据是否连贯
          let state = this.getSotrState(arr)
          if (state) {
            // 数据连贯 [1,2]
            let s = Number(arr[arr.length - 1])
            let e = s + len
            let result = this.getName(s, e, f)
            return result
          } else {
            // 数据不连贯 [1,3,5]
            let result = this.sortNotGood(arr, len, f)
            return result
          }
        }
      }
    },
    // 判断数据是否连贯
    getSotrState(arr) {
      let array = [...arr]
      let i = array[0]
      let isContinuation = true
      for (let e in array) {
        if (array[e] != i) {
          isContinuation = false
          break
        }
        i++
      }
      return isContinuation
    },
    // 顺序不连贯
    sortNotGood(arr, len, f) {
      let numIndex = []
      // 获取不连贯的位置(有几个不连贯的位置) 【 numIndex= [[1,3],[3,5]] 】
      for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] - arr[i] > 1) {
          numIndex.push([arr[i], arr[i + 1]])
        }
      }
      // 判断len能填充几个不连贯的位置 【 len=3  numIndex= [[1,3],[3,5]] --- 能填充满，并且还多一个 】
      let num = len
      let theIndex = 0
      numIndex.forEach((item, index) => {
        num = num - (item[1] - item[0] - 1)
        if (num >= 0) {
          theIndex = index
        }
      })
      // 获取需要填充的数据
      let myArr = []
      for (let i = 0; i < theIndex + 1; i++) {
        myArr.push(numIndex[i])
      }
      // 根据所在区间生成对应名称 (填补空缺位置)
      let resultName = []
      for (let i = 0; i < myArr.length; i++) {
        let s = myArr[i][0]
        let e = myArr[i][1] - 1
        // 是否超出所需长度（len）
        if (e - s >= len) {
          e = myArr[i][0] + len
        }
        let result = this.getName(s, e, f)
        resultName.push(...result)
      }
      // 如果空缺位置不够（< len） 则 取arr最后一位向后叠加
      if (resultName.length < len) {
        let s = arr[arr.length - 1]
        let e = s + (len - resultName.length)
        let result = this.getName(s, e, f)
        resultName.push(...result)
      }
      return resultName
    },
    // 判断只有一个数据的情况
    sortOnlyOne(arr, len, f) {
      // arr只有1个 arr = [3]
      if (arr[0] >= len) {
        return this.getName(1, len + 1, f)
      } else {
        let one = this.getName(1, arr[0] + 1, f)
        let two = this.getName(arr[0] + 1, len + 1, f)
        return [...one, ...two]
      }
    },
    getName(s, e, f) {
      this.setHostMax(false)
      let arr = []
      for (let i = s; i < e; i++) {
        let o = i + 1 + f + '主机'
        // 限制不能超过10
        if (i + 1 > 10) {
          this.setHostMax(true)
          return false
        }
        arr.push({ value: o })
      }
      return arr
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
