<template>
   <div class="box-wrap">
      <van-tabs v-model="active"  type="card" color="#4979ff"  @change="changetabs" >
         <van-tab title="报价申请">
            <el-button type="primary" class="btn-style" @click="openoutpriceOrder('')">发起报价申请</el-button>
         </van-tab>
         <van-tab title="客户报价记录" >
            <ul class="mar-t16" v-for="(itmes,index) in tableData" v-loading="loading">
               <li class="lis-card">
                  <p>{{itmes.newOfferName}}<b :class="'bg'+itmes.statused">{{statudedname[itmes.statused]}}</b></p>
                  <p>
                     <img src="@/assets/images/offer/edits.png" @click="handleOpertion(itmes.id,1)" v-if="itmes.statused == 1" />
                     <img src="@/assets/images/offer/cancels.png" @click="handleOpertion(itmes.id,2)" v-if="itmes.statused == 1"/>
                     <img src="@/assets/images/offer/shares.png"@click="handleOpertion(itmes.id,3)" v-if="itmes.statused == 2"/></p>
               </li>
            </ul>
         </van-tab>
      </van-tabs>
   </div>
</template>
<script>
   import { Base64 } from 'js-base64';
   import { Customer } from "@/store/dispatch/index";
import { getOutUserId, getWeChatEnv } from "@/utils/Wechat/WxUtils";
   import { mapState } from "vuex";
   import { getToken } from "@/utils/Auth";
   import { Storage } from "@/utils/Enum/index";
   import { sendNewsMsg } from "@/utils/Wechat/WxUtils";
   import { WeChatEnv } from "@/utils/Enum/WeChat";
   import {sellerList,exportResult,sellerCancel} from "@/api/outPrices"
   export default {
      data(){
         return {
            active:0,
            tableData:[],
            statudedname:{
               1:'待处理',
               2:'已完成',
               3:'已驳回',
            },
            loading:false,
            studWxUserId:'',

         }
      },
      computed: {
         ...mapState({
            user: e => e.customer_material.user,
            form: (e) => e.customer_material.user,
            back: (e) => e.customer_material.back,
         }),
      },
      async created(){
        
        
      },
      mounted(){
         if(!this.showtype){
            // this.init();
            // return
            //TODO
            if (this.$route.params.back) {
               this.init();
            } else {
               this.dispatch();
            }
         }else{
            this.bodyShow = true;
         }
      },
      methods: {
         openoutpriceOrder(id){
            if(!this.form.dbId && !this.form.wyId){
               return this.$notify.warning("该账户没有关联账号，请去关联账号");
            }
            const tokens = getToken('TOKEN');
            let params = JSON.stringify({
               countryId: this.form.countryId,
               universityId:this.form.universityId,
               token: tokens,
               studWxUserId:this.studWxUserId,
               id:id,
            })
            console.log(params)
            let routeData = this.$router.resolve({
               path: "/outPrices/index",
               query:{
                  bdata:Base64.encode(params)
               }
            });
            window.open(routeData.href, '_blank','width=400,height=600,left=600');
         },
         changetabs(val){
            if(val == 1){
               this.sellerList()
            }
           
         },
         handleOpertion(id,type){
            if(type == 1){
              //编辑
              this.openoutpriceOrder(id)
            }
            if(type == 2){
              this.sellerCancel(id)//取消报价申请
            }
            if(type == 3){
               this.exportResult(id)//导出
            }
         },
         async sellerCancel(id){
            const {status,body} = await sellerCancel({id});
            if(status == 200){
               this.$message({
                  duration: 2000,
                  message: "操作成功",
                  type: "success",
               });
               this.sellerList()
            }
         },
         async exportResult(id){
            const {status,body} = await exportResult({id});
            if(status == 200){
               this.$message({
                  duration: 2000,
                  message: "操作成功",
                  type: "success",
               });
              if(body.uuid){
               let routeData = this.$router.resolve({
                  path: "/outPrices/result",
                  query:{
                     uuid:body.uuid
                  }
               });
               window.open(routeData.href, '_blank','width=400,height=600,left=600');
              }
            }
         },
         /**校验当前入口环境 */
         async validateEnv() {
            const _env = await getWeChatEnv();
            console.log("当前入口环境:", _env, _env != WeChatEnv.NORMAL);
            return _env ;
         },
         dispatch() {
            console.log('dispatch----------',)
            this.intervalId = setInterval(() => {
               const config = localStorage.getItem(Storage.AGENT_CONFIG);
               if (!config) clearInterval(this.intervalId);
               else if (+config === 1) {
                  clearInterval(this.intervalId);
                  this.init();
               }
            }, 500);
         },
         async init() {
            // console.log('init----------',)
            // await Customer.Material.getUserDetail();
            // Customer.Material.initList();
            // this.bodyShow = true;
            // return;
            // TODO:
            if (await this.validateEnv()) {
            console.log('执行个人信息')
               await Customer.Material.getUserDetail();
               Customer.Material.initList()
               this.studWxUserId = await getOutUserId();
               await this.sellerList()
            } else {
               console.log('请前往与客户的聊天窗口右侧工具栏查看', this.bodyShow)
               this.$message({
                  duration: 0,
                  message: "请前往企业微信查看",
                  type: "warning",
               });
            }
         },
         async sellerList(){
            this.loading = true;
            const {status,body} = await sellerList({studWxUserId:this.studWxUserId,page:1,limit:1000});
            this.loading = false;
            this.tableData = body.list
         },
      },
   }
</script>
<style scoped>
   .box-wrap{
      background: #fff;
      padding: 16px 10px;
      overflow: hidden;
   }
   .btn-style{
      margin: 30px 20px;
   }
   .lis-card{
      padding: 0 10px;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-bottom: 10px;
   }
   .lis-card p{
      color: #4979ff;
      font-size: 14px;
   }
   .lis-card p img{
      width: 16px;
      margin-right: 10px;
      font-weight: bold;
   }
   .lis-card p b{
      padding: 0 4px;
      margin: 0 4px;
      border-radius: 4px;
     
      color: #fff;
   }
   .mar-t16{
      margin-top: 16px;
   }
   .bg1{
      color: #EA6B59!important;
      background: #FACD91;
   }
   .bg2{
      color: #002E05!important;
      background: #67C671;}
   .bg3{
      color: #910012!important;
       background: #EFB0B3;}
</style>