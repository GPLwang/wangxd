<template>
  <div id="echart"></div>
</template>

<script>
export default {
  data() {
    return {
      option: {}
    };
  },
  methods: {
    async getreports() {
      var res = await this.$http.get("/reports/type/1");
      var { meta, data } = res.data;
      console.log(res);
      this.option = data;
      var myChart = this.$echarts.init(document.getElementById("echart"));
      myChart.setOption(this.option);
    }
  },
  mounted() {
    this.getreports();
  }
};
</script>

<style>
#echart {
  width: 100%;
  height: 100%;
}
</style>
