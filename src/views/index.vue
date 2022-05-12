<template>
  <div class="the-index">
    <my-menu :isCollapse="isCollapse"></my-menu>
    <div class="app-context">
      <my-header></my-header>
      <div class="router-div">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import myMenu from '../components/menu/myMenu'
import myHeader from '../components/header/myHeader'
export default {
  components: { myMenu, myHeader },
  data() {
    return {
      isCollapse: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.the-index {
  height: 100%;
  width: 100%;
  display: flex;
  .app-context {
    flex: 1;
    height: 100%;
    overflow: hidden;
    .router-div {
      padding: 12px;
      height: calc(100% - 58px);
      background: #f0f2f5;
      > div {
        height: 100%;
        width: 100%;
        overflow-y: auto;
      }
    }
  }
}
</style>
