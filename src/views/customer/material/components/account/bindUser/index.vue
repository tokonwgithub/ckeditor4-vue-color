<template>
  <div class="bind-user-container" >
    <div class="main-container" >
      <!-- 头部 -->
      <div class="header">
        <span @click="onBack"><i class="el-icon-arrow-left" />关联客户账户</span>
        <span @click="handleCreate">子系统内没有账户可直接<span>创建账户</span></span>
      </div>

      <p class='sys-tip'>{{userIsWy ? '文亚' :isSxAccount?'实习':'导毕'}}系统客户账户</p>
      <!-- 搜索栏 -->
      <div class="search-container">
        <el-input v-model="form.key" @keyup.enter.native="initList" :placeholder="userIsWy?'搜索client Name或client ID':'搜索手机号'" :type="userIsWy? 'text' : 'number'">
          <i slot="append" class="el-icon-search" @click="initList"></i>
        </el-input>
      </div>
      <!-- 用户模板 -->
      <div class="user-container" v-loading="loading">
        <ul v-if="!userIsWy">
          <li v-for="(item, i) in bindUsers" :key="i">
            <div class="bind-link">
              <span class="bind" >
                <div class="dot" :style="{'background-color': UserStatus2Val[!!item.wxUserId].color}"></div>
                {{UserStatus2Val[!!item.wxUserId].label}}
                <span v-if="!!item.wxUserId">客户【{{item.username}}】</span>
                <span v-if="!!item.wxUserId && item.sellerUserName">>>>{{item.sellerUserName}}</span>
              </span>
              <span class="link" @click="handleBind(item)" v-show="!item.wxUserId"> <img src="@/assets/images/connection.png" alt="">  关联</span>
            </div>
            <div class="bind-item"><span class="label">手机号:</span>{{item.mobile}}</div>
            <div class="bind-item"><span class="label">姓名</span>{{item.username}}</div>
            <div class="bind-item"><span class="label">昵称:</span>{{item.nickName}}</div>
            <div class="bind-item"><span class="label">国家:</span>{{item.country}}</div>
            <div class="bind-item"><span class="label">学校:</span>{{item.university}}</div>
          </li>
        </ul>
        <ul v-if="userIsWy" v-loading="bindLoading">
          <li v-for="(item, i) in bindUsers" :key="i">
            <div class="bind-link">
              <span class="bind" >
                <div class="dot" :style="{'background-color': UserStatus2Val[!!item.ucId].color}"></div>
                  {{UserStatus2Val[!!item.ucId].label}}
                <span v-if="!!item.ucId">客户【{{item.username}}】</span>
              </span>
              <span class="link" @click="handleBind(item)"  v-show="!item.ucId"><img src="@/assets/images/connection.png" alt="">关联</span>
            </div>
            <div class="bind-item"><span class="label1">clientName:</span>{{item.clientName}}</div>
            <div class="bind-item"><span class="label1">createdTime:</span>{{item.createdTime}}</div>
            <div class="bind-item"><span class="label1">学校:</span>{{item.university}}</div>
            <div class="bind-item"><span class="label1">账户余额:</span><span> <b v-for="(currency,indexc) in item.accountBalance" :key="indexc">{{currency.money}}{{currency.currencyName}};</b></span></div>
            <div classp="bind-item"><span class="label1">订单名称:</span>
            <div>
              <p v-for="(order,indexo) in item.order" :key="indexo" @click="openOrder(order)">{{order.orderName}}</p>
            </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- dialog -->
    <el-dialog title="是否确认创建账户？" :show-close="false" center :visible.sync="confirmShow" width="84%">
      <!-- <span>子系统内创建账户后无法再关联账户</span> -->
      <clientName ref='clientname'  :userIsWy="userIsWy" style="margin-top:10px;"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="confirmShow = false">取 消</el-button>
        <el-button type="primary" :disabled="createdLoading" :loading="createdLoading" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* 关联用户 */
