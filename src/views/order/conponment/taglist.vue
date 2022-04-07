<template>
   <div class="order-tag-wrap">
      <!-- <div class="order-tap-title"  >
         <div class="title"> {{tagobj.title}}
            <span class="grouporder-pc" v-if="!browser&&tagobj.title == '文案类产品' && tagobj.arrlist[6].showStatus">
               <span  @click="gotoOrderder(1,tagobj.title)"><img src="@/assets/images/order/section-add.png"/>Group Order</span>
            </span>
         </div>
      </div> -->

      <div v-for="(item,i) in tagobj.arrlist" :key="i" style="display:inline-block" :class="{'mobile': browser,'grouporder':item.productType == 16,'grouporder-mobile':browser && item.productType == 16 }"    @click="gotoOrderder(item.id,item.sonid,item.productType)">
         <img :src="item.imgsrc" @click="gotoOrderder(item.id,item.sonid,item.productType)" >
         <div class="texts" v-if="item.productType == 16">
            <p>Group Order</p>
            *通过此方式创建的订单自动为关联订单
         </div>
      </div>  

   </div>
</template>
<script>
import util from '@/utils/util'
export default {
   props:[ 'tagobj','creatertype'],
   data(){
      return{
         
      }
   },
   computed: {
      browser() {
         // console.log('util.browser = ', util.browser)
         return util.browser.android || util.browser.iPhone
      }
   },
   methods:{
      gotoOrderder(id,sonid,productType){
         this.$emit("goto",id,sonid,productType)
      },
   }
}
</script>
<style lang="scss" scoped>
   .title{
      color: #2C2D2F;
      font-size: 14px;
      display: flex;
      align-items: center;
   }
   .order-tag-wrap{
      width: 100%;
      margin-bottom: 16px;
      overflow: hidden;
      // flex: 1;
      // overflow: auto;
      .order-tap-title{
         position: relative;
         line-height: 20px;
         font-size: 16px;
         font-weight: 600;
         padding-left: 10px;
         
         &>span{
            position: absolute;
            top: 0;
            left: 10px;
            width: 100%;
            height: 100%;
         }
         &>img{
            
            display: block;
            width: 100%;
            height: 46px;
         }
      }
     
      
      
      .tag-radius{
         margin-right: 8px;
         border-radius: 4px;
         margin-bottom: 20px;
      }

   }
.mobile{
   width: 50%;
   img{
      width: 100%;
      cursor: pointer;
   }
}
.grouporder{
   display: flex!important;
   width: calc(100% - 155px);
   box-sizing: border-box;
   align-items: center;
   align-content: center;
   padding: 8px;
   background: #FFFFFF;
   box-shadow: 1px 5px 15px 0px rgba(91, 91, 95, 0.21);
   border-radius: 4px;
   img{
      width: 92px;
      height: 92px;
      margin-right: 24px;
   }
   .texts{
      font-size: 16px;
      font-weight: 400;
      color: #48494C;
      line-height: 16px;
      p{
         margin: 0 0 16px 0;
         font-size: 24px;
         font-weight: 500;
         color: #172B4E;
         line-height: 24px;
      }
   }
}
.grouporder-mobile{
   width:100%;
   img{
      margin-right: 16px;
      width: 56px;
      height: 56px;
   }
   .texts{
      font-size: 12px;
      line-height: 12px;
      p{
         font-size: 16px;
         line-height: 16px;
      }
   }
}
</style>