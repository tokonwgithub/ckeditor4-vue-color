<template>
  <div class="field-container">
   <el-form :model="accountForm" ref="accountForm" label-width="86px" label-position="top">
      <el-form-item label="clientName" v-if="userIsWy" prop="clientName" :rules="[{required: true,message: '不能为空'}]">
        <el-input
          placeholder="请输入用户clientName"
          v-model="accountForm.clientName"
          type="text"
          :disabled="form.clientName?true:false"
        >
        </el-input>
        <p v-if="errtips" style="margin:2px 0;line-height:12px;font-size:12px;color:#f00">*该client name已存在，请重新输入</p>
      </el-form-item>
      <el-form-item label="手机号" v-if="!userIsWy" prop="mobile" :rules="[{required: true,message: '不能为空'}]">
        <el-input
          placeholder="请输入手机号"
          v-model="accountForm.mobile"
          type="number"
          :disabled="form.mobile?true:false"
        >
          <el-select v-model="accountForm.code" slot="prepend" style="width: 90px" @change="changeCode">
            <el-option v-for="(item,index) in countryList" :key="index" :label="`${item.text}(${item.code})`" :value="item.id"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";
import BasicProxy from "@/proxy/customer/Basic";
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
      errtips:false,
      accountForm: {
        clientName:'',
        mobile: ''
      },
      countryList: []
    };
  },
  props: ['userIsWy'],
  computed: {
    ...mapState({
      form: state => state.customer_material.user,
    })
  },
  async mounted(){
    this.countryList = await BasicProxy.getCountryList();
    this.accountForm.clientName = this.form.clientName?this.form.clientName:'';
    this.accountForm.mobile = this.form.mobile?this.form.mobile:'';
    this.accountForm.code = this.form.mobileCode?this.form.mobileCode:'';
    this.accountForm.country = this.form.countryId?this.form.countryId:58;
  },
  created(){
    this.mobile = this.form.mobile
  },
  methods: {
    async handleBlur() {
      let checkClientName = this.accountForm.clientName;
      const res = await ucCheckClientName(checkClientName,{userId: this.form.userId});
      console.log(res);
      if(res.status == 200){
         this.errtips = res.body;
      }else{

      }
    },
    changeCode(){
      this.$forceUpdate()
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