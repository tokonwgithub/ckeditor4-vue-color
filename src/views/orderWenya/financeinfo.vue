<template>
   <div class="order-content">
      <el-form ref="financeform" :model="orderForm" :rules="rules" label-width="80px" label-position="top">
         <!-- 作业订单及其考试订单修改 -->
         <template v-if="ordereditstatus">
            <div class="ordereditstatus-box">
               <img src="@/assets/images/transferCapital/reject.png"/>
               <h5>如需修改金额信息，请保存后通过以下方式对应修改：</h5>
               <p>[划拨金额]：减少已支付金额</p>
               <p>[添加追付]：增加金额</p>
               <p>[账单申请异常]：减少未支付金额</p> 
            </div>
         </template>
         <template v-else>
            <el-form-item label="Total Price" prop="decimalTotalPrice" class="other-style" >
               <el-input placeholder="Please input the amount"  type="number" v-model="orderForm.decimalTotalPrice" class="input-with-select" ref="moneyinputs" @blur="changefeeCVOS">
                  <!-- 正常来源文亚 -->
                  <el-select v-model="orderForm.currencyWy" @change="queryByCurrency" style="width:80px" slot="prepend" placeholder="请选择" v-if="!comeFrom">
                     <el-option :label="currency.currency" :value="indexc" v-for="(currency,indexc) in currencyList" :key="indexc"></el-option>
                  </el-select>
                  <!--来源导毕  -->
                  <el-select v-model="orderForm.currency"  @change="queryByCurrency" style="width:80px" slot="prepend" placeholder="请选择" v-else>
                     <el-option :label="currency" :value="currency" v-for="(currency,indexcs) in currencyList" :key="indexcs"></el-option>
                  </el-select>
               </el-input>
               <p class="error-tips" v-if="orderForm.decimalTotalPrice && orderForm.guaranteeScoreSwitch == 1">已包含保分费</p>
               <div class="cards-currency" v-loading="accountLoading">
                  <p v-if="!comeFrom"><i></i>{{ currencyList[orderForm.currencyWy] && currencyList[orderForm.currencyWy].currency}} <span>{{accountMoney}}</span></p>
                  <p v-else><i></i>{{orderForm.currency}} <span>{{accountMoney.money}}</span></p>
                  <p>
                     <b  @click="showAccounts('huanhuis')"><img src="@/assets/images/order/huanhui.png" />换汇</b>
                     <b @click="showAccounts('chongzhis')"><img src="@/assets/images/order/chonzhi.png" />充值</b>
                  </p>
               </div>
            </el-form-item>
            <el-form-item label="Deposit" prop="minMoney"  class="other-style"  >
               <el-input style="width:100%"   type="number"  v-model="orderForm.minMoney" size="small" @blur="calculateBalance"/>
               <!-- <p class="error-tips" >
                  当前余额{{accountMoney}}
                  <span v-if="accountMoneyShow" >当前余额不足，请先<b @click="showAccounts('chongzhis')">充值</b>或<b  @click="showAccounts('huanhuis')">换汇</b></span></p> -->
            </el-form-item>
            <el-form-item label="Balance" prop="Balance" class="other-style"  >
               <el-input style="width:100%" type="number" :value="balancecalc" disabled size="small"/>
            </el-form-item>
            <!-- <el-form-item label="High Score Guarantee Fee" prop="guaranteeScoreFee" class="other-style" v-if="orderForm.guaranteeScoreSwitch == 1" >
               <el-input v-model="orderForm.guaranteeScoreFee" style="width:100%"  type="number" size="small" />
            </el-form-item> -->
         </template>
         <!-- 添加新版本高分 -->
         <template v-if="orderForm.guaranteeScoreSwitch == 1 && orderForm.guaranteeScore && showHighScore">
            <el-form-item label="High Score Guarantee Fee" class="other-style" >
               <span slot="label" class="label-show-all"> <b>*</b> High Score Guarantee Fee</span>
            </el-form-item>
            <el-form-item  class="other-style-highScore" v-for="(lists,indexs) in  orderForm.feeCVOS" :key="indexs" :prop="'feeCVOS.' + indexs +'.guaranteeFee'" :rules="{required:true,validator:numVaildator, trigger:'change',indexs}">
               <span slot="label" class="label-show">{{lists.score?lists.score:lists.highScore}}</span>
               <el-input   style="width:100%"   v-model="orderForm.feeCVOS[indexs].guaranteeFee"  @keypress.native="disableInputSymbol" size="small" type="number" >
                  <el-button  slot="prepend" icon="el-icon-minus" @click="calcNum(indexs,'-')" />
                  <el-button  slot="append"  icon="el-icon-plus" @click="calcNum(indexs,'+')" />
               </el-input>
               <span class="show-danwei" v-if="!comeFrom"><i></i>{{ currencyList[orderForm.currencyWy] && currencyList[orderForm.currencyWy].currency}} </span>
                  <span class="show-danwei" v-else><i></i>{{orderForm.currency}} </span>
            </el-form-item>
         </template>
         <el-form-item label="订单默认锁定，是否需要解锁？" class="other-style" prop="accountRemark">
           <el-switch v-model="orderForm.lockFlag " :active-value="2" :inactive-value="1">
            </el-switch>
         </el-form-item>
          <!-- <el-form-item label="Note" class="other-style" prop="accountRemark">
            <el-input type="textarea"
            :rows="3" v-model="orderForm.accountRemark"/>
         </el-form-item> -->
        
      </el-form>
      <chongzhi ref="chongzhis" @successfun="queryAccountcurreny"/>
      <huanhui ref="huanhuis" @successfun="queryAccountcurreny"/>
      <el-dialog :visible.sync="showMoneyStatus" :append-to-body="true" width="350px" :show-close="false" class="showMoneyStatus-dialog" title="提示">
         <div class="showMoneyStatus-box">
            <p >当前订单定金为 <b class="bule">{{orderForm.minMoney}}
               <span v-if="!comeFrom">{{ currencyList[orderForm.currencyWy] && currencyList[orderForm.currencyWy].currency}}</span>
               <span v-else><i></i>{{orderForm.currency}}</span>
               </b>，订单总价<b class="bule">{{orderForm.decimalTotalPrice}}
                   <span v-if="!comeFrom">{{ currencyList[orderForm.currencyWy] && currencyList[orderForm.currencyWy].currency}}</span>
               <span v-else><i></i>{{orderForm.currency}}</span><br/></b>定金小于订单总价<b class="red">30%</b> ，无法下单！</p>
            <div class="button-box">
               <div  class="upload-btn" @click="showMoneyStatus=false" >确定</div>
            </div>
            
         </div>
      </el-dialog>
   </div>
