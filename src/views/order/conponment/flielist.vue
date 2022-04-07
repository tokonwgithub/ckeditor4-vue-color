<template>
   <div v-if="urlarr.length>0"  >
      <div class="imgbox-show"  v-for="(files,index) in urlarr" :key="index" v-if="files.groupId == id">
         <p><span>{{files.name}}</span>({{files.size|conver}})<i class="el-icon-close"  style="float:right;margin-left:10px"   @click="deleteImg(files)" /></p>
         <div :class="!files.description && required?'red-tips-box':''" v-if="!nodesc">
            <input  class="upload-reason" :placeholder="userIsWy?'Please input file description.':'请填写文件描述'" v-model="files.description"/>
            <span class="red-tips" v-if="!files.description && required"> {{userIsWy?'Please input file description.':'请填写文件描述'}}</span>
         </div>
         <div class="progress-box">
            <el-progress :percentage="files.percentage" style="width:100%" status="success"></el-progress>
         </div>
         <div class="check-box" v-if="!nodesc && !sectionOrderStatus && childorderList.length">
            <p @click="showCheck(files,index)">文件分配<van-icon :name="!files.up?'arrow-up':'arrow-down'" size="10" style="margin-left:10px"/> </p>
            <div class="check-box-wrap" v-if="files.up && childorderList.length">
               <van-checkbox   shape="square"  icon-size="14px" v-model="files.allchecked"    @change="changeallchecked($event,index,files)" >全选</van-checkbox>
               <van-checkbox-group v-model="files.result"  :ref="'checkboxGroup' + index" @change="distribution($event,files,index)" >
                  <van-checkbox v-for="(list,indexc) in childorderList" :key="indexc" :name="indexc"  shape="square"  icon-size="14px" >{{typeObj[list.childType] || 'Dissertation' }}-{{list.section == 'Custom'?list.newSection :list.section}}</van-checkbox>
               </van-checkbox-group>
            </div>
            
         </div>
         
      </div>
   </div>
</template>
<script>
import { mapState } from "vuex";
export default {
   props:['urlarr',"nodesc",'id','sectionOrderStatus','required','userIsWy'],
   data(){
      return {
         typeObj:{
            2:'Writing materials',
            3:'Quizzes/Exams/Weekly tasks',
            4:'Presentation',
            8:'Profreading',
         },
         isIndeterminate: false, 
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
         this.urlarr.forEach(item=>{
            item.result = [];
            val.length && val.forEach((items,indexs)=>{
               item.result.push(indexs);
               console.log(item)
               item.allchecked = true;
            }) 
         })
      } 
   },
   filters:{
      conver(limit){  
         if(!limit) return '缺少文件大小';
         var size = "";  
         if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
               size = limit.toFixed(2) + "B";    
         }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
               size = (limit / 1024).toFixed(2) + "KB";              
         }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
               size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
         }else{ //其他转化成GB  
               size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
         }  
            
         var sizestr = size + "";   
         var len = sizestr.indexOf("\.");  
         var dec = sizestr.substr(len + 1, 2);  
         if(dec == "00"){//当小数点后为00时 去掉小数部分  
            return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
         }  
         return sizestr;  
      }
   },
   methods:{
      showCheck(files,index){
        console.log(files)
        this.urlarr[index].up = !this.urlarr[index].up;
        this.$forceUpdate()
      },
      deleteImg(obj){
         let objsindexs = this.urlarr.findIndex(item=>item.name == obj.name);
         this.urlarr.splice(objsindexs,1);
      },
      distribution(val,files,index){
         if(val.length){
            if(val.length == this.childorderList.length){
               this.urlarr[index].allchecked = true;
            }else{
               this.urlarr[index].allchecked = false;
            }
         }
        else{
            this.urlarr[index].allchecked = false;
         }
      },
      changeallchecked(val,index,files){
         this.urlarr[index].result = [];
         if(val){
               this.childorderList.length && this.childorderList.forEach((item,indexs)=>{
               this.urlarr[index].result.push(indexs);
            }) 
            console.log(this.urlarr[index].result)
         }else{
            this.urlarr[index].result = [];
         }
         this.$forceUpdate()
         
         // console.log(this.$refs['checkboxGroup' + index])
         // this.$refs['checkboxGroup' + index][0].toggleAll();
      },
   },
   
}

</script>
<style lang="scss" scoped>
.check-box{
   p{
      display: flex;
      align-items: center;
      margin: 10px 0;
      height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: #48494C;
      line-height: 12px;
   }
}
.check-box-wrap{
   padding: 10px;
   background: #F9FBFF;
   border-radius: 2px;
   border: 1px solid #F3F5FC;
   
}
.imgbox-show{
   min-width:300px;
   margin: 16px 0;
   padding: 10px 8px;
   border-radius:2px;
   border:1px solid rgba(217,217,217,1);
   .red-tips-box{
      position: relative;
      height: 40px;
      input{
         border-color: #E45434;
      }
   }
   .red-tips{
         position: absolute;
         bottom: -4px;
         font-size: 10px;
         color: #E45434;
         display: block;
         line-height: 14px;
   }
   &>p{
      margin: 0;
      font-size: 14px;
      line-height: 16px;
      span{
         display: block;
         float: left;
         line-height: 16px;
         max-width:70% ;
         line-height: 16px;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
      }
   }
   
}
</style>