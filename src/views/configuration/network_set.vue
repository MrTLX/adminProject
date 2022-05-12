<template>
  <div class="v-network_set">
    <el-tabs v-model="tabName" type="card" @tab-click="tabClick">
      <el-tab-pane :label="item.label" :name="item.name" v-for="item in tabData" :key="item.name">
        <components v-if="tabName === item.name" :is="tabName"></components>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import internet from './components/internet'
import fourG from './components/fourG'
import WIFI from './components/WIFI'
export default {
  name: 'network_set',
  components: { internet, fourG, WIFI },
  data() {
    return {
      tabName: 'internet',
      tabData: [
        { label: '网络配置', name: 'internet' },
        { label: '4G配置', name: 'fourG' },
        { label: 'WIFI配置', name: 'WIFI' },
      ],
    }
  },
  methods: {
    tabClick() {},
  },
}
</script>

<style lang="scss" scoped>
.v-network_set {
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  /deep/ .el-tabs--card {
    height: 100%;
    width: 100%;
    .el-tabs__header {
      border-bottom: 1px solid #d4d9e1;
      .el-tabs__item {
        margin-right: 10px;
        border: none;
        color: #303133;
        background: rgba(223, 223, 223, 0.4);
        // opacity: 0.4;
        border-radius: 10px 10px 0px 0px;
        transition: none;
      }
      .is-active {
        background: #0893fd;

        color: #ffffff;
      }
      .el-tabs__nav {
        border: none;
      }
    }
    .el-tabs__content {
      height: calc(100% - 55px);
      width: 100%;
      .el-tab-pane {
        height: 100%;
        width: 100%;
        > div {
          height: 100%;
          width: 100%;
          .content-body {
            margin-bottom: 20px;
            min-height: 180px;
            background: #fff;
            border-radius: 5px;
            .configurationManagement-header {
              padding: 20px 0 10px 0;
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
              background-color: #fff;
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
            height: calc(100% - 235px);
          }
        }
      }
    }
  }
  /deep/.el-input__inner:focus {
    border-color: #dcdfe6;
  }
}
</style>