</template>
<script>
import {disableInputSymbol} from  '@/utils/handleTimes'
import chongzhi from '@/views/customer/material/components/account/transfer/chongzhi'
import huanhui from '@/views/customer/material/components/account/transfer/huanhui'
import {queryQuotableUserList, calculate, queryByCurrency, } from "@/api/order";
import { SysCode } from "@/utils/Enum/Customer/Account";
import { userAccountGetById } from "@/api/account";
import {exchangeListwy} from '@/api/basic'
import {getbalancebycoin,canCreatePrepaymentLess30} from '@/api/orderwy'
import {autoRechargeCheck} from "@/api/order.js"
export default {
   props:['userid','ordertype','indexs','orderForm','ordereditstatus'],
   data() {
      let that = this;
      var numVaildator = (rule, value, callback) => {
         // console.log(rule,value,that.orderForm.feeCVOS)
         let index = rule.indexs,
         len = that.orderForm.feeCVOS.length - 1,//获取index的最大值
         indexlimit = that.orderForm.feeCVOS.length - 2;
         if (!value.toString() ) {
            callback(new Error('请输入数值'));
         }else if(value < 0){
            callback(new Error('数值必须大于等于0'));
         } else if(index == 0 ){//第一档数值进行判断
            if(that.orderForm.feeCVOS[index].guaranteeFee && ( Number(value) > Number(that.orderForm.decimalTotalPrice))){
               callback(new Error('数值不能大于总价'));
            }
            else if(that.orderForm.feeCVOS[index].guaranteeFee && that.orderForm.feeCVOS[index + 1] && that.orderForm.feeCVOS[index + 1].guaranteeFee && (Number(value) < Number(that.orderForm.feeCVOS[index + 1].guaranteeFee))){
               callback(new Error('数值不能小于下一档的数值'));
            }else{
               callback();
            }
         }
         //最后一档数值进行判断
         else if(index == len ){
            if(that.orderForm.feeCVOS[index].guaranteeFee && (Number(value) > Number(that.orderForm.feeCVOS[indexlimit].guaranteeFee))){
               callback(new Error('数值不能大于上一档的数值'));
            }else{
               callback();
            }
         }
         else {
            callback();
         }
      };
      return {
         numVaildator,
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
         // showHighScore:false,
         accountLoading:false, 
         comeFrom:sessionStorage.getItem('comefrom'), 
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
         userloading:false,
         userList:[],
         accountMoneyShow:false,
         accountMoney:0,
         content:null,
         cantSubmit:false,
         canCreate:null,
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
         },
      }
   },
   components:{
     chongzhi,
     huanhui
   },
   watch:{
      indexs:function(val){
         if((val == 2 && [1,11].includes(Number(this.ordertype)) || (val == 4 && !this.comeFrom))&& !this.ordereditstatus){
            this.exchangeListwy()
         }
      }
   },
   computed:{
      balancecalc(){
         return this.reduceNum(this.orderForm.decimalTotalPrice,this.orderForm.minMoney);
      },
      showHighScore(){
         console.log(this.orderForm,'------kjkjk')
         if(this.orderForm.guaranteeScoreSwitch == 1 && this.orderForm.guaranteeScore && this.orderForm.decimalTotalPrice &&  this.orderForm.feeCVOS.length){
            this.changefeeCVOS()
            return true;
         }
         return false;
      },
   },
   async created(){
      this.type = this.ordertype;
      await this.canCreatePrepaymentLess30()
      if(!this.ordereditstatus){
         if(!this.comeFrom){
            await this.exchangeListwy();  
         }else{
            this.orderForm.currency = "AUD"
         }
         await this.queryByCurrency();
         await this.getAccountsByData();
         
      }
      
      // await this.queryByCurrency()
   },
   methods:{
      disableInputSymbol,
      reduceNum (num1, num2) {
         var sq1,sq2,m;
         try {
            sq1 = num1.toString().split(".")[1].length;
         }
         catch (e) {
            sq1 = 0;
         }
         try {
            sq2 = num2.toString().split(".")[1].length;
         }
         catch (e) {
         sq2 = 0;
         }
         m = Math.pow(10,Math.max(sq1, sq2));
         return (num1 * m - num2 * m) / m;
      },
      reduceNums (num,n) {
         return parseInt(num*Math.pow(10,n)+0.5,10)/Math.pow(10,n); 
      },
      async exchangeListwy(){
         const {status,body} = await exchangeListwy({page:1,limit:100});
         if(status == 200){
            this.currencyList = body;
            console.log(body);
            this.orderForm.currencyWy = this.orderForm.currencyWy|0;
            this.orderForm.currency =   this.orderForm.currency|body[0].currency;
           
         }
         console.log(body,'leixing')
      },
      changfouce(){
         this.$nextTick(()=>{   //焦点获取
            this.$refs.moneyinputs.focus();
         })
      
      },
      formjudge(){
         this.$refs.financeform.clearValidate()
         let status = false;
         if(this.ordereditstatus){//修改订单的时候做的验证
            status = true;
         }else{
            this.$refs.financeform.validate((valid) => {   
               if (valid) {
                  status = true;
               }
            });
            if(!this.calculateBalance()){
                  this.$message({
                     message: "定金不能大于总金额",
                     type: "warning",
                  });
               status = false;
            }
            if(this.cantSubmit){//定金小于30%不可提交
               status = false;
               
            }
            if(!this.comeFrom){
               this.orderForm.currency =  this.currencyList[this.orderForm.currencyWy].currency;
            }
         }
        return status;
      },
      async canCreatePrepaymentLess30(){
         const res = await canCreatePrepaymentLess30();
         if(res.status == 200){
            this.canCreate = res.body.canCreate
         }
      },
      async queryAccountcurreny(){
         await this.queryByCurrency();
         await this.getAccountsByData();
      },
      async getAccountsByData(){
         let sysCode = 'wy',
         id = localStorage.getItem('wyid');
         if(this.comeFrom){
            sysCode = 'db',
            id = this.userid;//查询用userid不用dbid
         }
         const res = await userAccountGetById({sysCode,id});
         const _data = res.body;
         const data = {
          ..._data,
          sysCode,
        }
         this.content = data;
         console.log('获取账号信息',res)
      },
      async showAccounts(name){
         localStorage.setItem('orderUserId',this.userid);
         if(name == 'huanhuis'){
            this.$refs[name].open(this.content);
         }else{
            console.log(this.userid);
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
         if(this.userid == 'undefined' || !this.userid){
            return false
         }
         // this.orderForm.currency = this.currencyList[this.orderForm.currencyWy].currency;
         let data = {
            userId:this.userid
         };
         let sysCode = '';
         if(this.comeFrom){
            sysCode = SysCode.DAOBI,
            data.current = this.orderForm.currency;
         }else{
            data.totalCoin = this.currencyList[this.orderForm.currencyWy].id;
         }
         this.accountLoading = true;
         const {status,body,msg} = this.comeFrom?await queryByCurrency({sysCode,data}): await getbalancebycoin(data);
         this.accountLoading = false;
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
         }else{
            this.$message({
               message: msg,
               type: "warning",
            });
         }
      },
      calculateBalance(){
         let status = true;
         this.accountMoneyShow = false;
          if(Number(this.orderForm.minMoney) > Number(this.accountMoney)){
            this.accountMoneyShow = true;
            status = false;
         }
         if(Number(this.orderForm.minMoney)>Number(this.orderForm.decimalTotalPrice)){
            this.$message({
               message: "定金不能大于总金额",
               type: "warning",
            });
            status = false;
            
         }
         if(!this.canCreate){
            this.showMoneyTip();
         }  
         
         return status;
      },
      showMoneyTip(){
         if(this.canCreate) return;//当前客户有资格下单小于30%的单子
         this.cantSubmit = false;
         // if(localStorage.getItem('showMoneyTip')) return;
         if(this.orderForm.minMoney*1 < (this.orderForm.decimalTotalPrice*1)*0.3){
            this.cantSubmit = true;
            // localStorage.setItem('showMoneyTip',true);
            this.showMoneyStatus =  true;
         }
      },
      async queryQuotableUserList(){
         const sysCode = SysCode.DAOBI;
         this.userloading = true;
         const {status , body} = await queryQuotableUserList({sysCode,key:''});
         this.userloading = false;
         if(status == 200){
            this.userList = body;
         }
      },
      changefeeCVOS(){
         if(this.ordereditstatus && !localStorage.getItem('feeCVOSnumber')){
            return
         }
         if(!this.orderForm.decimalTotalPrice || !(this.orderForm.guaranteeScoreSwitch == 1 && this.orderForm.guaranteeScore)) return;
         let alllen = this.orderForm.feeCVOS.length;
         let totalPrice = this.orderForm.decimalTotalPrice * 1 / (1+(this.orderForm.feeCVOS[0].rate))
         this.orderForm.feeCVOS.forEach((item,index) => {
            this.$set( this.orderForm.feeCVOS[index],'type', Number(alllen - index));
            // if(!item.rate){
            //    this.$set( this.orderForm.feeCVOS[index],'type', 0 );
            // }
            this.$set( this.orderForm.feeCVOS[index],'guaranteeFee',this.reduceNums(totalPrice * item.rate,2))
         });
         console.log( this.orderForm.feeCVOS,' this.orderForm.feeCVOS')
      },
      calcNum(index,type){
         if(type == '+'){
            this.orderForm.feeCVOS[index].guaranteeFee ++;
         }else{
            if(!this.orderForm.feeCVOS[index].guaranteeFee){
               return
            }
            if(this.orderForm.feeCVOS[index].guaranteeFee <= 0){
               return false;
            }
            this.orderForm.feeCVOS[index].guaranteeFee --;
         } 
      },
      timehandle(str){
         if(!str) return;
         return str.split('/').join('-');
      },
      async calculateFun(){
         if(this.type != 65 || !this.orderForm.wordsNum) return;
         const { wordsNum, examTime } = this.orderForm,
         data = {
            wordsNum: wordsNum,
            countryId: this.orderForm.countryId,
            type:1,
            examTime: this.timehandle(examTime),
         };
         const sysCode = SysCode.DAOBI;
         const {status, body,msg} = await calculate({sysCode, data});
         if(status == 200){
            this.$set(this.orderForm,'decimalTotalPrice',body.calculatedPrice);
         }else{
            this.$message({
               message: msg,
               type: "warning",
            });
         }
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
<style>
.other-style-highScore .el-form-item__label{
   width: 60px;
   padding-left: 10px;
}
.other-style-highScore.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
   content: '';
}
.other-style-highScore .el-form-item__content{
   flex: 1;
   display: flex;
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
.ordereditstatus-box{
   padding: 20px;
   img{
      display: block;
      margin:20px auto
   }
   h5{
      font-size: 16px;
      line-height: 24px; 
   }
   p{
      margin: 10px 0;
      font-size: 14px;
      line-height: 16px;
      text-align: left;
      color: #E45434;
   }
}
.other-style-highScore{
   display: flex;
}
.label-show-all b{
  color:#F56C6C!important ; 
}
.show-danwei{
   width: 80px;
   font-weight: bold;
   margin-left: 10px;
}
.changewidth{
  width: 90%!important;
}
</style>

<style>
   .changewidth{
       width: 90%;
     }
   </style>