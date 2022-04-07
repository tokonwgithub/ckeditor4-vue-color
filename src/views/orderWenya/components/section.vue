<template>
   <div class="section-wrap">
      <h3>Sections <span  @click="addData"><img src="@/assets/images/order/section-add.png"/> Add Section</span></h3>
      <div class="content-box" v-for="(list,index) in data" :key="index" >
         <div class="text-show">
            <p>{{typeObj[list.childType] || 'Dissertation' }}</p>
            <p>{{list.section == 'Custom'?list.newSection :list.section}}</p>
         </div>
         <div class="icon-box">
            <img src="@/assets/images/wenya/order-copy.png" @click="addData(index,'copy')" alt="">
            <img src="@/assets/images/wenya/order-edit.png" @click="addData(index,'edit')" alt="">
            <img src="@/assets/images/wenya/order-delete.png"  @click="deleteData(index)" alt="">
         </div>
      </div>
   </div>
</template>
<script>
export default {
   props:['data'],
   data(){
      return {
         typeObj:{
            2:'Writing materials',
            3:'Quizzes/Exams/Weekly tasks',
            4:'Presentation',
            8:'Profreading',
         },
      }
   },
   methods:{
      deleteData(index){
         this.$emit('detelefun',index)
      },
      addData(index,type){
         console.log('addandedit',index,type)
         this.$emit('addandedit',index,type)
      }
   },
}
</script>
<style lang="scss" scoped>
.section-wrap{
   margin-top: 16px;
   h3{
      margin: 0 0 10px 0;
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #2C2D2F;
      line-height: 16px;
      span{
         display: block;
         float: right;
         color: #4979FF;
         img{
            display: block;
            margin-right: 8px;
            float: left;
            width: 16px;
            height: 16px;
         }
      }
   }
   .content-box{
      padding: 10px;
      background: #F9FBFF;
      border-radius: 2px;
      border: 1px solid #F3F5FC;
      overflow: hidden;
      margin-bottom: 16px;
      overflow: hidden;
      .text-show{
         float: left;
         width: 60%;
         p{
            margin: 0;
            height: 14px;
            font-size: 14px;
            font-weight: 500;
            color: #2C2D2F;
            line-height: 14px;
            &:nth-of-type(2){
               margin-top: 8px;
               font-size: 12px;
               height: 12px;
               font-weight: 400;
               color: #48494C;
            }
         }
      }
     .icon-box{
         float: left; 
         width: 40%;
         text-align: right;
         img{
            display: inline-block;
            margin-left: 8px;
            width: 16px;
            height: 16px;
         }
     }

   }
}
</style>