<template>
    <div class="order-content">
      <div class="total-price-warp">
         <p><label >Total Price</label>{{totalObj.decimalTotalPrice}}</p>
         <p><label >Deposit</label>{{totalObj.minMoney}}</p>
         <p><label >Balance</label>{{Number(totalObj.decimalTotalPrice) - Number(totalObj.minMoney) }}</p>
         <p class="widthslagre"><label >High Score Guarantee Fee</label>{{totalObj.guaranteeScoreFee}}</p>
      </div>
      <div class="part-price-warp" v-for="(items,key) in childorderList" :key="key">
         <h3>{{typeObj[items.childType] || 'Dissertation' }}-{{items.section == 'Custom'?items.newSection :items.section}}</h3>
         <p><label >Total Price</label>{{items.decimalTotalPrice || 0}}</p>
         <p><label >Deposit</label>{{items.minMoney ||0}}</p>
         <p><label >Balance</label>{{Number(items.decimalTotalPrice) - Number(items.minMoney)}}</p>
         <p class="widthslagre"><label >High Score Guarantee Fee</label>
            <!-- {{items.guaranteeScoreFee}} -->
         </p>
         <div class="feeCVOS-boxs">
            <p v-for="(lists,indexs) in items.feeCVOS" :key="indexs"><label >{{lists.score?lists.score:lists.highScore}}</label>{{lists.guaranteeFee}}</p>
         </div>
      </div>
   </div>
</template>
<script>
import { mapState } from "vuex";
export default {
   props:['urlarr',"nodesc",'id'],
   data(){
      return {
         result:[],
         allchecked:false,
         typeObj:{
            2:'Writing materials',
            3:'Quizzes/Exams/Weekly tasks',
            4:'Presentation',
            8:'Profreading',
         },
         totalObj:{
         },
      }
   },
   computed: {
      ...mapState({
         childorderList: (e) => e.order_user.childorderlist,
      }),
   },
   watch: {
      childorderList:function(val){
         console.log('子订单数组变化',val)
         this.totalObj = {
            decimalTotalPrice:0,
            minMoney:0,
            guaranteeScoreFee:0
         },
         val.length&&val.forEach(item=>{
            this.totalObj.decimalTotalPrice +=  Number(item.decimalTotalPrice||0);
            this.totalObj.minMoney += Number(item.minMoney||0) ;
            let singleguaranteeFee = 0;
            item.feeCVOS.forEach(li=>{
               if(li.highScore  == item.guaranteeScore){
                  
                  singleguaranteeFee = li.guaranteeFee
               }
            })
            this.totalObj.guaranteeScoreFee += Number(singleguaranteeFee|| 0);
            this.totalObj.guaranteeScoreFee = this.reduceNums(this.totalObj.guaranteeScoreFee,2);
            console.log('guaranteeScoreFee',this.totalObj)
         })
         this.$forceUpdate()
      }
        
   },
   created(){
      this.totalObj = {
         decimalTotalPrice:0,
         minMoney:0,
         guaranteeScoreFee:0
      },
      this.childorderList.length&&this.childorderList.forEach(item=>{
         this.totalObj.decimalTotalPrice += Number(item.decimalTotalPrice || 0);
         this.totalObj.minMoney += Number(item.minMoney || 0);
         // console.log(item.guaranteeScore,'item.guaranteeScore',item.feeCVOS)
         let singleguaranteeFee = 0;
         item.feeCVOS.forEach(li=>{
            if(li.highScore  == item.guaranteeScore){
               singleguaranteeFee = li.guaranteeFee
            }
         })
         this.totalObj.guaranteeScoreFee += Number(singleguaranteeFee|| 0);
         this.totalObj.guaranteeScoreFee = this.reduceNums(this.totalObj.guaranteeScoreFee,2);
            console.log('guaranteeScoreFee',this.totalObj)
      })
   },
   methods:{
      reduceNums (num,n) {
         return parseInt(num*Math.pow(10,n)+0.5,10)/Math.pow(10,n); 
      },
   },
   
}

</script>
<style lang="scss" scoped>
.total-price-warp{
   margin-bottom: 16px;
   padding: 18px 14px;
   height: 159px;
   background: #FFFFFF;
   box-shadow: 0px 3px 10px 0px rgba(92, 98, 117, 0.14);
   border-radius: 2px;
   overflow: hidden;
   position: relative;
   &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 159px;
      background: #507AEF;
      border-radius: 2px 0px 0px 2px;
   }
   p{
      text-align: right;
      margin: 0 0 16px 0;
      line-height: 20px;
      height: 20px;
      font-size: 20px;
      font-family: YouSheBiaoTiHei;
      color: #2C2D2F;
      label{
         float: left;
         font-size: 14px;
         font-weight: 400;
         color: #2C2D2F;
      }
   }
}
.feeCVOS-boxs{
   padding: 0 0 0 180px;
   p{

   }
   
}
.widthslagre{
   label{
      width: 190px;
   }
}
.part-price-warp{
   margin-bottom: 10px;
   padding: 10px;
   /* height: 128px; */
   background: #F9FBFF;
   border-radius: 2px;
   border: 1px solid #F3F5FC;
   h3{
      margin: 0 0 16px 0;
      height: 14px;
      font-size: 14px;
      font-weight: 500;
      color: #2C2D2F;
      line-height: 14px;
   } 
}
 
p{
   margin: 0 0 10px 0;
   height: 12px;
   font-size: 12px;
   font-weight: 400;
   color: #48494C;
   line-height: 12px;
   label{
      display: block;
      width: 78px;
      float: left;
      font-size: 14px;
      font-weight: 400;
      color: #8C8C8C;
      
   }
}
</style>