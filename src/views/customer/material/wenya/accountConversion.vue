<template>
    <el-dialog
        width="375px"
        :append-to-body="true"
        :visible.sync="show"
        title="账户转换"
        @close="closeDialog"
        :close-on-click-modal="false"
    >
        <el-form ref="form" :model="form" label-position="top">
            <div class="select-container">
                <div class="account-select">
                    <span>从</span>
                    <el-form-item>
                        <el-select v-model="form.out" @change="changeAccountType('out')">
                            <el-option v-for="(item,index) in accountTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="account-select">
                    <span>到</span>
                    <el-form-item>
                        <el-select v-model="form.enter" @change="changeAccountType">
                            <el-option v-for="(item,index) in accountTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <img src="@/assets/images/wenya/exchange.png" alt="" class="exchange">
            </div>
            <p class="tip" v-if="form.out == form.enter">转出和转入的账户不可相同</p>
            <el-form-item label="转换货币" prop="currency" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
                <el-select v-model="form.currency" @change="changeCurrency">
                    <el-option 
                        v-for="(item,index) in currencyList" 
                        :key="index" 
                        :label="item.current" 
                        :value="item.current">
                    </el-option>
                </el-select>
                
            </el-form-item>
            <el-form-item label="可转换货币" v-if="form.currency">
                <div class="accountBar">
                    <div class="currencyBar">
                        <div class="cricel"></div>
                        <div class="currency">{{accountInfo && accountInfo.current}}</div>
                        
                    </div>
                    <div class="price">{{accountInfo && accountInfo.canChangeMoneyTotal}}</div>
                    <div class="lockMoney" v-if="accountInfo && accountInfo.accountLockMoney && Number(accountInfo.accountLockMoney) > 0">
                        含{{accountInfo && accountInfo.accountLockMoney}}不可提现金额
                    </div>
                </div>
            </el-form-item>
            
            <el-form-item label="转换金额（可提现）" prop="money" :rules="money" v-if="accountInfo && accountInfo.availableAmount && Number(accountInfo.availableAmount) > 0">
                <el-input v-model="form.money" type="number" @input="forceUpdate"></el-input>
            </el-form-item>
            <el-form-item label="转换金额（不可提现）" prop="lockMoney" :rules="lockMoney" v-if="accountInfo && accountInfo.accountLockMoney && Number(accountInfo.accountLockMoney) > 0">
                <el-input v-model="form.lockMoney" type="number" @input="forceUpdate"></el-input>
            </el-form-item>
        </el-form>  
        <div class="btn-group">
            <el-button type="primary" plain size="small" @click="closeDialog" :disabled="loading" :loading="loading">取消</el-button>
            <el-button type="primary" size="small" @click="submit" :disabled="loading" :loading="loading">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { changeStudAccount, getChangeStudAccount } from '@/api/account'
