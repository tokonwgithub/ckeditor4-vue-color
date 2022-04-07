<template>
  <div class="material-tags-container">
    <div class="tag-box">
      <div @click="openModal">
        <i class="el-icon-circle-plus-outline" />
        <span class="add-title">添加标签</span>
      </div>
    </div>
    <el-tag
      :style="{ 'borderColor': tag.color}"
      class="tag"
      :key="i"
      v-for="(tag, i) in userTags"
      closable
      effect="dark"
      :color="tag.color"
      :disable-transitions="false"
      @close="handleRemove(i)"
    >{{tag.tagName}}</el-tag>
    <!-- dialog -->
    <el-dialog
      title="添加标签"
      :modal-append-to-body="false"
      :visible.sync="isShow"
      width="80%"
      :show-close="false"
      center
    >
      <el-form>
        <el-form-item label="标签内容">
          <el-input v-model="form.tagName" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签颜色" class="label">
          <div :style="{ 'backgroundColor': form.color }" class="tagColor"></div>
        </el-form-item>
          <div v-for="(item, index) in colorList" :key="index" :style="{ 'backgroundColor': item }" :class="{border: item === form.color}" class="tagColor" @click="form.color = item"></div>
          <el-color-picker v-model="value" @change="headleChangeColor" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 取 消 -->
        <el-button @click="isShow = false">取消</el-button>
        <!-- 保 存 -->
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :modal-append-to-body="false"
      :visible.sync="isDeleteShow"
      width="200px"
      :show-close="false"
      center
    >
      <div style="text-align: center;">
        <div><i class="el-icon-warning" /></div>
        <span>确定删除？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeleteShow = false">取消</el-button>
        <el-button type="primary" @click="onSureDelete">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* 用户标签列表 */
import { Customer } from "@/store/dispatch/index";
import { mapState } from "vuex";

export default {
  data() {
    return {
      isShow: false,
      isDeleteShow: false,
      saveIndex: null,
      form: {
        color: "#8F97AC"
      },
      colorList: ['#8F97AC', '#FFB537', '#F05555', '#43CB8D', '#4979FF', '#9A49FF'],
      value: "#8F97AC"
    };
  },
  computed: {
    ...mapState({ 
      userTags: e => e.customer_material.userTags
    })
  },
  methods: {
    handleRemove(index) {
      this.isDeleteShow = true
      this.saveIndex = index
    },
    async onSureDelete() {
      this.userTags.splice(this.saveIndex, 1);
      await Customer.Material.updateUserTags(this.userTags);
      this.isDeleteShow = false
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    },
    openModal() {
      this.form = {color: "#8F97AC"};
      this.isShow = true;
    },
    async handleSubmit() {
      const { tagName, color } = this.form;
      if (!tagName) return;
      const _userTags = [...this.userTags, { tagName, color }];
      const bool = await Customer.Material.updateUserTags(_userTags);
      if (bool) this.isShow = false;
    },
    headleChangeColor(color) {
      this.form.color = color
    }
  }
};
</script>
<style scoped>
/deep/.el-dialog__header{
  padding: 10px;
  border-bottom: 1px solid #d9d9d9;
}
/deep/.el-dialog__body{
  padding: 10px 25px 10px;
}
/deep/.el-color-picker--mini .el-color-picker__trigger{
  vertical-align: text-bottom;
  margin-left: 10px;
  border: none;
}
/deep/.label .el-form-item__label{
  line-height: 22px;
}
.el-icon-warning{
  font-size: 40px;
  vertical-align: text-bottom;
  color: #E6A23C;
  margin-right: 10px;
}
</style>
<style lang="scss">
.material-tags-container {
  width: 100%;
  .tag-box {
    display: flex;
    align-items: center;
    cursor: pointer;
    .icon-add {
      color: #4979ff;
      font-size: 21px;
      vertical-align: middle;
    }
    .add-title {
      font-size: 14px;
      color: #4979ff;
      margin-left: 10px;
      vertical-align: middle;
      font-weight: 600;
    }
  }

  .tag {
    margin-right: 10px;
    margin-top: 10px;
  }
  .tagColor{
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 3px;
    &+.tagColor{
      margin-left: 10px;
    }
  }
}
.m-colorPicker .colorBtn {
    width: 20px !important;
    height: 20px !important;
    border-radius: 3px;
    margin-left: 10px;
}
.customColor{
  font-size: 13px;
  &>div{
    display: inline-block;
    vertical-align: middle;
  }
}
.border{
  border: 2px solid #ccbfbf;
}
.el-icon-circle-plus-outline{
  font-size: 18px;
  vertical-align: middle;
  color: #4979ff;
  font-weight: 600;
}
</style>