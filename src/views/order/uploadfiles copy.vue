<template>
  <div class="order-content">
    <copyTemp @savefiles="savefiles" :types="1" @clearfiles="clearfiles" style="margin-top: 10px;"/>
    <el-form ref="uploads" :rules="rules" :model="orderForm" label-width="200px" size="mini">
      <h3>订单附件</h3>
      <el-form-item
        :label="formitem.groupName"
        :rules="{required:formitem.required?true:false,message:'请上传'+ formitem.groupName,trigger:'change'}"
        v-for="(formitem,index) in formlistArr"
        :key="index"
      >
        <uploadfile :urlarr.sync="formitem.url" :id="formitem.id"  :position="true"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import copyTemp from "@/views/orderWenya/copyorder";
import uploadfile from "./conponment/uploadfile";
import { getgroupList } from "@/api/order";
export default {
  props: ["data","ordertype",'orderforms'],
  data() {
    return {
      checked: true,
      types:'',
      orderForm: {},
      rules: {},
      formlistArr: [],
      hasnodescStatus:false,
    };
  },
  components: {
    uploadfile,
    copyTemp
  },
  created() {
    this.types = this.ordertype;
    this.getgroupList();
  },
  methods: {
    savefiles(filese){
      filese.forEach(item=>{
        this.formlistArr.forEach(list=>{
          if(list.id == item.groupId){
            console.log(list.url)
            list.url.push(item)
          }
        })
      })
      console.log(this.formlistArr)
      this.$forceUpdate()
    },
    clearfiles(){
      this.data = [];
    },
    async getgroupList() {
      let data = {
        page: 1,
        limit: 100,
      };
      const sysCode = "db";
      const { status, body } = await getgroupList({ sysCode, data });
      if (status == 200) {
        let { list } = body;
        // if( list.length){
        //   this.handRequired(list);
        // }
        list.length &&
        list.forEach((item) => {
          if(this.types == 68){
            if(item.groupName == 'Unit Guide(Syllabus)'){
              item.required = true;
            }
          }else{
            if(item.groupName == 'Requirement'){
              item.required = true;
            }
          }
          if( this.type == 32 && item.groupName == 'Past Paper'){
            item.required = true;
          }
          item.url = [];
          if (this.data.length){
            this.data.forEach(list=>{
                if(list.groupId == item.id){
                  item.url.push(list)
                }
            })
          }
          
        });
        this.formlistArr = list;     }
    },
    handRequired(list){
			
      list.forEach((item) => {
        switch(this.types + 0){
          case 0://定制辅导
          if(item.groupName == 'Lecture note' || item.groupName == 'Student Completed Work'){
            item.required = true;
          }
          break;
          case 1://考前突击
            if(item.groupName == 'Lecture note' ){
              item.required = true;
            }
            if(this.orderforms.studSpecialOrderExam && this.orderforms.studSpecialOrderExam.isUploadPpastPaperFile && item.groupName == 'Past Paper' ){
              item.required = true;
            }
          break;
          case 65://论文大礼包
          break;
          case 66://特殊订单
          //   { id: "1", name: "资料整理" },Student Completed Work
          // { id: "2", name: "Appeal Letter" },Student Completed Work
          // { id: "4", name: "作业订单" }, 
          // { id: "8", name: "论文批改" },Student Completed Work
          // { id: "16", name: "Proofreading" },Student Completed Work
          // { id: "32", name: "Past-paper" },Lecture note/Past Paper
          // { id: "64", name: "论文修改" },Student Completed Work
          // { id: "128", name: "考试订单" },
            if(this.orderforms.studSpecialOrderExt && (this.orderforms.studSpecialOrderExt.type == 1 || this.orderforms.studSpecialOrderExt.type == 2 || this.orderforms.studSpecialOrderExt.type == 8 || this.orderforms.studSpecialOrderExt.type == 16 || this.orderforms.studSpecialOrderExt.type == 64) && item.groupName == 'Student Completed Work'){
               item.required = true;
            }
            if(this.orderforms.studSpecialOrderExt && (this.orderforms.studSpecialOrderExt.type == 32) && (item.groupName == 'Lecture note' || item.groupName == 'Past Paper') ){
              item.required = true;
            }
          break;
          case 68://论文大礼包
            if(item.groupName == 'Unit Guide(Syllabus)'){
              item.required = true;
            }
          break;
        }
        if(item.groupName == 'Requirement' && this.type != 68){
          item.required = true;
        }
      })
    },
    addFileData(){
      let arrs = [];
      this.formlistArr.forEach((item) => {
        arrs = arrs.concat(item.url);
      })
      this.$emit("update:data", arrs);
    },
    formjudge() {
      let status = false,
      statuscounter1 = 0,
      statuscounter2 = 0,
      arrs = [];
      this.hasnodescStatus = false;
      this.formlistArr.forEach((item) => {
         arrs = arrs.concat(item.url);
         if (item.url.length) {
            
            if(this.type != 32){
              if(this.types == 68){
                if(item.groupName  == 'Unit Guide(Syllabus)'){
                  return status = true
                }
              }else{
                if(item.groupName  == 'Requirement'){
                  return status = true
                }
              }
               
            }else{
               if(item.groupName  == 'Past Paper' ){
                  statuscounter1 = 1;
               }
               if(item.groupName  == 'Requirement'){
                  statuscounter2 = 1;
               }
               if((statuscounter1 + statuscounter2) == 2){
                  return status = true
               }
            }
            
         }
         
      });
        console.log(arrs,'arrs')
        //  this.$emit("update:data", arrs);
         this.$emit("changeList", arrs);
         if (!status) {
            let msgerror = '';
            if(this.types == 68){
              msgerror = "请上传Unit Guide(Syllabus)文件";
            }else{
              msgerror = "请上传"+ (this.type == 32 ? 'Requirement/Past Paper':'Requirement')+"文件";
            }
            this.$message({
               message: msgerror,
               type: "error",
            });
         }
         let hasuploading = false;
         arrs.forEach(item=>{
          if(!item.description){
            this.hasnodescStatus = true;
          }
          console.log(item.percentage)
          if(item.percentage != 100){
              return hasuploading = true;
            }
        })
        if(hasuploading){
          status = false;
          this.$message({
            message: '还有文件未上传成功',
            type: "error",
          });
        }
        if(this.hasnodescStatus){
          status = false;
          this.$message({
            message: '请检查上传文件组，有未填写文件描述',
            type: "error",
          });
        }
        return status;
      },
   },
};
</script>
<style lang="scss" scoped>
.order-content {
  h3 {
    padding: 16px 0;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(44, 45, 47, 1);
  }
  .switch-style {
    float: right !important;
  }
  .bottom-tabbar {
    margin: 0 10px;
    height: 60px;
    width: calc(100% - 20px);
    border-radius: 0 0 4px 4px;
    flex-direction: row;
    justify-content: space-between;
    span {
      display: block;
      color: #48494c;
      font-size: 14px;
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
  .order-textarea {
    width: 100%;
    height: 56px;
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
}
</style>