import { Customer } from "@/store/dispatch/index";
export default {
    data(){
        let moneyVlidator = (rule, value, callback) => {
            if(parseFloat(value) > Number(this.accountInfo.availableAmount)){
                return callback(new Error('账户余额不足'))
            }else {
                return callback()
            }
        }
        let lockMoneyVlidator = (rule, value, callback) => {
            if(parseFloat(value) > Number(this.accountInfo.accountLockMoney)){
                return callback(new Error('账户余额不足'))
            }else {
                return callback()
            }
        }
        return {
            loading: false,
            show: false,
            accountTypeList: [
                {label: '辅导账户',value: 1},
                {label: '文案账户',value: 2},
            ],
            form: {},
            money: [
                { required: true, message: '请输入金额', trigger: 'blur' },
                { validator: moneyVlidator, trigger: 'change' },
                { validator: moneyVlidator, trigger: 'blur' }
            ],
            lockMoney: [
                { required: true, message: '请输入金额', trigger: 'blur' },
                { validator: lockMoneyVlidator, trigger: 'change' },
                { validator: lockMoneyVlidator, trigger: 'blur' }
            ],
            currencyList: [],
            accountInfo: {}
        }
    },
    props: {
        accountType: {
            type: String,
            default: ''
        },
        studId: {
            type: [String, Number],
            default: ''
        }
    },
    methods: {
        showDialog(){
            this.form = {}
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            }) 
            this.show = true
            if(this.accountType == 'db'){
                this.form.out = 1
                this.form.enter = 2
            }else if(this.accountType == 'wy'){
                this.form.out = 2
                this.form.enter = 1
            }
            this.getChangeStudAccount()
            
        },
        closeDialog(){
            this.loading = false
            this.show = false
        },

        changeCurrency(){
            this.$forceUpdate()
            this.form.money = null
            this.form.lockMoney = null
            this.changeAccount()
        },

        changeAccountType(type){
            this.$forceUpdate()
            if(type == 'out'){
                this.$refs.form.clearValidate()
                this.accountInfo = {}
                // this.form.currency = ''
                this.form.money = null
                this.form.lockMoney = null
                this.getChangeStudAccount()
            } 
        },

        forceUpdate(){
           this.$forceUpdate() 
        },

        changeAccount(){
            this.accountInfo = this.form.currency && JSON.parse(JSON.stringify(this.currencyList.filter(i => i.current == this.form.currency)[0])) 
        },

        getChangeStudAccount(){
            this.currencyList = []
            getChangeStudAccount({id: this.studId,type: this.form.out}).then(res => {
                if(res.status == 200){
                    this.currencyList = this.form.out == 1 ? res.body.dbAccounts || [] :  res.body.wyAccounts || []
                    this.form.currency = this.currencyList.filter(i => i.current == res.body.currency).length > 0 ? 
                        res.body.currency : this.currencyList.length > 0 ? this.currencyList[0].current : null
                    this.changeAccount()
                }
            })
        },
        submit(){
            if(this.form.out == this.form.enter) return false
            this.$refs.form.validate(async valid => {
                if (valid){
                    this.loading = true
                    let { out, money, currency, lockMoney } = this.form
                    let data = {
                        changeFlag: out == 1 ? 1 : 2,
                        money, lockMoney, currency, ucId: this.studId
                    }
                    changeStudAccount(data).then(res => {
                        if(res.status == 200){
                            this.$emit('success')
                            this.$message.success('转换成功')
                            Customer.Account.getAccounts();
                            this.closeDialog()
                        }else{
                            this.$message.error(res.msg)
                            this.loading = false
                        }
                    }).catch(err => {
                        this.$message.error(err.msg)
                        this.loading = false
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
/deep/.el-form-item__label{
    margin-top: 18px;
    padding: 0;
    color: #8C8C8C;
    font-size: 12px;
    line-height: 18px;
}
/deep/.el-form-item{
    margin: 0 !important;
}
/deep/.select-container input{
    border: none !important;
    background: none !important;
}
</style>
<style lang="scss" scoped>
.select-container{
    position: relative;
    background: #EEF1F9;
    width: 100%;
    height: 92px;
    .account-select{
        width: 100%;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        span{
            margin: 0 24px 0 10px;
        }
        .el-select{
            width: 120px;
            border: none !important;
            background: none !important;
            input{
                border: none !important;
                background: none !important;
            }
        }
        
    }
    .exchange{
        width: 24px;
        height: 24px;
        position: absolute;
        top: 34px;
        right: -12px;
    }
}
.tip{
    color: #E45434;
    font-size: 12px;
}

.accountBar{
    width: 100%;
    padding: 16px;
    border-radius: 4px;
    background: #F9FAFD;
    margin-right: 16px;
    float: left;
    display: flex;
    flex-basis: 234px;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    .currencyBar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cricel{
            width: 6px;
            height: 6px;
            border-radius: 3px;
            background: #FFA044;
            margin-right: 10px;
        }
        .currency{
            color: #2C2D2F;
            font-size: 14px;
        }
    }
    .lockMoney{
        font-size: 12px;
        color: #E45434; 
    }
    .price{
        color: #2C2D2F;
        font-size: 20px;
        font-family: "YouSheBiaoTiHei";
    }
    
}
.icon-container{
    display: flex;
    span{
        margin-left: 10px;
    }
}

.btn-group{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    .el-button{
        width: 112px;
    }
}
.el-select{
    width: 100%;
}

</style>