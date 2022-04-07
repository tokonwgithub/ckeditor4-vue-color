<template>
  <el-dialog  :visible.sync="show" width="350px" top="30%" title="充值">
    <div v-loading="chonzhiLoading">
      <!-- 可操作 -->
      <el-form :model="form" ref="form" label-position="top" :inline="true" :rules="rules">
        <el-radio
        style="margin-bottom: 10px;"
        v-model="change"
        :label="1"
        @click.native.prevent="clickitem(1)"
      >识别码充值</el-radio>
        <template v-if="change">
          <el-input
            style="width:220px;margin-top:20px"
            v-model.trim="code"
          ></el-input>
          <el-button
            type="primary"
            @click="getMoneyByCode"
            style="margin-left:20px"
          >确定</el-button>
          <div
            class="money-box"
            v-if="detail.money"
          >
            <span>{{detail.currency}}</span>{{detail.money}}
          </div>
          <div >
            <el-button
              v-if="detail.money"
              :loading="isLoading"
              style="position:absolute;right:20px;bottom:5px"
              type="primary"
              @click="handleRecharge"
            >充值</el-button>
          </div>
        </template>
        <template v-else>
          <div class="label_item">转账：</div>
        <el-form-item label="" prop="currency">
           <el-select v-model="form.currency" style="width: 80px">
              <el-option
                v-for="(currency, i) in currencyList"
                :key="i"
                :label="currency.label"
                :value="currency.label"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label=""  prop="money">
          <el-input v-model="form.money" :min="0" type="number" style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="btn" @click="handleRecharge">充值</div>
        </el-form-item>
        <template v-if="form.currency == 'CAD' ">
          <div class="label_item">转账方式</div>
          <el-form-item label="" prop="channelFlag" style="width: 100%;">
            <el-radio-group v-model="form.channelFlag">
              <el-radio :label="1">公司账户</el-radio>
              <el-radio :label="2">渠道账户</el-radio>
            </el-radio-group>
          </el-form-item>
          <template  v-if="form.channelFlag == 2">
              <div class="label_item">转账日期</div>
              <el-form-item label="" lable-width="0" prop="cadTransferDate" style="width: 100%;">
                <el-date-picker v-model="form.cadTransferDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions" placeholder="请选择转账日期" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <div class="label_item">客户银行户主名</div>
              <el-form-item label="" lable-width="0" prop="cadStudBankName" style="width: 100%;">
                <el-input v-model="form.cadStudBankName" placeholder="请输入客户银行户主名" style="width: 100%;"></el-input>
              </el-form-item>
              <div class="label_item">收款账户邮箱</div>
              <el-form-item label="" lable-width="0" prop="cadIncomeEmail" style="width: 100%;">
                <el-select v-model="form.cadIncomeEmail" placeholder="请选择收款账户邮箱" style="width: 100%;">
                  <el-option value="1" label="mttubc@gmail.com"></el-option>
                  <el-option value="2" label="payment@msbg.ca"></el-option>
                  <el-option value="3" label="mowang980@gmail.com"></el-option>
                  <!-- <el-option value="4" label="452654397@qq.com"></el-option> -->
                  <el-option value="5" label="wisesh@hotmail.com"></el-option>
                  <el-option value="6" label="naiveforever@hotmail.com"></el-option>
                </el-select>
              </el-form-item>
              <template v-if="[3,4].includes(Number(form.cadIncomeEmail))">
                <div class="label_item">问题</div>
                <el-form-item label="" lable-width="0" prop="problem" style="width: 100%;">
                  <el-input v-model="form.problem" placeholder="请输入问题" style="width: 100%;"></el-input>
                </el-form-item>
                <div class="label_item">密码</div>
                <el-form-item label="" lable-width="0" prop="password" style="width: 100%;">
                  <el-input v-model="form.password" placeholder="请输入密码" style="width: 100%;"></el-input>
                </el-form-item>
              </template>
            </template>
          </template>
          <div class="imgs-box">
            <!-- 上传的图片 -->
            <div v-for="(img, k) in form.files"  :key="k"  class="imgs-show-wrap">
              <el-image
                style="width: 50px; height: 50px; margin-left: 8px;"
                :src="img.thumbUrl"
                :preview-src-list="srcList"
                fit="fill"
              > 
              </el-image>
              <i class="el-icon-error delete-icon" @click="deleteImg(k)"></i>
            </div>
            <image-temp style="margin-left: 8px;" @upload="handleUpload"></image-temp>
          </div>
          <template v-if="form.currency == 'CAD' ">
            <div class="label_item">备注</div>
            <el-form-item label="" lable-width="0" prop="remark" style="width: 100%;">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
          </template>
        </template>
        
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
/* 充值dialog组件 */
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";
import imageTemp from "./image";
import {addAccountMoneyShixi,getMoneyByCode} from '@/api/order'
import _ from "lodash";

