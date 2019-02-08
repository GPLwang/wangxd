<template>
  <el-card>
    <Mbread first="商品管理" last="商品分类"/>
    <el-row>
      <el-col :span="24">
        <el-button>添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <!-- 
      data： 数据源
      file-icon：文件图标
      folder-icon：文件夹图片
      prop： 设置数据源中显示的属性
      label：列的标题
    -->
    <!-- levelKey="cat_level"
         treeKey="cat_id"
    parentKey="cat_pid"-->
    <el-table :data="categories" border max-height="400">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        levelKey="cat_level"
        treeKey="cat_id"
        parentKey="cat_pid"
        label="分类名称"
        width="320"
      ></el-table-tree-column>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted = false">无效</span>
          <span v-else-if="scope.row.cat_deleted = true">有效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      categories: []
    };
  },
  methods: {
    async getcategorieslist() {
      var res = await this.$http.get("/categories");
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.categories = data;
      } else {
        this.$message.error(meta.msg);
      }
      console.log(res);
    }
  },
  mounted() {
    this.getcategorieslist();
  }
};
</script>

<style>
</style>
