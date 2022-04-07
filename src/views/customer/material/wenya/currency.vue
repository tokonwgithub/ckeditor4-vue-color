<template>
<div>
    <div class="account-wrap">
        <div class="icon-box">
            <span v-for="(link,index) in accountLink.filter(i => i.isShow.includes(accountType))" :key="index" @click="clickFun(link.value)" class='item' :class="{'gray': !user.isMy && link.name != '发送支付链接', 'float': link.name != '发送支付链接'} ">
                <img :src="link.imgsrc" alt="">
                <span class="name">{{link.name}}</span>
                <span class="tip" v-if="link.name == '发送支付链接'">{{accountType == 'db' ? '*用于充值辅导账户' : '*用于充值文案账户'}}</span>
            </span>
        </div>
    </div>
    <ul>
        <li v-for="(item, j) in accountInfo.accounts" :key="j">
            <div class="left">
                <span></span>
                <div class="currency-info">
                    <div>{{ item.current ? item.current : item.currencyName }}</div>
                    <div>{{ item.money }}</div>
                </div>
            </div>
            <div class='right' @click="withdrawal(item.current || item.currencyName )" v-if="accountType != 'db' ? (item.availableAmount > 0 ? true : false) : (Number(item.money) - Number(item.lockMoney) > 0 ? true : false)">
                <img src="@/assets/images/account/tixian.png" alt="">
                <span>提现</span>
            </div>
        </li>
    </ul>


    <!-- 充值dialog -->
    <chongzhi-temp ref="chongzhi" />
    <!-- 换汇dialog -->
    <huanhui-temp ref="huanhui" />
    <!-- 账户转换 -->
    <accountConversion ref="accountConversion" :accountType="accountType" :studId="user.userId"/>
    <!-- 生成支付链接 -->
    <paychoose :showtype="true" ref="paychoose" :studUserId="user.userId" @sendmsg="payLinksSend"/>
</div>
</template>

