<template>
  <el-card>
    <Mybread firstnav="商品管理" lastnav="商品列表"/>
    <el-row style="margin-top: 15px;">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="goodsSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="querygoods"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">&nbsp;&nbsp;
        <el-button type="success" @click="addgoods" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column label="创建时间" width="250">
        <template slot-scope="scope">{{ scope.row.add_time | moment('YYYY-MM-DD HH:mm:ss') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      goodsSearch: "",
      goodList: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  methods: {
    async getList() {
      var res = await this.$http.get(
        `/goods?query=${this.goodsSearch}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      var { data, meta } = res.data;
      this.goodList = data.goods;
      this.total = data.total;
    },
    addgoods() {
      this.$router.push("goods/add");
    },
    querygoods() {
      this.getList();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style>
</style>
