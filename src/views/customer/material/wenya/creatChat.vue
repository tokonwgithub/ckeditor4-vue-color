<template>
    <div>
        <el-tooltip effect="dark" content="创建企业微信群聊" placement="bottom">
            <img
                src="@/assets/images/order/chat.png"
                class="icon-img"
                v-if="!orderInfo.wxChatStatus"
                @click="showDialog"
            />
            <img
                v-if="orderInfo.wxChatStatus"
                src="@/assets/images/order/chat-gray.png"
                class="icon-img"
                @click="showDialog"
            />
        </el-tooltip>
        <el-dialog
            :visible.sync="dialogVisible"
            width="400px"
            :before-close="closeDialog"
            append-to-body
            center
            :close-on-click-modal="false"
            title="创建企业微信群聊"
        >
            <div>
                <div>该订单匹配到的售后专员：{{ salename }}</div>
                <div class="mt10">点击 确定 创建企业微信群聊</div>
            </div>
            <div
                class="flex flex-justify-center flex-align-center group-btn mt10"
                v-loading="loading"
            >
                <el-button
                    type="primary"
                    plain
                    @click="closeDialog"
                    :loading="loading"
                    >取消</el-button
                >
                <el-button type="primary" @click="submit" :loading="loading"
                    >确定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getQueryString } from "@/utils/index";
import {
    getAfterSales,
    getAfterSalesList,
    afterSalesGroup,
    createChat,
} from "@/api/order";
export default {
    data() {
        return {
            loading: false,
            dialogVisible: false,
            userId: "",
            arrlist: [],
            afterSalesGroupobj: {},
            salename: "",
            orderNum: "",
        };
    },
    props: ["orderInfo"],
    methods: {
        async showDialog() {
            await this.getAfterSales();
            await this.getAfterSalesList();
            await this.getafterSalesGroup();
            this.orderNum = this.orderInfo.wyOrderId;
            if (this.orderInfo.wxChatStatus) {
                this.$notify({
                    message: "该订单已存在企业微信群聊",
                    type: "error",
                });
            } else {
                this.dialogVisible = true;
            }
        },
        async submit() {
            this.loading = true;
            let {
                    studWxId,
                    sellerWxId,
                    afterSalesWxId,
                    robotWxId,
                    afterSalesName,
                    studName,
                } = this.afterSalesGroupobj,
                { orderNo } = this.orderInfo;
            let datas = {
                orderNum: this.orderInfo.wyOrderId,
                orderName: orderNo,
                afterSalesName,
                sellerWxId,
                studWxId,
                afterSalesWxId,
                afterSalesUserId: this.userId,
                robotWxId,
                studName,
            };
            const {status,body} = await createChat(datas)
            if(status==200){
                this.$notify.success(body.msg)
                this.$emit('success')
                this.closeDialog()
                this.loading = false
            }else{
                this.$notify.warning(body.msg)
                this.loading = false
            }
        },
        getafterSalesGroup() {
            let datas = {
                studUserId: this.orderInfo.wyUcId,
                afterSalesUserId: this.userId,
            };
            afterSalesGroup(datas).then((res) => {
                const { status, body } = res;
                if (status == 200) {
                    this.afterSalesGroupobj = body;
                }
            });
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        async getAfterSales() {
            const { status, body } = await getAfterSales({
                orderNum: this.orderInfo.wyOrderId
            });
            if (status == 200) {
                this.userId = body.ucId;
            }
        },
        getAfterSalesList() {
            getAfterSalesList().then((res) => {
                const { status, body } = res;
                if (status == 200) {
                    this.arrlist = body;
                    this.arrlist.forEach((e) => {
                        if (this.userId == e.ucId) {
                            this.salename = e.username;
                        }
                    });
                }
            });
        },
    },
};
</script>