<script>
import paychoose from "./paychoose";
import chongzhiTemp from "../components/account/transfer/chongzhi";
import huanhuiTemp from "../components/account/transfer/huanhui";
import accountConversion from "./accountConversion"
import { mapState } from "vuex";
import { sendPayLinks,generatePayLinkWy } from "@/api/account";
import { sendNewsMsg } from "@/utils/Wechat/WxUtils";
import { webUrl } from "config";
import { getToken } from '@/utils/Auth';
import {autoRechargeCheck} from "@/api/order.js"
export default {
    data() {
        return {
            accountLink:[
                // {name:'发送支付链接',value: 'payLinksSend', imgsrc:require("@/assets/images/account/sendlink.png"),isShow: ['wy']},
                {name:'充值',value: 'chongzhi',imgsrc:require("@/assets/images/wenya/chonzhi.png"),isShow: ['db','wy','sx']},
                {name:'换汇',value: 'huanhui',imgsrc:require("@/assets/images/wenya/huanhui.png"),isShow: ['db','wy','sx']},
                {name:'查看明细',value: 'seeDetails',imgsrc:require("@/assets/images/account/seeDetails.png"),isShow: ['db','wy','sx']},
                {name:'账户转换',value: 'accountConversion',imgsrc:require("@/assets/images/wenya/accountConversion.png"),isShow: ['db','wy']},
            ],
        };
    },
    computed: {
        ...mapState({
            user: e => e.customer_material.user,
            form: (e) => e.customer_material.user,
        }),
    },
    props: {
        accountInfo: {
            type: Object,
            default: () => {
                accounts: []
            }
        },
        accountType: {
            type: String,
            default: 'db'
        }
    },
    components: {
        chongzhiTemp,
        huanhuiTemp,
        accountConversion,
        paychoose
    },
    created(){
    },
    methods:{
        clickFun(index){
            switch(index){
                case 'payLinksSend': 
                this.showLinkFun();
                // this.payLinksSend();
                break;
                case 'chongzhi': 
                console.log(this.accountInfo)
                    if(this.accountType == 'sx'){
                        this.accountInfo.accountType = 3;
                    }
                this.chongzhi(this.accountInfo);
                break;
                case 'huanhui': 
                if(this.accountType == 'sx'){
                    this.accountInfo.accountType = 3;
                }
                this.huanhui(this.accountInfo);
                break;
                case 'seeDetails': this.seeDetails()
                break;
                case 'accountConversion': this.accountConversion()
                break
            }
        },
        showLinkFun(){
            this.$refs.paychoose.shows()
        },
        async payLinksSend(url){
            // const res = await sendPayLinks({userId:this.user.userId});
            // const res = await generatePayLinkWy({userId:this.user.userId});
            // if(res.status==200){
                // const url = res.body.link;
                await sendNewsMsg({
                    title: "付款链接",
                    url: url,
                    desc: "请点击查看并确认付款",
                    imgUrl: "https://wchk-oss.oss-cn-hongkong.aliyuncs.com/statics/images/paylinkimg.png"
                });
            // }else{
            //     this.$notify.warning(res.body.msg);
            // }
        },
        async chongzhi(content) {
            console.log("充值",content);
            if (!this.user.isMy) return
            const {status,body} = await autoRechargeCheck({studentId:this.user.userId})
            if(status==200){
                console.log(body);
                if(!!body.contents){
                    this.$confirm(body.contents,'',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass:'changewidth',
                    type: 'warning'})
                    .then((_) => {
                        this.$refs.chongzhi.open(content);
                        done();
                    })
                    .catch((_) => {});
                }else{
                    this.$refs.chongzhi.open(content);
                }
            }
        },
        huanhui(content) {
            console.log("换汇", content);
            if (!this.user.isMy) return
            this.$refs.huanhui.open(content);
        },
        seeDetails(){
            if(this.accountType == 'db'){
                window.open(`${webUrl}seller/#/system/customerDetails?studId=${this.form.userId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&type=accountPay&sys=${this.accountType}`, '_blank')
            }else{
                window.open(`${webUrl}seller/#/system/customerDetails?studId=${this.form.userId}&wyId=${this.form.wyId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&type=accountPay&sys=${this.accountType}`, '_blank')
            }
        },

        withdrawal(currency){
            if(this.accountType == 'db'){
                window.open(`${webUrl}seller/#/system/customerDetails?studId=${this.form.userId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&type=accountPay&sys=${this.accountType}&showWithdrawal=true&currency=${currency}`, '_blank')
            }else{
                window.open(`${webUrl}seller/#/system/customerDetails??studId=${this.form.userId}&wyId=${this.form.wyId}&token=${getToken('TOKEN')}&orderNo=${this.form.username}&type=accountPay&sys=${this.accountType}&showwyWithdrawal=true&currency=${currency}`, '_blank')
            }
        },

        accountConversion(){
            this.$refs.accountConversion.showDialog();
        }
    }
};
</script>
<style>
    .changewidth{
        width: 90%!important;
    }
</style>
<style lang="scss" scoped>
@import url("../../../../font/font.css");

ul {
    padding: 10px 10px 10px 10px;
    overflow: auto;
}
li {
    display: flex;
    margin-top: 10px;
    background: #F9FAFD;
    border-radius: 4px;
    padding: 10px;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Regular, PingFang SC;
    .left{
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        span{
            width: 6px;
            height: 6px;
            border-radius: 3px; 
            background: #FFA044;
            margin: 4px 5px 0 0;
        }
        .currency-info{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            :first-child{
                color: #2C2D2F;
                font-size: 14px;
            }
            :last-child{
                color: #2C2D2F;
                font-size: 20px;
                margin-top: 10px;
                font-family: "YouSheBiaoTiHei";
            }
        }
    }
    .right {
        display: flex;
        align-items: center;
        img{
            width: 16px;
            height: 16px;
            margin-right: 8px;
        }
        span{
            color: #4979FF;
            font-size: 14px;
        }
    }
}

.account-wrap{
    background: #fff;
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
            .tip{
                color: #E45434;
                font-size: 12px;
            }
        }
        .float{
            float: left;
        }
    }
}
.changewidth{
  width: 90%!important;
}
</style>
