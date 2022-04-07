/**author:xulanlan 
createTime:2021-01-14-15:37 
title:文亚订单展示入口首页 bottom
editor:xulanlan
editTime:2021-01-14-15:37  */
<template>
   <div  class="bottombar-wrap">
      <span @click="bottombarchange('-')"><van-icon name="arrow-left" size="16" />{{back}}</span>
      <span @click="bottombarchange('+')" class="active">{{pre}}<van-icon name="arrow" size="16" /></span>
   </div>
</template>
<script>
export default {
   props:['back','pre'],
   methods:{
      bottombarchange(type){
         this.$emit('bottombarchange',type)
      }
   }
}
</script>
<style lang="scss" scoped>
.bottombar-wrap{
   width: 100%;
   height: 48px;
   
   background: #fff;
   display: flex;
   span{
      flex:1;
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #48494C;
      line-height: 14px;
      text-align: left;
      line-height: 48px;
      &.active{
         justify-content: flex-end;
         text-align: right;
         color: #4979FF;
      }
   }
}
</style>