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
        <el-button class="mybtn" type="success" plain>添加用户</el-button>
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
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain></el-button>
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
      totalpage: 0
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
    async mgstatus(id,stu) {
      var res = await this.$http.put(`users/${id}/state/${stu}`);
      var {meta} = res.data
      if(meta.status === 200){
        this.$message.success(meta.msg)
      }else{
        this.$message.error(meta.msg)
      }
      console.log(res);
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
