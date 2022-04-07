<template>
<div>
    <div class="icon-box">
        <span v-for="(link,index) in accountLink" :key="index"  class='item' @click="toDetails(link.event)">
            <img :src="link.imgsrc" alt="">
            <span class="name">{{link.name}}</span>
        </span>
    </div>
    <div class="rermCardContainer">
        <div
            class="card"
            v-for="(item,index) in studCardBagList"
            :key="index"
            :style="(item.statused == 16 || item.statused == 8 )? {backgroundImage: 'url(' + require('@/assets/images/cardBg/invalid.png') + ')'} : bgType(item.currency)"
        >
          <div class="cardStatus">{{ item.statused | cardStatus}}</div>
          <div class="top">
                <div class="cardNumberAndTime">
                    <div class="cardNumber">{{item.cardNo}}</div>
                    <div class="time">{{item.createAt}}</div>
                </div>
                <div class="currency">
                    <img :src="nationalFlag(item.currency)" alt />
                    <span>单价：{{item.unitWorth}} {{item.currency}}/课时</span>
                </div>
          </div>
          <div class="bottom">
            <div class="classHours">
                <div class="totalClassHours">
                    <div>{{item.allTime}}h({{item.buyTime}}+{{item.sendTime}})</div>
                    <div>总课时</div>
                </div>
                <div class="remainingClassHours">
                    <div>{{item.lastTime}}h</div>
                    <div>剩余课时</div>
                </div>
            </div>
            <div class="tool">
                <img src="@/assets/images/account/rechargeWhiteIcon.png" alt @click="recharg(item)" />
                <img src="@/assets/images/account/refundCard.png" alt @click="refundCard(item.id)" />
            </div>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import { queryStudCardBag } from "@/api/account"
import { mapState } from "vuex";
import { webUrl } from "config";
import { getToken } from '@/utils/Auth';
export default {
    data(){
        return {
            studCardBagList: [],
            accountLink:[
                {name:'添加学期卡',imgsrc:require("@/assets/images/account/creatCard.png"),event: 'showAddTermCard'},
                {name:'查看明细',imgsrc:require("@/assets/images/account/seeDetails.png"),event: null},
            ],
        }
    },
    computed: {
        ...mapState({
            form: (e) => e.customer_material.user,
        }),
    },
    filters: {
        cardStatus(code) {
            switch (code) {
                case 0: return "未知";
                case 1: return "未使用";
                case 2: return "使用中";
                case 4: return "代充值";
                case 8: return "退卡中";
                case 16: return "已注销";
                default: return "-";
            }
        },
    },
    created(){
        this.queryStudCardBag()
    },
    methods: {
        async queryStudCardBag(){
            let res = await queryStudCardBag({
                page: 1,
                limit: 100,
                studId: this.form.userId,
            });
            if (res.status == 200) {
                this.studCardBagList = res.body;
            }
        },

        bgType(currency) {
            switch (currency) {
                case "AUD":
                return {
                    backgroundImage:
                    "url(" + require("@/assets/images/cardBg/australia.png") + ")",
                };
                case "GBP":
                return {
                    backgroundImage:
                    "url(" + require("@/assets/images/cardBg/britain.png") + ")",
                };
                case "CAD":
                return {
                    backgroundImage:
                    "url(" + require("@/assets/images/cardBg/Canada.png") + ")",
                };
                case "NZD":
                return {
                    backgroundImage:
                    "url(" + require("@/assets/images/cardBg/newZealand.png") + ")",
                };
                case "USD":
                return {
                    backgroundImage: "url(" + require("@/assets/images/cardBg/USA.png") + ")",
                };
                case "CNY":
                return {
                    backgroundImage:
                    "url(" + require("@/assets/images/cardBg/chain.png") + ")",
                };
                default:
                return {
                    backgroundImage:
                    "url(" + require("@/assets/images/cardBg/invalid.png") + ")",
                };
            }
        },
        nationalFlag(currency) {
            switch (currency) {
                case "AUD": return require("@/assets/images/nationalFlag/australiaFlag.png");
                case "GBP": return require("@/assets/images/nationalFlag/britainFlag.png");
                case "CAD": return require("@/assets/images/nationalFlag/canadaFlag.png");
                case "NZD": return require("@/assets/images/nationalFlag/newZealandFlag.png");
                case "USD": return require("@/assets/images/nationalFlag/USAFlag.png");
                case "CNY": return require("@/assets/images/nationalFlag/chainFlag.png");
                default: return "";
            }
        },

        toDetails(event){
            window.open(`${webUrl}seller/#/system/customerDetails?studId=${this.form.userId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&type=accountCard&show=${event}`, '_blank')
        },

        // 充值学期卡
        recharg(info){
           window.open(`${webUrl}seller/#/system/customerDetails?show=recharg&studId=${this.form.userId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&cardInfo=${JSON.stringify(info)}&type=accountCard`, '_blank') 
        },

        // 退卡
        refundCard(cardId){
           window.open(`${webUrl}seller/#/system/customerDetails?show=refund&studId=${this.form.userId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&cardId=${cardId}&type=accountCard`, '_blank') 
        }
    }
}
</script>

<style lang="scss" scoped>
@import url("../../../../font/font.css");
.rermCardContainer {
    padding: 16px 10px;
    .card {
        width: 100%;
        height: 150px;
        overflow: hidden;
        border-radius: 8px;
        margin-bottom: 12px;
        padding: 16px;
        background: pink;
        flex-basis: 320px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        color: #fff;
        position: relative;
        background-size: 100% 100%;
        .cardStatus {
            width: 160px;
            height: 32px;
            position: absolute;
            top: -4px;
            left: -67px;
            background: #ffd13c;
            color: white;
            text-align: center;
            line-height: 32px;
            transform: rotate(-45deg) scale(0.5);
            -webkit-transform: rotate(-45deg) scale(0.5);
        }
        .top {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .cardNumberAndTime {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .cardNumber {
                    font-size: 14px;
                    font-family: "YouSheBiaoTiHei";
                }
                .time {
                    width: 130px;
                    font-size: 10px;
                    color: white;
                    margin: 0 !important;
                    text-align: right;
                }
            }
            .currency {
                margin-top: 9px;
                display: flex;
                align-items: center;
                img {
                    width: 16px;
                    height: 10px;
                }
                span {
                    margin-left: 10px;
                    font-size: 10px;
                }
            }
        }
        .bottom {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .classHours {
                display: flex;
                align-items: center;
                justify-content: space-between;
            .totalClassHours,
            .remainingClassHours {
                float: left;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-right: 25px;
                :first-child {
                    font-size: 14px;
                    font-family: "YouSheBiaoTiHei";
                }
                :last-child {
                    margin-top: 6px;
                    font-size: 10px;
                    }
                }
            }
            .tool {
                display: flex;
                align-items: center;
                :first-child {
                    margin-right: 14px;
                }
            }
        }
    }
}
.icon-box{
    padding: 0 10px;
    overflow: hidden;
    .item{
        display: flex;
        align-items: center;
        font-size: 12px;
        line-height: 14px;
        color: #4979ff;
        margin-right: 8px;
        margin-top: 10px;
        float: left;
        img{
            margin-right: 4px;
            display: block;
            float: left;
            width: 16px;
            height: 16px;
        }
        .name{
            color: #4979FF;
            font-size: 14px; 
            margin: 0 12px 0 8px;
        }
    }
}
</style>