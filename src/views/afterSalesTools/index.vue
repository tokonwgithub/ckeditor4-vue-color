<template>
    <div style="height: 100vh">
        <div style="height: 60vh">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="发送问卷" name="first">
                    <sendQuestionre ref="sendQuestionre" @groudsuccess="groudsuccess1"></sendQuestionre>
                </el-tab-pane>
                <el-tab-pane label="订单文件" name="second">
                    <sendFile ref="sendFile" @success="success" @groudsuccess="groudsuccess"></sendFile>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="logbox"  v-if="chatId" style="height: 40vh">
            <div class="f14 mb5">操作日志</div>
            <log ref="log" :groupChatId="chatId"> </log>
        </div>
    </div>
</template>
<script>
import { Storage } from "@/utils/Enum/index";
import { getWeChatEnv, getChatId } from "@/utils/Wechat/WxUtils";
import sendQuestionre from "@/views/sendQuestionre/index.vue";
import sendFile from "@/views/sendFile/index.vue";
import log from "./components/log.vue";
export default {
    data() {
        return {
            activeName: "first",
            chatId: null,
        };
    },
    methods: {
        dispatch() {
            this.intervalId = setInterval(() => {
                const config = localStorage.getItem(Storage.AGENT_CONFIG);
                // const config = 1;
                if (!config) clearInterval(this.intervalId);
                else if (+config === 1) {
                    clearInterval(this.intervalId);
                    this.init();
                }
            }, 500);
        },
        groudsuccess() {
            if (this.$route.params.back) {
               if(this.$refs.sendQuestionre)this.$refs.sendQuestionre.init();
            } else {
               if(this.$refs.sendQuestionre)this.$refs.sendQuestionre.dispatch();
            }
        },
        groudsuccess1() {
            if (this.$route.params.back) {
               if(this.$refs.sendFile)this.$refs.sendFile.init();
            } else {
               if(this.$refs.sendFile)this.$refs.sendFile.dispatch();
            }
        },
        /**校验当前入口环境 */
        async validateEnv() {
            const _env = await getWeChatEnv();
            console.log("当前入口环境:", _env);
            // 环境入口说明条件
            return ["group_chat_tools", "group_chat_tools"].includes(_env);
        },
        async getChatIdFun() {
            this.chatId = await getChatId();
            this.loading = false
        },
        async init() {
            // this.chatId = "wrYs_gEAAAbz5Ipd3HumezpPr5qoHdCg";
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
        handleClick(tab, event) {
        },
        success() {
            console.log(this.$refs.log);
            this.$refs.log.initChatLogList()
        },
    },
    mounted() {
        if (this.$route.params.back) {
            this.init();
        } else {
            this.dispatch();
        }
    },
    components: {
        sendQuestionre,
        sendFile,
        log,
    },
};
</script>
<style scoped>
/deep/.el-tabs {
    height: calc(100% - 52px);
}
/deep/.el-tabs__nav {
    width: 100%;
    background-color: #fff;
}
/deep/.el-tabs__item {
    width: 50%;
    text-align: center;
    border: 0 none !important;
}
/deep/.el-tabs__content {
    overflow: auto;
    height: 100%;
}
.logbox {
    padding: 12px;
}
</style>