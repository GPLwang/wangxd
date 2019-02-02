<template>
  <el-row>
    <el-col :span="8">
      <img src="/static/logo.png" alt>
    </el-col>
    <el-col :span="8">
      <div class="title">电商后台管理系统</div>
    </el-col>
    <el-col class="outlogin" :span="8">
      <a @click="outlogin">退出</a>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    outlogin() {
      this.$confirm("确定退出登录?", "退出提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          window.localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出"
          });
        });
    }
  }
};
</script>

<style>
</style>
