<template>
    <div class="log pb10">
        <div
            class="mt5 mb5 pl10 pr10"
            v-for="(item, index) in logs"
            :key="index"
        >
            <div>
                <div class="time f12 filetime pt10" v-if="item.createdAt">{{formatTime(Number(item.createdAt)*1000,'Y-M-D h:m:s') | createTime}}</div>
                <div class="mt5 f12 break-all">{{item.info}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import {formatTime} from "@/utils/util"
import {
	getChatLogList
} from "@/api/order";
import { downloadFile } from "@/utils/download";
export default {
    data() {
        return {
            logs: []
        };
    },
    mounted() {
        this.chatId = this.groupChatId
        this.initChatLogList()
    },
    methods: {
        downloadFile,
        formatTime,
		async initChatLogList() {
			this.loading = true;
            const { status, body } = await getChatLogList({
                groupChatId: this.chatId,
            });
            if (status == 200) {
                this.logs = body;
            }
            this.loading = false;
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
.log {
    background-color: rgba(242, 237, 209, 0.498);
    height: calc(100% - 21px);
    border-radius: 5px;
    overflow: auto;
}
</style>