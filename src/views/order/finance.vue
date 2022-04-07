<template>
   <div class="order-content">
      <el-form ref="financeform" :model="orderForm" :rules="rules" label-width="80px" label-position="top">
         <h3>
            订单财务信息
         </h3>
         <el-form-item label="支付方式" prop="fromCard" class="other-style">
            <div class="f12"><i class="el-icon-warning-outline"></i> 该订单后续的所有账单都只能用相同的支付方式</div>
            <el-select placeholder="请选择支付方式"  :disabled="studCurrentCardBagobj.length > 0 && (type<67 || type == 71)?false:true" v-model="orderForm.fromCard" style="width:100%" size="small" @change="changeAplay">
               <el-option :label="item.name" :value="item.value" v-for="(item,i) in aplayList" :key="i"></el-option>
            </el-select>
         </el-form-item>
         <!-- <el-form-item label="学期卡"  v-if="orderForm.fromCard"  class="other-style" >
            <p>{{studCurrentCardBagobj.cardNo}}({{studCurrentCardBagobj.allTime}}课时)</p>
         </el-form-item>
         <el-form-item label="学期卡单价"  v-if="orderForm.fromCard"  class="other-style" >
            <p>{{studCurrentCardBagobj.unitWorth}}({{studCurrentCardBagobj.currency}}/小时)</p>
         </el-form-item> -->
         <!-- <el-form-item label="学期卡预计抵扣课时"  v-if="orderForm.fromCard"  class="other-style" >
            <p>{{type ==  0 ? orderForm.decimalScheduledTime : (orderForm.decimalTotalPrice?orderForm.decimalTotalPrice:0)/studCurrentCardBagobj.unitWorth }}课时</p>
         </el-form-item> -->
        <el-form-item label="工作量（工作量为报价参数）" prop="wordsNum" class="other-style"  v-if="[65,71].includes(Number(type))">
            <el-input style="width:100%" type="number" v-model="orderForm.wordsNum"  size="small" @blur="calculateFun"/>
         </el-form-item>
         <el-form-item label="订单总金额" v-if="!(orderForm.fromCard && type == 0)" prop="decimalTotalPrice" class="other-style" >
            <el-input placeholder="请输入内容"  type="number" v-model="orderForm.decimalTotalPrice" class="input-with-select" @keypress.native="(e) => {if(e.keyCode == 45){e.preventDefault();}}" @blur="computedDecimalMaterialCost(type,true)" ref="moneyinputs" @input='orderForm.decimalTotalPrice=orderForm.decimalTotalPrice.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".").replace(/^\./g, "").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")'>
               <el-select v-model="orderForm.currency" :disabled="orderForm.fromCard?true:false" @change="queryByCurrency" style="width:80px" slot="prepend" placeholder="请选择">
                  <el-option :label="currency" :value="currency" v-for="(currency,indexc) in currencyList" :key="indexc"></el-option>
               </el-select>
            </el-input>
            <p class="error-tips" v-if="type == 68" >*课程价格为500RMB,该订单请全额付款(当前余额{{orderForm.currency}} {{accoutTip.money}} )<span v-if="accoutTipShow" >当前余额不足，请先<b @click="showAccounts('chongzhis')">充值</b>或<b  @click="showAccounts('huanhuis')">换汇</b></span></p>
         </el-form-item>
         <el-form-item :label="'定金' + orderForm.currency" prop="minMoney"  class="other-style" v-if="!orderForm.fromCard && type != 68" >
            <el-input style="width:100%"   type="number"  v-model="orderForm.minMoney" size="small" @blur="calculateBalance"/>
            <p class="error-tips" >当前余额{{orderForm.currency}} {{accoutTip.money}}<span v-if="accoutTipShow" >当前余额不足，请先<b @click="showAccounts('chongzhis')">充值</b>或<b  @click="showAccounts('huanhuis')">换汇</b></span></p>
         </el-form-item>

         <!-- 学习卡列表 -->
         <el-form-item label="请选择学期卡支付" v-if="orderForm.fromCard" class="other-style">
            <el-radio-group v-model="orderForm.studTermCardId" @change="$forceUpdate();">
               <el-radio v-for="(item,index) in studCurrentCardBagobj" :key="index" :label="item.id" @change="selectRadio(item)">
                  <div
                     class="card"
                     :style="(item.statused == 16 || item.statused == 8 )? {backgroundImage: 'url(' + require('@/assets/images/cardBg/invalid.png') + ')'} : bgType(item.currency)"
                  >
                     <div class="top">
                        <div class="cardNumber">{{item.cardNo}}</div>
                        <div class="currency">
                           <img :src="nationalFlag(item.currency)" alt />
                           <span>单价：{{item.unitWorth}} {{item.currency}}/课时</span>
                        </div>
                     </div>
                     <div class="bottom">
                        <div class="classHours">
                        
                           <div class="remainingClassHours">
                              <div>{{item.lastTime}}h</div>
                              <div>学期卡余额</div>
                           </div>
                        </div>
                        <span class="show-level" v-if="item.cardLevelName">{{item.cardLevelName}}</span>
                     </div>
                  </div>
               </el-radio>
            </el-radio-group>
            <p class="error-tips">当前学期卡课时单价为：<span style="float:none;display:inline-block;color:#222;font-size:14px;margin-left:6px">{{studTermCardObj.unitWorth}} {{studTermCardObj.currency}}/课时</span></p>
         </el-form-item>
         <el-form-item label="特殊消耗" prop="cardSpecialPriceFlag" class="other-style" v-if="orderForm.studTermCardId && type == 0  && orderForm.fromCard">
            <el-checkbox v-model="orderForm.cardSpecialPriceFlag" :label="1">有特殊消耗</el-checkbox>
         </el-form-item>
         <!-- 若订单为 论文大礼包Plus订单，则财务信息中没有（特殊报价）字段 -->
         <el-form-item label="特殊报价" prop="theSpecialOffer" class="other-style" v-if="[67,71].includes(Number(type)) || (Number(type) == 65 && orderForm.bigPackageType != 2)">
            <el-checkbox v-model="orderForm.theSpecialOffer">有特殊报价</el-checkbox>
         </el-form-item>
         <el-form-item label="报价人" prop="specialOfferUser" class="other-style"  v-if="orderForm.theSpecialOffer&&!(orderForm.studSpecialOrderExt.type == 129||orderForm.studSpecialOrderExt.type == 130)">
            <el-select v-model="orderForm.specialOfferUser" filterable placeholder="请选择报价人" style="width:100%" size="small" v-loading="userloading">
               <el-option style="width:350px" :label="user.username" :value="user.userId" v-for="(user,indexs) in userList" :key="indexs"></el-option>
            </el-select>
         </el-form-item>
         <!-- 有学期卡支付 -->
          <el-form-item label="特殊课时单价" prop="decimalPrice"  class="other-style other-style-special"  v-if="orderForm.cardSpecialPriceFlag && type == 0 && orderForm.fromCard">
            <el-input style="width:100%" placeholder="请输入特殊课时单价：XXX（等于1.5H/小时）" type="number"  v-model="orderForm.decimalPrice"  size="small" @blur="calcSpacilPrice">
             <template slot="append"><span style="max-width:150px;display:block">{{multiple?multiple:0}}学期卡课时/小时
              <!-- 等于  {{multiple?multiple:0}}H/小时 -->
                </span></template>
            </el-input>
         </el-form-item>
         <!-- 没有学期卡支付 -->
         <el-form-item :label="'课时单价' + orderForm.currency" prop="decimalPrice"  class="other-style"  v-if="type < 2 && !(orderForm.fromCard && type == 0)">
            <el-input style="width:100%"  type="number"  v-model="orderForm.decimalPrice" :disabled="type == 1" size="small" @blur="computedDecimalMaterialCost(type)"/>
         </el-form-item>
         <!-- 材料费=课程总价的百分之30 -->
         <el-form-item :label="'材料费'+ orderForm.currency " prop="decimalMaterialCost" class="other-style" v-if="type == 1">
            <el-input style="width:100%" disabled="disabled" v-model="orderForm.decimalMaterialCost" size="small" type="number"/>
         </el-form-item>
         <el-form-item label="预充课时" prop="decimalScheduledTime" :rules="[{ required: type == 0?false:true, message: '请填写预充课时', trigger: 'blur' }]" class="other-style" v-if="type<2">
            <el-input style="width:100%" :disabled="type == '1'" v-model="orderForm.decimalScheduledTime" size="small" type="number" @blur="computedDecimalMaterialCost(type)"/>
         </el-form-item>
         
         <el-form-item label="备注信息" class="other-style" prop="accountRemark">
            <textarea class="order-textarea" v-model="orderForm.accountRemark"/>
         </el-form-item>
         <el-form-item label="订单默认锁定，是否需要解锁？" class="other-style" prop="accountRemark">
           <el-switch v-model="lockFlag " @change="changeLock" >
            </el-switch>
         </el-form-item>
      </el-form>
      <chongzhi ref="chongzhis" @successfun="queryAccountcurreny"/>
      <huanhui ref="huanhuis" @successfun="queryAccountcurreny"/>
      <el-dialog :visible.sync="showMoneyStatus" :append-to-body="true" width="300px" :show-close="false" class="showMoneyStatus-dialog" title="提示">
         <div class="showMoneyStatus-box">
            <p >当前解锁订单定金为 <b class="bule">{{orderForm.minMoney}}{{orderForm.currency}}</b>，订单总价<b class="bule">{{orderForm.decimalTotalPrice}}{{orderForm.currency}}</b>定金小于订单总价<b class="red">30%</b> ，请确定定金金额填写正确！</p>
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
import {queryQuotableUserList, calculate, queryByCurrency, studCurrentCardBag, studCardBag } from "@/api/order";
import { SysCode } from "@/utils/Enum/Customer/Account";
import { userAccountGetById } from "@/api/account";
import {autoRechargeCheck} from "@/api/order.js"
export default {
   props:['orderForm','userid','ordertype','indexname'],
   data() {
      let that = this;
      return {
         showMoneyStatus:false,
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
         userloading:false,
         userList:[],
         accoutTipShow:false,
         accoutTip:{
            money:0
         },
         studCurrentCardBagobj:[],
         content:null,
         rules:{
            minMoney: [
               { required: true, message: '请输入定金', trigger: 'blur' },
            ],
            decimalPrice: [
               { required: true, message: '请输入课时单价', trigger: 'blur' },
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
         studTermCardObj:{},
         multiple:0,
         lockFlag:false//自动委派开关
      }
   },
   components:{
     chongzhi,
     huanhui
   },
   watch:{
      indexname:function(val){
         if(val == '财务信息'){
            this.changfouce();
         }
      }
   },
   async created(){
      this.type = this.ordertype;
      if([65,67,71].includes(Number(this.type))){
         
         this.queryQuotableUserList();
      }
      if(this.ordertype == 1){
         this.orderForm.decimalScheduledTime = 7;
      }
      await this.studCurrentCardBag();
      await this.queryByCurrency();
      await this.getAccountsByData();
      
   },
   methods:{
      changfouce(){
         this.$nextTick(()=>{   //焦点获取
            this.$refs.moneyinputs.focus();
         })
     
    },
    changeLock(){
       this.$set(this.orderForm,'lockFlag',this.lockFlag?2:1)
    },
      async queryAccountcurreny(){
         await this.queryByCurrency();
         await this.getAccountsByData();
      },
      async studCurrentCardBag(){
         this.studCurrentCardBagobj = [];
         let data = {
            studId: this.orderForm.ucId,
            statused: 2
         };
         const {status,body} = await studCardBag(data);
         if(status == 200){
            this.studCurrentCardBagobj = body?body:[];
            // if(this.studCurrentCardBagobj.currency){
            //    this.orderForm.currency = this.studCurrentCardBagobj.currency
            // }   
         }
      },
      async getAccountsByData(){
         const sysCode = SysCode.DAOBI,
         id = this.orderForm.ucId;
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
         this.accoutTipShow = false;
         const sysCode = SysCode.DAOBI,
         data = {
            userId:this.orderForm.ucId,
            current:this.orderForm.currency
         };
         const {status,body} = await queryByCurrency({sysCode,data});
         if(status == 200){
            if(body){
               this.accoutTip = body; 
               if(this.orderForm.minMoney*1 > this.accoutTip.money*1){
                  this.accoutTipShow = true;
               }
            }else{
               this.accoutTip.money = 0;
               if(this.orderForm.minMoney*1 > this.accoutTip.money*1){
                  this.accoutTipShow = true;
               }
            }
         }
      },
      changeAplay(){
         this.orderForm.decimalTotalPrice = 0
         this.$refs.financeform.clearValidate();
         if(this.orderForm.fromCard){
            if(this.studCurrentCardBagobj.length > 0){
               this.orderForm.currency = this.studCurrentCardBagobj[0].currency;
               this.orderForm.studTermCardId = this.studCurrentCardBagobj[0].id;
               this.studTermCardObj = this.studCurrentCardBagobj[0];
            }else{
               this.orderForm.currency = '';
            }
           
            if(this.type != 1 && this.studCurrentCardBagobj.length > 0){
               this.orderForm.decimalPrice = this.studCurrentCardBagobj[0].unitWorth;
                this.calcSpacilPrice();
            }else{
               if(this.type < 66 && this.studCurrentCardBagobj.length > 0){
                  let decimalMaterialCost =   Math.floor((this.orderForm.decimalTotalPrice/10 * 3) * 100) / 100 ;
                  let balance = this.orderForm.decimalTotalPrice - decimalMaterialCost ;
                  let decimalPrice =  Math.floor((balance / this.orderForm.decimalScheduledTime) * 100) / 100;
                  this.$set(this.orderForm,'decimalMaterialCost',decimalMaterialCost);
                  this.$set(this.orderForm,'decimalPrice',decimalPrice);
                  this.calcSpacilPrice();
               }
            }

            
         }
      },
      calculateBalance(){
         this.accoutTipShow = false;
          if(this.orderForm.minMoney*1 > this.accoutTip.money*1){
            this.accoutTipShow = true;
         }
         if(this.orderForm.minMoney*1>this.orderForm.decimalTotalPrice*1){
            this.$message({
               message: "定金不能大于总金额",
               type: "warning",
            });
         }
         this.showMoneyTip();
         
      },
      showMoneyTip(){
         if(localStorage.getItem('showMoneyTip')) return;
         if(this.orderForm.minMoney*1 <= (this.orderForm.decimalTotalPrice*1)*0.3){
            localStorage.setItem('showMoneyTip',true);
            this.showMoneyStatus =  true;
         }
      },
      // 计算特殊课时单价倍数展示
      calcSpacilPrice(){
        this.multiple = Math.floor((this.orderForm.decimalPrice/this.studTermCardObj.unitWorth) * 100) / 100 ;
      },
      computedDecimalMaterialCost(type,statuss){
         if(this.orderForm.fromCard){
            const { lastTime, lastMoney } = this.studCurrentCardBagobj.filter(i => i.id == this.orderForm.studTermCardId)[0];
            if(type == 0){
               // if(+lastTime < +this.orderForm.decimalScheduledTime){//定制辅导不要这个提示
               //    this.$message('学期卡剩余课时不足')
               // }
            }else{
               if(+lastMoney < +this.orderForm.decimalTotalPrice){
                  this.$message('学期卡金额不足')
               }
            }
         }
         if(type == 0 && !this.orderForm.fromCard){
            const decimalScheduledTime = Math.floor((this.orderForm.decimalTotalPrice / this.orderForm.decimalPrice) * 100) / 100 ;
            this.$set(this.orderForm,'decimalScheduledTime',decimalScheduledTime);
         }else{
            if(this.type < 66 && this.type >0){
               let decimalMaterialCost =   Math.floor((this.orderForm.decimalTotalPrice/10 * 3) * 100) / 100 ;
               let balance = this.orderForm.decimalTotalPrice - decimalMaterialCost ;
               let decimalPrice =  Math.floor((balance / this.orderForm.decimalScheduledTime) * 100) / 100;
               this.$set(this.orderForm,'decimalMaterialCost',decimalMaterialCost);
               this.$set(this.orderForm,'decimalPrice',decimalPrice);
            }
         }
         if(this.type == 68){
            this.orderForm.minMoney = this.orderForm.decimalTotalPrice
            this.calculateBalance()
         }
         if(statuss){
            this.showMoneyTip();
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
      timehandle(str){
         if(!str) return;
         return str.split('/').join('-');
      },
      async calculateFun(){
         if(![65,71].includes(Number(this.type)) || !this.orderForm.wordsNum) return;
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
      formjudge(){
         let status = false
         this.$refs.financeform.validate((valid) => {
          if (valid) {
            status = true;
          }
        });
        return status;
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
         case "AUD":
            return require("@/assets/images/nationalFlag/australiaFlag.png");
         case "GBP":
            return require("@/assets/images/nationalFlag/britainFlag.png");
         case "CAD":
            return require("@/assets/images/nationalFlag/canadaFlag.png");
         case "NZD":
            return require("@/assets/images/nationalFlag/newZealandFlag.png");
         case "USD":
            return require("@/assets/images/nationalFlag/USAFlag.png");
         case "CNY":
            return require("@/assets/images/nationalFlag/chainFlag.png");
         default:
            return "";
         }
      },
      selectRadio(item){
         this.orderForm.currency = item.currency
         if(this.type != 1){
            this.orderForm.decimalPrice = item.unitWorth;
         }else{
            if(this.type < 66 && this.studCurrentCardBagobj.length > 0){
               let decimalMaterialCost =   Math.floor((this.orderForm.decimalTotalPrice/10 * 3) * 100) / 100 ;
               let balance = this.orderForm.decimalTotalPrice - decimalMaterialCost ;
               let decimalPrice =  Math.floor((balance / this.orderForm.decimalScheduledTime) * 100) / 100;
               this.$set(this.orderForm,'decimalMaterialCost',decimalMaterialCost);
               this.$set(this.orderForm,'decimalPrice',decimalPrice);
            }
         }
         const { lastTime, lastMoney } = this.studCurrentCardBagobj.filter(i => i.id == this.orderForm.studTermCardId)[0]
         if(this.type == 0){
            if(+lastTime < +this.orderForm.decimalScheduledTime){
               this.$message('学期卡剩余课时不足')
            }
         }else{
            if(+lastMoney < +this.orderForm.decimalTotalPrice){
               this.$message('学期卡金额不足',lastMoney)
            }
         }
         const studTermCardObj  = this.studCurrentCardBagobj.find(item=>item.id == this.orderForm.studTermCardId);
         this.studTermCardObj = studTermCardObj;
      }
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
.button-box{
   margin: 10px auto;
   text-align: center;
   .upload-btn{
      margin: 0 auto;
   }
}
.order-content{
   padding: 0 10px;
   margin: 10px;
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
   .card {
      width: 240px;
      height: 120px;
      overflow: hidden;
      border-radius: 8px;
      margin-right: 16px;
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
            }
            .time {
               width: 190px;
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
         position: relative;
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
.f12{
   font-size: 12px;
   position: absolute;
   top: -27px;
   left: 65px;
}
.show-level{
   position: absolute;
   top: 10px;
   right: -10px;
   font-size: 14px;
   font-family: YouSheBiaoTiHei;
   color: #FFFFFF;
   line-height: 18px;
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