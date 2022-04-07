<template>
 <div class="order-contents">
    
    <h3 class="tiles"><van-icon name="arrow-left" size="16" color="#ccc" style="margin-right:8px" />Add Section</h3>
    <el-form
    class="sectionForm-style"
        ref="sectionForm"
        :model="sectionForm"
        :rules="rules"
        label-width="80px"
        size="mini"
        label-position="top"
    >
       
        <el-form-item label="Section Name" prop="type" class="other-style" >
          <el-radio-group v-model="sectionForm.type"  >
              <el-radio :label="0">Default</el-radio>
              <el-radio :label="1">Custom</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="section" class="other-style" >
          <el-input  v-model="sectionForm.section" v-if="sectionForm.type == 1"/>
          <el-select v-model="sectionForm.section" v-else placeholder="请选择"  style="width:100%">
            <el-option
              v-for="item in sectionArr"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        
        </el-form-item>
        <el-form-item label="Real Deadline" prop="realDeadLine" class="other-style" >
          <el-input v-model="sectionForm.realDeadLine"  />
        </el-form-item>
        <el-form-item label="Deadline" prop="deadLine" class="other-style" >
          <el-input  v-model="sectionForm.deadLine"/>
        </el-form-item>
        <el-form-item label="Word Count" prop="wordsNum" class="other-style" >
          <el-input v-model="sectionForm.wordsNum"/>
        </el-form-item>
        <el-form-item label="Unusual Quote" prop="theSpecialOffer" class="other-style" >
          <el-switch  v-model="sectionForm.theSpecialOffer" @change="getEmpListByRoleType"/>
        </el-form-item>
        <el-form-item label="Quoter" prop="specialOfferUser" class="other-style" v-if="sectionForm.theSpecialOffer">
          <el-select v-model="sectionForm.specialOfferUser" filterable placeholder="请选择报价人" style="width:100%" size="small" v-loading="userloading">
              <el-option style="width:350px" :label="user.nickName" :value="user.userId" v-for="(user,indexs) in userList" :key="indexs"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="WorkLoad" prop="workLoad" class="other-style" >
          <el-input v-model="sectionForm.workLoad"/>
        </el-form-item>
        <el-form-item label="Individual Client Message" prop="ICMtypes" class="other-style" >
          <el-switch v-model="sectionForm.ICMtypes" />
        </el-form-item>
        <el-form-item prop="description" class="other-style" v-if="sectionForm.ICMtypes">
          <el-input v-model="sectionForm.description" />
        </el-form-item>
    </el-form>
    <div class="bottom-bar-wrap">
      <span @click="btnFun('back')">Back</span>
      <span @click="btnFun('add')" class="save">Save</span>
    </div>
 </div>
</template>
<script>
import taps from './tap'
import {getEmpListByRoleType} from '@/api/orderwy'
export default {
  props: ['objdata'],
  data() {
    return {
      bottomtapArr:[{name:"返回"},{name:"Section Info"},{name:"Section Financial Info"},{name:"save"},],
      bottomtapIndex:1,
      sectionForm:{
        type:0
      },
      userList:[],
      sectionArr:['Week 1','Week 2','Week 3','Week 4','Week 5',],
      userloading:false,
      editStatus:false,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      rules: {
        studSpecialOrderExam:{
          examType: [
            { required: true, message: "请选择考试类型", trigger: "change" },
          ],
        }
      },
    };
  },
  components: {
    taps
  },
  computed:{
   
  },
  async created() {
    if(this.objdata){
      this.sectionForm = this.objdata
    }
  },
  methods: {
    changeTap(step,index){
      console.log(step.name,index,this.bottomtapIndex)
      this.bottomtapIndex = index;
    },
    // 特殊报价人
    async getEmpListByRoleType(){
      if(!this.sectionForm.theSpecialOffer) return;
      this.userloading = true;
      const {status , body} = await getEmpListByRoleType({role_type:2});
      this.userloading = false;
      if(status == 200){
        this.userList = body;
      }
    },
    btnFun(type){
      this.$emit("clickfun",type,this.sectionForm)
    },
  },
};
</script>
<style>
.other-style .el-form-item__label {
  padding: 0;
  color: #8c8c8c;
}
</style>
<style lang="scss" scoped>
.order-contents {
    height: calc(100% - 120px);
    background: #fff;
    z-index: 9999;
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
  .order-textinput{
    height: 56px;
  }
  .order-textarea {
    width: 100%;
    height: 56px;
    border-radius: 4px;
    padding: 6px 10px;
    border: 1px solid rgba(217, 217, 217, 1);
    &::placeholder{
      line-height: 20px;
      
      color: #C0C4CC;
    }
  }
}
.tiles{
  display: flex;
}
.bottom-bar-wrap{
  position: absolute;
  bottom: 26px;
  width: 100%;
  text-align: center;
  span{
    display: inline-block;
    width: 112px;
    height: 36px;
    border-radius: 2px;
    color: #4979FF;
    font-size: 14px;
    font-weight: 400;
    color: #4979FF;
    line-height: 36px;
    text-align: center;
    border: 1px solid #4979FF;
    &.save{
      color: #fff;
      margin-left: 16px;
      background: #4979FF;
    }
  }
}
.sectionForm-style{
  height: calc(100% - 100px);
  overflow-y: auto;
}
</style>