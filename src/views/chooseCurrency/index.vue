<template>
   <div v-loading='loading'>
      <div class="choose-courrency-box" :class="!showtype?'padding20':''"  v-show="bodyShow">
         <h3>请选择货币种类</h3>
         <ul>
            <li v-for="(list,indexs) in currencyList" :key="indexs" @click="createdlink(list,indexs)" :class="{'actives':activesIndex == indexs,'mobiles':browser}"  >
               <img :src="list.img" alt="">
               <img src="@/assets/images/choosecurrency/choose.png" alt="" v-if="activesIndex == indexs" class="chooses">
               <p>
                  {{list.name}}
               </p>
            </li>
         </ul>
      </div>
      <div v-if="wyOrDbSeller == 'none'" class="showtips">
         请先关联{{accountTypeObj[companyName]}}账户
      </div>
   </div>
   
</template>
<script>
   import { Customer } from "@/store/dispatch/index";
   import { getOutUserId, getWeChatEnv } from "@/utils/Wechat/WxUtils";
   import { mapState } from "vuex";
   import { getToken } from "@/utils/Auth";
   import { Storage } from "@/utils/Enum/index";
   import { sendNewsMsg } from "@/utils/Wechat/WxUtils";
   import { WeChatEnv } from "@/utils/Enum/WeChat";
  import {generatePayUrl} from '@/api/order'
  import { generatePayLinkWy } from "@/api/account";
  import util from '@/utils/util'
   export default {
      props:['showtype'],
      data() {
         return {
            bodyShow:false,
            activesIndex:null,
            intervalId: null,
            wyOrDbSeller:null,
            userIdObj:{
               1:'dbId',
               2:'wyId',
               3:'sxId'
            },
            accountTypeObj:{
               1:'辅导',
               2:'文亚',
               3:'实习',
            },
            currencyList:[{
               name:'CNY',
               img:require("@/assets/images/choosecurrency/CNY@2x.png")
            },
            {
               name:'AUD',
               img:require("@/assets/images/choosecurrency/AUD@2x.png")
            },
            {
               name:'USD',
               img:require("@/assets/images/choosecurrency/USD@2x.png")
            },
            {
               name:'NZD',
               img:require("@/assets/images/choosecurrency/NZD@2x.png")
            },{
               name:'GBP',
               img:require("@/assets/images/choosecurrency/GBP@2x.png")
            },
            {
               name:'CAD',
               img:require("@/assets/images/choosecurrency/CAD@2x.png")
            }]
         }
      },
      computed: {
         ...mapState({
            user: e => e.customer_material.user,
            form: (e) => e.customer_material.user,
            loading: (e) => e.customer_material.loading,
            back: (e) => e.customer_material.back,
            companyName:(e) => {
               return e.user.companyName.includes('导毕')?1:e.user.companyName.includes('万能职咖')?3:2
               console.log(e,'0fijdakfj')
            },
            browser() {
               return util.browser.android || util.browser.iPhone
            },
         }),
      },
      async created(){
         this.form.wxUserId = await getOutUserId();
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
         /**校验当前入口环境 */
         async validateEnv() {
            const _env = await getWeChatEnv();
            console.log("当前入口环境:", _env, _env != WeChatEnv.NORMAL);
            return _env != WeChatEnv.NORMAL;
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
               await Customer.Material.getUserDetail();
               Customer.Material.initList();
               this.wyOrDbSeller = this.user.wyOrDbSeller?(this.user.wyOrDbSeller && this.user[this.userIdObj[this.user.wyOrDbSeller]] )? this.user.wyOrDbSeller :'none':'none';
               console.log(this.wyOrDbSeller,this.user,'0---------------')
               if(this.wyOrDbSeller&& this.wyOrDbSeller != 'none'){
                  this.bodyShow = true;
               }
            } else {
               console.log('请前往与客户的聊天窗口右侧工具栏查看', this.bodyShow)
               this.$message({
                  duration: 0,
                  message: "请前往与客户的聊天窗口右侧工具栏查看",
                  type: "warning",
               });
            }
         },
         createdlink(obj,index){
            this.activesIndex = index;
            if(this.showtype){
               this.$emit('saveCurrency',obj.name)
            }else{
               this.generatePayUrl(obj.name);
            }
         },
         async generatePayUrl(curr){
            let datas = {curr:curr,studUserId:this.user.userId}
            const{status,body} = await generatePayUrl(datas)
            this.$notify({type:status == 200?'success':'error',message:status == 200?'已复制到对话框, 请点击发送！':body.msg})
            if(status == 200){
               this.payLinksSend(body.msg,curr);
            }
         },
         // 点击六个货币种类的那个页面
         async payLinksSend(url,curr){
            let img = `https://wchk-oss.oss-cn-hongkong.aliyuncs.com/statics/images/currency_ico/${curr}@2x.png`
            await sendNewsMsg({
               title: "付款链接",
               url: url,
               desc: "请点击查看并确认付款",
               // imgUrl: "https://wchk-oss.oss-cn-hongkong.aliyuncs.com/statics/images/paylinkimg.png"
               imgUrl: img
            });
        },
      },
   };
   </script>
<style lang="scss" scoped>
   
   .choose-courrency-box{
      padding: 10;
      h3{
         height: 16px;
         font-size: 16px;
         font-weight: 500;
         color: #2C2D2F;
         line-height: 16px;
      }
      ul{
         display: flex;
         margin: 0;
         padding: 0;
         flex-wrap: wrap;
         li{
            position: relative;
            padding: 8px 15px;
            width: 133px;
            height: 64px;
            margin-bottom:10px;
            margin-right:10px;
            background: #F9FAFD;
            border-radius: 4px;
            border: 1px solid #EEF1F9;
            &.actives{
               background: #FFFFFF;
               box-shadow: 2px 3px 5px 0px rgba(25, 43, 94, 0.12);
               border-radius: 4px;
               border: 1px solid #4979FF;
            }
            img{
               display: block;
               width: 24px;
               margin: 0 0 8px;
            }
            p{
               margin: 0;
               padding: 0;
               font-size: 15px;
               font-weight: 500;
               color: #2C2D2F;
               line-height: 15px;
            }
         }
      }
   }
   .chooses{
      position: absolute;
      width: 16px!important;
      right: 4px;
      top: 4px;
      height: 16px!important;
   }
   .padding20{
      padding: 0 20px;
   }
   .mobiles{
      width: 48%!important;
   }
   .mobiles:nth-of-type(2n){
      margin-right: 0;
   }
   .showtips{
      padding: 20px;
      font-size: 16px;
      color: #4979FF;
   }
</style>