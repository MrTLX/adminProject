<template>
  <el-scrollbar class="v-menu">
    <div class="menu-log">
      <img src="../../assets/images/menu/logo.png" />
    </div>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :unique-opened="true"
      :router="true"
    >
      <template v-for="(item, index) in menuList">
        <el-submenu v-if="item.children" :key="index" :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.label }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(val, num) in item.children" :key="num" :index="item.path + val.path">
              {{ val.label }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :index="item.path" :key="index">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.label }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  name: 'myMenu',
  data() {
    return {
      defaultActive: '',
    }
  },
  computed: {
    ...mapGetters(['menuList']),
  },
  watch: {
    $route: {
      handler(val) {
        if (val) {
          this.defaultActive = val.path
        }
      },
      immediate: true,
    },
  },
  methods: {
    toRouter(path) {
      this.$router.push({ path: path })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
  },
}
</script>

<style lang="scss" scoped>
.v-menu {
  width: 200px;
  height: 100%;
  background: #0768dd;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .menu-log {
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .el-menu {
    background: #0768dd;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
    .el-menu-item-group__title {
      display: none;
    }
    .el-submenu__title,
    .el-menu-item {
      color: rgba(255, 255, 255, 0.7);
      background: #0768dd;
      span,
      i {
        color: rgba(255, 255, 255, 0.7);
      }
    }
    .el-menu-item:focus,
    .el-menu-item:hover {
      color: #fff;
      span,
      i {
        color: #fff;
      }
    }
    .el-menu-item.is-active {
      background: #337ae7 !important;
      color: #fff !important;
    }
    .el-menu-item-group {
      .el-menu-item {
        background: rgba(0, 0, 0, 0.3);
      }
    }
    .el-submenu__title:hover,
    .el-menu-item:hover {
      color: #fff;
      span,
      i {
        color: #fff;
      }
    }
  }
}
</style>
