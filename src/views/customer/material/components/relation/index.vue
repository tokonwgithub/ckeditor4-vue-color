<template>
    <div>
        <div class="relation-container" v-if="accountTypeInfo.flag != shixiNumber" @click="!accountTypeInfo.dbId && toBind('db')">
            <div class="left">
                <div>辅导系统客户账户</div>
                <div>
                    <span :class="accountTypeInfo.dbId ? 'blue' : 'red'"></span>
                    <span>{{accountTypeInfo.dbId? '已关联' : '未关联'}}</span>
                </div>
            </div>
            <div class="right" v-if="!accountTypeInfo.dbId">
                <img src="@/assets/images/connection.png" alt="">
                <span>关联/创建</span>
            </div>
        </div>
        <div class="relation-container margin0" v-if="accountTypeInfo.flag != shixiNumber" @click="!accountTypeInfo.wyId && toBind('wy')">
            <div class="left">
                <div>文案系统客户账户</div>
                <div>
                    <span :class="accountTypeInfo.wyId ? 'blue' : 'red'"></span>
                    <span>{{accountTypeInfo.wyId? '已关联' : '未关联'}}</span>
                </div>
            </div>
            <div class="right" v-if="!accountTypeInfo.wyId">
                <img src="@/assets/images/connection.png" alt="">
                <span>关联/创建</span>
            </div>
        </div>
        <div class="relation-container" v-if="accountTypeInfo.flag == shixiNumber" @click="!accountTypeInfo.sxId && toBind('sx')">
            <div class="left">
                <div>实习系统客户账户</div>
                <div>
                    <span :class="accountTypeInfo.sxId ? 'blue' : 'red'"></span>
                    <span>{{accountTypeInfo.sxId? '已关联' : '未关联'}}</span>
                </div>
            </div>
            <div class="right" v-if="!accountTypeInfo.sxId">
                <img src="@/assets/images/connection.png" alt="">
                <span>关联/创建</span>
            </div>
        </div>
    </div>
</template>

<script>
import { shixiNumber} from "@/utils/Enum/User";
import { Customer } from "@/store/dispatch/index";
import { mapState } from "vuex";
export default {
    data(){
        return{
            shixiNumber
        }
    },
    props: ['studUserId','username'],
    computed: {
        ...mapState({
            accountTypeInfo: e => e.customer_material_account.accountTypeInfo,
        })
    },
    async created(){
        await Customer.Account.getAccountType({studUserId: this.studUserId});
    },
    methods: {
        toBind(type){
            if(!this.username || (this.username && !this.username.trim())){
                this.$toast('请先填充客户姓名')
                return
            }
            this.$router.push({path: "/customer/material/bind",query: {type}});
        }
    },
}
</script>

<style lang="scss" scoped>
.relation-container{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background: #EEF1F9;
    border-radius: 2px;
    margin-bottom: 10px;
    font-family: PingFangSC-Medium, PingFang SC;
    .left,.right{
        display: flex;
        align-items: center;
    }
    .left{
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        :first-child{
            color: #2C2D2F;
            font-size: 14px;
            font-weight: 500;
        }
        :last-child{
            display: flex;
            align-items: center;
            margin-top: 13px;
            :first-child{
                width: 8px;
                height: 8px;
                border-radius: 4px;
            }
            :last-child{
                color: #48494C;
                font-size: 12px;
                margin: 0 0 0 8px;
            }
        }
        .red{
            background: #E45434;
        }
        .blue{
            background: #4979FF;
        }
    }
    .right{
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4979FF;
        font-size: 14px;
        font-weight: 500;
        img{
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }
    }
}
.margin0{
    margin: 0;
}
</style>