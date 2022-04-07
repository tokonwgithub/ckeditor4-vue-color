/*
 * @Author: xulanlan 
 * @Date: 2021-01-12 11:20
 * @Last Modified by: xulanlan
 * @Name:   考试订单订单详情展示
 * @Last Modified time: 2021-01-12 11:20
 */
 <template>
<div class="account-info-container" v-loading="modalLoading">
  <el-tabs type="border-card" v-model="active1"  v-if="accountTypeInfo.flag != shixiNumber">
    <el-tab-pane label="文案账户" ></el-tab-pane>
    <el-tab-pane label="辅导账户">
    </el-tab-pane>
    <!-- <el-tab-pane label="实习账户" v-if="accountTypeInfo.flag == shixiNumber"></el-tab-pane> -->
  </el-tabs>
  <van-tabs v-model="active2"  type="card" color="#4979ff" line-height="1px" :sticky="true" v-if="active1 == 1 && accountTypeInfo.dbId && accountTypeInfo.flag != shixiNumber">
    <van-tab title="货币账户">
      <currency :accountInfo="accountList.filter(i => i.deptName == '导毕')[0] || {}" accountType='db'/>
    </van-tab>
    <van-tab title="学期卡账户">
      <cardBag/>
    </van-tab>
  </van-tabs>
  <currency :accountInfo="accountList.filter(i => i.deptName == '文亚')[0] || {}" accountType='wy' v-if="accountTypeInfo.wyId && active1 == 0 && accountTypeInfo.flag != shixiNumber"/>
  <currency :accountInfo="accountList.filter(i => i.deptName == '万能职咖')[0] || {}" accountType='sx' v-if="accountTypeInfo.sxId && accountTypeInfo.flag == shixiNumber"/>
  <!-- 未绑定提示文案 -->
  <section class="tips-container" v-show="((active1 == 1 && !accountTypeInfo.dbId) || (active1 == 0 && !accountTypeInfo.wyId)&&  accountTypeInfo.flag != shixiNumber) || (accountTypeInfo.flag == shixiNumber &&  !accountTypeInfo.sxId)">
    <img src="@/assets/images/connection.png" alt="">
    <span @click="handleBing(active1 == 1 ? 'db' : accountTypeInfo.flag == shixiNumber?'sx':'wy')" v-track-event="'销售系统, 侧边栏, 关联账户'">关联/创建</span>
  </section>
</div>
</template>

<script>
/* 账户信息 */
import { shixiNumber} from "@/utils/Enum/User";
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";
import currency from "./currency"
import cardBag from "./cardBag"
export default {
  components: { currency, cardBag },
  computed: {
    ...mapState({
      accountList: (e) => e.customer_material_account.accountList,
      modalLoading: (e) => e.customer_material_account.modalLoading,
      user: e => e.customer_material.user,
      accountTypeInfo: e => e.customer_material_account.accountTypeInfo,
    }),
  },
  data() {
    return {
      shixiNumber,
      active1: 0,
      active2: 0
    }
  },
  async created(){
    /* 账户信息列表 */
    await Customer.Account.getAccounts();
  },
  methods: {
    handleBing(type) {
      this.$router.push({path: "/customer/material/bind",query: {type}});
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
  src: url('../../../../styles/font-style.ttf');
}
.account-info-container {
   background: #fff;
   margin-top: 10px;
   min-height: calc(100vh - 80px);
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
    img{
      width: 16px;
      height: 16px;
      margin-right: 8px;
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
  color: #c6c6c6!important;
  cursor: not-allowed!important;
  margin-left: 10px;
}
.account-wrap{
   background: #fff;
   .icon-box{
      padding: 20px 10px;
      span{
         display: inline-block;
         overflow: hidden;
         font-size: 12px;
         line-height: 14px;
         color: #4979ff;
         margin-right: 20px;
         img{
            margin-right: 4px;
            display: block;
            float: left;
            width: 14px;
            height: 14px;
         }
      }
   }
}

::v-deep .el-tabs--border-card{
  box-shadow: none !important;
  border: none !important;
  
  .is-active{
    color: #4979ff !important;
  }
}
::v-deep .el-tabs--border-card>.el-tabs__content{
  padding: 8px !important;
}
::v-deep .van-tabs__nav--card{
  margin: 0 10px 0 10px;
}
::v-deep .van-tabs--line .van-tabs__wrap{
  height: 30px;
}
</style>