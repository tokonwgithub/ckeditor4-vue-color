<template>
    <div>
     
    </div>
</template>

<script>
import { Storage } from "@/utils/Enum/index";
import { autoAuth,getWeChatEnv,openChatGroup } from "@/utils/Wechat/WxUtils";
import { WeChatEnv } from "@/utils/Enum/WeChat";
import { getQueryString } from "@/utils/index";
export default {
    data(){
        return{
            loading:false,
        }
    },
    methods: {
        dispatch() {
            this.intervalId = setInterval(() => {
               const config = localStorage.getItem(Storage.AGENT_CONFIG);
               console.log(config);
               if (!config) clearInterval(this.intervalId);
               else if (+config === 1) {
                  clearInterval(this.intervalId);
                  this.handleClick()
               }
            }, 500);
         },
        async handleClick(){
            if (await this.validateEnv()) {
                const url = window.location.href + "";
                const chatId = getQueryString("groupChatId", url);
                // await autoAuth(window.location.href.split("#")[0])
                await openChatGroup(chatId)
                window.closed()
            }else{
                this.$message({
                    duration: 0,
                    message: "请在企业微信内部打开",
                    type: "warning",
                });
            }

         },
        
        /**校验当前入口环境 */
        async validateEnv() {
            const _env = await getWeChatEnv();
            console.log("当前入口环境:", _env);
            return _env ;
        },
    },
    async mounted() {
        if (this.$route.params.back) {
            this.handleClick()
        } else {
            this.dispatch();
        }
    },
}
</script>
