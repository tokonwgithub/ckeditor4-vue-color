<template>
  <div class="field-container">
    <el-form-item :rules="rules" :prop="field" :label="label">
      <el-input
        ref="field"
        :disabled="!isEdit"
        :placeholder="placeholder"
        v-model="form[field]"
        :type="password"
        @blur="handleBlur"
      >
        <template slot="append" >
          <i class="el-icon-edit-outline" @click="handleEdit"/>
        </template>
        <el-select  slot="prepend" v-if="field == 'mobile'" v-model="form.mobileCode" style="width: 140px;" @change="handleBlur">
          <el-option v-for="(item,index) in countryList" :key="index" :label="`${item.text}(${item.code})`" :value="item.code.toString()"></el-option>
        </el-select>
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";
import BasicProxy from "@/proxy/customer/Basic";
export default {
  data() {
    const that = this
    return {
      isEdit: false,
      saveMobile: '',
      password: that.type || "text",
      countryList: []
    };
  },
  props: ["label", "placeholder", "field", "rules", "type"],
  computed: {
    ...mapState({
      form: state => state.customer_material.user
    })
  },
  async created(){
    this.countryList = await BasicProxy.getCountryList();
  },
  methods: {
    handleBlur(val) {
      this.isEdit = false;
      this.password = this.type
      if (this.rules) {
        this.$emit('submit', this.field)
      } else {
       this.submit(this.form);
      }
    },
    async submit(form) {
      if (this.field === 'mobile' && this.form.mobile === '') {
        this.$store.state.customer_material.user.mobile = this.saveMobile
        return 
      }
      const bool = await Customer.Material.updateUserDetail(form);
      if (bool) {
        this.$toast("操作成功");
      } else {
        if(this.field === 'mobile') {
        this.$store.state.customer_material.user.mobile = this.saveMobile
      }
      }
    },
    handleEdit() {
      this.isEdit = true;
      this.password = 'text'
      if(this.field === 'mobile') {
        this.saveMobile = this.form.mobile
        // this.$store.state.customer_material.user.mobile = ''
      }
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