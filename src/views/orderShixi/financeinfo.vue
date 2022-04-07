<template>
   <div class="order-content">
      <el-form ref="financeform" :model="orderForm" :rules="rules" label-width="80px" label-position="top">
          <el-form-item label="订单总金额" prop="decimalTotalPrice" class="other-style" >
            <el-input placeholder="请输入金额"  type="number" v-model="orderForm.decimalTotalPrice" class="input-with-select" ref="moneyinputs">
               <!--来源导毕  -->
               <el-select v-model="orderForm.currency"  @change="queryByCurrency" style="width:80px" slot="prepend" placeholder="请选择" >
                  <el-option :label="currency" :value="currency" v-for="(currency,indexcs) in currencyList" :key="indexcs"></el-option>
               </el-select>
            </el-input>
            <div class="cards-currency">
               <p ><i></i>{{orderForm.currency}} <span>{{accountMoney.money}}</span></p>
               <p>
                  <b  @click="showAccounts('huanhuis')"><img src="@/assets/images/order/huanhui.png" />换汇</b>
                  <b @click="showAccounts('chongzhis')"><img src="@/assets/images/order/chonzhi.png" />充值</b>
               </p>
            </div>
         </el-form-item>
         <el-form-item label="定金" prop="minMoney"  class="other-style"  >
            <el-input style="width:100%"  placeholder="请输入定金"  type="number"  v-model="orderForm.minMoney" size="small" @blur="calculateBalance"/>
            <!-- <p class="error-tips" >
               当前余额{{accountMoney}}
               <span v-if="accountMoneyShow" >当前余额不足，请先<b @click="showAccounts('chongzhis')">充值</b>或<b  @click="showAccounts('huanhuis')">换汇</b></span></p> -->
         </el-form-item>
         <!-- <el-form-item label="Balance" prop="Balance" class="other-style"  >
            <el-input style="width:100%" type="number" :value="Number(orderForm.decimalTotalPrice) - Number(orderForm.minMoney) " disabled size="small"/>
         </el-form-item> -->
         <el-form-item label="订单默认锁定，是否需要解锁？" class="other-style" prop="accountRemark">
           <el-switch v-model="lockFlag " @change="changeLock" >
            </el-switch>
         </el-form-item>
          <!-- <el-form-item label="Note" class="other-style" prop="accountRemark">
            <el-input type="textarea"
            :rows="3" v-model="orderForm.accountRemark"/>
         </el-form-item> -->
      </el-form>
      <chongzhi ref="chongzhis" @successfun="queryAccountcurreny"/>
      <huanhui ref="huanhuis" @successfun="queryAccountcurreny"/>
      <el-dialog :visible.sync="showMoneyStatus" :append-to-body="true" width="300px" :show-close="false" class="showMoneyStatus-dialog" title="提示">
         <div class="showMoneyStatus-box">
            <p >当前解锁订单定金为 <b class="bule">{{orderForm.minMoney}}{{orderForm.currencyWy}}</b>，订单总价<b class="bule">{{orderForm.decimalTotalPrice}}{{orderForm.currencyWy}}</b>定金小于订单总价<b class="red">30%</b> ，请确定定金金额填写正确！</p>
            <div class="button-box">
               <div  class="upload-btn" @click="showMoneyStatus=false" >确定</div>
            </div>
            
         </div>
      </el-dialog>
   </div>
