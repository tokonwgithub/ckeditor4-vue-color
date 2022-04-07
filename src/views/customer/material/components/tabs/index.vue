<template>
  <div class="tabs-container">
    <van-tabs v-model="activeName" @change="currentSelect" color="#4979FF">
      <van-tab title="账户信息" name="account">
        <span style="color: #222;font-size: 12px; padding: 10px;margin-top: 10px;">
          <account-info />
        </span>
      </van-tab>
      <!-- <van-tab title="订单信息" name="b">
        <span style="color: #222;font-size: 12px; padding: 10px;margin-top: 10px;">正在研发中</span>
      </van-tab> -->
      <van-tab title="合同信息" name="contract">
        <contractTemp ref="contract" />
      </van-tab>
      <!-- <van-tab title="动态" name="c">
        <span style="color: #222;font-size: 12px; padding: 10px;margin-top: 10px;">正在研发中</span>
      </van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
/* 标签页 */
import contractTemp from "./contract";
import accountInfo from "@/views/customer/material/components/account/index";
import { Customer } from "@/store/dispatch/index";
export default {
  components: { contractTemp, accountInfo },
  data() {
    return {
      activeName: "account"
    };
  },
  methods: {
    currentSelect(e) {
      switch (e) {
        case "contract":
          Customer.Material.getContractList();
          break;
        case "account":
          Customer.Account.getAccounts();
          break;
      }
    }
  }
};
</script>

<style scoped>
/deep/.van-tab{
  font-size: 14px;
  font-weight: 600;
}
/deep/.van-tab--active{
  color: #4979ff;
}
/deep/.van-tabs__line{
  height: 2px
}
</style>