import clientName from "../../clientName2";
import { Customer } from "@/store/dispatch/index";
import { UserStatus2Val, SysCode2Type } from "./Cfg";
import { SysCode, BindType } from "@/utils/Enum/Customer/Account";
import { mapState } from "vuex";
import { getToken } from "@/utils/Auth";
import { mergeDbStudUser, bindStudUser,mergeDbStudUserSx } from '@/api/account'
import { wenyaUrl, webUrl } from "config";
export default {
  data() {
    return {
      form: { key: "" },
      confirmShow: false,
      UserStatus2Val,
      userIsWy:false,
      bindLoading:false,
      createdLoading: false,
      isSxAccount:false,//是不
    };
  },
  components:{
    clientName
  },
  computed: {
    ...mapState({
      bindUsers: e => e.customer_material_account.bindUsers,
      user: e => e.customer_material.user,
      loading: e => e.customer_material_account.loading
    })
  },
  async created () {
    Customer.Account.clearBindUserList(this.form)
    this.handUserCode();
    await Customer.Material.getUserDetail()
  },
  methods: {
    openOrder(item){
      let { courseId, orderName, orderNum } = item
      let url;
      if(courseId){
        url = `${webUrl}seller/#/system/wyOrderDetails?courseId=${courseId}&orderNo=${encodeURIComponent(orderName)}&token=${getToken()}`
      }else{
        url = wenyaUrl + 'site/auto-login?token=' + getToken() + '&redirect=neworder/view&orderNum=' + item.orderNum;
      }
      var feature = 'top=0, left=0,toolbar=no,menubar=yes, scrollbars=yes, resizable=yes,location=no,status=no,channelmode = yes';
      var newwindows = window.open(url, "_blank", feature);
      newwindows.moveTo(0, 0); //将新页面打开位置定位在屏幕左上角
      newwindows.resizeTo(screen.width, screen.height); 
    },
    handUserCode(){
      // let codes = sessionStorage.getItem("state");
      let codes = this.$route.query.type
      this.userIsWy = codes&&codes.includes('wy')?true:false;
      this.isSxAccount = codes == 'sx'?true:false;
      console.log(this.userIsWy,'this.userIsWy')
    },
    onBack() {
      this.$router.push({ name: 'customerMaterial', query: {token: getToken()}, params: {back: true}})
    },
    handleCreate() {
      this.confirmShow = true;
    },
    /* 创建 */
    async handleConfirm() {
      let data = {
        ucId:sessionStorage.getItem("userId"),
        bindType: BindType.CREATE,
        childType: this.userIsWy ? 2 :this.isSxAccount ? 3: 1,//添加实习处理
        clientName: '',
        userId: this.user.userId,
        mobile: '',
        
      }
      if(this.userIsWy){
        data.clientName = this.$refs.clientname.accountForm.clientName;
        if(!data.clientName) return
        if(!this.user.clientName){
          this.$refs.clientname.handleBlur();
        }
      }else{
        data.mobile = this.$refs.clientname.accountForm.mobile;
        let country =  this.$refs.clientname.accountForm.country
        if(!data.mobile) return
        if(!country) {
          this.$message.info('请选择国家code')
          return
        }
        data.code = this.$refs.clientname.countryList.filter(i => i.id == country)[0].code
      }
      
      this.createdLoading = true
      const res = await bindStudUser(data);
      if (res.status === 200) {
        this.$toast("创建成功");
        this.createdLoading = false
        this.confirmShow = false;
        this.onBack()
      } else {
        this.createdLoading = false
        this.$toast(res.msg)
      }
    },
    /* 绑定 */
    async handleBind(item) {
      let datas = {
        childType:1,
        oldUserId: this.user.userId,
        newUserId: item.userId,
        systemFlag: 1
      };
      if(this.isSxAccount){
        datas.childType = 3;
      }
      if(this.userIsWy){
        datas = {
          childType:2,
          oldUserId: this.user.userId,
          newUserId: item.id,
          systemFlag: 1,
          oldOldUserId: item.oldUcId,
        }
      }
      this.bindLoading = true;
      const res = await (this.isSxAccount?mergeDbStudUserSx: mergeDbStudUser)(datas);
      this.bindLoading = false;
      if (res.status === 200) {
        this.$toast("绑定成功");
        this.onBack()
      } else {
        this.$toast(res.msg)
      }
    },
    async initList() {
      this.form.usercode = this.userIsWy;
      if(this.isSxAccount){
        this.form.sysCode = this.$route.query.type
      }
      await Customer.Account.getBindUserList(this.form);
    }
  }
};
</script>
<style scoped>
/deep/.el-input-group__append, .el-input-group__prepend{
  background-color: #fff;
  
}
/* /deep/.el-input__inner{
  border-right: none;
} */
/deep/.el-dialog__body{
  padding: 16px 15px;
}
/deep/.el-form-item__label{
  line-height: 18px;
  margin: 0;
  padding: 0;
  color: #8C8C8C;
  font-size: 12px;
}
/deep/.el-dialog__header{
  border-bottom: 1px solid #D9D9D9;
}
</style>
<style lang="scss" scoped>
.el-button{
  width: 112px;
}
.el-icon-arrow-left{
  margin-right: 8px;
}
.tips{
  text-align: center;
  font-size: 15px;
  margin-top: 10px;
  color: #1a1919;
}
.bind-item{
  font-size: 12px;
}
.text-left{
  text-align: left;
}
.text-center{
  text-align: center;
  padding: 0 3px;
}
.text-right{
  text-align: right;
}
.accounts{
  display: inline-block;
  word-break:break-all;
}
.bind-user-container {
  width: 100%;
  padding: 10px;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  height: 100%;
  .main-container{
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    padding: 16px 10px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    :first-child{
      color: #2C2D2F;
      font-weight: 600;
      font-size: 16px;
    }
    :last-child{
      color: #48494C;
      font-size: 12px;
      span{
        color: #4979FF;
      }
    }
  }
  .sys-tip{
    color: #48494C;
    font-size: 14px;
    margin: 24px 0 8px 0;
  }
  .select-container {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    span {
      font-size: 13px;
    }
  }
  .search-container {
    span {
      font-size: 13px;
    }
  }
  .user-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    li {
      margin-top: 16px;
      padding: 10px;
      border-radius: 2px;
      background: #EEF1F9;
      & > div {
        display: flex;
        color: #48494C;
        font-size: 12px;
        line-height: 30px;
        .label {
          display: inline-block;
          color: #8C8C8C;
          width: 50px;
        }
        .label1{
          display: inline-block;
          color: #8C8C8C;
          width: 70px;
        }
        i{
          margin-right: 3px;
          font-style: initial;
          color: #8C8C8C;
        }
        p{
          margin: 0;
          display:block;
          line-height: 14px;
          white-space: nowrap;
          overflow: hidden;
          width: auto;
          max-width: 200px;
          text-overflow: ellipsis;
          color: #4979FF;
          margin-bottom: 5px;
          text-decoration-line: underline;
        }
      }
      .bind-link{
        display: flex;
        .bind{
          flex: 1;
          text-align: left;
          color: #48494C;
          font-size: 14px;
          .dot{
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 3px;
          }
        }
        .link{
          flex: 1;
          text-align: right;
          font-size: 14px;
          color: #4979FF;
          cursor: pointer;
          img{
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
  .footer {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    span {
      font-size: 14px;
      color: #333;
    }
    .btn {
      cursor: pointer;
    }
  }
}
</style>