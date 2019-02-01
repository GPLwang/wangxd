<template>
  <div class="home">
    <el-container>
      <el-header>
          <heds />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <asid />
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import asid from "@/layout/leftas.vue"
import heds from "@/layout/heds.vue"
export default {
  components: {
    asid,
    heds
  },
};
</script>

<style>
.home {
  width: 100%;
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.title {
  text-align: center;
  font-size: 26px;
  color: #ffffff;
}
.outlogin {
  text-align: right;
}
.outlogin a {
  color: orange;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-menu-vertical-demo {
  height: 100%;
}
</style>
