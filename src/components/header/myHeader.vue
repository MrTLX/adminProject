<template>
  <div class="v-myHeader">
    <div class="header-left">Hais1000管理端</div>
    <div class="header-right">
      <div v-if="projectInfo">{{ projectInfo.ProjectName }}</div>
      <div>{{ newDate }}</div>
      <div class="project-div" @click="toYWProject">
        <i class="el-icon-s-platform" style="font-size: 20px"></i>
        运维系统
      </div>
      <el-dropdown :hide-on-click="false" @command="loginOut">
        <span class="el-dropdown-link">
          欢迎您，{{ userName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'myHeader',
  data() {
    return {
      timer: null,
      newDate: null,
    }
  },
  computed: {
    ...mapGetters(['userName', 'projectInfo']),
  },
  mounted() {
    this.getProjectInfo()
    this.newDate = new Date().format('yyyy-MM-dd hh:mm:ss')
    this.timer = setInterval(() => {
      this.newDate = new Date().format('yyyy-MM-dd hh:mm:ss')
    }, 1000)
  },
  methods: {
    ...mapMutations(['setLoginState', 'setProjectInfo']),
    loginOut() {
      this.setLoginState(false)
      // 清空所有缓存
      window.localStorage.clear()
      this.$router.push({ name: 'login' })
    },
    getProjectInfo() {
      this.$apis.systemStatus.getProjectInfo().then((res) => {
        this.setProjectInfo(res.data)
      })
    },
    toYWProject() {
      window.open('http://172.16.0.228:82/')
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
.v-myHeader {
  padding: 0 12px;
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0768dd;
  box-shadow: 0 1px 2px 0;
  .header-left {
    font-family: 幼圆;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }
  .header-right {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
    > div {
      margin-left: 50px;
    }
    .project-div {
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
    }
    .el-dropdown {
      span {
        display: flex;
        align-items: center;
        color: #fff;
      }
    }
  }
}
</style>
