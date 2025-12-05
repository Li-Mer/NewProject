<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <common-aside> </common-aside>
      <el-container>
        <el-header class="el-header">
          <common-header> </common-header>
        </el-header>
        <common-tab> </common-tab>
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import CommonAside from "../components/CommonAside.vue";
import CommonHeader from "../components/CommonHeader.vue";
import CommonTab from "../components/CommonTab.vue";
</script>
<style lang="less" scoped>
.common-layout,
.lay-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #333;
}
</style>
