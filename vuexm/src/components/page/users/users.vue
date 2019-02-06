<template>
  <el-card>
    <Mbread first="用户管理" last="用户列表"/>
    <el-row class="search">
      <el-col :span="4">
        <el-input v-model="search" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" @click="searchbtn" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="20">
      </el-col>
    </el-row>
    <el-table :data="userdata" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="mgstatus(scope.row.id,scope.row.mg_state)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="editList(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="del(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="might(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="editsize"
      @current-change="curpage"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalpage"
    ></el-pagination>
    <!-- 添加部分 -->
    <el-dialog title="添加用户" :visible.sync="addUserFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改部分 -->
    <el-dialog title="修改用户" :visible.sync="editListstu">
      <el-form :model="editData" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" disabled :label-width="formLabelWidth" prop="username">
          <el-input :disabled="true" v-model="editData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editListstu = false">取 消</el-button>
        <el-button type="primary" @click="editListUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限部分 -->
    <el-dialog title="修改用户" :visible.sync="mightDialog">
      <el-form :model="roleObj" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" disabled label-width="100px" prop="username">
          <el-input :disabled="true" v-model="roleObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色设置" label-width="100px">
          <el-select v-model="roleObj.rid" placeholder="请选择">
            <el-option :disabled="true" label="请选择角色" :value="-1"></el-option>
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mightDialog = false">取 消</el-button>
        <el-button type="primary" @click="mightAdd">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      value2: true,
      userdata: [],
      pagenum: 1,
      pagesize: 10,
      totalpage: 0,
      addUserFormVisible: false,
      editListstu: false,
      mightDialog: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
        mg_state: "",
        id: ""
      },
      editData: {},
      rolesList: [],
      roleObj: {},
      formLabelWidth: "120px",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getlist() {
      var res = await this.$http.get(
        `/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      var { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.userdata = data.users;
        this.totalpage = data.total;
        console.log(data.users);
      }
    },
    // 搜索部分
    searchbtn() {
      if (this.search === "") {
        this.$message.info("请输入需要搜索的内容");
        return;
      } else {
        this.getlist();
        // this.search =''
      }
    },
    // 页容量
    editsize(size) {
      this.pagesize = size;
      this.getlist();
    },
    // 页码
    curpage(num) {
      this.pagenum = num;
      this.getlist();
    },
    // 用户状态管理
    async mgstatus(id, stu) {
      var res = await this.$http.put(`users/${id}/state/${stu}`);
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 修改用户信息
    async editList(id) {
      this.editListstu = true;
      var res = await this.$http.get(`users/${id}`);
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.editData = data;
      }
    },
    // 发送修改的用户信息
    async editListUser() {
      var res = await this.$http.put(
        `users/${this.editData.id}`,
        this.editData
      );
      var { meta } = res.data;
      if (meta.status === 200) {
        this.getlist();
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
      this.editListstu = false;
    },
    //删除用户信息
    del(id) {
      this.$confirm("此操作将删除该用户, 是否继续?", "删除提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.delete(`users/${id}`);
          var { meta } = res.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            this.getlist();
          } else {
            this.$message.error(meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //权限管理
    async might(id) {
      this.mightget(id);
      this.mightDialog = true;
      var res = await this.$http.get(`/users/${id}`);
      // console.log(res);
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.roleObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async mightget() {
      var res = await this.$http.get(`/roles`);
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.rolesList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async mightAdd() {
      var res = await this.$http.put(`users/${this.roleObj.id}/role`, {
        rid: this.roleObj.rid
      });
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
      this.mightDialog = false;
    },
    //添加用户
    addUser() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          var res = await this.$http.post("/users", this.form);
          var { data, meta } = res.data;
          if (meta.status === 201) {
            this.getlist();
            this.$message.success(meta.msg);
          } else {
            this.$message.warning(meta.msg);
          }
        } else {
          this.$message.error("添加失败");
        }
        this.clearDate(this.form);
        // 隐藏添加窗口
        this.addUserFormVisible = false;
      });
    },
    cancelAdd() {
      this.addUserFormVisible = false;
      this.clearDate(this.form);
    },
    clearDate(obj) {
      for (var item in obj) {
        obj[item] = "";
      }
    }
  },
  mounted() {
    this.getlist();
  }
};
</script>

<style>
.search {
  margin: 15px 0;
}
.mybtn {
  margin-left: 5px;
}
</style>
