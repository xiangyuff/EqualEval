<script setup>
import CommonHeader from '@/components/CommonHeader.vue';
import CommonMenu from '@/components/CommonMenu.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <el-header>
        <common-header />
      </el-header>
      <el-container>
        <el-aside>
          <common-menu />
        </el-aside>
        <el-main>
          <div class="bread">
            <breadcrumb />
          </div>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  // overflow: scroll;
}

.common-layout,.lay-container {
  height: 100%;
}

.el-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.el-aside {
  position: fixed;
  top: 60px; /* 高度与 header 相同 */
  left: 0;
  bottom: 0;
  z-index: 1000;
  background-color: transparent;
  width: 75px;
  height: 100vh;
  overflow: hidden;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.el-main {
  margin-top: 60px; /* 高度与 header 相同 */
  margin-left: 75px; /* 宽度与 aside 相同 */
  height: calc(100% - 60px); /* 减去 header 的高度 */
  background-color: transparent;
  overflow: auto;
  padding: 10px;
  .bread {
    width: 100%;
  }
}

</style>
