<template>
  <el-card>
    <Mbread firstnav="订单管理" lastnav="订单列表"/>
    <el-table :data="orderData" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="pay_status" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status=== '0'" type="danger">未付款</el-tag>
          <el-tag v-if="scope.row.pay_status=== '1'" type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货"></el-table-column>
      <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">{{ scope.row.create_time | moment('YYYY-MM-DD HH:mm:ss') }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div id="box"></div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      orderData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0
    };
  },
  methods: {
    async getorderlist() {
      var res = await this.$http.get(
        `orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      var { meta, data } = res.data;
      this.orderData = data.goods;
      this.total = data.total;
      console.log(res);
    }
  },
  mounted() {
    this.getorderlist();
    var map = new BMap.Map("box");
    // 创建地图实例
    var point = new BMap.Point(116.404, 39.915);
    // 创建点坐标
    map.centerAndZoom(point, 15);
    // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl());
  }
};
</script>

<style>
#box {
  width: 100%;
  height: 800px;
}
</style>
