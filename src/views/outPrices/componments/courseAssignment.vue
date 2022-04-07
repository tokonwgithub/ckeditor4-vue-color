<template>
<div class="content-wrap" v-loading="loading">
   <h4>请完善该课程作业结构  </h4>
   <el-form :model="ruleForm" :rules="rules" ref="form" class="form-padding"  label-position="left" label-width="132px">
      <el-row :class="isMobileStatus?'mobile-show':''" v-for="(item,index) in ruleForm.structs" :key='index'  :gutter="10" v-if="item.deleteFlag == 0">
         <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
            <el-form-item label=" " :rules="[{required: true,message:'请输入作业名'}]" :prop="'structs.' + index +'.assignmentName'" class="name-show">
               <el-input class="w-160" v-model="ruleForm.structs[index].assignmentName"/>
            </el-form-item>
         </el-col>
         <el-col :xs="22" :sm="22" :md="11" :lg="11" :xl="11">
             <el-form-item label="Official Deadline" :rules="[{required: true,message:'请选择Official Deadline'}]" :prop="'structs.' + index +'.officialDeadline'" class="switch">
               <el-date-picker
                  v-model="ruleForm.structs[index].officialDeadline"
                  type="datetime"
                  class="w-160"
                  ref="timesearch"
                  @hook:mounted="closeReadOnly"
                  @visible-change="closeReadOnly"
                  format="yyyy年MM月dd HH:mm"
                  value-format="yyyy/MM/dd HH:mm"
                  placeholder="选择日期"
                  default-time="23:59:59" >
               </el-date-picker>
            </el-form-item>
         </el-col>
         <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" class="bule-color">
             <i class="el-icon-remove" style="font-size: 20px;" @click="deleteItem(index)"></i>
         </el-col>
      </el-row>
      <el-row>
         <i class="el-icon-circle-plus bule-color" style="font-size: 34px;" @click="addItem"></i>
      </el-row>
    </el-form>
    
</div> 
</template>
<script>
   import { Base64 } from 'js-base64';
   import {saveNewOfferStruct,queryUpdateData} from '@/api/outPrices'
   export default {
     data() {
       return {
         ruleForm: {
            newOfferId:'',
            structs:[],
         },
         rules: {
           courseCode: {
             required: true,
             message: "请输入courseCode",
             trigger: "blur",
           },
           
         },
         loading: false,
         defaultData:{},
       }
     },
     computed: {
      isMobileStatus:function(){
         const { body } = document;
         const WIDTH = 1300;
         const RATIO = 3;
         const rect = body.getBoundingClientRect();
         return rect.width - RATIO < WIDTH;
      }
     },
     created() {
      if(this.$route.query.bdata){
        let bdata = decodeURIComponent(this.$route.query.bdata) 
        const defaultDatas = Base64.decode(bdata);
        this.defaultData = JSON.parse(defaultDatas); 
       }else{
        this.defaultData = {
          id:this.$route.query.id
        }
       }
        this.queryUpdateData()
     },
     mounted(){

      },
     methods: {
      closeReadOnly (val) {
         this.$nextTick(() => {
            if (!val) {
               console.log(this.$refs.timesearch)
               this.$refs.timesearch.forEach((item,index)=>{
                  const input = this.$refs.timesearch[index].$el.querySelector('.el-input__inner')
                  const timer = setTimeout(() => {
                     input.removeAttribute('readonly')
                     clearTimeout(timer)
                  }, 200)
               })
               
            }
         })
      },
      addItem(){
         this.ruleForm.structs.push(JSON.parse(JSON.stringify({assignmentName:'',officialDeadline:'',id:'',deleteFlag:0})))
      },
      deleteItem(index){
         if(this.ruleForm.structs[index].id){
            this.$set(this.ruleForm.structs[index],'deleteFlag',1)
         }else{
            this.ruleForm.structs.splice(index,1)
         }
        
      },
      //获取报价详情
      async queryUpdateData(){
        if(!this.defaultData.id) return
        this.loading = true;
        let datas = {
          newOfferId:this.defaultData.id,
          structId:'',
        }
        let res = await queryUpdateData(datas)
        this.loading = false;
         if (res.status == 200) {
            this.ruleForm.newOfferId =  this.defaultData.id;
            console.log(res.body)
            let {structs} =  res.body;
            structs.length&&structs.forEach(item=>{
               if(item.officialDeadline){
                  item.officialDeadline = item.officialDeadline.split('-').join('/') 
               }
            })
            this.$set(this.ruleForm,'structs',structs ?structs: [])
            this.$forceUpdate()
         }else{
           this.$notify.error(res.body.msg)
         }
      },
      async confirm(type) {
         let numbers = 0 
         this.ruleForm.structs.forEach(item=>{
            if(item.deleteFlag == 0){
               numbers ++;
            }
         })
         if(!numbers){
            return  this.$notify.warning("作业结构不可为空！")
         }
         this.$refs.form.validate(async (valid) => {
            if (valid) {
            await this.saveNewOfferStruct(type)
            }
         })
      },
     //保存作业结构
      async saveNewOfferStruct(type){
         this.loading = true;
         let datas = JSON.parse(JSON.stringify(this.ruleForm))
         datas.structs.forEach(item => {
            item.officialDeadline =  item.officialDeadline.split('/').join('-')
         });
         console.log(datas)
         let res = await saveNewOfferStruct(datas)
         this.loading = false;
         if(res.status == 200){
            this.$emit('changeStep',type)
         }else{
            this.$message({
               message:res.body.msg,
               type: "warning",
            });
         }
      }
     },
     
   }
   </script>
   
   <style scoped >
      .w-160{
         width: 100%;
      }
      .inline-b{
         display: inline-block;
      }
      /deep/.name-show .el-form-item__label{
         width: 10px!important;
      }
      /deep/.name-show .el-form-item__content{
         margin-left: 20px!important;
      }
      .bule-color{
         color: #4979ff;
      }
      .mobile-show{
         padding-top: 16px;
         border-radius: 10px;
         border: 1px dotted #4979ff;
         margin-bottom: 16px;
      }
      .form-padding{
         padding: 0 6px;
      }
   </style>