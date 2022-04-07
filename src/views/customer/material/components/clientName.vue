<template>
  <div class="field-container">
      <el-form-item :rules="rules" :prop="field" :label="label">
         <el-input
         ref="field"
         :disabled="!isEdit && !judgeSumbit"
         :placeholder="placeholder"
         v-model="form[field]"
         :type="password"
         @blur="handleBlur"
         >
         <template slot="append" v-if="!judgeSumbit">
            <i class="el-icon-edit-outline" @click="handleEdit"/>
         </template>
         </el-input>
         <p v-if="errtips" style="margin:2px 0;line-height:12px;font-size:12px;color:#f00">*该client name已存在，请重新输入</p>
      </el-form-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";
import {
  ucCheckClientName
} from "@/api/user";
import {
  changeWyAccountClientname
} from "@/api/account";

export default {
  data() {
    const that = this
    return {
      isEdit: false,
      saveMobile: '',
      errtips:false,
      password: that.type || "text"
    };
  },
  props: ["label", "placeholder", "field", "rules", "type",'judgeSumbit'],
  computed: {
    ...mapState({
      form: state => state.customer_material.user
    })
  },
  methods: {
    async handleBlur(val) {
      this.isEdit = false;
      this.password = this.type;
      let checkClientName = this.form.clientName;
      const res = await ucCheckClientName(checkClientName,{userId: this.form.userId});
      console.log(res);
      if(res.status == 200){
         this.errtips = res.body;
         if(!this.errtips && !this.judgeSumbit){//没有重复的clientname提交
            this.submit(this.form)
         }
      }else{

      }
    },
    async submit(form) {
      const bool = await Customer.Material.updateUserDetail(form);
      if (bool) {
        this.$toast("操作成功");
      }
    },
    handleEdit() {
      this.isEdit = true;
      this.password = 'text';
      this.$nextTick(() => this.$refs.field.focus());
    }
  }
};
</script>
<style lang="scss" scoped>
.el-icon-edit-outline{
  font-size: 18px;
  cursor: pointer;
}
</style>