<template>
  <el-menu
    :router="true"
    :unique-opened="true"
    :default-active="a1a1"
    class="el-menu-vertical-demo"
  >
    <el-submenu v-for=" (item , index) in menus" :key="item.id" :index="index + ''">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{item.authName}}</span>
      </template>
        <el-menu-item v-for="item1 in item.children" :key="item1.id" :index=" '/' +item1.path">
          <i class="el-icon-menu"></i>
          <span>{{item1.authName}}</span>
        </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      menus: {}
    };
  },
  methods: {
    async getaside() {
      var res = await this.$http.get("/menus");
      var { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.menus = data;
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getaside();
  },
  computed: {
    a1a1: function() {
      return this.$route.path;
    }
  }
};
</script>

<style>
</style>
