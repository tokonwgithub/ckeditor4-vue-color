<template>
  <div class="order-content">
    <copyTemp @savefiles="savefiles" :types="2" @clearfiles="clearfiles"/>
    <el-form ref="uploads" :rules="rules" :model="orderForm" label-width="140px" label-position="top" size="mini">
      <el-form-item
        :label="formitem.groupName"
        :rules="{required:formitem.required?true:false,message:'请上传'+ formitem.groupName,trigger:'change'}"
        v-for="(formitem,index) in formlistArr"
        :key="index"
      >
        <uploadfile :urlarr.sync="allFile" :id="formitem.id" :required="formitem.required"  :sectionOrderStatus="sectionstatus"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  
import copyTemp from "./copyorder";
import uploadfile from "../order/conponment/uploadfile";
import { getWyFileType } from "@/api/orderwy";
import { mapState } from "vuex";
export default {
  props: ["data","ordertype",'allFile','sectionstatus'],
  data() {
    return {
      checked: true,
      orderForm:{},
      types:'',
      rules: {},
      formlistArr: [],
      hasnodescStatus:false,
    };
  },
  components: {
    uploadfile,
    copyTemp
  },
  computed: {
    ...mapState({
        childorderList: (e) => e.order_user.childorderlist,
    }),
  },
  watch:{
    allFile:function(val){
      this.formjudge()
    }
  },
  created() {
    this.types = this.ordertype;
    this.getgroupList();
  },
  methods: {
    async getgroupList() {
      let data = {
        page: 1,
        limit: 100,
      };
      const { status, body } = await getWyFileType(data);
      if (status == 200) {
        let { list } = body;
        let index = list.findIndex(item=>item.groupName == 'requirement')
        list[index].required = true;
        this.formlistArr = list;
      }
    },
    savefiles(filese){
      this.$emit('changeFiles',filese)
    },
    clearfiles(){
      this.$emit('changeFiles')
    },
    formjudge(){
      let status = false,
      allStatus = false;
      if(this.allFile&&this.allFile.length){
        let filesLoadAll = 0;
        this.allFile&&this.allFile.forEach(item => {
          console.log(item,'item')
          if(item.percentage == 100){
            filesLoadAll += 1;
          }
          let obj = this.formlistArr.find(item=>item.groupName == 'requirement');
          if((Number(this.ordertype) == 1 || Number(this.ordertype) == 11) && !this.sectionstatus){//
            if(item.result&&item.result.length && this.childorderList&&this.childorderList.length){
              status = true; 
            }
          }else{
            if(obj){
              if(item.groupId == obj.id && item.description){
                status = true;
              }
            }
          }
          if(filesLoadAll == this.allFile.length  && status){
            allStatus = true;
          }else{
            allStatus = false;
          }
        });

      }
      console.log(allStatus,'allStatus')
      return allStatus;
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