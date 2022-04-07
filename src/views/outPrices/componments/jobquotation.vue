/*author:xulanlan time:2022-02-22  */
<template>
  <div class="order-content" v-loading="loading">
      <el-form
         ref="orderform"
         :model="ruleForm"
         :rules="rules"
         label-width="80px"
         size="mini"
         label-position="top"
      >
      <!-- grouporder订单展示 -->
      <el-form-item label="报价处理状态（Status）" prop="statused" class="other-style">
         <el-switch  v-model="ruleForm.statused"  inactive-color="#ff0000"   :active-value="2" :inactive-value="3" @change="changeStepshow"></el-switch> 
         {{ruleForm.statused == 2?'接受报价申请':'驳回报价申请'}}
       </el-form-item>
       <template v-if="ruleForm.statused == 2">
         <el-form-item prop="structId" label="作业名称" class="other-style" v-if="courseCodeIsOpen" >
            <el-select v-model="ruleForm.structId" placeholder="请选择" size="small" style="width:100%" @change='changeNext'>
              <el-option
                v-for="item in ruleForm.structsSelect"
                :key="item.id"
                v-if="item.deleteFlag == 0"
                :label="item.assignmentName"
                :value="item.id">
              </el-option>
            </el-select>
            <!-- 一开始有作业id,作业变动提示 -->
            <p class="show-tips" v-if="defaultStructId && defaultStructId != ruleForm.structId">当前所选作业名称和销售发起申请时选择的不一致，请注意确认</p>
            <!-- 作业有报价记录提示 -->
            <p class="show-tips" v-if="structIdnewOfferId">当前所选作业名称数据库已存在报价记录如下，修改并保存将更新数据库记录</p>
            <!-- 选了作业没有作业报价提示 -->
            <p class="show-tips" v-if="ruleForm.structId && !structIdnewOfferId && fristStatus">当前所选作业名称数据库不存在报价记录，请填写如下报价信息</p>
          </el-form-item>
          
         <el-form-item prop="productType" label="产品类型（Product Category）" class="other-style" >
             <el-select v-model="ruleForm.productType" placeholder="请选择" size="small" style="width:100%"  v-loading="productArrLoading" @change="clearValues" >
               <el-option
               v-for="item in productCategory"
               :key="item.productType"
               :label="item.name"
               v-if="(!isPackageClass && item.productType != 999) || isPackageClass"
               :value="item.productType">
               </el-option>
             </el-select>
           </el-form-item>
           <template v-if="[693].includes(Number(ruleForm.productType))">
            <el-form-item label="考试类型（Exam Type）" prop="examType" class="other-style">
               <el-select v-model="ruleForm.examType" placeholder="请选择" size="small" style="width:100%"  >
                  <el-option
                    v-for="item in examTypeArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="选择题数目（MCQs）"  v-if="ruleForm.examType == 3" prop="weeklyQzQuestionCount"  class="other-style">
              <el-input style="width:100%" type="number" v-model="ruleForm.weeklyQzQuestionCount" size="small" > <template slot="append"> 个（Number）</template></el-input>
            </el-form-item>
             <div class="flexs-box" v-if="ruleForm.examType == 1" >
              <!-- v-if="ruleForm.examType == 1" -->
                 <el-form-item label="考试持续时长(Duration)" style="margin-right: 10px;" prop="examHour"  >
                   <el-input v-model="ruleForm.examHour" type="number" @input="ruleForm.examHour = ruleForm.examHour.replace(/\D/g,'')"  @keypress.native="disableInputSymbol"> <template slot="append">小时（Hours）</template></el-input>
                 </el-form-item>
                 <el-form-item label="" class="no-labels" prop="examMinute"  >
                   <el-input v-model="ruleForm.examMinute" type="number" @input="ruleForm.examMinute = ruleForm.examMinute.replace(/\D/g,'')"   @keypress.native="disableInputSymbol"> <template slot="append">分钟（Mins）</template></el-input>
                 </el-form-item>
               </div>
          </template>
          <template v-if="[694].includes(Number(ruleForm.productType))">
            <el-form-item label=" PPT页数（PPT Pages）"  prop="pptPageCount"  class="other-style">
              <el-input style="width:100%" type="number" v-model="ruleForm.pptPageCount" size="small" >
               <template slot="append"> 页（Number）</template>
             </el-input>
            </el-form-item>
             <el-form-item label="演讲稿和报告总字数（Word Count）" prop="wordCount"  class="other-style">
               <el-input style="width:100%" type="number" v-model="ruleForm.wordCount" size="small" />
             </el-form-item>
          </template>
           
           <el-form-item label="字数要求（Word Count）"  v-if="[692,698,699,6911].includes(Number(ruleForm.productType)) || ruleForm.examType == 2" prop="wordCount"  class="other-style">
            <el-input style="width:100%" type="number" v-model="ruleForm.wordCount" size="small" />
          </el-form-item>
          <el-form-item label="报价备注信息（Note）" prop="sellerNote"  class="other-style">
            <el-input style="width:100%" type="textarea" disabled v-model="ruleForm.sellerNote" size="small" />
          </el-form-item>
          <template v-if="(ruleForm.productType != 693 || (ruleForm.productType == 693&&![1,3].includes(Number(ruleForm.examType)))) && !isPackageClass">
            <el-form-item label="额外工作量（Extra Workload）" prop="additionalType" class="other-style" >
              <el-select v-model="ruleForm.additionalType" placeholder="请选择" size="small" style="width:100%"  v-loading="productArrLoading"  v-if="![6911].includes(Number(ruleForm.productType))">
                 <el-option
                   v-for="item in extendsArr"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
            </el-form-item>
            <el-form-item  prop="additionalWorkload" class="other-style" >
              <el-input size="small" @keypress.native="disableInputSymbol" v-model="ruleForm.additionalWorkload"  style="width:100%" type="number" min="1"/>
            </el-form-item>
          </template>
          
          <template v-if="[6911].includes(Number(ruleForm.productType))">
            <el-form-item  prop="topicName" class="other-style" label="论文题目（Topic）（目前未定题请输入“待定”）">
               <el-input size="small" @keypress.native="disableInputSymbol" v-model="ruleForm.topicName" />
             </el-form-item>
             <el-form-item  prop="dissertationSpec" class="other-style" label="客户专业方向（Specialization）">
              <el-select
              v-model="ruleForm.dissertationSpec"
              :placeholder="$t('courseCode.addDialog.SpecializationPlaceholder')"
              style="width:100%"
              filterable
              v-if="!isMobileStatus"
            >
              <el-option
                v-for="(item, index) in professionalList"
                :value="item.id"
                :key="index"
                :label="`${item.professionalName}(${item.professionalEnName})`"
              >
              {{item.professionalEnName?`${item.professionalName}(${item.professionalEnName})`:`${item.professionalName}`}}
                <span
                  class="small-img"
                  v-if="item.difficultRate == 1"
                >{{defficultLevel[item.difficultRate]}}</span>
              </el-option>
            </el-select>
            <el-input  @focus="showpops('chooseMajor')" v-else v-model="ruleForm.dissertationSpecName" />
            </el-form-item>
          </template>
          <el-form-item label="专业谈资" prop="termMsg"   class="other-style">
            <el-input style="width:100%" type="textarea" v-model="ruleForm.termMsg" size="small" />
          </el-form-item>
          <template v-if='[999].includes(Number(ruleForm.productType))'>
            <h4>课程作业列表（Assignment List）</h4>
            <el-row  v-for="(item,index) in ruleForm.structs" style="margin-bottom: 4px;" :key='index'  :gutter="10">
              <el-col :xs="8" :sm="8" :md="11" :lg="11" :xl="11">
                <span class="assignmentName-shows">{{item.assignmentName}}</span>
              </el-col>
              <el-col :xs="16" :sm="16" :md="11" :lg="11" :xl="11">
                 <el-form-item label="总工作量" :rules="[{required: true,message:'请输入该作业的总工作量'}]" :prop="'structs.' + index +'.workload'" class="name-show">
                    <el-input class="w-160"  @keypress.native="disableInputSymbol" type="number" min="1" v-model="ruleForm.structs[index].workload" @blur="(e)=>{
                      editWorkload(e,index)
                    }"/>
                 </el-form-item>
              </el-col>
           </el-row>
          </template>
        
       </template>
       <el-form-item label="驳回原因" prop="rejectMsg"   class="other-style" v-else>
         <el-input style="width:100%" type="textarea" v-model="ruleForm.rejectMsg" size="small" />
       </el-form-item>
      </el-form>
      <chooseMajor ref="chooseMajor" :type="true"/>
  </div>
