<template>
    <div class="user-tip">
        <div class="tip-text">该客户已与销售{{form.sellerUserName}}绑定，如需换绑请联系上级！</div>
        <div class="username">{{form.wxName || form.nickName}}</div>
        <div class="wxid-number">
            <span>wxid：</span>
            <span>{{form.wxUserId}}</span>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    props: ['form']
}
</script>

<style lang="scss" scoped>

.user-tip{
    min-height: calc(100vh - 20px);
    background: #fff;
    padding: 10px;
    font-family: PingFangSC-Medium, PingFang SC;
    .tip-text{
        width: 100%;
        padding: 10px 0;
        border-radius: 4px;
        background: #FFEEEF;
        color: #D33443;
        font-size: 12px;
        text-align: center;
        line-height: 33px;
    }
    .username{
        margin: 16px 0;
        color: #2C2D2F;
        font-size: 16px;
        font-weight: 500;
    }
    .wxid-number{
        font-size: 12px;
        :first-child{
            color: #8C8C8C
        }
        :last-child{
            color: #48494C;
        }
    }
}
</style>