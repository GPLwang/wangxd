<template>
  <div>
    <el-breadcrumb separator-class="el-icon-d-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{first}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{last}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Mbread",
  props: ["first", "last"]
};
</script>
<style>
</style>