</template>
<script>
  import chooseMajor from '@/views/vantTemp/chooseMajor'
  import { Base64 } from 'js-base64';
  import {
        getProfessionalListcourse
      } from "@/api/common.js"
  import {productCategory,examTypeArr,defficultLevel} from '@/utils/Enum/outprices'
  import {queryUpdateData,reviewNewOffer} from '@/api/outPrices'
import {disableInputSymbol} from '@/utils/handleTimes'
export default {
  data() {
    var validateMinute = (rule, value, callback) => {
      if (value>59) {
        callback(new Error('只能填写小于60的分钟数！'));
      } else {
        callback();
      }
    };
    return {
      productCategory,
      examTypeArr,
      ruleForm:{
        
      },
      courseCodeIsOpen:null,
      // 图表 计算 代码 仿真模拟
      extendsArr:[
        {name:'图表',id:1},
        {name:'计算',id:2},
        {name:'代码',id:3},
        {name:'仿真模拟',id:4},
      ],
      professionalList:[],
      clickData:'',
      defaultStructId:'',
      defficultLevel,
      rules: {
        realDeadline: {
          required: true,
          message: "请选择作业交付或考试开始时间（Real Deadline）",
          trigger: "change",
        },
        structId: {
          required: true,
          message: "请选择作业",
          trigger: "change",
        },
        productType:{
          required: true,
          message: "请选择Product Category",
          trigger: "change",
          
        },
        wordCount:{
          required: true,
          message: "请输入字数",
          trigger: "blur",
        },
        rejectMsg:{
          required: true,
          message: "请输入驳回原因",
          trigger: "blur",
        },
        pptPageCount:{
          required: true,
          message: "请输入PPT页数（PPT Pages）",
          trigger: "blur",
        },
        termMsg:{
          required: true,
          message: "请输入专业谈资",
          trigger: "blur",
        },
        examType:{
          required: true,
          message: "请选择考试类型（Exam Type）",
          trigger: "change",
        },
        examHour:{
          required: true,
          message: "请输入考试持续时长(Duration)",
          trigger: "blur",
        },
        examMinute:{
          required: true,
          message: "请输入考试持续时长(Duration)",
          trigger: "blur",
          validator: validateMinute, 
        },
        weeklyQzQuestionCount:{
          required: true,
          message: "请输入选择题数目（MCQs）",
          trigger: "blur",
        },
        topicName:{
          required: true,
          message: "请输入选论文题目（Topic）",
          trigger: "blur",
        },
        dissertationSpec:{
          required: true,
          message: "请选择客户专业方向（Specialization）",
          trigger: "change",
        },
        remark: {
          required: true,
          message: "请选择memo",
          trigger: "change",
        },
      },
      structIdnewOfferId:'',
      fristStatus:false,
      // 编辑的时候展示子订单类型
      productArrLoading:false,
      loading:false,
      defaultData:{},
      isPackageClass:false,
    };
  },
  components: {
    chooseMajor,
  },
  computed:{
    isMobileStatus:function(){
      const { body } = document;
      const WIDTH = 1100;
      const RATIO = 3;
      const rect = body.getBoundingClientRect();
      return rect.width - RATIO < WIDTH;
    }
    
  },
  watch:{

  },
  async created(){
    if(this.$route.query.bdata){
      let bdata = decodeURIComponent(this.$route.query.bdata) 
      const defaultDatas = Base64.decode(bdata);
      this.defaultData = JSON.parse(defaultDatas); 
      }else{
      this.defaultData = {
        id:this.$route.query.id
      }
    }
    await this.queryUpdateData()
    await this.getProfessionalList()
  },
   mounted() {

  },
  methods: {
    disableInputSymbol,
    showpops(name){
      this.$refs[name].open()
    },
    //获取报价详情
    async queryUpdateData(val){
      if(!this.defaultData.id) return
      this.loading = true;
      let datas = {
        newOfferId:this.defaultData.id,
        structId:this.ruleForm.structId,
      }
      let res = await queryUpdateData(datas)
      this.loading = false;
      if (res.status == 200) {
        let resultObj = JSON.parse(JSON.stringify(res.body)) 
        if(!val){//初始化
          this.courseCodeIsOpen = resultObj.courseCodeIsOpen;
          resultObj.statused =  resultObj.statused<2? 2:resultObj.statused;
          this.ruleForm = resultObj;
          this.defaultStructId = resultObj.structs && resultObj.structs[0].id;
          this.ruleForm.structId = resultObj.structId?resultObj.structId: resultObj.structs && resultObj.structs[0].id;
          this.ruleForm.structId = Number( this.ruleForm.structId)
          this.ruleForm.productType = Number(this.ruleForm.productType)
          if(this.ruleForm.productType == 999){
            this.isPackageClass = true;
          }
          if(resultObj.statused == 3){
            this.changeStepshow()
          }
          this.ruleForm.dissertationSpec = Number(this.ruleForm.dissertationSpec)
          this.$forceUpdate()
        }else{//修改作业
          this.structIdnewOfferId = resultObj.newOfferId;
          const { statused,structsSelect,structId,sellerNote,productType,structs,courseCodeIsOpen} = this.ruleForm;
          // this.ruleForm = resultObj;
          this.ruleForm.courseCodeIsOpen = courseCodeIsOpen;
          this.ruleForm.statused = statused;
          this.ruleForm.structId = Number(structId);
          this.ruleForm.structsSelect = structsSelect;
          this.fristStatus = true;
          this.ruleForm.productType = productType == 999?productType :'';
          this.ruleForm.structs = productType == 999?structs : resultObj.structs;
          this.ruleForm.sellerNote = sellerNote
          this.ruleForm.dissertationSpec = Number(resultObj.dissertationSpec)
// 只要赋值的字段
          this.ruleForm.additionalType =  resultObj.additionalType;
          this.ruleForm.additionalWorkload =  resultObj.additionalWorkload
          this.ruleForm.examHour =  resultobj.examHour
          this.ruleForm.examMinute =  resultobj.examMinute
          this.ruleForm.examType =  resultobj.examType
          this.ruleForm.loginPhotoExamTime =  resultobj.loginPhotoExamTime
          this.ruleForm.pptPageCount =  resultobj.pptPageCount
          this.ruleForm.rejectMsg =  resultobj.rejectMsg
          this.ruleForm.termMsg =  resultobj.termMsg
          this.ruleForm.topicName =  resultobj.topicName
          this.ruleForm.weeklyQzQuestionCount =  resultobj.weeklyQzQuestionCount
          this.ruleForm.wordCount =  resultobj.wordCount

        }
      
      }else{
           this.$notify.error(res.body.msg)
         }
    },
    clearValues(){
      this.ruleForm.examType = ''
    },
    // 驳回报价申请的展示修改
    changeStepshow(val){
      this.$emit('noresult',this.ruleForm.statused == 2?true:false)
    },
    async getProfessionalList() {
      let res = await getProfessionalListcourse({ ...this.query,key:'Research Project Dissertation' })
      if (res.status == 200) {
        this.professionalList = res.body.list || []
        if(this.ruleForm.dissertationSpec){
          let obj = this.professionalList.find(item=>item.id == this.ruleForm.dissertationSpec)
          this.$set(this.ruleForm, 'dissertationSpecName', obj.professionalEnName?`${obj.professionalName}(${obj.professionalEnName})`:`${obj.professionalName}`)
        }
      }

    },
    editWorkload(e,index){
      this.$set(this.ruleForm.structs[index],'workload',e.target.value)
    },
    changeNext(val){//判断选择作业是哪一种
      let objs = this.ruleForm.structsSelect.find(item=>item.id == val);
      console.log(objs)
      this.isPackageClass = false;
      this.ruleForm.productType = ''
      if(objs && objs.isPackageClass == 1){//包课
        this.isPackageClass = true;
        this.ruleForm.productType = 999
      }
      this.queryUpdateData(val)
    },
    async confirm(type) {
      this.$refs.orderform.validate(async (valid) => {
        if (valid) {
          await this.reviewNewOffer(type)
        }
      })
    },
    async reviewNewOffer(type){
      this.loading = true;
      let res = await reviewNewOffer(this.ruleForm)
      this.loading = false;
      if (res.status == 200) {
        if(this.ruleForm.statused == 2){
          this.$emit('changeStep',type)
        }else{//关闭报价处理
          this.closeWindow()
        }
        
      }else{
        this.$message({
          message: res.body.msg,
          type: "warning",
        });
      }
    },
    closeWindow() {
      var userAgent = navigator.userAgent;
      console.log(userAgent)
      if (
        userAgent.indexOf("Firefox") !== -1 ||
        userAgent.indexOf("Chrome") !== -1
      ) {
        window.location.href = "about:blank";
        window.close();
      } else {
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
        window.history.back();
      }
      window.parent.postMessage({msg: 'cancel' }, '*');
    },
  },
};
</script>

