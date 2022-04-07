<template>
<div class="content-wrap" v-loading="loading">
  <div class="error-box" v-if="errflag">  
      <div><span style="color:red">{{$t('courseCode.errflag')}}</span>{{$t('courseCode.errordes1')}}</div>
      <div>{{$t('courseCode.content')}}
        <span v-if="errObj">{{`${errObj.courseCode}、${errObj.countryName}、${errObj.universityName}、${errObj.professionalName}、${errObj.specialtyName}`}}</span>
      </div>
      <div>{{$t('courseCode.errordes2')}}</div>
  </div>
   <el-form :model="ruleForm" :rules="rules" ref="form"  label-position="top" label-width="120px">
      <el-form-item label="Course Code" :rules="[{required: true}]" prop="courseCodeIsOpen" class="switch" v-if="switchStatus">
         <el-switch v-model="ruleForm.courseCodeIsOpen" inactive-color="#ff0000" :active-value="1" :inactive-value="0" @change="changeSwitchStatus">
         </el-switch>
     </el-form-item>
     <p class="show-tips" v-if="ruleForm.courseCodeIsOpen == 0">无Course Code的报价，请输入专业和学科以确定报价表难度等级</p>
     <template  v-if="ruleForm.courseCodeIsOpen == 1">
         <el-form-item
            prop="courseCode"
         >
         <span slot="label"v-if="!switchStatus">{{$t('courseCode.addDialog.CourseCode')}}</span>
            <el-input
            v-model.trim="ruleForm.courseCode"
            class="w-300"
            
            :placeholder="$t('courseCode.addDialog.CourseCodePlaceholder')"
              @input="changeValue($event)"
             
            ></el-input>
         </el-form-item>
         <div class="memo">只能输入英文字母及数字</div>
      </template>
     
      <el-form-item
        :label="$t('courseCode.addDialog.Specialization')"
        prop="professionalId"
      >
        <el-select
          v-model="ruleForm.professionalId"
          :placeholder="$t('courseCode.addDialog.SpecializationPlaceholder')"
          class="w-300"
          filterable
          v-if="!isMobileStatus"
          @change="changeProfession"
        >
          <el-option
            v-for="(item, index) in professionalList"
            :value="item.id"
            :key="index"
            class="select-option"
            :label="`${item.name}(${item.enName})`"
            :disabled="item.type != 2"
          >
          {{item.enName?`${item.name}(${item.enName})`:`${item.name}`}}
            <img
              class="small-img"
              src="@/assets/old.jpg"
              alt=""
              v-if="item.type != 2"
            />
          </el-option>
        </el-select>
        <el-input @focus="showpops('chooseMajor')" v-else v-model="ruleForm.dissertationSpecName" />
      </el-form-item>
    
      <el-form-item
        :label="$t('courseCode.addDialog.CourseName')"
        prop="specialtyId"
      >
        <el-select
          v-model="ruleForm.specialtyId"
          :placeholder="$t('courseCode.addDialog.CourseNamePlaceholder')"
          class="w-300"
          filterable
          v-if="!isMobileStatus"
        >
          <el-option
            class="select-option"
            v-for="(item, index) in specialtyList"
            :label="item.enName?`${item.name}(${item.enName})`:`${item.name}`"
            :value="item.id"
            :key="index"
          >
          </el-option>
        </el-select>
        <el-input @focus="showpops('chooseCourse')" v-else v-model="ruleForm.courseNameshow" />
      </el-form-item>
    <!-- 擅长学科拓展 -->
    <div v-if="ruleForm.courseCodeIsOpen == 1">
      <div v-if="extList.length" style="overflow:hidden;width:350px;">
         <div
           v-for="(extobj, indexe) in extList"
           :key="indexe"
           style="margin-bottom:10px"
         >
           <p class="checkbox-show">
             <!-- 针对擅长软件的勾选，系统做提示并要求勾选： -->
             <el-checkbox
               v-if="extobj.ext.prompt.select"
               v-model="extobj.ext.prompt.select"
               :label="true"
             ></el-checkbox
             ><span class="font-red" v-html="extobj.ext.prompt.explain">
             </span>
           </p>
           <div v-if="extobj.ext.options.length">
             <template v-if="extobj.ext.optionsType == 1">
               <el-radio
                 v-for="(check, index) in extobj.ext.options"
                 :key="index"
                 v-model="check.select"
                 :label="true"
                 style="position:relative;"
                 @change="showOhterInput(check, extobj, 1)"
               >
                 {{ check.name }}
                 <el-input
                   style="width:180px"
                   v-if="check.select == true && check.type == 2"
                   v-model="check.value"
                   :rows="1"
                   type="textarea"
                   class="other-input"
                   placeholder="请输入"
                 ></el-input>
               </el-radio>
             </template>
             <template v-else>
               <el-checkbox
                 v-for="(check, index) in extobj.ext.options"
                 :key="index"
                 v-model="check.select"
                 :label="true"
                 style="position:relative;"
                 @change="showOhterInput(check, extobj, 2)"
               >
                 {{ check.name }}
                 <el-input
                   v-if="check.select == true && check.type == 2"
                   v-model="check.value"
                   :rows="1"
                   type="textarea"
                   class="other-input"
                   placeholder="请输入"
                 ></el-input>
               </el-checkbox>
             </template>
           
           </div>
         </div>
      </div>
       <el-form-item
         :label="$t('courseCode.addDialog.Country')"
         prop="countryId"
       >
         <el-select
           v-model="ruleForm.countryId"
           :placeholder="$t('courseCode.addDialog.CountryPlaceholder')"
           class="w-300"
           @change="changeCountry"
           filterable
           v-if="!isMobileStatus"
         >
           <el-option
             v-for="(item, index) in countryList"
             class="select-option"
             :label="item.enName?`${item.name}(${item.enName})`:`${item.name}`"
             :value="item.id"
             :key="index"
           ></el-option>
         </el-select>
         <el-input @focus="showpops('chooseCountry')" v-else v-model="ruleForm.sellerSubmitCountryIdName" />
       </el-form-item>
       <el-form-item
         :label="$t('courseCode.addDialog.SChool')"
         prop="universityId"
       >
         <el-select
           v-model="ruleForm.universityId"
           :placeholder="$t('courseCode.addDialog.SChoolPlaceholder')"
           class="w-300"
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
         <el-input @focus="showpops('chooseSchool')" v-else v-model="ruleForm.sellerSubmitUniversityIdName" />
       </el-form-item>
    </div>
    </el-form>
    <chooseCountry ref="chooseCountry"/>
    <chooseSchool ref="chooseSchool"/>
    <chooseMajor ref="chooseMajor"/>
    <chooseCourse ref="chooseCourse"/>
