<template>
   <el-row>
      <el-button @click="copeDaliog">从其他订单复制文件<el-tooltip effect="dark" content="通过单号搜索到一个订单后,可以一键复制该订单的所有文件" placement="bottom"><i class="el-icon-question icon-styles" ></i></el-tooltip></el-button>
      <el-button type="text" style="float: right;" @click="clearfiles" class="red-colors" >清空文件</el-button>
      <el-dialog  :visible.sync="showCopy" :append-to-body="true" width="300px" title="复制文件" :close-on-click-modal="false">
         <el-form ref="ordercopy" :rules="rules" :model="ordercopy" label-width="140px" label-position="top" v-loading="loadings">
           <el-form-item label="单号" prop="order">
             <el-select v-model="ordercopy.order" placeholder="请选择" clearable filterable remote :remote-method="queryCourseListByOrderNo"  @change="handeFun" style="width: 100%;" >
               <el-option :label="order.orderNo" :value="order.id" v-for="(order,indexcs) in orderList" :key="indexcs"></el-option>
            </el-select>
           </el-form-item>
           <el-form-item v-if="ordercopy.order && types != 1">
             <span slot="label"> <el-checkbox v-model="ordercopy.allchecked" @change="checkedAll">请选择需要复制的文件类型</el-checkbox></span>
             <span  class="check-wrap" v-for="item in checklist" :key="item.id"  >
              <el-checkbox @change="checkedOne($event,item.id)"v-model="item.checked" :value="item.id" :disabled="item.disabled">
              </el-checkbox> <el-tooltip v-if="item.disabled" effect="dark" content="该订单没有此类型的文件" placement="bottom"><span>{{item.groupName}}</span></el-tooltip>
              <span v-else>{{item.groupName}}</span>
             </span>
            
           </el-form-item>
           <el-row class="mar-top-10">
             <el-button @click="savefiles" type="primary">确认</el-button>
             <el-button @click="closecopeDaliog">取消</el-button>
           </el-row>
         </el-form>
       </el-dialog>
    </el-row>
 </template>
 <script>
   import {toTrim} from '@/utils/handleTimes'
   import { getWyFileType } from "@/api/orderwy";
 import{getgroupList,queryCourseListByOrderNo,queryCreateOrderCourseware,queryCreateOrderCoursewareV2} from "@/api/order";
 export default {
   props: ['types'],
   data() {
     return {
       ordercopy:{
         order:'',
         allchecked:false,
       },
       alldatas:[],
       loadings:false,
       rules: {
         order:[{ required: true, message: "请输入订单号", trigger: "change" }]
       },
       orderList:[],
       showCopy:false,
       checklist:[],
       filesArr:[],
       canchecklen:0,
     };
   },
   watch:{

   },
   created() {
    this.getgroupList()
   },
   methods: {
     copeDaliog(){
       this.showCopy = true;
       this.checklist = [];
       this.allchecked = false;
       this.ordercopy = {
         order:'',
         allchecked:false,
       }
       this.$refs['ordercopy']&&this.$refs['ordercopy'].resetFields()
       this.getgroupList()
     },
     closecopeDaliog(){
       this.showCopy = false;
       this.checklist = [];
       this.allchecked = false;
       this.ordercopy = {
         order:'',
         allchecked:false,
       }
       this.$refs['ordercopy']&&this.$refs['ordercopy'].resetFields()
     },
     handeFun(){
       if(this.types == 1){
        this.queryCreateOrderCourseware()
       }else{
        this.queryCreateOrderCoursewareV2();
       }
     },
     getfileFun(){},
     async getgroupList() {
       this.canchecklen = 0;
      let data = {
        page: 1,
        limit: 100,
      };
      const sysCode = "db";
      let datas = null
      if(this.types ==1){
        datas ={ sysCode, data }
      }else{
        datas = data
      }
      const { status, body } = await (this.types !=1? getWyFileType:getgroupList)(datas);
      if (status == 200) {
        let { list } = body;
        list.forEach(li=>{
          li.checked = false;
          li.disabled = false;
        })
        this.checklist = list; 
      }
    },
     async queryCourseListByOrderNo(e) {
        this.orderList = [];  
       
       let data = {
         orderNo: toTrim(e),
         type: this.types,
       };
       if(!toTrim(e)) return;
       this.loadings = true;
       const { status, body } = await queryCourseListByOrderNo(data);
       this.loadings = false;
       if (status == 200) {
         console.log(body)
         this.orderList = body;
       }
     },
     async queryCreateOrderCourseware() {
      this.loadings = true;
       let data = {
         courseId:this.ordercopy.order,
       };
       const { status, body } = await queryCreateOrderCourseware(data);
       this.loadings = false;
       if (status == 200) {
         console.log(body)
          this.filesArr = body;
       }
     },
     async queryCreateOrderCoursewareV2() {
      this.canchecklen = 0;
      this.loadings = true;
       let data = {
         courseId:this.ordercopy.order,
       };
       const { status, body } = await queryCreateOrderCoursewareV2(data);
       this.loadings = false;
       if (status == 200) {
         console.log(body,'body')
         this.checklist.forEach((item,ins)=>{
          console.log(item.id)
          this.$set(this.checklist[ins],'disabled',true)
          let indexs = body.findIndex(list=>list.groupId == item.id)
          if(indexs >= 0){
            if(body[indexs].studCoursewares&& body[indexs].studCoursewares.length){
              this.canchecklen ++;
              this.$set(this.checklist[ins],'studCoursewares',body[indexs].studCoursewares)
              this.$set(this.checklist[ins],'disabled',false)
            }
          }
          
         })
          this.ordercopy.allchecked = true;
          this.checkedAll(this.ordercopy.allchecked)
          console.log(this.checklist,'studCoursewares')
       }
     },
     checkedAll(val){
      this.alldatas = [];
      this.checklist.forEach(item=>{
        if(!item.disabled){
          if(val){
            item.checked = true;
            this.alldatas.push(item.id)
          }else{
            item.checked = false;
          }
        }
       })
     },
     checkedOne(val,id){
      if(val){
            this.alldatas.push(id)
         }else{
            let indexs = this.alldatas.findIndex(item =>item == id);
            this.alldatas.splice(indexs,1);
         }
         this.ordercopy.allchecked = false;
         console.log(this.canchecklen,this.alldatas)
         if(this.alldatas.length ==  this.canchecklen){
          this.ordercopy.allchecked = true;
         }
     },
     savefiles(){
      this.$refs['ordercopy'].validate((valid) => {
          if (valid) {
            let datas = [];
            if(this.types == 1){
              datas = JSON.parse(JSON.stringify(this.filesArr));
            }else{
              this.checklist.forEach(item=>{
                if(item.checked){
                  datas = datas.concat(item.studCoursewares)
                }
              })
            }
            datas.forEach(item => {
            item.percentage = 100
            });
            if(!datas.length){
            return this.$message({
                  message: '必须要选一个文件类型才能继续进行复制文件！',
                  type: "error",
                });
            }
            console.log(datas)
            this.$emit('savefiles',datas)
            this.closecopeDaliog()
          } 
        })
      
        
     },
     clearfiles(){
      this.$emit('clearfiles')
     },
   },
 };
 </script>
 <style scoped>
 /deep/.el-form-item--mini.el-form-item, 
 /deep/.el-form-item--small.el-form-item{
   margin-bottom: 10px;
 }
 </style>
 <style lang="scss" scoped>
.red-colors{
  color: #f00;
  text-decoration: underline;
}
.icon-styles{
  font-size: 14px;
  margin-left: 8px;
}
.check-wrap{
  display: block;
}
.mar-top-10{
  margin-top: 20px;
}
 </style>