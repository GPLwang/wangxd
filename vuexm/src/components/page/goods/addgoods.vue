<template>
  <el-card>
    <Mbread first="商品管理" last="商品列表"/>
    <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
    <el-steps
      :active="active"
      align-center
      space="180px"
      finish-status="success"
      process-status="wiat"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs @tab-click="tabclick" tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form :model="goodscon" :rules="rules" ref="ruleForm" label-position="top">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodscon.goods_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodscon.goods_price" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodscon.goods_weight" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodscon.goods_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="classify">
            <el-cascader :props="ctrop" :options="categoriesList" v-model="selectedOptions"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <div v-for=" item in parame" :key="item.attr_id">
          <p>{{item.attr_name}}</p>
          <div>
            <el-checkbox
              v-model="check"
              v-for=" (item1 , index) in item.attr_vals.split(',')"
              :key="index"
              :label="item1"
              border
            ></el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form>
          <el-form-item v-for="item in nature" :key="item.id" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          list-type="picture"
          :on-success="success"
          :on-remove="uploadremove"
          :on-preview="preview"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-dialog title="预览图片" :visible.sync="previewdialog" width="30%">
          <img class="myimg" ref="imgmy" src="#">
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <el-button @click="sbm" type="primary">添加商品</el-button>
        <div class="edit" style="margin-top: 15px">
          <quill-editor ref="textEditor" v-model="goodscon.goods_introduce" :options="editorOption"></quill-editor>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      check: true,
      active: 0,
      previewdialog: false,
      goodscon: {
        goods_name: "",
        goods_price: "",
        goods_cat: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce: "",
        pics: []
      },
      categoriesList: [],
      selectedOptions: [],
      parame: [],
      ctrop: {
        label: "cat_name",
        value: "cat_id"
      },
      headers: {
        Authorization: window.localStorage.getItem("token")
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        classify: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      nature: {},
      fileList2: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }],
            ["clean"],
            [{ align: [] }, "image"]
          ]
        },
        placeholder: "请输入文章内容 ..."
      }
    };
  },
  methods: {
    tabclick(eve) {
      this.active = Number(eve.index);
      if (eve.index === "1") {
        this.getparameter("many");
      } else if (eve.index === "2") {
        this.getparameter("only");
      }
    },
    async getcategories() {
      var res = await this.$http.get(`categories?type=${3}`);
      var { meta, data } = res.data;
      if (meta.status === 200) {
        this.categoriesList = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 根据分类id获取商品参数及商品属性
    async getparameter(mold) {
      if (this.selectedOptions.length !== 0) {
        var id = this.selectedOptions[this.selectedOptions.length - 1];
        var res = await this.$http.get(
          `categories/${id}/attributes?sel=${mold}`
        );
        var { meta, data } = res.data;
        if (meta.status === 200) {
          if (data.length === 0) {
            this.parame = [];
            this.nature = [];
            this.$message.info("暂无商品参数");
          } else {
            if (mold === "many") {
              this.parame = data;
            } else {
              this.nature = data;
            }
          }
          console.log(data);
        } else {
          this.$message.error(meta.msg);
        }
      } else {
        this.$message.error("商品分类不能为空");
      }
    },
    //上传组件
    success(response, file, fileList) {
      if (response.meta.status === 200) {
        this.goodscon.pics.push(file.response.data.tmp_path);
        this.$message.success(response.meta.msg);
      } else {
        this.$message.error(response.meta.msg);
      }
    },
    uploadremove(file, fileList) {
      for (var i = 0; i < this.goodscon.pics.length; i++) {
        if (this.goodscon.pics[i] === file.response.data.tmp_path) {
          this.goodscon.pics.splice(i, 1);
          this.$message.success("删除成功");
          break;
        }
      }
    },
    preview(file) {
      this.previewdialog = true;
      this.$nextTick(function() {
        this.$refs.imgmy.src = file.response.data.url;
      });
    },
    async sbm() {
      var pvc = this.selectedOptions.join(",");
      this.goodscon.goods_cat = pvc;
      var res = await this.$http.post("/goods", this.goodscon);
      var meta = res.data.meta;
      console.log(meta);

      if (meta.status === 201) {
        this.$message.success(meta.msg);
        this.$router.push("/goods");
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  mounted() {
    this.getcategories();
  }
};
</script>

<style>
.el-alert--info {
  margin: 10px 0;
}
.el-step__title {
  font-size: 12px;
}
.el-checkbox {
  margin: 10px;
}
.myimg{
  width: 100%;
}
</style>
