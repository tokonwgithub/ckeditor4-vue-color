<template>
   <div class="forms-wrap" >
      <template v-if="noContentText">
         <p>
            {{noContentText}}
         </p>
      </template>
      <template v-else>
         <template  v-if="active != stepArr.length">
            <el-steps :active="active" class="step-show" align-center>
               <el-step :space="30" icon="el-icon-circle-check" :title="step.name" v-for="(step,indexs) in stepArr" :key="indexs"></el-step>
            </el-steps>
            <div class="forms-content">
               <coursecodes ref="coursecodes" v-show="stepArr[active].name == '维护课程号'" @changTap="changTap" @changeStep="changeStep" @noContent="noContentFun"/>
               <courseAssignment ref="courseAssignments" v-if="stepArr[active].name == '录入课程作业结构'" @changeStep="changeStep"/>
               <jobquotation  ref="jobquotations" @changeStep="changeStep" v-if="stepArr[active].name == '作业报价'" @noresult="noresultFun" />
               
            </div>
         </template>
         <result v-if="active == stepArr.length && hasresultStatus" />
         <div class="footer-box">
            <el-button type="text" :disabled="!(active>0)" class="btn-show" @click="changeStep('-')"><i class="el-icon-arrow-left"></i>上一步</el-button>
            <el-button type="text"   class="btn-show"  @click="changeStepFun('+')">{{(active == stepArr.length&&hasresultStatus) || (!hasresultStatus && active == (stepArr.length - 1))?'完成报价':'下一步'}}<i class="el-icon-arrow-right"></i></el-button>
         </div>
      </template>
     
   </div>
</template>
<script>
   import { Base64 } from 'js-base64';
   import coursecodes from './componments/coursecode.vue'
   import courseAssignment from './componments/courseAssignment.vue'
   import jobquotation from './componments/jobquotation.vue'
   import result from './componments/result.vue'
   export default {
      data(){
         return {
            active:0,
            stepArr:[{name:'维护课程号',refs:'coursecodes'},{name:'作业报价',refs:'jobquotations'}],
            allForm:{},
            defaultData:{},
            hasresultStatus:true,
            noContentText:null,
         }
      },
      components:{
         coursecodes,
         courseAssignment,
         jobquotation,
         result
      },
      created(){
         let bdata = decodeURIComponent(this.$route.query.bdata) 
         const defaultDatas = Base64.decode(bdata);
         this.defaultData = JSON.parse(defaultDatas);  
         console.log(this.defaultData)
      },
      methods:{
         noContentFun(val){
            this.noContentText = val
         },
         changeStepFun(type){
            if(this.active == (this.stepArr.length )){
               return this.changeStep(type)
            } 
            console.log(this.stepArr[this.active])
            this.$refs[this.stepArr[this.active].refs].confirm(type)
         },
         changeStep(type){
            if(type == '-'){
               if(this.active == 0) return false;
               
               this.active --;
            }else{
               //添加关闭报价处理
               if((this.active == this.stepArr.length&&this.hasresultStatus) || (!this.hasresultStatus && this.active == (this.stepArr.length - 1))) {
                  this.closeWindow()
                  return false
               };
               this.active ++;
            }
         },
         closeWindow() {
            var userAgent = navigator.userAgent;
            if (
              userAgent.indexOf("Firefox") !== -1 ||
              userAgent.indexOf("Chrome") !== -1
            ) {
              window.location.href = "about:blank";
              window.close();
            } else {
              window.opener = null;
              window.open("", "_self");
              window.close();
            }
            window.parent.postMessage({msg: 'cancel' }, '*');
          },
         changTap(val){
            this.stepArr = val?[{name:'维护课程号',refs:'coursecodes'},{name:'录入课程作业结构',refs:'courseAssignments'},{name:'作业报价',refs:'jobquotations'}]:[{name:'维护课程号',refs:'coursecodes'},{name:'作业报价',refs:'jobquotations'}]
         },
         noresultFun(val){
            this.hasresultStatus = val;
         },
      }
   }
</script>
<style  scoped>
   /deep/.el-step__icon-inner{
      font-size: 18px!important;
   }
  /deep/.el-step__title{
      font-size: 12px!important;
   }
.forms-wrap{
   position: relative;
   padding: 10px;
    margin: 10px;
    overflow: hidden;
    height: calc(100% - 20px);
    box-sizing: border-box;
    background: #fff;
    border-radius: 2px;
}
.content-wrap{
   height: 100%;
   overflow-x: hidden;
   overflow-y: auto;
}
.forms-content{
   height: calc(100% - 100px);
}
.footer-box{
   position:absolute;
   display: flex;
   align-items: center;
   align-content: center;
   flex-direction: row;
   justify-content: space-between;
   height: 40px;
   bottom: 0;
   right: 0;
   left: 0;
   background: #fff;
   z-index: 100;
}
.btn-show{
   font-size: 14px;
}
</style>