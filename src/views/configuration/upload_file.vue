<template>
  <div class="v-upload_file">
    <div class="content-body">
      <div class="configurationManagement-header">
        <i class="el-icon-upload2"></i>
        <div class="big-item_title">系统升级</div>
      </div>
      <div class="the-content">
        <div class="content-item" style="width: 100%">
          <span class="span-title">平台编号：</span>
          <div style="font-weight: bold; color: #f56c6c; font-size: 14px">
            {{ projectInfo.itemNumber }}
          </div>
        </div>
        <div class="content-item" style="width: 100%">
          <span class="span-title">授权操作：</span>
          <div>
            <el-button type="primary" size="mini" @click="toUpdate(dialogName[0])">更新授权</el-button>
          </div>
        </div>
        <div class="content-item" style="width: 100%; margin-top: 20px">
          <span class="span-title">协议操作：</span>
          <div>
            <el-button type="primary" size="mini" @click="toUpdate(dialogName[1])">更新协议</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      custom-class="my-dialog"
      center
      width="500px"
      :visible.sync="basicsDialog"
      @close="closeDialog"
      :destroy-on-close="true"
    >
      <div class="dialog-div">
        <div>
          <span>请选择需要更新的文件：</span>
          <el-upload ref="upload" class="upload-demo" action="" :auto-upload="false" :file-list="fileList" :on-change="handleChangeFile">
            <el-button slot="trigger" size="mini">选择</el-button>
          </el-upload>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'upload_file',
  data() {
    return {
      file: '',
      fileList: [],
      basicsDialog: false,
      dialogTitle: '',
      dialogName: ['更新系统授权文件', '更新系统协议文件'],
      projectInfo: {
        itemNumber: 'F98312196BA2941A258FD0A26C2F9FC3',
      },
    }
  },
  methods: {
    toUpdate(name) {
      this.dialogTitle = name
      this.basicsDialog = true
    },
    closeDialog() {
      this.restFrom()
      this.basicsDialog = false
    },
    restFrom() {
      this.file = ''
      this.fileList = []
    },
    handleChangeFile(file, fileList) {
      this.fileList = fileList.slice(-1)
      this.file = file
    },
    submit() {
      let formData = { file: this.file }
      if (this.dialogTitle === this.dialogName[0]) {
        this.$apis.systemUpgrade.upload(formData).then((res) => {
          this.restFrom()
          this.$message({ type: 'success', message: res.message })
          this.basicsDialog = false
        })
      } else {
        this.$apis.systemUpgrade.uploadPackage(formData).then((res) => {
          this.restFrom()
          this.$message({ type: 'success', message: res.message })
          this.basicsDialog = false
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.v-upload_file {
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  .content-body {
    margin-bottom: 20px;
    min-height: 180px;
    width: calc(50% - 10px);
    background: #fff;
    border-radius: 5px;
    .configurationManagement-header {
      padding: 0 0 10px 0;
      display: flex;
      align-items: center;
      background: #fff;
      position: relative;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      .my-button {
        position: absolute;
        top: 15px;
        right: 110px;
      }
      i {
        margin-right: 5px;
        font-size: 20px;
      }
    }
    .the-content {
      margin-bottom: 15px;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      background-color: #fff;
      > div {
        width: 50%;
      }
      .content-item {
        display: flex;
        align-items: center;
        height: 50px;
        /deep/.el-input.is-disabled .el-input__inner {
          background-color: #fff;
          color: #606266;
          border-color: #dcdfe6;
        }
      }
      .span-title {
        font-size: 14px;
        margin-right: 5px;
        width: 80px;
        text-align: right;
      }
      .span-text {
        min-width: 115px;
        font-size: 14px;
      }
    }
  }
  .my-dialog {
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
  }
}
</style>
