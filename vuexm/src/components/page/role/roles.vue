<template>
  <el-card class="box-card">
    <Mbread first="权限管理 " last="角色管理"/>
    <el-button plain style="margin-top: 15px;margin-bottom: 5px;" @click="roleDialog = true">添加角色</el-button>
    <!-- 表格部分 -->
    <el-table
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      :data="rolesDate"
      border
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag
                :closable="true"
                color="#ccc"
                @close="deltag(scope.row.id,item1.id,scope.row)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag
                    color="#8B0000"
                    :closable="true"
                    @close="deltag(scope.row.id,item2.id,scope.row)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    color="#000000"
                    :closable="true"
                    @close="deltag(scope.row.id,item3.id,scope.row)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">没有分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="editRole(scope.row.id)"
            icon="el-icon-edit"
            size="mini"
            plain
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delRole(scope.row.id)"
            size="mini"
            plain
          ></el-button>
          <el-button
            type="success"
            @click="qxlist(scope.row.children,scope.row.id)"
            icon="el-icon-check"
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加新角色 -->
    <el-dialog title="添加角色" :visible.sync="roleDialog">
      <el-form :model="roleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editDialog">
      <el-form :model="editForm" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRole">取 消</el-button>
        <el-button type="primary" @click="editRoleSend">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出测试 -->
    <el-dialog title="权限管理" :visible.sync="corDialog">
      <el-tree
        ref="list"
        :data="chilList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defaultCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="corDialog = false">取 消</el-button>
        <el-button type="primary" @click="rolesend">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      roleForm: {
        roleName: "",
        roleDesc: ""
      },
      rolesDate: [],
      editForm: {},
      chilList: [],
      //   corData: [],
      roleDialog: false,
      editDialog: false,
      corDialog: false,
      //   权限数据
      //   checktree:[],
      rolesQx: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      defaultProps: {
        label: "authName",
        children: "children"
      },
      defaultCheck: [],
      roleid: ""
    };
  },
  methods: {
    async getAllRoles() {
      var res = await this.$http.get("/roles");
      var { data, meta } = res.data;
      this.rolesDate = data;
      this.loading = false;
    },
    // 添加新角色
    addRole() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          var res = await this.$http.post("/roles", this.roleForm);
          var { data, meta } = res.data;
          if (meta.status === 201) {
            this.getAllRoles();
            this.$message.success(meta.msg);
          } else {
            this.$message.warning(meta.msg);
          }
        } else {
          this.$message.error("添加失败");
        }
        this.clearDate(this.roleForm);
        // 隐藏添加窗口
        this.roleDialog = false;
      });
    },
    cancelRole() {
      this.roleDialog = false;
      this.editDialog = false;
      this.clearDate(this.roleForm);
    },
    clearDate(obj) {
      for (var item in obj) {
        obj[item] = "";
      }
    },
    // 修改部分
    async editRole(id) {
      this.editDialog = true;
      var res = await this.$http.get(`roles/${id}`);
      var { data, meta } = res.data;
      if (meta.status === 200) {
        this.editForm = data;
        this.editForm.id = id;
      } else {
        this.$message.error(meta.msg);
      }
    },
    async editRoleSend() {
      var res = await this.$http.put(
        `roles/${this.editForm.id}`,
        this.editForm
      );
      var { meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
      this.editDialog = false;
      this.getAllRoles();
    },
    // 删除角色
    delRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.delete(`roles/${id}`);
          var { meta } = res.data;
          if (meta.status === 200) {
            this.$message.success(meta.msg);
            this.getAllRoles();
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
    //权限列表
    qxlist(rights, id) {
      this.corDialog = true;
      this.roleid = id;
      this.defaultCheck = [];
      this.getRoleslist();
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultCheck.push(item3.id);
          });
        });
      });
    },
    async getRoleslist() {
      var res = await this.$http.get("/rights/tree");
      var { data, meta } = res.data;
      this.chilList = data;
    },
    // 修改权限
    async rolesend() {
      var allcheck = this.$refs.list.getCheckedKeys();
      var halfcheck = this.$refs.list.getHalfCheckedKeys();
      var newArr = halfcheck.concat(allcheck);
      var ids = newArr.join(",");
      var res = await this.$http.post(`roles/${this.roleid}/rights`, {
        rids: ids
      });
      var { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
      this.corDialog = false;
      this.getAllRoles();
    },
    //权限展示列表
    async deltag(id1, id2, datas) {
      console.log(id1, id2);
      var res = await this.$http.delete(`roles/${id1}/rights/${id2}`);
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        datas.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getAllRoles();
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-tag {
  margin: 0 5px 5px 0;
}
</style>