export default {
  components: { imageTemp },
  data() {
    return {
      show: false,
      srcList:[],
      isLoading:false,
      chonzhiLoading:false,
      form: { 
        depositCode:'',
        files: [],
        currency: "",
        money: "",
        channelFlag: 1,
        cadTransferDate: '',
        cadStudBankName: '',
        cadIncomeEmail: '',
        problem: '',
        password: '',
        remark: ''
      },
      userId:'',
      sysCode: "",
      accountType:1,
      rules: {
        money: [{ required: true, message: "请输入金额", trigger: ['change']}],
        channelFlag: [{ required: true, message: "请选择转账方式", trigger: ['change']}],
        cadTransferDate: [{ required: true, message: "请选择转账日期", trigger: ['change']}],
        cadStudBankName: [{ required: true, message: "请输入客户银行户主名", trigger: ['change']}],
        cadIncomeEmail: [{ required: true, message: "请选择收款账户邮箱", trigger: ['change']}],
        problem: [{ required: true, message: "请输入问题", trigger: ['change']}],
        password: [{ required: true, message: "请输入密码", trigger: ['change']}]
      },
      userIsWy:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      change: 0,
      code: "",
     
      detail: {}
    };
  },
  computed: {
    ...mapState({
      currencyList: (e) => e.customer_material_account.currencyList,
    }),
  },
  watch: {
    code(val) {
      if (!val) this.detail = {}
    }
  },
  methods: {
    async getMoneyByCode() {
      if (!this.code) {
        this.$notify.warning('请输入识别码')
        return
      }
      let res = await getMoneyByCode({ code: this.code })
      if (res.status == 200) {
        if (res.body == null) {
          this.$notify.error('识别码错误或已失效，请重试')
          return
        }
        this.detail = res.body || {}
      }else{
        this.$notify.error(res.body.msg)
      }
    },
    clickitem() {
      this.change = this.change == 1 ? 0 : 1
      !this.change && (this.code = '')
    },
    handUserCode(){
      let codes = sessionStorage.getItem("state");
      this.userIsWy = codes && codes.includes('wy')?true:false;
    },
    closeModal() {
      this.show = false;
      if(!localStorage.getItem('orderUserId')){
        Customer.Account.getAccounts();
      }
      localStorage.setItem('orderUserId','')
    },
    async open(data) {
      this.handUserCode();
      this.sysCode = data.sysCode;
      let sysCode = data.sysCode;
      this.userId = data.userId;
      this.accountType = data.accountType;
      this.show = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.form.files = [];
        this.srcList = [];
      }
      /* 获取币种列表 */
      await Customer.Account.getCurrencyList(sysCode);
      this.form.currency = this.currencyList[0].label;
    },
    handleUpload({ thumbUrl, name }) {
      this.srcList.push(thumbUrl);
      this.form.files.push({ thumbUrl, name });
    },
    deleteImg(index){
      this.form.files.splice(index,1);
      this.srcList.splice(index,1);
    },
    /**充值 */
    async handleRecharge() {
      if(!this.form.files.length && !this.change){
        return this.$message.error("请上传充值凭证！");
      }
      this.chonzhiLoading = true;
      this.$refs.form.validate(async valid => {
        let bool = null;
        if (valid) {
          if(this.change){
            this.form.depositCode = this.code;
          }
          
          this.form.accountType = this.accountType;
          if(this.detail.money){
            const {money,currency} = this.detail;
            this.form.currency = currency;
            this.form.money = money
          }
          let _data = _.cloneDeep(this.form);
          bool = await Customer.Account.createAccount(this.sysCode, _data);
          if (bool) {
            this.$emit('successfun');
            this.closeModal();
            this.chonzhiLoading = false;
            this.$message.success("充值成功");
          }else{
            this.chonzhiLoading = false;
            this.$message.error("充值失败,请检查");
          }
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  cursor: pointer;
  width: 50px;
  height: 30px;
  background-color: #409eff;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
}
.imgs-box {
  margin: 20px 0;
  display: flex;
  align-items: center;
}
.label_item{
  font-size: 12px;
  margin: 0 0 10px 0;
}
.imgs-show-wrap{
  position: relative;
  .delete-icon{
    display: none;
  }
  &:hover{
    .delete-icon{
      display: block;
    }
  }
}
.delete-icon{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
}
.money-box {
  height: 90px;
  line-height: 90px;
  margin: 20px auto;
  box-shadow: 0px 1px 9px 0px rgba(0, 0, 0, 0.14);
  text-align: center;
  font-size: 18px;
  span {
    font-weight: 700;
    font-size: 24px;
    margin-right: 15px;
  }
}
</style>