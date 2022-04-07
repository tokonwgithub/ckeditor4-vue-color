<template> 
  <div class="app-container" v-show="bodyShow">
    <div v-if="form.isMy">
      <van-tabs v-model="active"  type="line" color="#4979FF" line-height="2px" sticky title-active-color="#4979ff" title-inactive-color="#2C2D2F" @disabled="disabledTip">
        <van-tab title="基础信息">
          <!-- 用户详情 -->
          <section class="box user-detail">
            <el-form :model="form" ref="form" label-width="80px" label-position="top">
              <!-- 昵称/性别 -->
              <van-cell :border="false" style="margin-bottom: 10px; padding: 10px 10px 10px 0;">
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                  <span class="nick-name">{{form.wxName || form.nickName}}</span>
                  <i v-if="Gender2Sex[form.sex]" class="el-icon-male" :style="{color: Gender2Css[form.gender]}" />
                  <i v-if="Gender2Sex[form.sex]" class="el-icon-female" :style="{color: Gender2Css[form.gender]}" />
                </template>
              </van-cell>
              <clientName v-if="form.wyOrDbSeller == 2" label="clientName" placeholder="请输入用户clientName" field="clientName" @submit="submit"/>
              <fieldTemp label="姓名" placeholder="请输入" field="username" />
              <el-form-item label="备注" v-show="form.followUserRemark">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  v-model="form.followUserRemark"
                  @blur="handleBlur"
                ></el-input>
              </el-form-item>
              <el-form-item label="clientId" v-if="form.wyOrDbSeller == 2" >
                <div class="wxid-box">{{form.wxUserId}}</div>
              </el-form-item>
              <el-form-item label="WX UserId" v-if="form.wyOrDbSeller == 1 || form.wyOrDbSeller == 3" >
                <div class="wxid-box">{{form.wxUserId}}</div>
              </el-form-item>
              <fieldTemp
                label="微信号"
                placeholder="请输入"
                field="wxAccount"
                @submit="submit"
              />
              <!-- 资源等级 -->
              <selectTemp
                v-if="form.wyOrDbSeller == 1"
                :columns="intentLevelList"
                label="资源等级"
                placeholder="请选择"
                field="resourceLevel"
              />
              <!-- 手机号 -->
              <!-- :rules="rulePhone" -->
              <fieldTemp label="手机号" placeholder="请输入" field="mobile" @submit="submit" />
              <!-- Email -->
              <fieldTemp
                :rules="ruleEmail"
                label="Email"
                placeholder="请输入"
                field="email"
                :type="password"
                @submit="submit"
              />
              <!-- 留学国家 -->
              <selectTemp
                :columns="countryList"
                label="留学国家"
                placeholder="请选择"
                field="countryId"
                @event="getSchoolByCountryId"
              />
              <!-- 学校 -->
              <selectTemp :columns="schoolList" label="学校" placeholder="请选择" field="universityId" />
              <!-- 在读专业 -->
              <selectTemp :columns="majorList" label="在读专业" placeholder="请选择" field="professionalId" />
              <!-- 在读年级 -->
              <selectTemp
                v-show="isExpend"
                :columns="GradeList"
                label="在读年级"
                placeholder="请选择"
                field="schoolYear"
              />
              <!-- 在读学历 -->
              <selectTemp
                v-show="isExpend"
                :columns="eduList"
                label="在读学历"
                placeholder="请选择"
                field="eduId"
              />
              <fieldTemp
                label="Blackboard Website"
                placeholder="请输入"
                field="universityWebsite"
                @submit="submit"
              />
              <fieldTemp
                label="Blackboard ID"
                placeholder="请输入"
                field="schoolAccount"
                @submit="submit"
              />
              <fieldTemp
                label="Blackboard Password"
                placeholder="请输入"
                field="schoolPws"
                @submit="submit"
              />
              <div class="expend" v-show="!isExpend" @click="isExpend = true">
                <span>展开 <i class="el-icon-arrow-down"/></span>
              </div>
            </el-form>
          </section>
          <section class="box">
            <van-cell :border="false">
              <template #title>
                <div class="tag-container">
                  <tags-temp />
                </div>
              </template>
            </van-cell>
          </section>
          <section class="box" v-if="form.userId">
            <relation :studUserId="form.userId" :username="form.username"  />
          </section>
        </van-tab>
        <van-tab title="账户信息" :disabled="!form.username || (form.username && !form.username.trim())">
          <account/>
        </van-tab>
        <van-tab title="订单信息" :disabled="!form.username || (form.username && !form.username.trim())">
          <order />
        </van-tab>
      </van-tabs>
    </div>
    <!-- 该用户已与其他销售绑定 -->
    <userBoundTip v-if="!form.isMy" :form="form"/>
  </div>
