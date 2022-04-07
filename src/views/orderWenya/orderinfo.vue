/*author:xulanlan time:2021-03-31 edit:course code同步导毕自动化派单的东西 */
<template>
<!-- // 第二版本文亚类ing
        // 1.团体订单group order
        // 2.作业订单 writing materials
        // 3.考试订单 Quizzes/Exams/Weekly  tasks
        // 4.Presentation(演讲稿)
        // 5.revision
        // 8.Proofreading
        // 9.Edting
        // 11. Dissertation(大论文) -->
  <div class="order-content">
      <el-form
         ref="orderform"
         :model="orderForm"
         :rules="rules"
         label-width="80px"
         size="mini"
         label-position="top"
      >
      <!-- grouporder订单展示 -->
      <el-form-item prop="childType" label="Product Category" class="other-style" v-if="[1].includes(Number(ordertype))">
          <el-select v-model="orderForm.childType" placeholder="请选择" size="small" style="width:100%" @change="initDataGet(orderForm.childType)" :disabled="addchildstatus || orderForm.groupOrderList.length >0" v-loading="productArrLoading" >
            <el-option
              v-for="item in typeArrlistShow"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="type" label="Product Category" class="other-style" v-if="(defaultData.orderType && defaultData.courseId && ordertype != 11)" >
           <el-select v-model="orderForm.type" placeholder="请选择" size="small" style="width:100%" @change="initDataGet(orderForm.type)" v-loading="productArrLoading"  :disabled="ordereditstatus == 'edit'?false:true">
            <el-option
              v-for="item in typeArrlistShow"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <template  v-if="editStatus && addchildstatus">
          <el-form-item prop="section" label="Section Name" class="other-style" >
            <el-select v-model="orderForm.section" placeholder="请选择" size="small" style="width:100%">
              <el-option
                v-for="item in ((Number(ordertype) == 11 || (Number(ordertype) == 11&&this.sectionOrderStatus))?sectionArr9:sectionArr)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="newSection" label="Custom Section Name" class="other-style" v-if="orderForm.section == 'Custom'" >
            <el-input v-model="orderForm.newSection" placeholder="请选择"  style="width:100%" /> 
          </el-form-item>
        </template>
        <template v-if="!ordereditstatus">
          <el-form-item label="Order Mode" prop="channelStatus" class="other-style" v-if="([1,2,3,4,8,9].includes(Number(ordertype)) && !addchildstatus) || ([11].includes(Number(ordertype))  && !addchildstatus)">
            <el-radio-group v-model="orderForm.channelStatus" @change="clearsellerChannelId" :disabled="ordereditstatus == 'edit'" >
                <el-radio :label="0">Default</el-radio>
                <el-radio :label="1">Sales Channel</el-radio>
            </el-radio-group>
          </el-form-item>
           <!-- Sales Channel情况下展示 -->
          <el-form-item label="Sales Channel" prop="sellerChannelId" class="other-style" v-if="orderForm.channelStatus">
            <el-select  filterable v-model="orderForm.sellerChannelId" size="small" style="width:100%" v-loading="sellerLoading" :disabled="ordereditstatus == 'edit'" >
              <el-option v-for="(seller,index) in sellerList" :key="index" :value="seller.id" :label="seller.name+`${seller.internalChannelInformation?' ('+seller.internalChannelInformation+')': ''}`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="orderForm.channelStatus" label="渠道证明" prop="certificateFileList" class="other-style" >
            <uploadfile :urlarr="orderForm.certificateFileList"  :type="21" :nodesc="true" @refreshUrlArr="refreshUrlArr" />
          </el-form-item> 
        </template>
        
        <!-- Specific Feedback -->
        <el-form-item label="Specific Feedback" prop="edtingCVO.specificFeedback" class="other-style" v-if="[9].includes(Number(ordertype))">
          <el-switch  v-model="orderForm.edtingCVO.specificFeedback"  :active-value="1" :inactive-value="0" @change="changeRuleRequit"/>
        </el-form-item>
       <el-form-item class="red-flower"  v-if="([2,3,4,8,9].includes(Number(ordertype)) && !addchildstatus)||(editStatus && addchildstatus)">
        <span slot="label">
          是否使用小红花，小红花(余{{ demoRedFlowerNum }}朵)
        </span>
        <el-switch
          v-model="orderForm.hongHua"
          :active-value="1" 
          :inactive-value="0"
          :disabled="!demoRedFlowerNum ||ordereditstatus == 'edit'"
        >
        </el-switch>
      </el-form-item>
        <!-- 关联订单展示 -->
        <template>
          <el-form-item label="linked Order" prop="linkStatus" class="other-style" v-if="[2,3,4,8].includes(Number(ordertype))">
            <el-switch  v-model="orderForm.linkStatus" @change="getLinkorder"  :active-value="1" :inactive-value="0"/>
          </el-form-item>
          <el-form-item label="linkOrder" prop="linkOrder" class="other-style" v-if="orderForm.linkStatus == 1">
            <el-select v-model="orderForm.linkOrder" filterable  size="small" style="width:100%" v-loading="linkLoading">
              <el-option v-for="order in orderList" :key="order.courseId" :value="order.courseId" :label="order.orderNo"></el-option>
            </el-select>
          </el-form-item>
        </template>
      
        <!-- Course Code在整理模块 -->
        <template v-if="([1,2,3,4,8,9].includes(Number(ordertype))&&!addchildstatus)|| ([11].includes(Number(ordertype))  && !addchildstatus)">
          <el-form-item label="无Coursecode请关闭此按钮" prop="checkCourseCodeFlag" class="other-style" >
            <el-switch  v-model="orderForm.checkCourseCodeFlag" @change="clearcourseData" :active-value="1" :inactive-value="0"/>
          </el-form-item>
          <el-form-item  prop="courseCode" class="other-style" label="CourseCode" v-if="orderForm.checkCourseCodeFlag">
            <span slot="label" >CourseCode <span class="memo">(只能输入英文字母及数字)</span></span>
            <el-input  v-model.trim="orderForm.courseCode" @input="changeValue($event)" @blur="queryCourseCodeAndStudId"/>
            <p class="courseCode-style" v-if="(courseCodeLoading || orderForm.checkCourseCode > 0) && orderForm.checkCourseCodeFlag"><img :src="coursecodesrc[orderForm.checkCourseCode]" alt=""><span :class="'color'+orderForm.checkCourseCode">{{ coursecodetext[orderForm.checkCourseCode]}}
              <b v-if="orderForm.checkCourseCode == 1">“{{professionalName +'('+ professionalEnName +')'}}”</b></span></p>
          </el-form-item>
          <el-form-item label="Specialization" prop="professionalId" class="other-style" v-if="(orderForm.checkCourseCode == 2 && orderForm.courseCode && orderForm.checkCourseCodeFlag) || orderForm.checkCourseCodeFlag == 0" >
            <el-select v-model="orderForm.professionalId" style="width:100%" filterable @change="forceUpdate">
              <el-option v-for="(item,index) in professionalListArr" filterable :key="index" :value="item.id" :label="item.chineseName + '【'+ item.name+'】'" style="width:500px"></el-option>
            </el-select>
            <p class="courseCode-style" v-if="orderForm.checkCourseCode == 2 && orderForm.checkCourseCodeFlag"><span class="color21">新的course code 请选择specialization</span></p>
          </el-form-item> 
        </template>
          <!-- course code同步导毕自动化派单的东西 -->
        <el-form-item  label="Order Course Name" prop="courseName" class="other-style" v-if="([1,2,3,4,8,9].includes(Number(ordertype))&&!addchildstatus)|| ([11].includes(Number(ordertype))&& !addchildstatus)">
          <el-input size="small" v-model="orderForm.courseName"/>
        </el-form-item>
         <!-- 考试订单 -->
        <template v-if="[3].includes(Number(ordertype)) || ([3].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-form-item label="Exam Type" prop="examCVO.examType" class="other-style">
            <el-radio-group v-model="orderForm.examCVO.examType" @change="changeExamType">
                <el-radio v-for="(value,key) in examType" :key="key" class="examTypeRadio" :label="Number(key)">{{ value }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="examCVO.examTypeName" class="other-style" v-if="orderForm.examCVO.examType==5">
              <el-input v-model="orderForm.examCVO.examTypeName"/>
          </el-form-item>
          <el-form-item label="Exam Form" prop="examCVO.assistExamWay" class="other-style">
              <el-radio-group v-model="orderForm.examCVO.assistExamWay" @change="changeExamForm()">
                  <el-radio class="examTypeRadio" :label="1">Require Login</el-radio>
                  <el-radio class="examTypeRadio" :label="2">Photo Exam</el-radio>
                  <el-radio class="examTypeRadio" :label="3">Take Home</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="Exam Link" prop="examCVO.examUrl" class="other-style" v-if="orderForm.examCVO.assistExamWay==1">
              <el-input v-model="orderForm.examCVO.examUrl" />
              <!-- onkeyup="value=value.replace(/[\u4E00-\u9FA5\s]/g,'')" -->
          </el-form-item>
          <el-form-item label="Exam Style" prop="examCVO.examStyle" class="other-style" v-if="orderForm.examCVO.assistExamWay&&orderForm.examCVO.assistExamWay!=3">
              <el-radio-group v-model="orderForm.examCVO.examStyle" @change="changeExamForm('examStyle')">
                  <el-radio class="examTypeRadio" :label="1">Limited Time</el-radio>
                  <el-radio class="examTypeRadio" :label="2">Open Time</el-radio>
              </el-radio-group>
          </el-form-item>
          <!-- -->
          <el-form-item prop="examCVO.examLimitTimeLevel" class="other-style" v-if="orderForm.examCVO.examStyle==1">
              <el-radio-group v-model="orderForm.examCVO.examLimitTimeLevel" @change="changeExamForm()">
                  <el-radio class="examTypeRadio" name='examLimitTimeLevel' :label="1">考试限定时间</el-radio>
                  <el-radio class="examTypeRadio" name='examLimitTimeLevel' :label="2">考试时间开放</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="Official Open From" prop="examCVO.examOpenTime" class="other-style" v-if="testFormShow.OfficialOpenFrom">
            <el-date-picker
              type="datetime"
              :picker-options="pickerOptions2"
              v-model="orderForm.examCVO.examOpenTime"
              format="yyyy年MM月dd HH:mm"
              value-format="yyyy/MM/dd HH:mm"
              placeholder="选择日期"
              default-time="00:00:00"
              size="small"
              style="width: 100%;"
              @change="changeOpenTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="To" prop="examCVO.examCloseTime" class="other-style" v-if="testFormShow.ToexamCloseTime">
              <el-date-picker
                type="datetime"
                v-model="orderForm.examCVO.examCloseTime"
                format="yyyy年MM月dd HH:mm"
                value-format="yyyy/MM/dd HH:mm"
                placeholder="选择日期"
                :picker-options="pickerOptions6"
                default-time="23:59:59"
                size="small"
                style="width: 100%;"
                @change="changeExamCloseTime"
              ></el-date-picker>
          </el-form-item>
          <el-form-item label="Start From" prop="examCVO.realExamStartTime" class="other-style" v-if="testFormShow.StartFrom">
            <el-date-picker
              type="datetime"
              v-model="orderForm.examCVO.realExamStartTime"
              format="yyyy年MM月dd HH:mm"
              value-format="yyyy/MM/dd HH:mm"
              :picker-options="pickerOptions3"
              placeholder="选择日期"
              default-time="00:00:00"
              size="small"
              style="width: 100%;"
              @change="changeStartForm"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="To" prop="examCVO.realExamEndTime" class="other-style" v-if="testFormShow.TorealExamEndTime">
              <el-date-picker
                type="datetime"
                v-model="orderForm.examCVO.realExamEndTime"
                format="yyyy年MM月dd HH:mm"
                value-format="yyyy/MM/dd HH:mm"
                :picker-options="pickerOptions4"
                placeholder="选择日期"
                default-time="23:59:59"
                size="small"
                style="width: 100%;"
                @change="changeRealExamEndTime"
              ></el-date-picker>
          </el-form-item>
          <el-form-item label="Exam Duration" prop="examCVO.examLimitTime" class="other-style" v-if="testFormShow.ExamDuration">
             <label slot="label" >Exam Duration <span style="color:#f00">(Min)</span></label>
              <el-input v-model="orderForm.examCVO.examLimitTime" type="number" @input="orderForm.examCVO.examLimitTime = orderForm.examCVO.examLimitTime.replace(/\D/g,'')" @blur="changeWorkload"> <template slot="append">Min</template></el-input>
          </el-form-item>
          <el-form-item label="Real Deadline" prop="realDeadline" class="other-style" v-if="testFormShow.RealDeadline">
              <el-date-picker
                type="datetime"
                v-model="orderForm.realDeadline"
                format="yyyy年MM月dd HH:mm"
                value-format="yyyy/MM/dd HH:mm"
                @change="changeRealDeadLine"
                :picker-options="pickerOptions5"
                placeholder="选择日期"
                default-time="23:59:59"
                size="small"
                style="width: 100%;"
              ></el-date-picker>
          </el-form-item>
        </template>
        <!-- realDeadline -->
        <el-form-item label="Real Deadline" prop="realDeadline" class="other-style" v-if="[2,4,8,9].includes(Number(ordertype))|| ([11].includes(Number(ordertype))  && editStatus && addchildstatus)|| ([2,4,8].includes(Number(orderForm.childType)) &&addchildstatus)">
          <el-date-picker
            type="datetime"
            v-model="orderForm.realDeadline"
            format="yyyy年MM月dd HH:mm"
            value-format="yyyy/MM/dd HH:mm"
            @change="changeRealDeadLine"
            :picker-options="pickerOptions"
            placeholder="选择日期"
            default-time="23:59:59"
            size="small"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Deal Deadline" prop="deadline" class="other-style" v-if="[2,4,8,9].includes(Number(ordertype)) || ([11].includes(Number(ordertype))  && editStatus && addchildstatus)|| ([2,4,8].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-date-picker
            type="datetime"
            v-model="orderForm.deadline"
            format="yyyy年MM月dd HH:mm"
            value-format="yyyy/MM/dd HH:mm"
            :picker-options="pickerOptions2"
            placeholder="选择日期"
            @change="changeDeadLine"
            default-time="23:59:59"
            size="small"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <!-- Reference Style -->
        <template v-if="[1,2,3,4,8,9,11].includes(Number(ordertype))|| ([2,3,4,8].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-form-item label="Reference" prop="referenceSwitch" class="other-style" >
            <el-switch  v-model="orderForm.referenceSwitch" @change="changeReference" :active-value="1" :inactive-value="0"/>
          </el-form-item>
          <el-form-item  label="Reference Style" prop="referenceStyleId" class="other-style" v-if="orderForm.referenceSwitch == 1">
            <el-select v-model="orderForm.referenceStyleId" style="width:100%"  v-loading="referenceStyleLoading" @change="selectReference">
              <el-option v-for="(item,index) in referenceStyleList" :key="index" :value="item.id" :label="item.referenceStyle" style="width:300px"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Reference Style Name" prop="referenceStyle" class="other-style" v-if="orderForm.referenceStyleId == -1 && orderForm.referenceSwitch == 1">
            <el-input size="small" v-model="orderForm.referenceStyle" />
          </el-form-item> 
          <el-form-item label="Reference Guide" prop="referenceGuideArr" :rules="{ required: true, message: 'Please upload referenceGuide', validator: validateCustomerArr, trigger: 'change' }" class="other-style" v-if="orderForm.referenceStyleId == -1 && orderForm.referenceSwitch == 1">
            <uploadfile :urlarr="orderForm.referenceGuideArr"  :type="21" :nodesc="true" @refreshUrlArr="refreshUrlArr" />
          </el-form-item>
          <el-form-item label="Reference Guide" class="other-style" v-if="orderForm.referenceStyleId != -1 &&orderForm.referenceGuide && orderForm.referenceSwitch == 1">
            <div class="bluelink" @click="downloadFile(orderForm.referenceGuide)"><label> referenceGuide: </label>{{ orderForm.referenceGuide }}</div>
          </el-form-item>
        </template>
        <!-- 3 Difficult Level -->
        <template v-if="[3].includes(Number(ordertype)) || ([3].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-form-item label="Difficult Level" prop="examCVO.difficultyDegree" class="other-style">
            <el-select v-model="orderForm.examCVO.difficultyDegree" style="width:100%" @change="changeWorkload">
              <el-option v-for="item in 12" :key="item" :value="item" :label="item" style="width:300px"></el-option>
            </el-select>
          </el-form-item> 
        </template>
        <!-- 3 Require Specific Software -->
        <template v-if="[3].includes(Number(ordertype)) || ([3].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-form-item label="Require Specific Software" prop="examCVO.hasrequireSpecificSoftware" class="other-style">
            <el-switch  v-model="orderForm.examCVO.hasrequireSpecificSoftware" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-if="orderForm.examCVO.hasrequireSpecificSoftware == 1" prop="examCVO.requireSpecificSoftware" class="other-style">
            <el-input size="small" v-model="orderForm.examCVO.requireSpecificSoftware"  onkeyup="value=value.replace(/[\u4E00-\u9FA5\s]/g,'')"/>
          </el-form-item>
        </template>
        <!-- 4 PPT Slides -->
        <template v-if="[4].includes(Number(ordertype)) || ([4].includes(Number(orderForm.childType)) && addchildstatus)">
          <el-form-item label="PPT Slides" prop="presentationCVO.pptSlides" class="other-style">
            <el-input size="small" v-model="orderForm.presentationCVO.pptSlides"/>
          </el-form-item> 
        </template>
        <el-form-item :label="ordertype == 4?'Speech Word Count':'Word Count'" prop="wordsNum" class="other-style" v-if="[2,4,8,9].includes(Number(ordertype)) ||([11].includes(Number(ordertype))&& editStatus&& addchildstatus) || ([2,4].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-input size="small" v-model="orderForm.wordsNum" type="Number"/>
        </el-form-item>
         <!--8 Proofreading产品没有特殊报价 -->
        <el-form-item label="Unusual Quote" prop="theSpecialOffer" class="other-style" v-if="[2,4,9].includes(Number(ordertype))|| ([11].includes(Number(ordertype))  && addchildstatus) || ([2,4].includes(Number(orderForm.childType))&&addchildstatus) || sectionOrderStatus">
          <el-switch  v-model="orderForm.theSpecialOffer" @change="ifclearworkload"  :active-value="1" :inactive-value="0"/>
        </el-form-item>
        <el-form-item label="workload" prop="workload" class="other-style" v-if="orderForm.theSpecialOffer == 1 || [3].includes(Number(ordertype)) || ([3].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-input size="small" @keypress.native="disableInputSymbol" v-model="orderForm.workload" type="number" min="1"/>
        </el-form-item>
        <template  v-if="[2,3,4,8,9].includes(Number(ordertype))|| ([11].includes(Number(ordertype))  && !addchildstatus) || ([2,3,4,8].includes(Number(orderForm.childType))&&addchildstatus) || sectionOrderStatus">
          <el-form-item label="High Score Guarantee" prop="guaranteeScoreSwitch" class="other-style">
            <el-switch  v-model="orderForm.guaranteeScoreSwitch" @change="getPassScoreByDbStudId" :active-value="1" :inactive-value="0"/>
          </el-form-item>
          <el-form-item label="" prop="guaranteeScore" class="other-style" v-if="orderForm.guaranteeScoreSwitch == 1"  >
            <el-select v-model="orderForm.guaranteeScore" style="width:100%"  size="small" @change="getHighScoreByDbStudIdV2">
              <el-option v-for="(item,index) in guaranteeScoreArr" :key="index" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </template>
         <!-- 作业订单 writing materials -->
        <el-form-item label="Client Message" prop="description" class="other-style" v-if="[1,2,3,4,8,9,11].includes(Number(ordertype))|| ([2,3,4,8].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-input  class="client-message-input" type="textarea" :rows="3" v-model="orderForm.description"/>
        </el-form-item>
        <template v-if="[8,9].includes(Number(ordertype))|| ([8].includes(Number(orderForm.childType))&&addchildstatus)">
          <el-form-item label="Original Work" :prop="Number(ordertype) == 8?'profreadingCVO.originalWork':'edtingCVO.originalWork'" class="other-style" >
            <uploadfile :urlarr="Number(ordertype) == 8?orderForm.profreadingCVO.originalWork:orderForm.edtingCVO.originalWork"  :type="21" :nodesc="true" @refreshUrlArr="refreshUrlArr" />
          </el-form-item> 
        </template>
        <template v-if="[9].includes(Number(ordertype)) && orderForm.edtingCVO&&orderForm.edtingCVO.specificFeedback">
          <el-form-item label="Feedback" prop="edtingCVO.editingFeedBack"  class="other-style"  >
            <uploadfile :urlarr="orderForm.edtingCVO.editingFeedBack"  :type="21" :nodesc="true" @refreshUrlArr="refreshUrlArr" />
          </el-form-item> 
        </template>
        <el-form-item label="Order Note" prop="remark" class="other-style" v-if="[1,2,3,4,8,9,11].includes(Number(ordertype))">
          <el-input 
            type="textarea"
            :rows="3"
            v-model="orderForm.remark"/>
        </el-form-item>
        <!-- gruop order -->
        <template  v-if="([1,11].includes(Number(ordertype)) || orderForm.groupOrderList.length) && !addchildstatus">
          <sections :data="orderForm.groupOrderList" @addandedit="addData" @detelefun="deleteData" />
        </template>
      </el-form>
  </div>
</template>
<script>
import { orderTypeQywx,orderType } from '@/utils/Enum/Permission'
import { Base64 } from 'js-base64';
import uploadfile from "../order/conponment/uploadfile";
import sections from './components/section'
import addsection from './components/addsection'
import { checkPermission } from "@/directives/permission";
import {linkOrderList,getEmpListByRoleType,queryMyChannelList,queryCourseCodeAndStudId,professionalList,getReferenceStyleByDbStudId,getPassScoreByDbStudId,getHighScoreByDbStudIdV2,queryOrderProductList,queryCourseName} from '@/api/orderwy'
import {timehandle, timechangedefault,disableInputSymbol} from '@/utils/handleTimes'
import {
   getRed,
  getUserDetailsInfo,
} from "@/api/order";
function disabledDateFunc(val,time){
  let choosedate = new Date(val);
  let hours = choosedate.getHours() * 60 * 60 *1000,
  mins = choosedate.getMinutes()*60*1000,
  seconds = choosedate.getSeconds()*1000,
  alltimes = hours + mins + seconds;
  let defaultDate = choosedate.getTime() - alltimes,
  spaceTime = choosedate>defaultDate? 8.64e7:0;
  return time.getTime() < choosedate.getTime() - spaceTime;
}
export default {
  props: ['ordertypes','orderForm','userid','addchildstatus','againstatus','qywxOrder','sectionOrderStatus','ordereditstatus'],
  data() {
    let that = this;
    var validateCustomerArr = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('Please upload Reference Guide'));
      } else {
        callback();
      }
    };
    var validateeditingFeedBackArr = (rule, value, callback) => {
      if (!value.length){
        callback(new Error('Please upload editingFeedBack'));
      } else {
        callback();
      }
    };
    let examLimitTimeValidator = (rule, value, callback) => {
      if (Number(value) < 0 || Number(value) > 240){
        callback(new Error('请输入0~240之间的整数'));
      } else {
        callback();
      }
    };
    let validateworkloadNubers = (rule, value, callback) => {
      if(!value){
        callback(new Error('Please enter workload '));  
      }
      else if (Number(value) <= 0 ){
        callback(new Error('workload数值要大于0'));
      } else {
        callback();
      }
    };
    var validatecertificateFileList= (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传渠道证明'));
      } else {
        callback();
      }
    };
    return {
       orderTypeQywx,
       orderType,
      validateCustomerArr,
      validateeditingFeedBackArr,
      // 销售渠道
      sellerLoading:false,
      sellerList:[],
      userList:[],
      userloading:false,
      orderList:[],
      linkLoading:false,
      clickData:'',
      pickerOptions: {
        disabledDate: (time) => {
          // console.log(time.getTime() , Date.now() - 8.64e7,'00000000000000000')
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          // console.log(time.getTime() < Date.now() - 8.64e7,'-------------')
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      // Official Open To
      pickerOptions6: {
          disabledDate: (time) => {
            if(this.orderForm.examCVO.examOpenTime){
              let res =  disabledDateFunc(this.orderForm.examCVO.examOpenTime,time)
              return res
            }
            return false;
        },
      },
      // Start From
      pickerOptions3: {
        disabledDate: (time) => {
          if(this.orderForm.examCVO.examOpenTime){
            let time1 = Date.parse(this.orderForm.examCVO.examOpenTime)
            let time2 = Date.now() - 8.64e7
            if(time1-time2>0){
              return  disabledDateFunc(this.orderForm.examCVO.examOpenTime,time)
            }else{
              return time.getTime() < Date.now() - 8.64e7;
            }
          }
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      // Start to
      pickerOptions4: {
        disabledDate: (time) => {
          if (this.orderForm.examCVO.realExamStartTime) {
            let res =  disabledDateFunc(this.orderForm.examCVO.realExamStartTime,time)
            return res
          }
          return false;
        },
      },
      // Real Deadline
      pickerOptions5: {
        disabledDate: (time) => {
          if(this.orderForm.examCVO.examCloseTime){
            let res =  disabledDateFunc(this.orderForm.examCVO.examCloseTime,time)
            return res
          }
          return false
        },
      },
      coursecodetext:{
        0:'正在验证课程代码是否存在…',
        1:'课程代码验证通过，匹配到专业为',
        2:'课程代码验证失败，请确定你的课程代码是否填写无误，若无误请继续填写以下内容'
      },
      coursecodesrc:{
        0:require('@/assets/images/order/coursecode-check.png'),
        1:require('@/assets/images/order/coursecode-success.png'),
        2:require('@/assets/images/order/coursecode-error.png')
      },
       professionalName:'',
      professionalEnName:'',
      courseCodeLoading:false,
      professionalListArr:[],
      referenceStyleLoading:false,
      referenceStyleList:[],
      otherObj:{referenceStyle:'other',id:-1},
      professionalLoading:false,
      rules: {
        childType:[{ required: true, message: "Please choose a Product Category", trigger: "change" }],
        section:[{ required: true, message: "Please choose a Section Name", trigger: "change" }],
        newSection:[{ required: true, message: "Please enter new Section Name", trigger: "blur" }],
        channelStatus:[{ required: true, message: "Please choose a Order Mode", trigger: "change" }],
        // linkStatus:[{ required: true, message: "Please choose a linkStatus", trigger: "change" }],
        professionalId:[{ required: true, message: "Please choose a Specialization", trigger: "change" }],
        linkOrder:[{ required: true, message: "Please choose a linkOrder", trigger: "change" }],
        realDeadline:[{ required: true, message: "Please choose a realDeadline", trigger: "change" }],
        deadline:[{ required: true, message: "Please choose a deadline", trigger: "change" }],
        // theSpecialOffer:[{ required: true, message: "Please choose a deadline", trigger: "change" }],
        sellerChannelId:[{ required: true, message: "Please choose a Sales Channele", trigger: "change" }],
        childFlag:[{ required: true, message: "Please choose a Order Type", trigger: "change" }],
        // checkCourseCodeFlag:[{ required: true, message: "Please choose a courseCode", trigger: "change" }],
        courseName:[{ required: true, message: "Please enter Order Course Name", trigger: "blur" }],
        courseCode:[{ required: true, message: "Please enter courseCode", trigger: "change" }],
        workload:[{ required: true, validator:validateworkloadNubers, message: "Please enter workload", trigger: "blur" }],
        // referenceSwitch:[{ required: true, message: "Please choose a referenceSwitch", trigger: "change" }],
        referenceStyleId:[{ required: true, message: "Please choose a referenceStyleId", trigger: "change" }],
        referenceStyle:[{ required: true, message: "Please choose a referenceStyle", trigger: "blur" }],
        wordsNum:[{ required: true, message: "Please enter Word Count", trigger: "blur" }],
        description:[{ required: true, message: "Please enter Client Message", trigger: "blur" }],
        profreadingCVO:{
          originalWork:[
            { required: true, message: "Please upload originalWork", validator: validateCustomerArr, trigger: "change" },
          ],
        },
        edtingCVO:{
          originalWork:[
            { required: true, message: "Please upload originalWork", validator: validateCustomerArr, trigger: "change" },
          ],
          editingFeedBack:[{ required: true, message: 'Please upload FeedBack', validator: validateeditingFeedBackArr, trigger: 'change'}]
        },
        presentationCVO:{
          pptSlides: [{ required: true, message: "Please enter the PPT Slides", trigger: "blur" }]
        },
        certificateFileList: [{ required: true, message: "请上传渠道证明", validator: validatecertificateFileList, trigger: "change" },],
        examCVO: {
          examType: [{ required: true, message: "Please choose a examType", trigger: "change" }],
          examTypeName: [{ required: true, message: "Please enter the Exam Type", trigger: "blur" }],
          examUrl: [{ required: true, message: "Please enter the Exam Link", trigger: "blur" }],
          examLimitTimeLevel: [{ required: true, message: "Please choose", trigger: "change" }],
          realExamStartTime: [{ required: true, message: "Please choose Start From", trigger: "change" }],
          realExamEndTime: [{ required: true, message: "Please choose To", trigger: "change" }],
          examOpenTime: [{ required: true, message: "Please choose Official Open From", trigger: "change" }],
          examCloseTime: [{ required: true, message: "Please choose To", trigger: "change" }],
          assistExamWay: [{ required: true, message: "Please choose Exam Form", trigger: "change" }],
          examStyle: [{ required: true, message: "Please choose Exam Style", trigger: "change" }],
          examLimitTime: [
            { required: true, message: "Please enter the Exam Duration", trigger: "blur" },
            { validator: examLimitTimeValidator, trigger: ['blur','change'] }
          ],
          difficultyDegree: [{ required: true, message: "Please choose Difficult Level", trigger: "change" }],
          requireSpecificSoftware: [{ required: true, message: "Please choose Require Specific Software", trigger: "change" }],
        },
        // guaranteeScoreSwitch:[{ required: true, message: "Please choose a guaranteeScore", trigger: "change" }],
      },
      guaranteeScoreArr:[],
      editStatus:false,
      // 编辑的时候展示子订单类型
      typeArrlistShow:[],
      productArrLoading:false,
      typeArrlist: [
        {
          show:false,
          productType:10,
          name: "Writing Materials", 
          perssmisonName:'WritingMaterials',
          id: 2,//作业订单 writing materials
        },
        {
          show:false,
          productType:12,
          name: "Exams&Quiz",
          perssmisonName:'ExamsQuiz',
          id: 3,//考试订单 
        },
        {
          show:false,
          productType:13,
          name: "Presentation",
          perssmisonName:'Presentation',
          id: 4,//4.Presentation(演讲稿)
        },
        
        {
          show:false,
          productType:14,
          name: "Proofreading",
          perssmisonName:'Proofreading',
          id: 8,//8.Proofreading
        },
      ],
      ordertype:'',
      sectionArr:[
        'Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8','Week 9','Week 10','Week 11','Week 12',
        'Week 13','Week 14','Week 15','Mid-term','Quiz','Final','Custom'],
      sectionArr9:['Proposal','Abstract Summary','Literature Review','Methodology','Data Analysis','Findings','Conclusion','Recommendation','Introduction','Discussion','Overall Formatting','Data','Topic','Ethics Form','Custom'],
      examType:{
        2:'Resit',
        3:'Mid-term',
        4:'Final_exam',
        5:'Others'
      },
      arrlist: [
        {
          name: "WritingMaterials", 
          perssmisonName:'WritingMaterials',
          id: 2,//作业订单 writing materials
          productType:10,
          showStatus:false,
          imgsrc: require("@/assets/images/order/Writing-materials.png")
        },
        {
          name: "Dissertation",
          perssmisonName:'Dissertation',
          id: 11,// 11. Dissertation(大论文)
          productType:11,
          showStatus:false,
          imgsrc: require("@/assets/images/order/Dissertation.png")
        },
        {
          name: "Exams&Quiz",
          perssmisonName:'ExamsQuiz',
          id: 3,//考试订单 
          productType:12,
          showStatus:false,
          imgsrc: require("@/assets/images/order/Quizzes-Exams-Weekly-tasks.png")
        },
        {
          name: "Presentation",
          perssmisonName:'Presentation',
          id: 4,//4.Presentation(演讲稿)
          productType:13,
          showStatus:false,
          imgsrc: require("@/assets/images/order/Presentation.png")
        },    
        {
          name: "Proofreading",
          perssmisonName:'Proofreading',
          id: 8,//8.Proofreading
          productType:14,
          showStatus:false,
          imgsrc: require("@/assets/images/order/Profreading.png")
        },

        {
          name: "Editing",
          perssmisonName:'Editing',
          id: 9,//9.Editiong
          productType:15,
          showStatus:false,
          imgsrc: require("@/assets/images/order/Editiong.png")
        },
      ],
      workloadObj:{
        1:800,
        2:1000,
        3:1000,
        4:1200,
        5:1200,
        6:1200,
        7:1200,
        8:1300,
        9:1300,
        10:1500,
        11:1500,
        12:1500,
      },
      defaultData:{},
      testFormShow:{},
      isFlower: false, //小红花开关
      redFlowerNum: 0, //小红花数量
      demoRedFlowerNum:0,//组合订单临时存储子订单消耗后的
      userId:'',
      changeCounter:0,
    };
  },
  components: {
    uploadfile,
    sections,
    addsection
  },
  computed:{
      editingFeedBackrequired:function(val){
      //[Specific Feedback]开关
    // 若为开（默认），
    // 显示文件[Original Work]','[Feedback] (必选）
    // 若为关：
    // 仅显示文件[Original Work]（必选）
        if(this.orderForm.edtingCVO&&this.orderForm.edtingCVO.specificFeedback == 1){
          return true
        }
        return false
      },
      examLimitTime: function(){
      if(this.orderForm.examCVO.realExamStartTime&&this.orderForm.examCVO.realExamEndTime){
        var start=new Date(this.orderForm.examCVO.realExamStartTime).getTime();
        var end=new Date(this.orderForm.examCVO.realExamEndTime).getTime();
        this.orderForm.examCVO.examLimitTime = Math.round((end - start)/(1000*60)).toFixed(0);
        this.changeWorkload()
        return Math.round((end - start)/(1000*60)).toFixed(0)
      }
      return ''
    }
  },
  watch:{
    "orderForm.channelStatus":function(val){
      if(val == 1){
        this.queryMyChannelList()
      }
    },
    "orderForm.type":function(val){
      this.queryOrderProductList(this.userid)
    },
    "orderForm.referenceStyleId":function(val){
      if(val && this.againstatus){
        this.getReferenceStyleByDbStudId()
      }
    },
  },
 async created(){
    await this.getUserDetailsInfo()
    this.getRed();
    this.getHighScoreByDbStudIdV2();
  },
  async mounted() {
    disableInputSymbol,
    this.ordertype = this.ordertypes;
    let bdata = decodeURIComponent(this.$route.query.bdata) 
    const defaultDatas = Base64.decode(bdata);
    this.defaultData = JSON.parse(defaultDatas);
    // 这里处理从订单详情过来的时候初始化展示修改
    if(this.defaultData.orderType && this.defaultData.courseId){
      this.orderForm.type = Number(this.orderForm.type)
      this.editStatus = true;
    }
    this.queryOrderProductList(this.userid)
    await this.initDataGet(this.ordertypes)
    this.professionalList();
    if(this.againstatus && this.ordertypes == 3){//再来一单考试订单时间展示处理
      this.testFormShowFun()
    }
   this.$refs.orderform.clearValidate()
  },
  methods: {
    checkPermission,
    clearcourseData(){
      this.orderForm.courseCode = null;
      this.orderForm.checkCourseCode = 0;
      this.orderForm.professionalId = null;
    },
    clearsellerChannelId(){
      if(!this.orderForm.channelStatus){
        this.orderForm.sellerChannelId = '';
      }
    },
     async queryOrderProductList(userId){
       if(userId == 'undefined' || !userId){
            return false
         }
      this.typeArrlistShow = [];
      this.productArrLoading = true;
      const {status,body} = await queryOrderProductList(userId);
      if(status == 200){
        let productArr = body;
        this.productArrLoading = false;
        if(this.againstatus || (this.defaultData.orderType && this.defaultData.courseId)){
            this.arrlist.forEach(item=>{
            //当文案类型产品接口返回了这些类型可以下单的子类型展示
            let index = productArr.findIndex(arr=>arr.productType == item.productType);
            if(index>-1 && this.checkPermission(this.qywxOrder?[this.orderTypeQywx[item.perssmisonName]]:[this.orderType[item.perssmisonName]])){
                if(this.ordereditstatus){//修改订单的类型选择
                  if([10,12].includes(Number(item.productType))){//作业订单跟考试订单兼容
                    this.typeArrlistShow.push(item)
                  }
                }else{
                  this.typeArrlistShow.push(item)
                }
              }
            this.$forceUpdate()
          })
        }else{
          this.typeArrlist.forEach(item=>{
            //当文案类型产品接口返回了这些类型可以下单的子类型展示
            let index = productArr.findIndex(arr=>arr.productType == item.productType);
            if(index>-1 && this.checkPermission(this.qywxOrder?[this.orderTypeQywx[item.perssmisonName]]:[this.orderType[item.perssmisonName]])){
                this.typeArrlistShow.push(item)
              }
            this.$forceUpdate()
          })
        } 
        
      }
    },
    //订单类型切换改变数据请求回填
    async initDataGet(type){
      if(this.ordereditstatus){
        this.ordertype = this.orderForm.type;
        this.changeCounter ++;
      }
      if(![1].includes(Number(this.ordertype))){
        this.handleSwitchStatus(type)
      }
      //确保数据回填接口查询
      await this.queryMyChannelList();
      await this.getReferenceStyleByDbStudId()
      await this.getLinkorder()
      if(this.ordertypes == 3 && !this.ordereditstatus){
        this.$set(this.orderForm.examCVO,'examType',2);
        this.$set(this.orderForm.examCVO,'assistExamWay',1);
      }
      if(this.defaultData.orderType=='again' || this.defaultData.orderType=='supersearchAgain'){
        this.$set(this.orderForm.examCVO,'examType','');
        this.$set(this.orderForm.examCVO,'assistExamWay','');
        this.$set(this.orderForm.examCVO,'examStyle','');
        this.$set(this.orderForm.examCVO,'examLimitTimeLevel','');
        this.$set(this.orderForm,'channelStatus','');
        this.$set(this.orderForm,'realDeadline','');
      }
      if(this.changeCounter >1){
        this.clearEditOderData();
      }
    },
    clearEditOderData(){
      this.orderForm.deadline = '';
      this.orderForm.hongHua = 0,
      this.orderForm.realDeadline = '';
      this.orderForm.workload = '';
      this.orderForm.guaranteeScoreSwitch = 0;
      this.orderForm.examCVO = {
          examType:"",
          examTypeName:"",
          examUrl:"",
          examLimitTimeLevel:"",
          realExamStartTime:"",
          realExamEndTime:"",
          examOpenTime:"",
          examCloseTime:"",
          assistExamWay:"",
          examStyle:"",
          examLimitTime:"",
          difficultyDegree:"",
          requireSpecificSoftware:"",
      }
    },
    changeRuleRequit(val){
      // if(this.orderForm.edtingCVO.specificFeedback){
      //   this.rules.edtingCVO.editingFeedBack[0].required = true;
      //   this.$forceUpdate()
      // }else{
      //   this.rules.edtingCVO.editingFeedBack[0].required = false;
      //   this.$forceUpdate()
      // }
    },
    //  各种类型开关初始数据修改
      handleSwitchStatus(type){
        if(this.againstatus || this.ordereditstatus) return;
        type = Number(type);
        switch(type){
          case 1:
            // this.orderForm.linkStatus = 0;
            this.orderForm.referenceSwitch = 1;
            // this.orderForm.theSpecialOffer = 0;
            // this.orderForm.guaranteeScoreSwitch = 0;
            break;
          case 2:
            this.orderForm.linkStatus = 0;
            this.orderForm.referenceSwitch = 1;
            this.orderForm.theSpecialOffer = 0;
            this.orderForm.guaranteeScoreSwitch = 0;
            break;
          case 3:
            this.orderForm.linkStatus = 0;
            this.orderForm.referenceSwitch = 0;
            this.orderForm.theSpecialOffer = 0;
            this.orderForm.guaranteeScoreSwitch = 0;
            break;
          case 4:
            this.orderForm.linkStatus = 0;
            this.orderForm.referenceSwitch = 0;
            this.orderForm.theSpecialOffer = 1;
            this.orderForm.guaranteeScoreSwitch = 0;
            break;
          case 8:
            this.orderForm.linkStatus = 1;
            this.orderForm.referenceSwitch = 1;
            // this.orderForm.theSpecialOffer = 1;
            this.orderForm.guaranteeScoreSwitch = 0;
            break;
          case 9:
            // this.orderForm.linkStatus = 1;
            this.orderForm.referenceSwitch = 1;
            this.orderForm.theSpecialOffer = 1;
            this.orderForm.guaranteeScoreSwitch = 0;
            break;
          case 11:
            // this.orderForm.linkStatus = 0;
            this.orderForm.referenceSwitch = 1;
            // this.orderForm.theSpecialOffer = 0;
            this.orderForm.guaranteeScoreSwitch = 0;
            break;
      }
    },
    changeWorkload(){
      if(!this.orderForm.examCVO.examLimitTime){
        this.orderForm.workload = '';
        return
      }
      if(!this.orderForm.examCVO.difficultyDegree) return  this.$toast('Please choose a Difficult Level');
      this.orderForm.workload = Math.round(this.workloadObj[this.orderForm.examCVO.difficultyDegree] * this.orderForm.examCVO.examLimitTime/ 60)  ;
    },
    clearForm() {
      this.$nextTick(()=>{
        if(this.$refs.orderform){
          this.$refs.orderform.clearValidate();
        } 
        
      })
    },
    changeOpenTime(e) {//修改时间Official Open From
      this.clearForm()
      if(this.orderForm.examCVO.examCloseTime&&(new Date(e)-new Date(this.orderForm.examCVO.examCloseTime))>0){
        this.orderForm.examCVO.examCloseTime = null
        this.$toast('The Official Open From time cannot be less than the current time')
      }
      if(this.orderForm.examCVO.realExamStartTime&&(new Date(e)-new Date(this.orderForm.examCVO.realExamStartTime))>0){//openfrom必定小于startFrom
        this.orderForm.examCVO.realExamStartTime = null
        this.$toast('The Official Open From time cannot be less than the current time')
      }
    },
    changeExamCloseTime(e) {
      this.clearForm()
      if(this.orderForm.examCVO.examOpenTime && (new Date(e)-new Date(this.orderForm.examCVO.examOpenTime))<0){
        this.orderForm.examCVO.examCloseTime = null
        this.$toast('The Official Open From time cannot be less than the current time')
      }
      if(this.orderForm.examCVO.realExamEndTime &&(new Date(e)-new Date(this.orderForm.examCVO.realExamEndTime))<0){
        this.orderForm.examCVO.realExamEndTime = null;
        this.$toast('The Start To time cannot be less than the current time')
      }
    },
    //start from 改变
    changeStartForm(e) {//大于Official Open From并且小于Official Open To
      this.clearForm()
      if(this.orderForm.examCVO.realExamEndTime&&(new Date(e)-new Date(this.orderForm.examCVO.realExamEndTime))>0){
        this.orderForm.examCVO.realExamEndTime = null
         return this.$toast('The Start From time cannot be less than the current time')
      }
      // orderForm.examCVO.examOpenTime
      if(this.orderForm.examCVO.examCloseTime &&(new Date(e)-new Date(this.orderForm.examCVO.examCloseTime))>0){ //StartFrom小于Official Open TO
        this.orderForm.examCVO.realExamStartTime = null
        return this.$toast('The Start From time cannot be less than the current time')
      }
      if(this.orderForm.examCVO.examOpenTime &&(new Date(e)-new Date(this.orderForm.examCVO.examOpenTime))<0){ //StartFrom大于Official Open From
        this.orderForm.examCVO.realExamStartTime = null
         return this.$toast('The Start From time cannot be more than the current time')
      }
    },
    //start to改变
    changeRealExamEndTime(e) {
      this.clearForm()
      if(this.orderForm.examCVO.realExamStartTime&&(new Date(e)-new Date(this.orderForm.examCVO.realExamStartTime))<0){//StartTo不能大于Start From
        this.orderForm.examCVO.realExamEndTime = null
        this.$toast('The Start TO time cannot be less than the current time')
      }
      if(this.orderForm.examCVO.examOpenTime &&(new Date(e)-new Date(this.orderForm.examCVO.examOpenTime))<0){ //StartTo不能小于Official Open From
        this.orderForm.examCVO.realExamEndTime = null
        this.$toast('The Start To time cannot be less than the current time')
      }
      if(this.orderForm.examCVO.examCloseTime &&(new Date(e)-new Date(this.orderForm.examCVO.examCloseTime))>0){ //StartTo不能大于Official Open TO
        this.orderForm.examCVO.realExamEndTime = null
        this.$toast('The Start To time cannot be less than the current time')
      }
    },
    ifclearworkload(e) {
      if(e==0){
        
        this.orderForm.workload = 0
      }else{
        this.orderForm.workload = ''
      }
    },
    refreshUrlArr(){
      if(this.orderForm.referenceGuideArr&&this.orderForm.referenceGuideArr.length>=1){
        this.orderForm.referenceGuide = this.orderForm.referenceGuideArr[0].url;
        this.orderForm.referenceGuideName = this.orderForm.referenceGuideArr[0].name;
      }
      this.clearForm();
    },
    changeExamForm(type) {
      if(type  == 'examStyle'){
        this.orderForm.examCVO.examLimitTimeLevel = null;
      }
      if(this.orderForm.examCVO.assistExamWay == 3){
        this.orderForm.examCVO.examStyle = null;
      }
      if(this.orderForm.examCVO.assistExamWay != 1){
        this.orderForm.examCVO.examUrl = null;
      }
      this.orderForm.examCVO.examLimitTime = null;
      this.orderForm.examCVO.realExamStartTime = null
      this.orderForm.examCVO.realExamEndTime = null
      this.orderForm.examCVO.examOpenTime = null
      this.orderForm.examCVO.examCloseTime = null
      this.orderForm.realDeadline = ''
      this.clearForm();
      this.testFormShowFun()
      this.$forceUpdate()
      this.changeWorkload()
    },
    testFormShowFun(){
      let {assistExamWay,
      examStyle,
      examLimitTimeLevel} =  this.orderForm.examCVO;
      let StartFrom ,
      ToexamCloseTime,
      OfficialOpenFrom,
      TorealExamEndTime,
      RealDeadline,
      ExamDuration = false;
      if(assistExamWay == 1 && examStyle == 1 && examLimitTimeLevel == 1){
        StartFrom = true;
        TorealExamEndTime = true;
        ExamDuration = true;
      }
      if(assistExamWay == 1 && examStyle == 1 && examLimitTimeLevel == 2){
        OfficialOpenFrom = true;
        ToexamCloseTime = true;
        ExamDuration = true;
        RealDeadline = true;
      }
      if(assistExamWay == 1 && examStyle == 2 ){
        OfficialOpenFrom = true;
        ToexamCloseTime = true;
        RealDeadline = true;
      }
      if(assistExamWay == 2 && examStyle == 1 && examLimitTimeLevel == 1){
        StartFrom = true;
        TorealExamEndTime = true;
        ExamDuration = true
      }
      if((assistExamWay == 2 && examStyle == 1 && examLimitTimeLevel == 2) || (assistExamWay == 2 && examStyle == 2 )){
        OfficialOpenFrom = true;
        TorealExamEndTime = true;
        StartFrom = true;
        ToexamCloseTime = true;
        ExamDuration = true;
      }
      if(assistExamWay == 3){
        OfficialOpenFrom = true;
        ToexamCloseTime = true;
        // ExamDuration = true;
        RealDeadline = true;
      }
      this.testFormShow = {StartFrom,ToexamCloseTime,OfficialOpenFrom,TorealExamEndTime,ExamDuration,RealDeadline};
    },
    changeExamType(e) {
      if(e!=5){
        this.orderForm.examCVO.examTypeName = this.examType[e] || ''
      }else{
        this.orderForm.examCVO.examTypeName = ''
      }
    },
    async getPassScoreByDbStudId(){
      if(!this.orderForm.guaranteeScoreSwitch) {
        this.orderForm.guaranteeScore = null;
        this.orderForm.feeCVOS = [];
        console.log(this.orderType,'this.orderType',this.orderForm.type)
        if(this.orderForm.groupOrderList && this.orderForm.groupOrderList.length && Number(this.orderForm.type == 11)){
          this.orderForm.groupOrderList.forEach((item,indexs)=>{
            this.orderForm.groupOrderList[indexs].guaranteeScore = null;
            this.orderForm.groupOrderList[indexs].feeCVOS = [];
          })
          this.$store.dispatch('setChildorderlist',this.orderForm.groupOrderList);
        }
        return false
      };
      console.log(this.userid,'this.userid')
        const {status,body} = await getPassScoreByDbStudId({studId:this.userid});
        if(status == 200){
          if(body){
              this.guaranteeScoreArr = body; 
          }
        }
    },
    async getHighScoreByDbStudIdV2(){
     
      if(!this.orderForm.guaranteeScoreSwitch) return;
        localStorage.setItem('feeCVOSnumber',1)
        const {status,body} = await getHighScoreByDbStudIdV2({studId:this.userid});
        if(status == 200){
          if(body){
            this.orderForm.feeCVOS = [];
            body.reverse().forEach((item,i)=>{
              if(Number(item.highScore)  <= Number(this.orderForm.guaranteeScore)){
                this.orderForm.feeCVOS.push( {...item,score:item.highScore});
              }
            })
            this.$forceUpdate()
            // this.orderForm.feeCVOS.push({type: null, highScore:'均未到', rate: 0,score:0});   
            console.log(body,'0000')
          }
        }
    },
    changeRealDeadLine(time){
      let nowDate = new Date();
      let realtime = new Date(time);
      let deadline = '',
      useDate = '';
        // 若[Real Deadline]距离当前时间>=48小时，则[Deal Deadline]自动回显比[Read Deadline]小48小时的日期时间
      if(realtime.getTime() >= nowDate.getTime() +  8.64e7*2){
        deadline = realtime.getTime() - 8.64e7*2;
        useDate = deadline
      }
      // 若[Real Deadline]距离当前时间<48小时，但>=24则[Deal Deadline]自动回显比[Read Deadline]小24小时的日期时间
      if(realtime.getTime() < nowDate.getTime() +  8.64e7*2 && realtime.getTime()>= nowDate.getTime() + 8.64e7){
        deadline = realtime.getTime() - 8.64e7;
        useDate = deadline
      }
      //若[Real Deadline]距离当前时间<24小时，则[Deal Deadline]自动回显与[Real Deadline]相同的日期时间
      if(realtime.getTime() > nowDate.getTime() && realtime.getTime() < nowDate.getTime() +  8.64e7){
        deadline = realtime.getTime();
        useDate = deadline
      }
      // if(this.orderForm.realDeadline&& this.orderForm.deadline && (new Date(this.orderForm.realDeadline)-new Date(this.orderForm.deadline))>=0){
      //   this.orderForm.deadline = '';
      //   useDate = '';
      //   this.$toast('The start time cannot be less than the current time')
      // }
      console.log(useDate, this.toLocaleString(useDate),'useDate')
      this.orderForm.deadline =  this.toLocaleString(useDate);
      this.clearForm()
    },
    changeDeadLine(time){
      // let realDeadline = new Date(timehandle(this.orderForm.realDeadline));
      // let realtime = new Date(timehandle(time));
      // if(realtime.getTime() > realDeadline.getTime()){
      //   this.orderForm.deadline = '';
      //   this.$toast('Real Deadline cannot be less than deadline')
      // }
      if(this.orderForm.realDeadline &&(new Date(time)-new Date(this.orderForm.realDeadline))>=0){ //
        this.orderForm.deadline = '';
        this.$toast('Real Deadline cannot be less than deadline')
      }
    },
    toLocaleString(date) {
      if(!date) return;
      date = new Date(date)
        return date.getFullYear() + "/" + this.addZero(date.getMonth() + 1) + "/" + this.addZero(date.getDate()) + " " + this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes()) + ":" + this.addZero(date.getSeconds()) ;
    },
    addZero(num) {
      if(num<10)
          return "0" + num;
      return num;
    },
    async queryMyChannelList(){
      if(!this.orderForm.channelStatus) return;
      this.sellerLoading = true;
      let params = {
        page:1,
        limit:1000,
        key:'',
        channelStatus:this.orderForm.channelStatus,
        userId: this.userid,
        contractStatus: 0,
      };
      let {status,body} = await queryMyChannelList(params);
      this.sellerLoading = false;
      if(status == 200){
        if(body){
          this.sellerList = body.list || [];
        }
      }
    },
    initStatus(){
      this.orderForm.checkCourseCode = 0;
    },
    async queryCourseCodeAndStudId(){
      let params = {
        courseCode:this.orderForm.courseCode,
        studId:this.userid
      }
      if(!this.orderForm.courseCode) return;
      this.courseCodeLoading = true;
      this.professionalName = '';
      this.professionalEnName = '';
      let {status,body} = await queryCourseCodeAndStudId(params);
       this.courseCodeLoading = false;
      if(status == 200){
        this.orderForm.checkCourseCode = 1;
         if(!body){
          this.orderForm.checkCourseCode = 2;
          this.professionalList();
        }else{
          this.professionalName = body.professionalName;
          this.professionalEnName = body.professionalEnName;
        }
      }
      this.orderForm.courseCode && this.queryCourseName()
    },

    // 通过course code 查询course name
    queryCourseName(){
      queryCourseName({courseCode: this.orderForm.courseCode}).then(res => {
        if(res.body && res.body.courseName){
          this.$set(this.orderForm,'courseName',res.body.courseName);
        }else{
          this.$set(this.orderForm,'courseName','');
        }
      })
    },

    async professionalList(){
      this.professionalLoading = true;
      let {status,body} = await professionalList({page:1,limit:1000,type:2});
      this.professionalLoading = false;
      if(status == 200){
        this.professionalListArr = body;
      }
    },
    changeReference(){
      if(this.orderForm.referenceSwitch){
        this.getReferenceStyleByDbStudId()
      }else{
        this.orderForm.referenceStyleId = ''
        this.orderForm.referenceStyle = '';
        this.orderForm.referenceGuide = ''
        this.orderForm.referenceGuideArr = []
      }
    },
    async getReferenceStyleByDbStudId(){
      if(!this.againstatus){
        this.orderForm.referenceStyleId = ''
        this.orderForm.referenceStyle = ''
        this.orderForm.referenceGuide = ''
        this.orderForm.referenceGuideArr = []
      }
      this.clearForm();
      if(!this.orderForm.referenceSwitch) return;
      this.referenceStyleLoading = true;
      let {status,body} = await getReferenceStyleByDbStudId({studId:this.userid});
      this.referenceStyleLoading = false;
      if(status == 200){
        this.referenceStyleList = [...body,this.otherObj];
      }
    },
    async getLinkorder(){
      if(!this.orderForm.linkStatus && !this.sectionOrderStatus){
        this.orderForm.linkOrder = null;
      }
      this.linkLoading = true;
      let {status,body} = await linkOrderList({key:''});
      this.linkLoading = false;
      if(status == 200){
        this.orderList = body;
      }
    },
    addData(index,type){   
      document.getElementById('allboxs').scrollTop = 0;
      this.clearForm()
      if(this.orderForm.groupOrderList[index]){//子订单存在数组时候
        console.log(index,'index',this.orderForm.groupOrderList[index]);
        if(type == 'copy'){//copy处理
          let obj = JSON.parse(JSON.stringify(this.orderForm.groupOrderList[index]))
          obj.hongHua=0
          this.orderForm.groupOrderList.push(obj);
          this.$store.dispatch('setChildorderlist',this.orderForm.groupOrderList);
        }
      }
      if(type != 'copy'){//不是copy处理
        this.editStatus = true;
        this.$emit('hiddenBottomStep',true,index)//新增跟编辑处理
      }
    },
    deleteData(index){
      if(index>=0){
        this.orderForm.groupOrderList.splice(index,1);
        this.$store.dispatch('setChildorderlist',this.orderForm.groupOrderList);
      }
    },
    // 特殊报价人
    async getEmpListByRoleType(){
      if(!this.orderForm.theSpecialOffer) return;
      this.userloading = true;
      const {status , body} = await getEmpListByRoleType({role_type:2});
      this.userloading = false;
      if(status == 200){
        this.userList = body;
      }
    },
    formjudge(){
        let status = false;
        this.$refs.orderform.validate((valid) => {
          console.log(Number(this.ordertypes),!this.addchildstatus,!this.orderForm.groupOrderList.length,[1,11].includes(Number(this.ordertype)) && !this.addchildstatus && !this.orderForm.groupOrderList.length)
        if (valid) {
          if([1,11].includes(Number(this.ordertype)) && !this.addchildstatus && !this.orderForm.groupOrderList.length){
            this.$emit('chagneTips')
            status = false;
          }else{
            status = true;
            this.clearForm();
          }
          
        }
      });
      return status;
    },
    selectReference(val) {
      this.orderForm.referenceStyle = '';
      this.orderForm.referenceGuide = '';
      this.orderForm.referenceGuideName = '';
      this.orderForm.referenceGuideArr = [];
      console.log(val, this.orderForm.referenceStyle)
      if(this.orderForm.referenceStyleId != -1){//选择了列表中返回referenceStyle
        this.orderForm.referenceStyle = this.referenceStyleList.filter(item=>{return item.id==this.orderForm.referenceStyleId})[0].referenceStyle;
        this.orderForm.referenceGuide = this.referenceStyleList.filter(item=>{return item.id==this.orderForm.referenceStyleId})[0].referenceGuide;
        this.orderForm.referenceGuideName = this.referenceStyleList.filter(item=>{return item.id==this.orderForm.referenceStyleId})[0].referenceGuideName;
      }
    },
    downloadFile(url, fileName ='') {
    fileName&&fileName.indexOf(".txt") > -1 ||
      fileName&&fileName.indexOf(".pdf") > -1 ||
      fileName&&fileName.indexOf(".jpg") > -1 ||
      fileName&&fileName.indexOf(".png") > -1 ||
      fileName&&fileName.indexOf(".jpeg") > -1 ||
      url.indexOf(".txt") > -1 ||
      url.indexOf(".pdf") > -1 ||
      (url.indexOf(".jpeg") > -1) | (url.indexOf(".jpg") > -1) ||
      url.indexOf(".png") > -1
        ? window.open(url)
        : window.open(url);
    },
    changeValue(val){
      this.$set(this.orderForm,'courseCode',val.replace(/[^A-Za-z0-9]/g,''))//只能输英文字母及数字
    },
    forceUpdate(){
      this.$forceUpdate()
      this.clearForm()
    },
    async getRed() {
      let res = await getRed({
        userId:this.userId,
        type: 1,
      })
      if (res.status == 200) {
        console.log('  this.redFlowerNum',  this.redFlowerNum)
        this.redFlowerNum=res.body?.number || 0
        this.demoRedFlowerNum=this.redFlowerNum
      }
    },
    //获取用户id
    async getUserDetailsInfo() {
      let res = await getUserDetailsInfo()
      if (res.status == 200) {
        this.userId = res.body?.user?.userId
      }
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
.color0{
  color: #48494C;
}
.color1{
    color: #36B67D;
}
.color2{
    color: #E45434;
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

</style>