</template>
<script>
import chongzhi from '@/views/customer/material/components/account/transfer/chongzhi'
import huanhui from '@/views/customer/material/components/account/transfer/huanhui'
import {queryByCurrency } from "@/api/order";
import { userAccountGetById } from "@/api/account";
import { SysCode } from "@/utils/Enum/Customer/Account";
import {exchangeListwy} from '@/api/basic'
import {autoRechargeCheck} from "@/api/order.js"
export default {
   props:['userid','ordertype','indexs','orderForm'],
   data() {
      let that = this;
      return {
         showMoneyStatus:false,
         chooseCurrency:{},
         currencyList:[
            'AUD',
            'GBP',
            'NZD',
            'CAD',
            'CNY',
            'USD',
            'EUR'
         ], 
         checked:true,
         type:'',
         select:'1',
         aplayList:[{
            name:'学期卡支付',
            value:true
         },{
            name:'余额支付',
            value:false
         }],
         lockFlag:false,
         userloading:false,
         userList:[],
         accountMoneyShow:false,
         accountMoney:0,
         content:null,
         rules:{
            minMoney: [
               { required: true, message: '请输入定金', trigger: 'blur' },
            ],
            decimalMaterialCost: [
               { required: true, message: '请填写材料费', trigger: 'blur' },
            ],
            wordsNum: [
               { required: true, message: '请填写字数/工作量', trigger: 'blur' },
            ],
            decimalTotalPrice: [
               { required: true, message: '请输入总价', trigger: 'blur' },
            ],
            guaranteeScoreFee: [
               { required: true, message: '请输入High Score Guarantee Fee', trigger: 'blur' },
            ],
         },
      }
   },
   components:{
     chongzhi,
     huanhui
   },
   watch:{
      indexs:function(val){
         if(val == 2 && [1,11].includes(Number(this.ordertype))){
            this.exchangeListwy()
         }
      }
   },
   async created(){
      this.type = this.ordertype;
      this.orderForm.currency = "AUD";
      await this.queryByCurrency();
      await this.getAccountsByData();
   },
   methods:{
      async exchangeListwy(){
         const {status,body} = await exchangeListwy({page:1,limit:100});
         if(status == 200){
            this.currencyList = body;
            console.log(body);
            this.orderForm.currencyWy = 0;
            this.orderForm.currency =  body[0].currency;
         }
         console.log(body,'leixing')
      },
      changfouce(){
         this.$nextTick(()=>{   //焦点获取
            this.$refs.moneyinputs.focus();
         })
      
      },
      formjudge(){
         let status = false;
         this.$refs.financeform.validate((valid) => {
          if (valid) {
            status = true;
          }
        });
        if(!this.calculateBalance()){
           status = false;
        }
        
        return status;
      },
      
      async queryAccountcurreny(){
         await this.queryByCurrency();
         await this.getAccountsByData();
      },
      async getAccountsByData(){
         const sysCode = SysCode.DAOBI,
         id = this.orderForm.ucId,
         accountType = 3;
         const res = await userAccountGetById({sysCode,id,accountType});
         const _data = res.body;
         const data = {
          ..._data,
          accountType:3,
          sysCode,
        }
         this.content = data;
         console.log('获取账号信息',res)
      },
      async showAccounts(name){
         localStorage.setItem('orderUserId',this.userid);
         console.log(this.content)
         if(name == 'huanhuis'){
            this.$refs[name].open(this.content);
         }else{
            const {status,body} = await autoRechargeCheck({studentId:this.userid})
            if(status==200){
               console.log(body);
               if(!!body.contents){
                  this.$confirm(body.contents,'',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass:'changewidth',
                    type: 'warning'})
                  .then((_) => {
                        this.$refs[name].open(this.content);
                        done();
                  })
                  .catch((_) => {});
               }else{
                  this.$refs[name].open(this.content);
               }
            }
         }
      },
      async queryByCurrency(){
         this.accountMoneyShow = false;
         let data = {
            userId:this.userid,
            current:this.orderForm.currency,
            accountType:3
         };
         const {status,body} = await queryByCurrency({sysCode:'db',data});
         if(status == 200){
            if(body){
               this.accountMoney = body; 
               if(this.orderForm.minMoney*1 > this.accountMoney*1){
                  this.accountMoneyShow = true;
               }
            }else{
               this.accountMoney = 0;
               if(this.orderForm.minMoney*1 > this.accountMoney*1){
                  this.accountMoneyShow = true;
               }
            }
         }
      },
      calculateBalance(){
         let status = true;
         this.accountMoneyShow = false;
          if(this.orderForm.minMoney*1 > this.accountMoney*1){
            this.accountMoneyShow = true;
            status = false;
         }
         if(this.orderForm.minMoney*1>this.orderForm.decimalTotalPrice*1){
            this.$message({
               message: "定金不能大于总金额",
               type: "warning",
            });
            status = false;
            
         }
         this.showMoneyTip();
         return status;
      },
      showMoneyTip(){
         if(localStorage.getItem('showMoneyTip')) return;
         if(this.orderForm.minMoney*1 <= (this.orderForm.decimalTotalPrice*1)*0.3){
            localStorage.setItem('showMoneyTip',true);
            this.showMoneyStatus =  true;
         }
      },
      timehandle(str){
         if(!str) return;
         return str.split('/').join('-');
      },
      changeLock(){
         this.$set(this.orderForm,'lockFlag',this.lockFlag?2:1)
      },
      
   }
}
</script>
<style scoped>
.showMoneyStatus-dialog .el-dialog__header{
   padding: 0px 20px;
   line-height: 36px;
   
}
.showMoneyStatus-dialog p{
   margin: 0;
   font-size: 12px;
}
.showMoneyStatus-dialog b{
   font-weight: normal;
   font-size: 14px;
}
.showMoneyStatus-dialog .red{
   color: #E45434;
}
.showMoneyStatus-dialog .bule{
   color: #4979FF;
}
.showMoneyStatus-dialog .el-dialog__title{
   font-size: 14px;
}
.showMoneyStatus-dialog .el-dialog__body{
   padding: 10px;
}
.other-style .el-form-item__label{
   padding: 0;
   color: #8C8C8C;
}
.other-style .el-input-group__append{
   background: none;
   border-left: none;
   padding: 0 10px;
}
.other-style-special .el-input__inner{
   border-right:none
}
</style>
<style lang="scss" scoped>
.cards-currency{
   display: flex;
   align-items: center;
   margin-top: 10px;
   padding: 10px;
   height: 64px;
   background: #F9FAFD;
   border-radius: 4px;
   p{
      margin: 0;
      flex: 1;
      overflow: hidden;
      &:nth-of-type(1){
         margin-top: 10px;
         line-height: 20px;
         margin-bottom: 10px;
         font-size: 14px;
         font-weight: 400;
         color: #2C2D2F;
         i{
            display: block;
            margin: 6px 8px 0 0;
            float: left;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #FFA044;
         }
         span{
            display: block;
            margin-top: 10px;
            font-size: 20px;
            font-family: YouSheBiaoTiHei;
            color: #2C2D2F;
            line-height: 20px;
         }
      }
      &:nth-of-type(2){
         b{
            float: right;
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #4979FF;
            line-height: 14px;
            &:nth-of-type(2){
               margin-right: 20px;
            }
            img{
               display: block;
               float: left;
               margin-right: 10px;
               width: 14px;
               height: 14px;
            }
         }
      }
   }
}
.button-box{
   margin: 10px auto;
   text-align: center;
   .upload-btn{
      margin: 0 auto;
   }
}
.order-content{
   background: #fff;
   border-radius:2px;
   overflow: hidden auto;
   .el-radio{
      display: flex;
      align-items: center;
      margin-top: 15px;
   }
   h3{
      padding: 16px 0;
      margin: 0;
      font-size:16px;
      font-weight:500;
      color:rgba(44,45,47,1);
   }
   .switch-style{
      float: right!important;
   }
   .bottom-tabbar{
      margin: 0 10px;
      height: 60px;
      width: calc(100% - 20px);
      border-radius:  0 0 4px 4px;
      flex-direction: row;
      justify-content: space-between;
      span{
         display: block;
         color: #48494C;
         font-size: 14px;
         &:nth-of-type(2){
            color: #4979FF;
         }
      }
      b{
         font-weight: normal;
         margin-left: 8px;
         line-height: 60px;
         &.go-file{
            margin-right: 8px!important;
         }
      }
   }
   .order-textarea{
      width: 100%;
      height:56px;
      border-radius:4px;
      border:1px solid rgba(217,217,217,1);
   }
   .error-tips{
      margin: 0;
      padding: 0;
      font-size:12px;
      line-height: 30px;
      color: #E45434;
      text-align: left;
      span{
         display: block;
         float: right;
         color: #E45434;
         b{
            font-weight: normal;
            color: #4979FF;
            text-decoration: underline;
         }
      }
   }
}
.changewidth{
  width: 90%!important;
}
</style>

<style>
   .changewidth{
       width: 90%!important;
   }
</style>