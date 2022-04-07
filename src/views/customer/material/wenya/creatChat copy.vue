<template>
    <div>
        <el-tooltip
            effect="dark"
            content="创建企业微信群聊"
            placement="bottom"
        >
            <img
                src="@/assets/images/order/chat.png"
                class="icon-img"
                v-if="!orderInfo.wxChatStatus"
                @click="handleClick"
            />
            <img
                v-if="orderInfo.wxChatStatus"
                src="@/assets/images/order/chat-gray.png"
                class="icon-img"
                @click="handleClick"
            />

        </el-tooltip>
        <el-dialog
            :visible.sync="dialogVisible"
            width="400px"
            :before-close="closeDialog"
            append-to-body
            center
            title="创建企业微信群聊"
        >
            <!-- <el-form
                v-loading="loading"
                ref="form"
                :model="form"
                :rules="rules"
                label-position="top"
            >
               <el-form-item
                    label="请选择需要加入群聊的售后人员"
                    prop="userId"
                    :rules="[{required: true, message: '请输入Message', trigger: 'change'}]"
                >
                <el-select style="width: 100%;" v-model="form.userId" @change="getafterSalesGroup">
                  <el-option
                     v-for="(item, i) in arrlist"
                     :key="i"
                     :label="item.username"
                     :value="item.ucId"
                  ></el-option>
                </el-select>
               </el-form-item>
            </el-form> -->
            <div>
                该订单匹配到的售后专员：{{salename}}
            </div>
            <div class="mt10">点击 确定 创建企业微信群聊</div>
            <div class="flex flex-justify-center flex-align-center group-btn" v-loading="loading">
               <el-button  type="primary" @click="submit" :loading="loading">保存</el-button>
               <el-button type="primary" plain @click="closeDialog" :loading="loading">取消</el-button>
           </div>
         </el-dialog>
    </div>
</template>

<script>
import { getWeChatEnv ,createdGroupChat} from "@/utils/Wechat/WxUtils";
import { WeChatEnv } from "@/utils/Enum/WeChat";
import { lightURL, Env } from "config"
import { getQueryString } from "@/utils/index";
import { autoAuth } from "@/utils/Wechat/WxUtils";
import { getAfterSales, getAfterSalesList ,afterSalesGroup,processingGroupChatsave,updateSellerGroupChatId} from "@/api/order";
export default {
    data(){
        return{
            lightURL,
            loading:false,
            dialogVisible:false,
            form:{
               userId:'',
               orderNum:'',
               groupChatId:"",
               groupChatName:''
            },
            arrlist:[],
            rules:{},
            beforesaveid:'',
            afterSalesGroupobj:{},
            salename: '',
        }
    },
    props: ['orderInfo'],
    methods: {
        async handleClick(){
            if (await this.validateEnv()) {
                await this.getAfterSales()
                await this.getAfterSalesList();
                await this.getafterSalesGroup()
                this.form.orderNum = this.orderInfo.wyOrderId;
                if(this.orderInfo.wxChatStatus){
                    this.$notify({
                        message: '该订单已存在企业微信群聊',
                        type: 'error',
                    });
                }else{
                    this.form.orderNum = this.orderInfo.orderNum
                    this.dialogVisible = true;
                }
            }else{
                this.$message({
                    duration: 0,
                    message: "请前往与客户的聊天窗口右侧工具栏查看",
                    type: "warning",
                });
            }

         },
          /* 获取用户权限 */
        async getAuth() {
        const url = window.location.href + "";
            const state = getQueryString("state", url);
            if (state) sessionStorage.setItem("state", state);
            autoAuth(location.href.split("#")[0]);
        },
         async submit(){
            alert('请在群创建后,在群内发送一条消息,否则将导致售后拉入失败')
            // this.$notify({
            //     message: '请在群创建后,在群内发送一条消息,否则将导致售后拉入失败',
            //     type: "warning",
            // });
           this.loading = true;
           let {studWxId,sellerWxId,afterSalesWxId,robotWxId} = this.afterSalesGroupobj,
           { orderNo } = this.orderInfo,
           userId = (sellerWxId?sellerWxId +';':'') + (robotWxId?robotWxId:'');
            console.log(userId,'加入群聊的userID')
            let  externalUserIds =  studWxId,
            groupName = orderNo;
           let datas = {
            userId:userId,
            externalUserIds:externalUserIds,
            groupName:orderNo,
            chatId:""
           };
           await this.processingGroupChatsave(null);
           const chatIdpbj = await createdGroupChat(datas);
            let cdebug = window.localStorage.getItem("cdebug")
            if(cdebug){
             alert("创建群聊响应"+chatIdpbj.toString())
            }
           if(chatIdpbj&&chatIdpbj.chatId){
               let dataobj = {groupChatId:chatIdpbj.chatId ,id:this.beforesaveid}
                this.updateSellerGroupChatId(dataobj)
            }
        },
        // getafterSalesGroup(){
        //     console.log(this.orderInfo,this.form.userId)
        //     let datas = {studUserId:this.orderInfo.wyUcId, afterSalesUserId:this.form.userId}
        //     afterSalesGroup(datas).then(res=>{
        //         const {status,body} =  res;
        //         if(status == 200){
        //             this.afterSalesGroupobj = body;
        //         }

        //     })
        // },
        updateSellerGroupChatId(data){
            updateSellerGroupChatId(data).then(res=>{
               this.loading = false;
               const {status,body} =  res;
               if(status == 200){
                this.$notify({
                    message:body.msg || '操作成功',
                    type:'success'
                })
                  this.$emit("updateSuccess")
                 this.closeDialog()
               }
            })
        },
        async processingGroupChatsave(chatId){
            this.form.groupChatName = this.orderInfo.orderNo;
            this.form.groupChatId  = chatId;
            this.form.orderNum = this.orderInfo.wyOrderId;
            this.form.afterSalesName = this.afterSalesGroupobj.afterSalesName
            const {status ,body} = await processingGroupChatsave(this.form)
            this.loading = false;
            this.beforesaveid = body.id;
            if(status == 200){
                this.closeDialog()
            }
            
        },
        closeDialog(){
         this.dialogVisible = false;
        },
        /**校验当前入口环境 */
        async validateEnv() {
            const _env = await getWeChatEnv();
            console.log("当前入口环境:", _env);
            return _env != WeChatEnv.NORMAL;
        },
        async getAfterSales(){
            const {status,body} = await getAfterSales();
            if(status == 200){
                this.form.userId = body.ucId
                console.log(this.form.userId)
            }

        },
        getAfterSalesList(){
            getAfterSalesList().then(res=>{
                const {status,body} =  res;
                if(status == 200){
                    this.arrlist = body;
                    this.arrlist.forEach(e => {
                        if(this.form.userId==e.ucId){
                            this.salename = e.username
                        }
                    });
                }
            })
        },
    }
}
</script>