</div>
</template>
<script>
   import chooseMajor from '@/views/vantTemp/chooseMajor'
   import chooseCourse from '@/views/vantTemp/chooseCourse'
   import chooseCountry from '@/views/vantTemp/chooseCountry'
   import chooseSchool from '@/views/vantTemp/chooseSchool'
   import { Base64 } from 'js-base64';
   import {
     getCountryList,
     getUniversityList,
     getProfessionalList,
     getSpecialtyClassList,
   } from "@/api/common.js"
   import {updateCourseCode,queryUpdateData,queryCourseCodeId,addCourseCode,editCourseCode} from '@/api/outPrices'
   export default {
     props: {
 
     },
     data() {
       return {
         ruleForm: {
            newOfferId:'',
            courseCodeIsOpen:'',
            courseCode:'',
            universityId:'',
            countryId:'',	
            professionalId:'',
            specialtyId:'',	
            professionalVos: []	
         },
         changeUcCourseCodeStatus:true,
         selectCloaidng:false,
         switchStatus:true,
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
           specialtyId: {
             required: true,
             message: "请选择courseName",
             trigger: "change",
           },
           countryId: {
             required: true,
             message: "请选择country",
             trigger: "change",
           },
           universityId: {
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
         query: {
           limit: 10000,
           page: 1,
         },
         loading: false,
          extList: [], //存储擅长学科的拓展项
          errflag:false,
          errObj:{},
          courseId:'',
          defaultData:{}
       }
     },
     components:{
        chooseMajor,
        chooseCountry,
        chooseSchool,
        chooseCourse
      },
     watch: {
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
     async created() {
       if(this.$route.query.bdata){
        let bdata = decodeURIComponent(this.$route.query.bdata) 
        const defaultDatas = Base64.decode(bdata);
        this.defaultData = JSON.parse(defaultDatas); 
       }else{
        this.defaultData = {
          id:this.$route.query.id
        }
       }
        
       await this.getCountryList();
       await this.getProfessionalList()
       await this.queryUpdateData()
       await this.setData()
       await this.$forceUpdate()
     },
     methods: {
      showpops(name){
        this.$refs[name].open()
      },
      changeSwitchStatus(){
        if(this.defaultcourseCodeIsOpen){
          this.switchStatus = false;
        }
        if(this.ruleForm.courseCodeIsOpen){
          // if(this.defaultcourseCodeIsOpen)
          this.$emit('changTap',true)
        }else{
          this.$emit('changTap',false)
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
          console.log(res.body)
          this.defaultcourseCodeIsOpen = res.body.courseCodeIsOpen;
          res.body.universityId = Number(res.body.universityId)
          this.ruleForm = JSON.parse(JSON.stringify(res.body));
          this.$forceUpdate()
          if(this.ruleForm.countryId){
            await this.getUniversityList()
          }
          if(this.ruleForm.professionalId){
            await this.getSpecialtyClassList()
            await this.showExt()
          }
          this.changeSwitchStatus()
         }else{
           this.$notify.error(res.body.msg)
           this.$emit('noContent',res.body.msg)
         }
      },
     
       //获取专业
       async getProfessionalList() {
         let res = await getProfessionalList({ ...this.query,type:2 })
         if (res.status == 200) {
           this.professionalList = res.body.list || []
         }
       },
       //获取擅长学科
       async getSpecialtyClassList() {
         this.initExt() //专业变化时处理拓展项
         let res = await getSpecialtyClassList({
           professionalIds: this.ruleForm.professionalId,
         })
         if (res.status == 200) {
           this.specialtyList = res.body || []
         }
       },
       changeProfession() {
         this.$set(this.ruleForm, "specialtyId", "")
         this.$set(this.ruleForm, "courseNameshow", "")
         this.getSpecialtyClassList()
       },
       changeCountry() {
         this.$set(this.ruleForm, "universityId", "")
         this.$set(this.ruleForm, "sellerSubmitUniversityIdName", "")
         this.getUniversityList()
       },
       //获取国家
       async getCountryList() {
         let res = await getCountryList({ ...this.query })
         if (res.status == 200) {
           this.countryList = res.body.list || []
         }
       },
       //获取学校
       async getUniversityList() {
         if(!this.ruleForm.countryId)return 
         let res = await getUniversityList(this.ruleForm.countryId)
         if (res.status == 200) {
           this.universityList = res.body || []
         }
       },
       async queryCourseCodeId(){
          let datas = {
            courseCode:this.ruleForm.courseCode,
            universityId:this.ruleForm.universityId
          }
          const {status,body} = await queryCourseCodeId(datas);
          if(status ==  200){
            this.courseId = body.id
          }
        
      },
      setData(){
        if(this.isMobileStatus){
          if(this.ruleForm.countryId){
            let obj = this.countryList.find(item=>item.id == this.ruleForm.countryId)
            this.$set(this.ruleForm, 'sellerSubmitCountryIdName', obj.enName?`${obj.name}(${obj.enName})`:`${obj.name}`)
          }
          if(this.ruleForm.professionalId){
            let obj = this.professionalList.find(item=>item.id == this.ruleForm.professionalId)
            this.$set(this.ruleForm, 'dissertationSpecName', obj.enName?`${obj.name}(${obj.enName})`:`${obj.name}`)
          }
          if(this.ruleForm.specialtyId){
            let obj1 = this.specialtyList.find(item=>item.id == this.ruleForm.specialtyId)
            this.$set(this.ruleForm, 'courseNameshow', obj1.enName?`${obj1.name}(${obj1.enName})`:`${obj1.name}`)
          }
          if(this.ruleForm.universityId){
            let obj1 = this.universityList.find(item=>item.id == this.ruleForm.universityId)
            this.$set(this.ruleForm, 'sellerSubmitUniversityIdName', obj1.enName?`${obj1.name}(${obj1.enName})`:`${obj1.name}`)
          }
          
        }
        
      },
      async changeUcCourseCode(){
          const {courseCode,universityId,countryId,professionalId,specialtyId,professionalVos} = this.ruleForm;
          let datas = {
            courseCode,
            universityId,
            countryId,
            professionalId,
            specialtyId,
            professionalVos,
            id:this.courseId
          }

          console.log(this.courseId,'this.courseId')
          const {status,body} = await (this.courseId?editCourseCode:addCourseCode)(datas);
          if(status == 200){
             if(body?.saveStatus==1){
              this.changeUcCourseCodeStatus = true;
           } else if(body?.saveStatus==2){
             this.errObj=body.courseCode||{}
              this.errflag=true
              this.changeUcCourseCodeStatus = false;
            }
          }
      },
       // 添加courseCode
       async updateCourseCode(type) {
        if(this.ruleForm.courseCodeIsOpen){
          if(this.extList.length){//有拓展项
           this.ruleForm.professionalVos =JSON.parse(JSON.stringify(this.extList))
            this.ruleForm.professionalVos[0].ext=JSON.stringify(this.ruleForm.professionalVos[0].ext)
         }else{//无
           this.ruleForm.professionalVos=[]
         }
         if(this.dealLink())return
          this.loading = true
          await this.queryCourseCodeId()
          await this.changeUcCourseCode();
          console.log(this.courseId)
          if(!this.changeUcCourseCodeStatus) return;
        }
         let res = await updateCourseCode(this.ruleForm)
         this.loading = false
         if (res.status == 200) {
            this.$emit('changeStep',type)
         }else{
           this.$notify.error(res.body.msg)
         }
       
       },
       //确定
       async confirm(type) {
         this.$refs.form.validate(async (valid) => {
           if (valid) {
              await this.updateCourseCode(type)
           }
         })
       },
       // 取消
       closeModal() {
         this.ruleForm = {}
         this.$refs.form.clearValidate()
         this.$refs.form.resetFields() //清除残余校验
         this.$emit("closeModal", "isAdd")
         this.loading = false
         this.extList=[]
         this.errflag=false,
          this.errObj={}
       },
         //获取当前专业下的拓展学科
       initExt() {
         let obj = this.professionalList.find(
           (v) => v.id == this.ruleForm.professionalId
         )
         // console.log('obj.ext',obj.ext)
         if (obj.ext) {
           obj.ext = this.isJSON(obj.ext)
             ? JSON.parse(obj.ext)
             : obj.ext
             ? obj.ext
             : null
           this.extList = [JSON.parse(JSON.stringify(obj))]
         } else {
           this.extList = []
           this.ruleForm.professionalVos=null
         }
       },
        isJSON(str) {
         if (typeof str == "string") {
           try {
             JSON.parse(str)
             return true
           } catch (e) {
             return false
           }
         } else {
           return false
         }
       },
       // 点击拓展学科的单选或多选框
       showOhterInput(check, extobj, flag) {
         //处理单选
         if (flag == 1) {
           let item = this.extList.find(
             (v) => v.id == extobj.id //当前操作的拓展项
           )
           item.ext &&
             item.ext.options.map((el) => {
               if (el.value != check.value) {
                 el.select = false
               }
             })
         }
       },
       //回显擅长学科
       showExt() {
         if(this.ruleForm.professionalVos?.length){
           this.extList =JSON.parse(JSON.stringify(this.ruleForm.professionalVos))
            this.extList[0].ext = JSON.parse(this.extList[0].ext)
         }
       },
       //处理擅长学科拓展项必传校验
       dealLink() {
         let flag
         let item = this.specialtyList.find((v) => v.id == this.ruleForm.specialtyId)
         if (
           item.extFlag == 1 &&
           this.ruleForm.professionalVos[0].ext.indexOf('"select":true') < 0
         ) {
           this.$notify.error("该擅长学科需要选择拓展项")
           flag = true
         }
         return flag
       },
      changeValue(val){
       // this.$set(this.ruleForm,'courseCode',val.replace(/\s+/g,""))
       this.$set(this.ruleForm,'courseCode',val.replace(/[^A-Za-z0-9]/g,''))//只能输英文字母及数字
      }
     },
   }
   </script>
   
   <style scoped >
   .small-img {
     height: 20px;
     width: auto;
     vertical-align: middle;
     display: inline-block;
   }
   .font-red{
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
        margin-top:-2px;
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
   </style>