<style >
.other-style .el-input input::-webkit-outer-spin-button,
.other-style .el-input input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
}
.other-style .el-input input[type="number"]{
    -moz-appearance: textfield;
}
</style>
<style scoped>

/deep/.el-radio__input.is-checked .el-radio__inner,
/deep/.el-switch.is-checked .el-switch__core{
    border-color: #4979FF;
    background: #4979FF;
}
/deep/.el-radio__input.is-checked+.el-radio__label{
  color: #4979FF;
}
/deep/.el-form-item--mini.el-form-item, 
/deep/.el-form-item--small.el-form-item{
  margin-bottom: 10px;
}
.other-style .el-form-item__label {
  padding: 0;
  color: #8c8c8c;
}
/deep/.client-message-input textarea{
  height: 162px;
  overflow: auto;
}


</style>
<style lang="scss" scoped>

.order-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
.needs-list {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  i {
    color: #409eff;
    font-size: 18px;
    padding-left: 10px;
  }
  .el-input {
    width: calc(100% - 90px);
    margin: 0 10px 0 5px;
  }
  .needNum {
    color: #8c8c8c;
    font-size: 14px;
    display: inline-block;
    width: 55px;
    margin-top: -28px;
  }
}
.add-wraps{
  position: fixed;
    top: 80px;
    left: 0;
    height: calc(100% - 120px);
    margin: 10px;
    padding: 10px;
    width: calc(100% - 20px);
    background: #fff;
    z-index: 9999;
}
.courseCode-style{
  margin: 10px 0 0;
  img{
    display: block;
    margin-right: 4px;
    float: left;
    width: 14px;
    height: 14px;
  }
  span{
    display: block;
    height: 14px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
   
  }
  
}
.examTypeRadio{
  width: 120px;
  margin: 5px 0;
}
.bluelink{
    margin: 16px 0;
    padding: 10px 8px;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    color: #638bfb;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 90%;
    margin-left: 10px;
    label{
      color: #8C8C8C;
    }
}
.name-show{
  display: flex;
}
.assignmentName-shows{
  font-size: 12px;
  color: #638bfb;
}
</style>
<style scoped>
  .small-img {
    height: 20px;
    line-height: 20px;
    padding: 0 4px;
    color: #fff;
    background: red;
    border-radius: 4px;
    font-size: 12px;
    width: auto;
    vertical-align: middle;
    display: inline-block;
  }
  .show-tips{
    font-size: 12px;
    margin: 0;
    color: #638bfb;
    line-height: 20px;
  }
/deep/.name-show .el-form-item__label{
  width: 120px;
}
/deep/.flexs-box .el-form-item{
        flex: 1;
      }
      /deep/.no-labels .el-form-item__content{
        margin-top: 40px;
      }
      .flexs-box{
        display: flex;
      }
      /deep/.flexs-box .el-input-group__append{
        padding: 0 4px;
      }
</style>