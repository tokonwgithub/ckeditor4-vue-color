<template>
   <div v-loading='loading' style="padding:16px">
      <div v-if="!groupIdchecked">
         <p>
            <p v-if="!isSend">该群聊系统自动获取ID失败，请手动选择单号</p>
            <el-select  v-model="orderId" placeholder="请选择订单" filterable  style="width:100%" v-if="!isSend" >
               <el-option v-for="(item,index) in groupList" :key="index" :label="item.orderName" :value="item.id" class="break-option"></el-option>
            </el-select>
         </p>
         <el-button type="primary" v-loading='btnloading' v-if="!isSend" @click="updateChatidandSend">发送问卷</el-button>
         <p v-else>
            满意度问卷已发送 <el-button type="primary"  v-loading='btnloading' @click="QuestionnaireLinksSend">（再次发送）</el-button>
         </p>
      </div>
      <div v-else>
         <el-button type="primary" v-loading='btnloading' v-if="!isSend" @click="QuestionnaireLinksSend">发送问卷</el-button>
         <p v-else>
            满意度问卷已发送 <el-button type="primary"  v-loading='btnloading' @click="QuestionnaireLinksSend">（再次发送）</el-button>
         </p>
      </div>
      
   </div>
   
</template>
<script>
   import { Storage } from "@/utils/Enum/index";
   import {  getWeChatEnv } from "@/utils/Wechat/WxUtils";
   import { sendNewsMsg, getChatId } from "@/utils/Wechat/WxUtils";
   import { WeChatEnv } from "@/utils/Enum/WeChat";
   import { getQuestionnaireUrl,updateQuestionnaireStatus ,getQuestionnaireUrlorderGroup,checkCreate,updateGroupChatId} from '@/api/order'
  import util from '@/utils/util'
   export default {
      data() {
         return {
            chatId:null,
            linksUrl:null,
            isSend:false,
            loading:false,
            btnloading:false,
            orderId:'',
            groupList:[],
            groupIdchecked:false,
            cansend:false,
         }
      },
      mounted(){
         if (this.$route.params.back) {
               this.init();
            } else {
               this.dispatch();
            }
      },
      methods: {
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
         /**校验当前入口环境 */
         async validateEnv() {
            const _env = await getWeChatEnv();
            console.log("当前入口环境:", _env, );         
            // 环境入口说明条件
            return  ['group_chat_tools','group_chat_tools'].includes(_env);
         },
         async init() {
            this.loading = true;
            if (await this.validateEnv()) {
               await this.getChatIdFun();
            } else {
               this.$message({
                  message: "请前往群聊的聊天窗口右侧工具栏查看",
                  type: "warning",
               });
            }
         },
         async updateChatidandSend(){
            this.cansend = false;
            if(!this.orderId){
               return this.$message({
                     message: "请先选择订单",
                     type: "warning",
                  });
            }
            await this.updateGroupChatId()
         },
         // ++++++++++++++++++++++++++++++++++
         updateGroupChatId(){
            updateGroupChatId({groupChatId:this.chatId,id:this.orderId}).then(async(res)=>{
               const {status,body} = res;
               if(status == 200){
                  if(body.msg == 'success'){
                     this.cansend = true;
                     if(this.cansend){
                        await this.getQuestionnaireUrls('first')
                        // await this.QuestionnaireLinksSend()
                     }else{
                        this.$emit('groudsuccess')
                     }
                  }
               }else if(status!= 4010){
                  this.$message({
                     message: "接口异常错误",
                     type: "warning",
                  });
               }
            })
         },
         //订单列表参数
         getQuestionnaireUrlorderGroup(){
            getQuestionnaireUrlorderGroup({currPage:1,pageSize:2000,groupChatIdNull:1}).then(res=>{
               const {status,body} = res;
               if(status == 200){
                 this.groupList = body.list
               }else if(status!= 4010){
                  this.$message({
                     message: "接口异常错误",
                     type: "warning",
                  });
               }
            })
         },
         // 对比群是否在
         checkCreate(){
            checkCreate({groupChatId:this.chatId}).then(res=>{
               this.loading = false;
               const {status,body} = res;
               if(status == 200){
                  this.groupIdchecked = (body.checked == 'ok')?true:false;//"checked": "ok",  或者 fail
                  if(!this.groupIdchecked){
                     this.getQuestionnaireUrlorderGroup()
                  }
               }else if(status!= 4010){
                  this.$message({
                     message: "接口异常错误",
                     type: "warning",
                  });
               }
            })
         },
         async getChatIdFun(){
            this.chatId = await getChatId();
            // this.chatId = 'dfjdahfjdsahgjdsgh4';
            await this.checkCreate()//对比群是否存在
            await this.getQuestionnaireUrls()
           
         },
         // ++++++++++++++++++++++++++++++
         updateQuestionnaireStatus(){
            this.btnloading = false;
            updateQuestionnaireStatus({groupChatId:this.chatId}).then(res=>{
               const {status,body} = res;
               if(status == 200){
                  this.$emit('groudsuccess')
               }else if(status!= 4010){
                  this.$message({
                     message: "接口异常错误",
                     type: "warning",
                  });
               }
            })
         },
         getQuestionnaireUrls(params){
            getQuestionnaireUrl({groupChatId:this.chatId}).then(res=>{
               const {status,body} = res;
               this.loading = false;             
               if(status == 200){
                  this.linksUrl = body.url;
                  // if(!this.groupIdchecked){
                  //    this.QuestionnaireLinksSend()
                  // }
                  if(params=='first'){
                     this.QuestionnaireLinksSend()
                  }
               }else if(status != 4010){
                  this.$message({
                     message: "获取链接失败",
                     type: "warning",
                  });
               }
            })
         },
         // 发送链接
         async QuestionnaireLinksSend(){
            this.loading = false;
            this.isSend = true;
            this.btnloading = true;
            let img = `http://classbro-oss.oss-cn-hongkong.aliyuncs.com/statice-resource/1600053309855/%E9%97%AE%E5%8D%B7.png`
            if(this.linksUrl){
               await sendNewsMsg({
                  title: "请对我的服务进行评价",
                  url: this.linksUrl,
                  desc: "您的宝贵意见是我们进步的最大动力^_^",
                  // imgUrl: "https://wchk-oss.oss-cn-hongkong.aliyuncs.com/statics/images/paylinkimg.png"
                  imgUrl: img
               });
               this.updateQuestionnaireStatus();
            }else{
               this.$message({
                     message: "获取链接失败,请刷新重试",
                     type: "warning",
                  })
            }
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
<style>
.break-option.el-select-dropdown__item{
    min-height: 36px;
    height: auto;
    width: calc(100vw - 30px);
    white-space: normal !important;
    padding: 10px;
    line-height: 20px;
}
</style>