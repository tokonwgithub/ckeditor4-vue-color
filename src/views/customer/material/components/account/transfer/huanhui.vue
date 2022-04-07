<template>
  <div>
    <el-dialog :visible.sync="show" width="98%" title="换汇">
      <div v-loading="modalLoading">
        <div class="form-box">
          <el-input
            size="mini"
            v-model="form.money"
            :min="0"
            :max="+form.staticMoney"
            @input="clacRate($event, form.toMoney)"
            type="number"
          >
            <template slot="prepend">
              <el-select
                v-model="form.fromCurrency"
                @change="setFromParams"
                size="mini"
                style="width: 90px"
              >
                <el-option
                  v-for="(currency, i) in accounts"
                  :key="i"
                  :label="currency.current?currency.current:currency.currencyName"
                  :value="currency.current?currency.current:currency.currencyName"
                ></el-option>
              </el-select>
            </template>
          </el-input>
          <div class="left-box">
            <span>当前余额{{form.staticMoney}}</span>
          </div>
        </div>
        <div class="dengyu">
          <span>||</span>
        </div>
        <div class="form-box">
          <el-input
            size="mini"
            @input="clacRate(form.money, $event)"
            v-model="form.toMoney"
            :min="0"
            :max="staticToMoney ? +staticToMoney: ''"
            type="number"
          >
            <template slot="prepend">
              <el-select
                v-model="form.toCurrency"
                @change="calcSysRate()"
                size="mini"
                style="width: 90px"
              >
                <el-option
                  v-for="(currency, i) in currencyList"
                  :key="i"
                  :label="currency.label"
                  :value="currency.label"
                ></el-option>
              </el-select>
            </template>
          </el-input>
          <div class="right-box">
            <span>汇率:{{calcRate}}</span>
            <span v-show="staticToMoney">当前余额:{{staticToMoney}}</span>
          </div>
        </div>
        <!-- 文案提示 -->
        <div class="content" v-show="tipsShow">
          <div>
            <el-checkbox v-model="checkbox" @change="handleChange"></el-checkbox>
          </div>
          <div>
            <span>
              当前系统汇率为
              <span class="tip" style="color: #F59A23">{{sysExchange}}</span>,输入金额应小于等于
              <span class="tip" style="color: #F59A23">{{maxMoney}}</span>，请确认金额无误后再勾选
            </span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- 取 消 -->
        <el-button @click="show = false">取消</el-button>
        <!-- 保 存 -->
        <el-button type="primary" :disabled="isDisabled" @click="handleSubmit" :loading="loading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* 换汇dialog组件 */
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";
import { arrayToHashMap } from "@/utils/index";
import {changeAccountMoneyShixi} from '@/api/order'
export default {
  data() {
    return {
      show: false,
      form: {},
      sysCode: "",
      userId:"",
      disabled: true,
      checkbox: false,
      sysExchange: "" /* 系统汇率 */,
      accounts: [],
      userIsWy:false,
      calcRate: "" /* 计算汇率 */,
      staticToMoney: "" /* to当前余额 */,
      maxMoney: "" /* 最大金额 */,
      tipsShow: false /* 提示文案展示 */,
      loading: false
    };
  },
  computed: {
    ...mapState({
      currencyList: e => e.customer_material_account.currencyList,
      modalLoading: e => e.customer_material_account.modalLoading,
      orderusedata: (e) => e.order_user.orderusedata,
    }),
    exchangeMap() {
      console.log(arrayToHashMap(this.currencyList, "label"))
      return arrayToHashMap(this.currencyList, "label");
    },
    isDisabled() {
      if (!this.tipsShow) return false;
      else return this.disabled;
    }
  },
  created(){
    this.handUserCode()
  },
  methods: {
    clacRate(from, to) {
      if (!from || !to) {
        this.calcRate = "";
        return;
      }
      if (+from === 0) {
        this.calcRate = "";
        return;
      }
      this.calcRate = (+to / +from).toFixed(4);
      this.calcSysRate(true);
      this.tipsShow = +to > +this.maxMoney;
    },
    /* 设置from的表单数据 */
    setFromParams(currency) {
      this.accounts.length&&this.accounts.forEach(item => {
        if (item.current === currency || item.currencyName == currency) {
          this.form.staticMoney = item.money;
          this.form.money = item.money;
        }
      });
      this.calcSysRate();
    },
    calcSysRate(status) {
      console.log(this.exchangeMap[this.form.toCurrency])
      const { exchange: toExchange } = this.exchangeMap[this.form.toCurrency];
      console.log(this.form.fromCurrency)
      const { exchange: fromExchange } = this.exchangeMap[this.form.fromCurrency];
      this.sysExchange = (+fromExchange / +toExchange).toFixed(4);
      if(status == true){

      }else{
        this.calcRate = this.sysExchange;
      }
      // this.clacRate(fromExchange,toExchange)
      this.maxMoney = (this.sysExchange * this.form.money).toFixed(4);
      //查看当前余额 是否展示
      this.accounts.length&&this.accounts.forEach(item => {
        if (item.current === this.form.toCurrency || item.currencyName === this.form.toCurrency) {
          this.staticToMoney = item.money;
        } else this.staticToMoney = "";
      });
    },
    async handleSubmit() {
      const { toCurrency, toMoney } = this.form;
      if (!toCurrency) {
        this.$toast("请选择需要换汇币种");
        return;
      }
      if (!toMoney) {
        this.$toast("请输入换汇金额");
        return;
      }
      this.loading = true
      // 实习系统充值
      let bool =null;
      if(this.sysCode == 'sx'){
        bool = await changeAccountMoneyShixi({ changeAccountDetailVars: [this.form],userId:this.userId})
      }else{
        bool = await Customer.Account.changeAccount(
          this.sysCode,
          this.form
        );
      }
      if (bool) {
        this.loading = false
        this.closeModal();
        this.$emit('successfun');
        this.$toast("操作成功");
      }else{
        this.loading = false
      }
    },
    handleChange(e) {
      this.disabled = !e;
    },
    closeModal() {
      this.form = {};
      this.show = false;
      if(!this.orderusedata.ucId){
        Customer.Account.getAccounts();
      }
    },
    handUserCode(){
      let codes = sessionStorage.getItem("state");
      this.userIsWy = codes && codes.includes('wy')?true:false;
    },
    async open({ accounts, sysCode,userId,accountType }) {
      /* 获取币种列表 */
      await Customer.Account.getCurrencyList();
      this.accounts = accounts;
      this.sysCode = sysCode;
      this.userId = userId;
      this.checkbox = false;
      console.log(this.userIsWy)
      this.form = {
        fromCurrency:this.userIsWy? accounts.length&& accounts[0].currencyName: accounts.length&&accounts[0].current,
        money: accounts[0].money,
        staticMoney: accounts[0].money,
        toCurrency: this.currencyList[0].label
      };
      if(accountType){
        this.form.accountType = accountType
      }
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.dengyu {
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 13px;
}
.form-box {
  display: flex;
  flex-direction: column;
  span {
    font-size: 13px;
  }
  .left-box {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .right-box {
    display: flex;
    padding-top: 10px;
    justify-content: space-between;
    span {
      color: #f6853a;
    }
  }
}
.content {
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>