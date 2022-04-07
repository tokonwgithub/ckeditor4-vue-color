<template>
  <div class="account-info-container" v-loading="modalLoading">
    <!-- 账户信息模板 -->
    <section>
      <ul v-for="(content, i) in accountList" :key="i">
        <div class="header">
          <!-- 名称 -->
          <div class="name">{{content.deptName}}</div><span class="red" v-if="!user.isMy">已与 {{user.sellerUserName}} 绑定</span>
          <div class="options">
            <el-dropdown trigger="click">
              <div class="pot">...</div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="chongzhi(content)" v-track-event="'销售系统, 侧边栏, 账户充值'"><span :class="{'gray': !user.isMy}">充值</span></el-dropdown-item>
                <el-dropdown-item @click.native="huanhui(content)" v-track-event="'销售系统, 侧边栏, 账户换汇'"><span :class="{'gray': !user.isMy}">换汇</span></el-dropdown-item>
                <!-- <el-dropdown-item>余额转移</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="account">
          <div>总消费 <span>{{content.totalConsumption?content.totalConsumption:0}} AUD</span></div>
          <div class="right">订单数量 <span>{{content.totalOrderCount}}</span></div>
        </div>
        <li v-for="(item, j) in content.accounts" :key="j">
          <div>{{item.current?item.current:item.currencyName}}</div>
          <div class="right">{{item.money}}</div>
        </li>
      </ul>
    </section>
    <!-- 为绑定提示文案 -->
    <section class="tips-container" v-show="accBindShow">
      <i class="el-icon-connection" />
      <!-- <svg-icon icon-class="guanlian" class-name="guanlian"></svg-icon> -->
      <span @click="handleBing" v-track-event="'销售系统, 侧边栏, 关联账户'">关联/创建</span>
    </section>
    <!-- 充值dialog -->
    <chongzhi-temp ref="chongzhi" />
    <!-- 换汇dialog -->
    <huanhui-temp ref="huanhui" />
  </div>
</template>

<script>
/* 账户信息 */

import { mapState } from "vuex";
import chongzhiTemp from "./transfer/chongzhi";
import huanhuiTemp from "./transfer/huanhui";
import {autoRechargeCheck} from "@/api/order.js"
export default {
  components: { chongzhiTemp, huanhuiTemp },
  computed: {
    ...mapState({
      accountList: (e) => e.customer_material_account.accountList,
      accBindShow: (e) => e.customer_material_account.accBindShow,
      modalLoading: (e) => e.customer_material_account.modalLoading,
      user: e => e.customer_material.user
    }),
  },
  // data() {
  //   return {
  //     accountList: [
  //       {
  //         deptName: '123',
  //         totalConsumption: 1233,
  //         totalOrderCount: 123131,
  //         accounts: [
  //           {
  //             current: 'UC',
  //             money: '123.00'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // },
  methods: {
    handleBing() {
      this.$router.push("/customer/material/bind");
    },
    async chongzhi(content) {
      console.log("充值");
      if (!this.user.isMy) return
      const {status,body} = await autoRechargeCheck({studentId:this.user.userId})
      if(status==200){
          console.log(body);
          if(!!body.contents){
              this.$confirm(body.contents,'',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass:'changewidth',
                    type: 'warning'})
              .then((_) => {
                  this.$refs.chongzhi.open(content);
                  done();
              })
              .catch((_) => {});
          }else{
              this.$refs.chongzhi.open(content);
          }
      }
    },
    huanhui(content) {
      console.log("换汇", content);
      if (!this.user.isMy) return
      this.$refs.huanhui.open(content);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-connection{
  font-size: 18px;
  margin-right: 5px;
  color: #4979ff;
}
@font-face {
  font-family: mFont;
  src: url('../../../../../styles/font-style.ttf');
}
.account-info-container {
  .tips-container {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    span {
      line-height: 25px;
      font-size: 16px;
      color: #4979ff;
    }
    .guanlian {
      margin-right: 5px;
      color: #4979ff;
      font-size: 20px;
    }
  }
  .header{
    display: flex;
    line-height: 30px;
    padding: 0 10px;
    box-sizing: border-box;
    div{
      flex: 1;
    }
  }
  .account{
    display: flex;
    box-shadow: 1px 2px 3px #d9d9d9;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;
    div{
      flex: 1;
      color: #8C8C8C;
      font-size: 13px;
      span{
        color: #48494C;
      }
    }
    .right{
      text-align: right;
    }
  }
  .name {
    cursor: pointer;
    font-size: 14px;
    text-decoration: underline;
    color: #4979ff;
    display: inline-block;
  }
  .options {
    display: flex;
    justify-content: flex-end;
    .pot {
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      text-align: right;
      width: 20px;
      height: 20px;
      border: 2px dotted #e3e3e3;
      box-sizing: border-box;
      line-height: 10px;
      text-align: center;
      float: right;
      margin-top: 7px;
    }
  }
  ul {
    padding: 0;
    // background-color: #f2f2f2;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #d9d9d9;
  }
  li {
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
    line-height: 30px;
    & > div {
      flex: 1;
      font-size: 13px;
    }
    .right{
      text-align: right;
      color: #4979ff;
      font-family: mFont;
      font-size: 16px;
    }
  }
}
.red{
  color: red;
  margin-left: 10px;
  display: inline-block;
}
.gray{
  color: #c6c6c6;
  cursor: not-allowed;
  margin-left: 10px;
}

</style>
<style>
.changewidth{
  width: 90%!important;
}
</style>