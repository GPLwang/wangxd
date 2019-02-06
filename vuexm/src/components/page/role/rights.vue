<template>
  <el-card class="box-card">
    <Mbread first="权限管理 " last="权限列表"/>
    <el-table :data="rolerights" border style="width: 50%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level=== '0'">一级</span>
          <span v-else-if="scope.row.level=== '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      rolerights: []
    };
  },
  methods: {
    async getrights() {
      var res = await this.$http.get("rights/list");
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.rolerights = data;
      } else {
        this.$message.error(meta.msg);
      }
      this.loading = false;
    }
  },
  mounted() {
    this.getrights();
  }
};
</script>

<style>
</style>
