<template>
   <div class="forms-wrap" v-loading="loading">
     <template v-if="!rejectMsgStatus">
      <h4>申请 <i class="el-icon-close"></i></h4>
      <div class="content-wrap">
        <el-form :model="ruleForm" :rules="rules" ref="forms"  label-position="top" label-width="120px">
          <el-form-item
          label="国家(Country)"
          prop="sellerSubmitCountryId"
        >
          <el-select
            v-model="ruleForm.sellerSubmitCountryId"
            :placeholder="$t('courseCode.addDialog.CountryPlaceholder')"
            class="w-300"
            v-loading="selectladingC"
            :disabled="defaultStatus"
            @change="changeCountry"
            filterable
            v-if="!isMobileStatus"
          >
            <el-option
            style="width: 350px;"
              v-for="(item, index) in countryList"
              :label="item.enName?`${item.name}(${item.enName})`:`${item.name}`"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
          <el-input @focus="showpops('chooseCountry')" v-else v-model="ruleForm.sellerSubmitCountryIdName" :disabled="defaultStatus" />
        </el-form-item>
        <el-form-item
          label="学校(School)"
          prop="sellerSubmitUniversityId"
        >
          <el-select
            v-model="ruleForm.sellerSubmitUniversityId"
            :placeholder="$t('courseCode.addDialog.SChoolPlaceholder')"
            class="w-300"
            v-loading="selectladingU"
            :disabled="!ruleForm.sellerSubmitCountryId || defaultStatus"
            filterable
            v-if="!isMobileStatus"
          >
            <el-option
            class="select-option"
              v-for="(item, index) in universityList"
              :label="item.enName?`${item.name}(${item.enName})`:`${item.name}`"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
          
          <el-input :disabled="!ruleForm.sellerSubmitCountryId || defaultStatus" @focus="showpops('chooseSchool')" v-else v-model="ruleForm.sellerSubmitUniversityIdName" />
        </el-form-item>
        <el-form-item
          label="作业交付或考试开始时间（Real Deadline）"
          prop="realDeadline"
        >
          <el-date-picker
              v-model="ruleForm.realDeadline"
              type="datetime"
              class="w-300"
              ref="timesearch"
              @change="judgetime"
              @hook:mounted="closeReadOnly"
              :editable="false"
              @focus="closeReadOnly"
              @click="closeReadOnly"
              @visible-change="closeReadOnly"
              format="yyyy年MM月dd HH:mm"
              :picker-options="pickerOption"
              value-format="yyyy/MM/dd HH:mm"
              placeholder="选择日期"
              default-time="23:59:59" >
          </el-date-picker>
          </el-form-item>
        
          <el-form-item label="课程号(Course Code)" prop="courseCodeIsOpen" class="switch">
             <el-switch v-model="ruleForm.courseCodeIsOpen"  inactive-color="#ff0000" @change="clearValues":active-value="1" :inactive-value="0" >
             </el-switch>
          </el-form-item>
          <el-form-item
             prop="courseCode"
             v-if="ruleForm.courseCodeIsOpen"
          >
             <el-input
             v-model.trim="ruleForm.courseCode"
             class="w-300"
             :disabled="!ruleForm.sellerSubmitCountryId && !ruleForm.sellerSubmitUniversityId"
             :placeholder="$t('courseCode.addDialog.CourseCodePlaceholder')"
                @input="changeValue($event)"
                @blur="checkCodeAssignment"
             ></el-input>
          </el-form-item>
          <!-- <div class="memo"  v-if="ruleForm.courseCodeIsOpen">只能输入英文字母及数字</div> -->
          <div class="show-tips" v-if="showtipsText">{{showtipsText}}</div>
          <el-form-item prop="structId" v-if="workList.length" label="作业名称 (Assignment Name)" class="other-style" >
            <el-select v-model="ruleForm.structId" placeholder="请选择" size="small" style="width:100%"   @change="changeNext">
              <el-option
                v-for="item in workList"
                :key="item.id"
                :label="item.assignmentName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <p class="show-tips" v-if="workstatus">{{workstatus == 1?'匹配成功，点击“发起申请”获取报价结果':'未获取到该作业报价结果，请选择本次报价产品类型'}}</p>
          <template v-if="showProduct">
           <el-form-item prop="productType" label="产品类型（Product Category）" class="other-style" >
             <el-select v-model="ruleForm.productType" placeholder="请选择" size="small" style="width:100%"  :disabled="editproductType" >
               <el-option
                 v-for="item in productCategory"
                 :key="item.productType"
                 :label="item.name"
                 v-if="(!ruleForm.courseCodeIsOpen && item.productType != 999) || ruleForm.courseCodeIsOpen"
                 :value="item.productType">
               </el-option>
             </el-select>
           </el-form-item>
          
           <template v-if="[693].includes(Number(ruleForm.productType))">
            <!-- v-if="[3].includes(Number(ruleForm.productType))" -->
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
           <el-form-item label="字数要求（Word Count）"  v-if="[692,6911].includes(Number(ruleForm.productType)) || ruleForm.examType == 2" prop="wordCount"  class="other-style">
            <el-input style="width:100%" type="number"  @keypress.native="disableInputSymbol" v-model="ruleForm.wordCount" size="small" />
          </el-form-item>
           <template v-if="[6911].includes(Number(ruleForm.productType))">
             <el-form-item  prop="topicName" class="other-style" label="论文题目（Topic）（目前未定题请输入“待定”）">
                <el-input size="small"  v-model="ruleForm.topicName" />
              </el-form-item>
              <el-form-item  prop="dissertationSpec" class="other-style" label="客户专业方向（Specialization）">
                <el-select
                v-model="ruleForm.dissertationSpec"
                :placeholder="$t('courseCode.addDialog.SpecializationPlaceholder')"
                class="w-300"
                filterable
                v-loading="selectladingS"
                v-if="!isMobileStatus"
                @change="changeProfession"
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
           <template v-if="[694].includes(Number(ruleForm.productType))">
             <el-form-item label="PPT页数（PPT Pages）"  prop="pptPageCount"  class="other-style">
                <el-input style="width:100%" type="number"  @keypress.native="disableInputSymbol" v-model="ruleForm.pptPageCount" size="small" >
                 <template slot="append"> 页（Number）</template>
               </el-input>
              </el-form-item>
              <el-form-item label="演讲稿和报告总字数（Word Count）" prop="wordCount"  class="other-style">
                <el-input style="width:100%" type="number"  @keypress.native="disableInputSymbol" v-model="ruleForm.wordCount" size="small" />
              </el-form-item>
           </template>
           <el-form-item label="报价备注信息（Note）" prop="sellerNote" v-if="ruleForm.productType"  class="other-style">
             <el-input style="width:100%" type="textarea" v-model="ruleForm.sellerNote" size="small" />
           </el-form-item>
          </template>
        </el-form>
      </div>
     
       <div class="footers">
         <el-button type="primary" style="display: block;margin: 10px auto;" class="w-300" @click="applyNewOffer">发起申请</el-button>
         <el-button type="info" style="display: block;margin: 10px auto;" plain  @click="closeWindow" class="w-300">取消申请</el-button>
       </div>
     </template>
      <template v-else>
        该作业报价由于公司供应资源原因已驳回，原因如下：
        <p class="show-tips-content">{{rejectMsg}}</p>
        
      </template>
      <chooseCountry ref="chooseCountry" :type="true"/>
      <chooseSchool ref="chooseSchool" :type="true"/>
      <chooseMajor ref="chooseMajor" :type="true"/>
   </div>
   </template>
   <script>
     import chooseMajor from '@/views/vantTemp/chooseMajor'
     import chooseCountry from '@/views/vantTemp/chooseCountry'
     import chooseSchool from '@/views/vantTemp/chooseSchool'
     import { Base64 } from 'js-base64';
     import { disableInputSymbol } from '@/utils/handleTimes'
     import {checkCodeAssignment,applyNewOffer,sellerUpdate,sellerGetById} from '@/api/outPrices'
      import {productCategory,examTypeArr,defficultLevel} from '@/utils/Enum/outprices'
      import {
        getCountryList,
        getUniversityList,
        getProfessionalListcourse,
      } from "@/api/common.js"
      export default {
        props: {},
        data() {
          var validateMinute = (rule, value, callback) => {
            if (value>59) {
              callback(new Error('只能填写小于60的分钟数！'));
            } else {
              callback();
            }
          };
          return {
            defficultLevel,
            productCategory,
            examTypeArr,
            ruleForm: {
               sellerSubmitCountryId:'',
               courseCodeIsOpen:1,
            },
            rejectMsg:'',
            rejectMsgStatus:false,
            loading:false,
            countryList: [], //国家列表
            universityList: [], //学校列表
            professionalList: [], //专业列表
            specialtyList: [], //擅长学科
            rules: {
              courseCode: {
                required: true,
                message: "请输入courseCode",
                trigger: "blur",
              },
              professionalId: {
                required: true,
                message: "选择specialization",
                trigger: "change",
              },
              realDeadline: {
                required: true,
                message: "请选择作业交付或考试开始时间（Real Deadline）",
                trigger: "change",
              },
              topicName:{
                required: true,
                message: "请输入论文题目（Topic）",
                trigger: "blur",
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
              pptPageCount:{
                required: true,
                message: "请输入PPT页数（PPT Pages）",
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
                trigger: "blur",
                validator: validateMinute, 
              },
              weeklyQzQuestionCount:{
                required: true,
                message: "请输入选择题数目（MCQs）",
                trigger: "blur",
              },
              dissertationSpec:{
                required: true,
                message: "请选择客户专业方向（Specialization）",
                trigger: "change",
              },
              sellerSubmitCountryId: {
                required: true,
                message: "请选择country",
                trigger: "change",
              },
              sellerSubmitUniversityId: {
                required: true,
                message: "请选择school",
                trigger: "change",
              },
              remark: {
                required: true,
                message: "请选择memo",
                trigger: "change",
              },
            },
            selectladingC:false,
            selectladingU:false,
            selectladingS:false,
            isCodeRecordStatus:false,
            workList:[],
            defaultStatus:false,
            query: {
              limit: 10000,
              page: 1,
            },
            editproductType:false,
            workstatus:false,
            defaultData:{},
            loading: false,
             pickerOption:{
              disabledDate: (time) => {
                return time.getTime() < Date.now() - 8.64e7;
              },
            },
          }
        },
        components:{
          chooseMajor,
          chooseCountry,
          chooseSchool
        },
        computed: {
          showtipsText:function(){
            if(!this.ruleForm.courseCodeIsOpen){
              return '提示：课程号已关闭，请选择需要报价的产品类型'
            }else{
              if(this.isCodeRecordStatus == 1){
                return '未获取到该课程号报价记录，请选择本次报价产品类型'
              }
              if(this.isCodeRecordStatus == 2){
                return '该课程号已存在报价记录，请选择具体作业名称'
              }
              return '' 
            }
            return ''
          },
         
          showProduct:function(){
            if(!this.ruleForm.courseCodeIsOpen || this.isCodeRecordStatus == 1 || this.ruleForm.structId == 'none'){//关闭课程号,没有作业报价,有作业以上均不符合
              return true
            }
            let objs = this.workList.find(item=>item.id == this.ruleForm.structId);
            if(objs&&!objs.sellerNewOfferId){//1以上类型都不是展示产品类型选择不为空就代表匹配成功2该作业没有报价过
              return true
            }
            return false
          },
          isMobileStatus:function(){
            const { body } = document;
            const WIDTH = 1100;
            const RATIO = 3;
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH;
          }
        },
        async created() {
          
          if(this.$route.query.bdata){
            let bdata = decodeURIComponent(this.$route.query.bdata) 
            const defaultDatas = Base64.decode(bdata);
            this.defaultData = JSON.parse(defaultDatas);  
          } else{
            this.defaultData = {
              id:this.$route.query.id
            }
          }
          if(!this.defaultData.id){
            this.loading = true;
          }
          console.log(this.defaultData,'00000url数据')
          await this.getCountryList();
          await this.getProfessionalList()
          await this.sellerGetById()//修改报价查询回填
          await this.getUniversityList()
          await this.getStudentMessage()
          await this.setData()
        },
        methods: {
          disableInputSymbol,
          closeReadOnly (val) {
            this.$nextTick(() => {
              if (!val) {
                const input = this.$refs.timesearch.$el.querySelector('.el-input__inner')
                const timer = setTimeout(() => {
                    input.removeAttribute('readonly')
                    clearTimeout(timer)
                }, 200)
              }
            })
          },
          showpops(name){
            this.$refs[name].open()
          },
          setData(){
            if(this.isMobileStatus){
              if(this.ruleForm.sellerSubmitCountryId){
                let obj = this.countryList.find(item=>item.id == this.ruleForm.sellerSubmitCountryId)
                this.$set(this.ruleForm, 'sellerSubmitCountryIdName', obj.enName?`${obj.name}(${obj.enName})`:`${obj.name}`)
              }
              if(this.ruleForm.sellerSubmitUniversityId){
                let obj1 = this.universityList.find(item=>item.id == this.ruleForm.sellerSubmitUniversityId)
                this.$set(this.ruleForm, 'sellerSubmitUniversityIdName', obj1.enName?`${obj1.name}(${obj1.enName})`:`${obj1.name}`)
              }
              if(this.ruleForm.dissertationSpec){
                let obj = this.professionalList.find(item=>item.id == this.ruleForm.dissertationSpec)
                this.$set(this.ruleForm, 'dissertationSpecName', obj.professionalEnName?`${obj.professionalName}(${obj.professionalEnName})`:`${obj.professionalName}`)
              }
            }
           
          },
          async getStudentMessage(){
            if(this.defaultData.id){
              this.defaultStatus = true;
            }
            if(this.defaultData.studWxUserId) {
              this.ruleForm.studWxUserId = this.defaultData.studWxUserId;
              this.ruleForm.sellerSubmitCountryId = this.defaultData.countryId
              this.ruleForm.sellerSubmitUniversityId = this.defaultData.universityId
              await this.getUniversityList()
              this.defaultStatus = true
            }
            this.loading = false;
          },//如果是从企微侧边栏发起的，回显已经录入的国家和学校信息，置灰不可修改
          //获取code详情
          changeProfession() {
            this.$set(this.ruleForm, "specialtyId", "")
            
          },
          async getProfessionalList() {
            this.selectladingS = true;
            let res = await getProfessionalListcourse({ ...this.query,key:'Research Project Dissertation' })
            this.selectladingS = false;
            if (res.status == 200) {
              this.professionalList = res.body.list || []
            }
          },
          clearValues(type){
            const {realDeadline,sellerSubmitCountryId,sellerSubmitCountryIdName,sellerSubmitUniversityId,sellerSubmitUniversityIdName,courseCodeIsOpen,courseCode,structId,productType,id} = this.ruleForm;
            this.ruleForm =type? {
                realDeadline,
                sellerSubmitCountryId,
                sellerSubmitCountryIdName,
                sellerSubmitUniversityId,
                sellerSubmitUniversityIdName,
                courseCodeIsOpen,
                courseCode,
                structId,
                productType,
                id
              }: {
              realDeadline,
              sellerSubmitCountryId,
              sellerSubmitUniversityId,
              sellerSubmitCountryIdName,
              sellerSubmitUniversityIdName,
              courseCodeIsOpen,
              id
            }
            if(!courseCodeIsOpen){
              this.workList = []
              this.isCodeRecordStatus = false;
              this.workstatus = false;
            }
           
          },
          changeCountry() {
            this.$set(this.ruleForm, "sellerSubmitUniversityId", "")
            this.$set(this.ruleForm, "sellerSubmitUniversityIdName", "")
            this.getUniversityList()
          },
          //获取国家
          async getCountryList() {
            this.selectladingC = true;
            let res = await getCountryList({ ...this.query })
            this.selectladingC = false;
            if (res.status == 200) {
              this.countryList = res.body.list || []
              
            }
          },
          //获取学校
          async getUniversityList() {
            if(!this.ruleForm.sellerSubmitCountryId) return;
            this.selectladingU = true;
            let res = await getUniversityList(this.ruleForm.sellerSubmitCountryId)
            this.selectladingU = false;
            if (res.status == 200) {
              this.universityList = res.body || [];
            }
          },
          //确定
          confirm() {
            this.$refs.form.validate((valid) => {
              if (valid) {
                this.addCourseCode()
              }
            })
          },
          //修改报价获取字段回填
          async sellerGetById(){
            console.log(this.defaultData.id)
            if(!this.defaultData.id) return;
            let datas = {id:this.defaultData.id}
            this.loading = true
            const {status,body} = await sellerGetById(datas);
            this.loading = false
            if(status == 200){
              body.structId = body.structId == null?'none':''
              body.productType = body.productType?Number(body.productType):'';
              body.realDeadline = body.realDeadline.split('-').join('/')
              body.sellerSubmitUniversityId =  body.sellerSubmitUniversityId?Number(body.sellerSubmitUniversityId):'';
              this.editproductType = body.productType?true:false
              this.ruleForm = body;
              this.getStudentMessage()
              if(this.ruleForm.courseCode){
                this.checkCodeAssignment()
              }
            }
          },
          async applyNewOffer(){//发起报价
            this.rejectMsgStatus = false;
            this.$refs.forms.validate(async(valid) => {
              if (valid) {
                if(this.rejectMsg){
                  this.rejectMsgStatus = true;
                  return;
                }
                this.loading = true;
                console.log(this.ruleForm,'ruleForm')
                this.ruleForm.studWxUserId = this.defaultData.studWxUserId;
                let datas = JSON.parse(JSON.stringify(this.ruleForm));
                datas.realDeadline = datas.realDeadline.split('/').join('-')
                datas.structId = datas.structId == 'none'?null:datas.structId;
                console.log(datas,'datas')
                const {status,body} = await (this.defaultData.id?sellerUpdate:applyNewOffer)(datas)
                this.loading = false;
                if(status != 200) {
                  return this.$notify.warning(body.msg||'接口异常报错')
                };
                this.$message({
                     message: "申请成功",
                     type: "success",
                  });
                let thats = this;
                setTimeout(function(){
                  if(body.code == 200){
                    thats.$router.push({path:'/outPrices/result',query:{uuid:body.uuid}})
                  }else{
                    thats.closeWindow()
                  }
                },200)
               
                console.log(body)
              }
            });
          },
          changeNext(val){//判断选择作业是哪一种
            this.rejectMsg = '';
            let objs = this.workList.find(item=>item.id == val);
            console.log(objs)
            if(objs && objs.sellerNewOfferStatused == 3){
              this.rejectMsg =  objs.rejectMsg;
            }
            if(objs && objs.isPackageClass == 1){//包课
              this.ruleForm.productType = 999
            }
            this.workstatus = 1;
            if((objs&&!objs.sellerNewOfferId) || val == 'none'){//1以上类型都不是展示产品类型选择不为空就代表匹配成功2该作业没有报价过
              this.workstatus = 2;
            }
            this.clearValues(true)
          },
          async checkCodeAssignment(){//验证coursecode
            if(!this.ruleForm.courseCodeIsOpen) return;
            const {sellerSubmitCountryId,courseCode,sellerSubmitUniversityId} = this.ruleForm;
            
            let datas = {
              countryId:sellerSubmitCountryId,
              universityId:sellerSubmitUniversityId,
              courseCode
            }
            this.isCodeRecordStatus = false;
            const{status,body} = await checkCodeAssignment(datas)
            if(status == 200){
              this.workList = []
              if(body == null){//没有匹配的
                this.isCodeRecordStatus = 1;
              }else{
                this.isCodeRecordStatus = 2;
                this.workList = [...body,{assignmentName:'以上作业均不符合',id:'none'}];
              }
            } 
            
            console.log(body)
          },
          changeValue(val){
            this.$set(this.ruleForm,'courseCode',val.replace(/[^A-Za-z0-9]/g,''))//只能输英文字母及数字
          },
          judgetime(val){
            let times = new Date(val);
            if(times.getTime()<= Date.now()){
              this.$notify.warning("时间不能小于当前时间")
              this.ruleForm.realDeadline = ''
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
        },
      }
      </script>
      <style>

      </style>
      <style scoped >
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
         .forms-wrap h4{
            font-weight: normal;
            margin: 0 0 16px 0;
            line-height: 36px;
            border-bottom: 1px solid #ccc;
         }
         .forms-wrap h4 i{
            float: right;
         }
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
      .show-tips-content{
        padding: 12px;
        margin: 16px 0 0;
        color: red;
        background: #F0F0F0;
        border-radius: 4px;
      }
      .font-red{
        margin: 4px 0;
        color: red;
      }
      .other-input{
        width:150px!important;
      }
      .error-box{
        line-height: 25px;
        margin-bottom: 20px;
        }
          .memo{
           color: red;
           font-size: 10px;
           margin-bottom:10px;
           margin-top:-10px;
        }
        .show-tips{
            font-size: 12px;
            margin: 0;
            color: #638bfb;
            line-height: 20px;
         }
         .w-300{
            width: 100%;
         }
         .switch{
            margin-bottom: 0px !important;
         }
      /deep/.switch .el-form-item__content{
         display: inline-block !important;
         margin-left: 16px !important;
      }
      /deep/.switch .el-switch{
         margin-top: -10px;
      }
      .content-wrap{
        height: calc(100% - 140px);
        overflow-y: auto;
        overflow-x: hidden;
      }
      .footers{
         padding: 0 16px;
         left: 0;
         right: 0;
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