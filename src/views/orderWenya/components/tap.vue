/**author:xulanlan 
createTime:2021-01-14-14:52 
title:文亚订单展示tap
editor:xulanlan
editTime:2021-01-14-14:52 */
<template>
      <ul class="step-wrap">
         <li v-for="(step,is) in bottomtapArr" :key="is" v-show="is<bottomtapArr.length-1 && is != 0" :class="is <= bottomtapIndex?'line-bule':''" @click="changeTap(step,is)">
            <div class="icon-box">
               <van-icon :name="is < bottomtapIndex ? step.isFull ? 'warning error':'circle active': bottomtapIndex == is? step.isFull ? 'warning error':'checked active':'circle'" />
               <p>{{step.name}}</p>
            </div>
            <span v-if="step.isFull" class="none-content">{{step.contents?step.contents:'有必填项未填写'}}</span>
         </li>
      </ul>
</template>
<script>
export default {
  props:['bottomtapArr','bottomtapIndex'],
  data(){
      return {
        
      }
   },
   created(){

   },
   methods:{
      changeTap(step,index){
         this.$emit("changeTap",step,index)
      },
   }
}
</script>
<style lang="scss" scoped>
  .step-wrap{
    width: 100%;
    display: flex;
    height: 60px;
    position: relative;
    width: 100%;
    margin-top: 0px;
    flex-direction: row;
    li{
      height: 100%;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;
      &.line-bule{
        &::after{
          background-color: #4979ff;
        } 
      }
      &::after{
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #ebedf0;
      }
      .active{
        color: #4979ff;
      }
      .error{
        color: #E45434;
      }
      i{
        font-size: 12px;
        background: #fff;
        z-index: 9;
      }
      .icon-box{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;
      }
      p{
        margin: 0;
        font-size: 14px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
      }
      span{
        position: relative;
        display: block;
        margin: 0px auto 0;
        font-size: 10px;
        height: 18px;
        line-height: 20px;
        border-radius: 4px;
        max-width: 100px;
        width: auto;
        text-align: center;
        background: #E45434;
        color: #fff;
        &::after{
          content: '';
          position: absolute;
          bottom: -6px;
          left: 49%;
          width: 0;
          height: 0;
          border-top: 3px solid #E45434;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-bottom: 3px solid transparent;
        }
      }
    }
  }
  h3 {
    padding: 14px 0;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(44, 45, 47, 1);
    line-height: 16px;
  }
  .bottom-tabbar {
    display: flex;
    align-items: center;
    align-content: center;
    margin: 0 10px;
    height: 60px;
    width: calc(100% - 20px);
    border-radius: 0 0 4px 4px;
    flex-direction: row;
    justify-content: space-between;
    span {
      display: flex;
      align-items: center;
      color: #48494c;
      font-size: 14px;
      align-items: center;
      &:nth-of-type(2) {
        color: #4979ff;
      }
    }
    b {
      font-weight: normal;
      margin-left: 8px;
      line-height: 60px;
      &.go-file {
        margin-right: 8px !important;
      }
    }
  }
</style>