<template>
    <div v-loading="loading" style="padding: 0 12px">
        <div v-if="!groupIdchecked">
            <div>
                <p v-if="!isSend">该群聊系统自动获取ID失败，请手动选择单号</p>
                <el-select  v-model="orderId" placeholder="请选择订单" filterable  style="width:100%" v-if="!isSend" @change="updateChatidandSend">
                    <el-option v-for="(item,index) in groupList" :key="index" :label="item.orderName" :value="item.id" class="break-option"></el-option>
                </el-select>
            </div>
        </div>
        <div v-else>
            <el-table
                :data="bills"
                class="mb10"
                style="width: 100%;height:240px;overflow: auto;">
                <el-table-column
                    prop="type"
                    label="账单类型"
                    min-width="120">
                    <template slot-scope="{row}">
                        {{typeOption[Number(row.type)]}} 
                    </template>
                </el-table-column>
                <el-table-column
                    prop="currency"
                    label="账单金额"
                    min-width="120">
                    <template slot-scope="{row}">
                        {{row.currency}} <span style="color: red" class="ml5">{{row.money}} </span>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="!isRevision" class="f14">（未接单修改该功能不可用）</div>
            <div v-else-if="!revisionOrderIsFinish">
                <el-button
                    type="primary"
                    v-if="autosend==0"
                    @click="setautofile(1)"
                    :loading="btnloading"
                    >自动发送文件</el-button
                >
                <div v-if="autosend==1" class="f14">
                    （已设置系统自动发送文件链接）<el-button
                        type="primary"
                        size="mini"
                        @click="setautofile(0)"
                        plain
                        :loading="btnloading"
                        >取消</el-button
                    >
                </div>
            </div>
            <div v-else-if="revisionOrderIsFinish">
                <div>
                    <div
                        class="
                            flex
                            bgfff
                            align-items-center
                            pl10
                            pr10
                            mb5
                            pb5
                            pt10
                            space-between
                        "
                        v-for="(item, index) in files"
                        :key="index"
                    >
                        <div>
                            <div
                                class="bluefont pointer"
                                @click="downloadFile(item.url, item.name)"
                            >
                                {{item.name}}
                            </div>
                            <div class="time f12 filetime mt5">
                                {{ item.createdAt | createTime }}
                            </div>
                        </div>
                        <div>
                            <el-button type="primary" @click="sendMsg(item.url, item.name)"
                                >发送</el-button
                            >
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </div>
</template>
<script>
import { Storage } from "@/utils/Enum/index";
import {  getWeChatEnv } from "@/utils/Wechat/WxUtils";
import { sendNewsMsg, getChatId } from "@/utils/Wechat/WxUtils";
import {
    checkRevision,
    updateAutoSendFile,
    sendMsg,
    getOrderFiles,
    getGroupChatInfo,
    checkCreate,
    getQuestionnaireUrlorderGroup,
    updateGroupChatId,
    getCustomerBills,
} from "@/api/order";
import { downloadFile } from "@/utils/download";
export default {
    data() {
        return {
            chatId: null,
            loading: false,
            btnloading: false,
            autosend: 0,
            isRevision: false,
            files: [],
            revisionOrderIsFinish: false,
            groupIdchecked:false,
            groupList:[],
            orderId:'',
            isSend:false,
            cansend:false,
            bills: [],
            typeOption: {
                1: '课程预付',
                2: '欠费账单',
                4: '课程尾款',
                8: '课程追付',
                16: '补款账单',
            },
        };
    },
    mounted() {
        if (this.$route.params.back) {
            this.init();
        } else {
            this.dispatch();
        }
        // this.chatId = this.groupChatId
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
         async getChatIdFun(){
            this.chatId = await getChatId();
            // this.chatId = 'dfjdahfjdsahgjdsgh4';
            await this.checkCreate()//对比群是否存在
            this.getCustomerBills()
            this.checkRevision();
            this.getOrderFiles();
            this.getGroupChatInfo();
         },
         async getCustomerBills() {
             getCustomerBills({groupChatId:this.chatId}).then(res=>{
               const {status,body} = res;
               if(status == 200){
                 this.bills = body
               }else if(status != 4010){
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
               }else  if(status != 4010){
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
               }else if(status != 4010){
                  this.$message({
                     message: "接口异常错误",
                     type: "warning",
                  });
               }
            })
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
         updateGroupChatId(){
            updateGroupChatId({groupChatId:this.chatId,id:this.orderId}).then(res=>{
               const {status,body} = res;
               if(status == 200){
                  if(body.msg == 'success'){
                     this.cansend = true;
                     this.groupIdchecked = true
                     this.$emit('groudsuccess')
                     if(this.cansend){
                        this.getCustomerBills()
                        this.checkRevision();
                        this.getOrderFiles();
                        this.getGroupChatInfo();
                     }
                  }
               }else if(status != 4010){
                  this.$message({
                     message: "接口异常错误",
                     type: "warning",
                  });
               }
            })
         },
        downloadFile,
        async checkRevision() {
            this.loading = true;
            const { status, body } = await checkRevision({
                groupChatId: this.chatId,
            });
            if (status == 200) {
                this.isRevision = body;
            }
            this.loading = false;
        },
        async getGroupChatInfo() {
            this.loading = true;
            const { status, body } = await getGroupChatInfo({
                groupChatId: this.chatId,
            });
            if (status == 200) {
                this.autosend = body.autoSendFile
                this.revisionOrderIsFinish = body.revisionOrderIsFinish
            }
            this.loading = false;
        },
        async setautofile(type) {
            //  是否自动发送文件：0-否，1-是, 默认为否
            this.btnloading = true;
            const { status, body } = await updateAutoSendFile({
                groupChatId: this.chatId,
                autoSendFile: type || 0,
            });
            if (status == 200) {
                this.$notify.success(body.msg);
                if (type == 1) {
                    this.autosend = 1;
                } else {
                    this.autosend = 0;
                }
                this.btnloading = false;
                this.$emit('success')
            } else if(status != 4010){
                this.$notify.warning(body.msg);
                this.btnloading = false;
            }
        },
        async sendMsg(url,name) {
            this.loading = true;
            const { status, body } = await sendMsg({
                groupChatId: this.chatId,
                fileName: name,
                fileUrl: url,
            });
            if (status == 200) {
                this.loading = false;
                this.$notify.success(body.msg);
                this.$emit('success')
            } else {
                this.$notify.warning(body.msg);
                this.loading = false;
            }
        },
        async getOrderFiles() {
            this.loading = true;
            const { status, body } = await getOrderFiles({
                groupChatId: this.chatId,
            });
            if (status == 200) {
                this.files = body || [];
                this.loading = false;
            } else if(status != 4010){
                this.$notify.warning(body.msg);
                this.loading = false;
            }
        },
    },
    props: ['groupChatId'],
	filters: {
        createTime(createTime) {
            if (!createTime) return "";
            return (
                createTime.split(" ")[0] +
                " " +
                createTime.split(" ")[1].split(":")[0] +
                ":" +
                createTime.split(" ")[1].split(":")[1]
            );
        },
    },
};
</script>
<style lang="scss" scoped>
.choose-courrency-box {
    padding: 10;
    h3 {
        height: 16px;
        font-size: 16px;
        font-weight: 500;
        color: #2c2d2f;
        line-height: 16px;
    }
    ul {
        display: flex;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;
        li {
            position: relative;
            padding: 8px 15px;
            width: 133px;
            height: 64px;
            margin-bottom: 10px;
            margin-right: 10px;
            background: #f9fafd;
            border-radius: 4px;
            border: 1px solid #eef1f9;
            &.actives {
                background: #ffffff;
                box-shadow: 2px 3px 5px 0px rgba(25, 43, 94, 0.12);
                border-radius: 4px;
                border: 1px solid #4979ff;
            }
            img {
                display: block;
                width: 24px;
                margin: 0 0 8px;
            }
            p {
                margin: 0;
                padding: 0;
                font-size: 15px;
                font-weight: 500;
                color: #2c2d2f;
                line-height: 15px;
            }
        }
    }
}
.chooses {
    position: absolute;
    width: 16px !important;
    right: 4px;
    top: 4px;
    height: 16px !important;
}
.padding20 {
    padding: 0 20px;
}
.mobiles {
    width: 48% !important;
}
.mobiles:nth-of-type(2n) {
    margin-right: 0;
}
.showtips {
    padding: 20px;
    font-size: 16px;
    color: #4979ff;
}
</style>
<style>
.break-option.el-select-dropdown__item {
    min-height: 36px;
    height: auto;
    width: calc(100vw - 30px);
    white-space: normal !important;
    padding: 10px;
    line-height: 20px;
}
</style>