</template>

<script>
/*client name*/
import clientName from "./components/clientName";
/*兼容文亚布局展示*/
import account from "./wenya/account";
import order from "./wenya/order";
/* 客户资料 */
import { Base64 } from 'js-base64';
import fieldTemp from "./components/field";
import selectTemp from "./components/selectTemp";
import tabsTemp from "./components/tabs/index";
import tagsTemp from "./components/tags/index";
import { mapState } from "vuex";
import { Gender2Css, Gender2Sex, GradeList } from "./Cfg";
import { validatePhone } from "@/utils/Validate";
import { Customer } from "@/store/dispatch/index";
import { Storage } from "@/utils/Enum/index";
import { WxGendor, shixiNumber} from "@/utils/Enum/User";
import { WeChatEnv } from "@/utils/Enum/WeChat";
import { getOutUserId, getWeChatEnv } from "@/utils/Wechat/WxUtils";
import { wenyaUrl } from "config";
import { getToken } from "@/utils/Auth";
// 关联账户模块
import relation from "./components/relation/index"
import userBoundTip from "./components/relation/userBoundTip"
export default {
  name: "customerMaterial",
  components: { fieldTemp, selectTemp, tabsTemp, tagsTemp, clientName, account, order, relation, userBoundTip},
  data() {
    return {
      shixiNumber,
      active: 0,
      password: "password",
      rulePhone: { trigger: "change", validator: validatePhone },
      ruleEmail: { trigger: "change", type: "email", message: "邮箱格式错误" },
      isExpend: false,
      Gender2Css,
      Gender2Sex,
      GradeList,
      intervalId: null,
      WxGendor,
      bodyShow: false,
      userIsWy:false
    };
  },
  computed: {
    ...mapState({
      form: (e) => e.customer_material.user,
      countryList: (e) => e.customer_material.countryList,
      schoolList: (e) => e.customer_material.schoolList,
      majorList: (e) => e.customer_material.majorList,
      eduList: (e) => e.customer_material.eduList,
      intentLevelList: (e) => e.customer_material.intentLevelList,
      loading: (e) => e.customer_material.loading,
      back: (e) => e.customer_material.back,
      accountTypeInfo: e => e.customer_material_account.accountTypeInfo,
    }),
  },
  created(){
    this.handUserCode();
  },
  methods: {
    async handUserCode(){
      sessionStorage.setItem("state",'wylll');
      let codes = sessionStorage.getItem("state");
      this.userIsWy = codes && codes.includes('wy')?true:false;
      this.form.wxUserId = await getOutUserId();
    },
    handleBlur() {
      this.isEdit = false;
      this.submit(this.form);
    },
    openOrder(){
      const url = wenyaUrl + 'site/auto-login?token=' + getToken() + '&redirect=neworder/create&customerId=' + this.form.wyId;
      console.log(url,'0url')
      window.open(url,'_blank')
      
//       http://test.wyard.cn/site/auto-login?token=&redirect=neworder/create&customerId=9999
// http://test.wyard.cn/site/auto-login?token=&redirect=neworder/view&orderNum=2018083110051499
    },
    openOrderWy(){
      if(!this.form.dbId && !this.form.wyId){
        return this.$notify.warning("该账户没有关联账号，请去关联账号");
      }
      const tokens = getToken('TOKEN');
      let params = JSON.stringify({
        ucId: this.form.userId,
        countryId: this.countryId,
        userId: this.form.userId,
        token: tokens
      })
      // // 测试数据
      // let testdata = {
      //   countryId: 61,
      //   token: 'be9277c9af16a5fed76f3f5e7577b6bc',
      //   ucId: 35190,
      //   userId: 35190,
      // }
      // let params = JSON.stringify(testdata);
      console.log(params)
      let routeData = this.$router.resolve({
        path: "/order/index",
        query:{
          bdata:Base64.encode(params)
        }
      });
      window.open(routeData.href, '_blank','width=400,height=600,left=600');
    },
    async submit(prop) {
      this.$refs.form.validateField(prop, async(valid) => {
        if (!valid) {
          const bool = await Customer.Material.updateUserDetail(this.form);
          if (bool) this.$toast("操作成功");
        }
      });
    },
    async payLinksSend(){
      const res = await sendPayLinks({userId:this.form.userId});
      console.log(res,'发送链接');
      const url = res.body;
      console.log(url, " link");
      await sendNewsMsg({
        title: "付款链接",
        url: url,
        desc: "请点击查看并确认付款",
        imgUrl: "https://wchk-oss.oss-cn-hongkong.aliyuncs.com/statics/images/paylinkimg.png"
      });
    },
    async init() {
      // await Customer.Material.getUserDetail();
      // Customer.Material.initList();
      // this.bodyShow = true;
      // return;
      // TODO:
      if (await this.validateEnv()) {
        await Customer.Material.getUserDetail();
        Customer.Material.initList();
        this.bodyShow = true;
      } else {
        this.$message({
          duration: 0,
          message: "请前往与客户的聊天窗口右侧工具栏查看",
          type: "warning",
        });
      }
    },
    /* 根据国家id获取学校列表 */
    async getSchoolByCountryId(id) {
      this.form.universityId = null;
      await Customer.Material.getSchoolListByCountryId(id);
    },
    /**校验当前入口环境 */
    async validateEnv() {
      const _env = await getWeChatEnv();
      console.log("当前入口环境:", _env);
      return _env != WeChatEnv.NORMAL;
    },
    dispatch() {
      this.intervalId = setInterval(() => {
        const config = localStorage.getItem(Storage.AGENT_CONFIG);
        if (!config) clearInterval(this.intervalId);
        else if (+config === 1) {
          clearInterval(this.intervalId);
          this.init();
        }
      }, 500);
    },

    disabledTip(){
      this.$toast('请先填充客户姓名')
    }
  },
  mounted() {
    // this.init();
    // return
    //TODO: 
    if (this.$route.params.back) {
      this.init();
    } else {
      this.dispatch();
    }
  },
};
</script>
<style>
.app-container .van-tab{
  /* justify-content: flex-start!important; */
  /* padding: 0 10px; */
}
.app-container .van-tabs__line{
  
}
.el-icon-circle-plus{
  font-size: 45px;
  cursor: pointer;
  color: #4979FF;
  position: fixed;
  right: 8px;
  bottom: 150px;
  z-index: 1;
}
.el-icon-zoom-in{
  font-size: 45px;
  cursor: pointer;
  color: #4979FF;
  position: fixed;
  right: 8px;
  bottom: 100px;
  z-index: 1;
}
</style>
<style scoped>
/deep/.el-form-item__label{
  text-align-last: justify;
  text-align: justify;
  line-height: 18px;
  margin: 0;
  padding: 0;
  color: #8C8C8C;
  font-size: 12px;
}
</style>
<style lang="scss">
.sendlinks-box{
  position: fixed;
  right: 10px;
  bottom: 200px;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  color: #409eff;
  font-size: 36px;
  background: #f5f5f5;
  
  z-index: 999;
  overflow: hidden;
  img{
    display: block;
    margin: 4px auto;
  }
}
.user-detail {
  margin-top: 10px;
  .van-field--disabled .van-field__label {
    color: #999;
  }
}
</style>
<style lang="scss" scoped>
.box {
  .van-cell{
    padding: 10px 10px 10px 0 !important;
  }
}
.el-icon-female,
.el-icon-male{
  font-size: 18px;
}
.goto-order-btn{
  text-align: right;
  margin: 0;
  button{
    width: 60px;
    height: 24px;
    line-height: 22px;
    border-radius: 4px;
    color: #4979FF;
    font-size: 14px;
    border: 1px solid #4979FF;
    background: #fff;
  }
}
.cant-click{
  button{
    border: 1px solid #ccc;
    color: #ccc;
    background: #f5f5f5;
  }
}
.box {
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 10px;
}
.nick-name {
  font-size: 18px;
  margin-right: 10px;
}
.icon-username {
  font-size: 18px;
}

.expend {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
  span {
    color: #999;
    font-size: 13px;
  }
}
.wxid-box{
  display: block;
  padding: 5px 15px;
  line-height: 1.5;
  min-height: 50px;
  height: 50px;
  box-sizing: border-box;
  width: 100%;
  white-space:normal;
  word-break: break-all;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  background-image: none;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
</style>