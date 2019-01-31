<template>
  <div class="box">
    <div class="login">
      <h1>用户登录</h1>
      <el-form
        label-position="top"
        :model="loginData"
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item label="密 码" prop="password">
          <el-input type="password" v-model="loginData.password"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="lgbtn" type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginData: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          var res = await this.$http.post("/login", this.loginData);
          var { data, meta } = res.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            window.localStorage.setItem("token", data.token);
            this.$router.push("/home");
          } else {
            this.$message.error(meta.msg);
          }
        } else {
          this.$message.error("用户名或密码不符合规则");
        }
      });
    }
  }
};
</script>

<style>
.box {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #324152;
}
.login {
  width: 500px;
  padding: 40px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
}
h1 {
  font-size: 26px;
  text-align: center;
  padding-bottom: 15px;
}
.lgbtn {
  width: 100%;
}
</style>
