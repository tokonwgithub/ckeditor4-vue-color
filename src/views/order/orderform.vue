<template>
  <!-- /*auhtor:xulanlan time：2021-3-19 10：24  editcontent:添加大礼包类型及其pass分*/ -->
  <div class="order-content">
    <el-form
      ref="orderform"
      :model="orderForm"
      :rules="rules"
      label-width="80px"
      size="mini"
      label-position="top"
    >
      <h3 v-if="orderForm.type != 67 && orderForm.type != 68&&(orderForm.type==66&&!(['129','130'].includes(orderForm.studSpecialOrderExt.type)))">
        是否要选择关联订单
        <van-switch
          v-model="checked"
          class="switch-style"
          size="16px"
          @change="chagneStatus"
        />
      </h3>
      <el-form-item
        label="推荐人类型"
        class="other-style"
      >
        <el-radio-group
          v-model="orderForm.recommendModel"
          @change="changesModel"
        >
          <el-radio :label="0">默认模式</el-radio>
          <el-radio :label="1">推荐人模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item
        label="选择推荐人"
        prop="recommendUserId"
        class="other-style"
        v-if="orderForm.recommendModel == 1"
      >
        <el-select
          v-model="orderForm.recommendUserId"
          filterable
          placeholder="请选择推荐人"
          style="width:100%"
          size="small"
          v-loading="recommenduserloading"
        >
          <el-option
            style="width:350px"
            :label="user.username"
            :value="user.id"
            v-for="(user,indexs) in recommenduserList"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item
        label="销售渠道"
        prop="sellerChannelId"
        class="other-style"
        v-if="orderForm.recommendModel == 1"
      >
        <el-select
          v-model="orderForm.sellerChannelId"
          filterable
          placeholder="请选择渠道"
          style="width:100%"
          size="small"
          v-loading="recommenduserloading"
        >
          <el-option
            style="width:100%"
            :label="user.name+`${user.internalChannelInformation?' ('+user.internalChannelInformation+')': ''}`"
            :value="user.id"
            v-for="(user,indexs) in channelList"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="渠道证明"
        prop="certificateFileList"
        v-if="orderForm.recommendModel == 1"
      >
        <uploadfile
          :urlarr="orderForm.certificateFileList"
          :nodesc="true"
          :type="0"
        />
      </el-form-item>
      <el-form-item class="red-flower">
        <span slot="label">
          是否使用小红花，小红花(余{{ redFlowerNum }}朵)
        </span>
        <el-switch
          v-model="isFlower"
          @change="changeRed"
          :disabled="!redFlowerNum"
        >
        </el-switch>
      </el-form-item>
      <el-form-item
        label="关联订单"
        prop="parentId"
        class="other-style"
        v-if="orderForm.type != 67 && checked"
      >
        <el-select
          v-model="orderForm.parentId"
          filterable
          placeholder="请选择关联订单"
          style="width:100%"
          size="small"
          v-loading="orderloading"
        >
          <el-option
            style="width:350px"
            :label="order.orderNo"
            :value="order.id"
            v-for="(order,indexs) in orderList"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 大礼包类型添加 -->
      <el-form-item
        label="论文大礼包类型"
        prop="bigPackageType"
        class="other-style"
        v-if="orderForm.type == 65"
      >
        <el-radio-group v-model="orderForm.bigPackageType">
          <el-radio :label="1"> 普通类型</el-radio>
          <el-radio :label="2">plus大礼包</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="子类型"
        prop="change"
        class="other-style"
        v-if="orderForm.type == 67"
      >
        <el-radio-group
          v-model="orderForm.change"
          @change="changesRadios"
        >
          <el-radio
            :label="0"
            v-if="!status"
          >引流订单</el-radio>
          <el-radio :label="1">收费订单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="子订单类型"
        prop="studSpecialOrderExt.type"
        class="other-style"
        v-if="orderForm.type == 66"
      >
        <el-select
          v-model="orderForm.studSpecialOrderExt.type"
          placeholder="请选择子订单类型"
          style="width:100%"
          size="small"
          @change="handleChildType"
          :disabled="['1','2','129','130'].includes(sonid)?true:false"
        >
          <el-option
            :label="order.name"
            :value="order.id"
            v-for="(order,index) in specilTypeArr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <template>
        <el-form-item
          label="课程名称"
          prop="courseName"
          class="other-style"
          v-if="orderForm.type != 67"
        >
          <el-input
            style="width:100%"
            v-model="orderForm.courseName"
          />
        </el-form-item>
        <el-form-item
          label="无Coursecode请关闭此按钮"
          prop="checkCourseCodeFlag"
          class="other-style"
        >
          <el-switch
            v-model="orderForm.checkCourseCodeFlag"
            @change="clearcourseData"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <!-- Course Code在整理模块 -->
        <el-form-item
          prop="courseCode"
          class="other-style"
          label="CourseCode"
          v-if="orderForm.checkCourseCodeFlag"
        >
          <span slot="label">CourseCode <span class="memo">(只能输入英文字母及数字)</span></span>
          <el-input
            v-model.trim="orderForm.courseCode"
            @input="changeValue($event)"
            @blur="queryCourseCodeAndStudId"
          />
          <p
            class="courseCode-style"
            v-if="courseCodeLoading || orderForm.checkCourseCode > 0"
          ><img
              :src="coursecodesrc[orderForm.checkCourseCode]"
              alt=""
            ><span :class="'color'+orderForm.checkCourseCode">{{ coursecodetext[orderForm.checkCourseCode]}}
              <template v-if="orderForm.checkCourseCode == 1">“{{professionalName +'('+ professionalEnName +')'}}”</template></span></p>
        </el-form-item>
        <el-form-item
          label="Specialization"
          prop="professionalId"
          class="other-style"
          v-if="(orderForm.checkCourseCode == 2 && orderForm.courseCode && orderForm.checkCourseCodeFlag) || orderForm.checkCourseCodeFlag == 0"
          v-loading="professionalLoading"
        >
          <el-select
            v-model="orderForm.professionalId"
            size="mini"
            style="width:100%"
            filterable
          >
            <el-option
              v-for="(item,index) in professionalListArr"
              filterable
              :key="index"
              :value="item.id"
              :label="item.chineseName + '【'+ item.name+'】'"
              style="width:500px"
            ></el-option>
          </el-select>
          <p
            class="courseCode-style"
            v-if="orderForm.checkCourseCode == 2 && orderForm.checkCourseCodeFlag"
          ><span class="color21">新的course code 请选择specialization</span></p>
        </el-form-item>

      </template>
      <el-form-item
        label="论文字数"
        prop="wordsNum"
        class="other-style"
        v-if="orderForm.change == 1"
      >
        <el-input
          v-model="orderForm.wordsNum"
          type="number"
          placeholder="请填写论文字数"
          @keypress.native="disableInputSymbol2"
          style="width:100%"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="委托数据处理部分"
        prop="confirmEntrust"
        class="other-style"
        v-if="orderForm.change == 1"
      >
        <el-checkbox v-model="orderForm.confirmEntrust">确认委托</el-checkbox>
      </el-form-item>
      <el-form-item
        label="学生的定题需求"
        prop="topicDemand"
        class="other-style"
        v-if="orderForm.change == 0"
      >
        <textarea
          class="order-textarea"
          placeholder="请填写学生的定题需求"
          v-model="orderForm.topicDemand"
        />
      </el-form-item>

      <el-form-item
        label="学生的答疑需求是"
        class="other-style"
        v-if="orderForm.change == 0"
      >
        <el-radio-group
          v-model="studentRadio"
          size="small"
        >
          <el-radio label="1">结合topic进行细节讲解</el-radio>
          <el-radio label="2">针对毕业论文流程/技巧进行答疑</el-radio>
        </el-radio-group>
        <textarea
          class="order-textarea"
          placeholder="结合topic进行细节讲解"
          v-model="orderForm.topicAnswerDemand"
          v-if="studentRadio == 1"
        />
        <textarea
          class="order-textarea"
          placeholder="请叙述学生的答疑需求是"
          v-model="orderForm.paperAnswerDemand"
          v-if="studentRadio == 2"
        />
      </el-form-item>
      <el-form-item
        label="学生定题写作方向（topic）是"
        class="other-style"
        v-if="orderForm.change == 1"
      >
        <textarea
          class="order-textarea"
          placeholder="结合topic进行细节讲解"
          v-model="orderForm.topicThinkDirect"
        />
      </el-form-item>
      <el-form-item
        label="是否委派给引流讲师"
        class="other-style"
        v-if="orderForm.change == 1"
      >
        <el-radio-group
          v-model="orderForm.appoint"
          size="small"
        >
          <el-radio label="0">委派给引流讲师</el-radio>
          <el-radio label="1">不委派给引流讲师</el-radio>
          <el-radio label="2">无需求</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="Deal deadline"
        prop="endCourseTime"
        class="other-style"
        v-if="orderForm.type != 68 && orderForm.studSpecialOrderExt.type != 128 "
      >
        <el-date-picker
          type="datetime"
          v-model="orderForm.endCourseTime"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          :picker-options="pickerOptions"
          placeholder="选择日期"
          default-time="00:00:00"
          size="small"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="Official deadline"
        prop="examTime"
        v-if="orderForm.change != 0 && orderForm.type != 68 && orderForm.studSpecialOrderExt.type != 128"
        class="other-style"
      >
        <el-date-picker
          type="datetime"
          :picker-options="pickerOptions2"
          v-model="orderForm.examTime"
          default-time="23:59:59"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          size="small"
          @change="getTimeRange"
          placeholder="选择日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item
        label="客户希望复习资料类型"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 1"
      >
        <el-select
          v-model="orderForm.studSpecialOrderExt.reviewMaterialType"
          placeholder="请选择复习资料类型"
          style="width:100%"
          size="small"
        >
          <el-option
            :label="order.name"
            :value="order.id"
            v-for="(order,index) in cousterdataType"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="客户的额外需求"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 1"
      >
        <textarea
          class="order-textarea"
          placeholder="请输入客户的额外需求"
          v-model="orderForm.studSpecialOrderExt.customerExtraDemand"
        />
      </el-form-item>
      <!-- <el-form-item label="课程代码" prop="courseCode" v-if="orderForm.type != 67 " class="other-style">
        <el-input style="width:100%" v-model="orderForm.courseCode" size="small" />
      </el-form-item> -->

      <!-- 字数/工作量参数添加 -->
      <el-form-item
        label="字数"
        prop="wordsNum"
        v-if="orderForm.type == 66 && orderForm.studSpecialOrderExt.type != 128 "
        class="other-style"
      >
        <el-input
          style="width:100%"
          type="number"
          @keypress.native="disableInputSymbol2"
          v-model="orderForm.wordsNum"
          size="small"
        />
      </el-form-item>
      <!-- 特殊报价 -->
      <el-form-item
        label="特殊报价"
        prop="theSpecialOffer"
        class="other-style"
        v-if="['129','130'].includes(orderForm.studSpecialOrderExt.type)"
      >
        <el-switch
          v-model="orderForm.theSpecialOffer"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item
        label="工作量"
        prop="studSpecialOrderExt.workload"
        v-if="(orderForm.theSpecialOffer&&(['129','130'].includes(orderForm.studSpecialOrderExt.type))||!(['129','130'].includes(orderForm.studSpecialOrderExt.type)))&&((orderForm.studSpecialOrderExt.type>2&&orderForm.studSpecialOrderExt.type!=32)|| orderForm.studSpecialOrderExt.type == 128)"
        class="other-style"
      >
        <el-input
          style="width:100%"
          type="number"
          min="1"
          v-model="orderForm.studSpecialOrderExt.workload"
          @keypress.native="disableInputSymbol"
          size="small"
        />
      </el-form-item>
      <el-form-item
        :label="itemf.question"
        :prop="'sellerDemandDesc.' + indexf + '.answer'"
        :rules="{required:true,message:'请输入'+ itemf.question, trigger:!itemf.select?'blur':'change'}"
        v-for="(itemf,indexf) in orderForm.sellerDemandDesc"
        :key="indexf"
        class="other-style"
        v-if="!([65,66,68,71].includes(Number(orderForm.type)))"
      >
        <!-- v-if="orderForm.type != 68 && orderForm.type != 66 && orderForm.type != 65" -->
        <textarea
          class="order-textarea"
          v-model="itemf.answer"
          v-if="itemf.question.includes('需求')"
        />
        <el-input
          size="small"
          style="width:100%"
          v-model="itemf.answer"
          v-else-if="!itemf.select"
        />
        <el-select
          placeholder="请选择"
          v-model="itemf.answer"
          style="width:100%"
          size="small"
          v-else
        >
          <el-option
            :label="items"
            :value="items"
            :key="keys"
            v-for="(items,keys) in itemf.select"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 论文大礼包3.0 -->
      <!-- { required: true, message: "请上传客户信息表", validator: validateCustomerArr, trigger: "change" } -->
      <!-- itemf.question.includes('学生目前作业进度')?{ required: true, validator: validateProgress, trigger: "change" }: -->
      <!-- :rules="!itemf.question.includes('学生的订单需求是') ? {required:itemf.type == 4&& orderForm.type == 71?false:true,message:'请输入'+ itemf.question, trigger:!itemf.select?'blur':'change'} : {required:true,type: 'array'}" -->
      <div v-if="[65,71].includes(Number(orderForm.type))&&orderForm.sellerDemandDesc.length">
        <el-form-item
          :label="itemf.question"
          :prop="itemf.question.includes('学生的订单需求是') ? '' : 'sellerDemandDesc.' + indexf + '.answer'"
          v-for="(itemf,indexf) in orderForm.sellerDemandDesc"
          :rules="!itemf.question.includes('学生的订单需求是') ? {required:itemf.type == 4&& orderForm.type == 71?false:true,validator:itemf.question.includes('学生目前作业进度')?validateProgress:'',message:'请输入'+ itemf.question, trigger:!itemf.select?'blur':'change'} : {required:true,type: 'array'}"
          :key="indexf"
          class="other-style"
        >
          <el-input
            size="small"
            style="width:100%"
            v-model="itemf.answer"
            v-if="!itemf.select && !itemf.question.includes('学生的订单需求是')"
          />
          <div v-else-if="itemf.question.includes('学生的订单需求是')">
            <div
              v-for="(item,index) in orderForm.needsList"
              :style="{ marginTop:index? '8px':'' }"
              :key="index"
              class="needs-list"
            >
              <span class="needNum">需求{{index+1}}:</span>
              <textarea
                class="order-textarea"
                v-model="item.answer"
              />
              <i
                class="el-icon-delete"
                @click="deleteNeed(index)"
                v-if="orderForm.needsList.length>1"
              ></i>
            </div>
            <el-button
              type="primary"
              size="small"
              @click="addNeed"
              style="margin:10px 0 0 0px"
            >新增</el-button>
          </div>
          <el-select
            placeholder="请选择"
            v-model="itemf.answer"
            style="width:100%"
            size="small"
            :style="{width:itemf.question.includes('学生目前作业进度')&&itemf.answer=='进行中'?'50%':'100%'}"
            v-else
          >
            <el-option
              :label="items"
              :value="items"
              :key="keys"
              v-for="(items,keys) in itemf.select"
            ></el-option>

          </el-select>
          <span
            v-if="itemf.question.includes('学生目前作业进度')&&itemf.answer=='进行中'"
            class="progress"
          >
            <el-input
              type="number"
              style="width:48%;margin-left:2%"
              v-model="itemf.progress"
              placeholder="请输入当前进度（可模糊）"
              oninput="if(value<0)value=0;if(value>100)value=100"
              onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
            > <span slot="append">%</span></el-input>
          </span>
        </el-form-item>
      </div>
      <!-- 特殊订单考试订单 -->
      <el-form-item
        label="订单需求"
        v-if="(orderForm.studSpecialOrderExt && orderForm.studSpecialOrderExt.type == 128  && orderForm.type == 66)"
      >
        <div>
          <div
            v-for="(item,index) in orderForm.needsList"
            :style="{ marginTop:index? '8px':'' }"
            :key="index"
            class="needs-list"
          >
            <span class="needNum">需求{{index+1}}:</span>
            <textarea
              class="order-textarea"
              v-model="item.answer"
            />
            <i
              class="el-icon-delete"
              style="margin-left:10px"
              @click="deleteNeed(index)"
              v-if="orderForm.needsList.length>1"
            ></i>
          </div>
          <el-button
            type="primary"
            size="small"
            @click="addNeed"
            style="margin:10px 0 0 0px"
          >新增</el-button>
        </div>
      </el-form-item>
      <el-form-item
        label="学生的订单需求是"
        prop="sellerDemandDesc"
        class="other-style"
        v-if="orderForm.type == 68 || (orderForm.studSpecialOrderExt.type > 1 && orderForm.studSpecialOrderExt.type != 128)"
        :rules="{required:true,message:'请输入学生的订单需求是', trigger:'blur'}"
      >
        <textarea
          class="order-textarea"
          v-model="orderForm.sellerDemandDesc"
          placeholder="请输入学生的订单需求"
        />
      </el-form-item>
      <el-form-item
        label="客户信息表"
        prop="customerArr"
        v-if="orderForm.studSpecialOrderExt.type == 2 || orderForm.studSpecialOrderExt.type == 130"
      >
        <uploadfile
          :urlarr="orderForm.customerArr"
          :nodesc="true"
          :type="21"
          @refreshUrlArr="refreshUrlArr"
        />
      </el-form-item>
      <el-form-item
        label="CV"
        prop="cvArr"
        v-if="orderForm.studSpecialOrderExt.type == 130"
      >
        <uploadfile
          :urlarr="orderForm.cvArr"
          :nodesc="true"
          :type="0"
          @refreshUrlArr="refreshUrlArr"
        />
      </el-form-item>
      <el-form-item
        label="Original Work"
        prop="originalArr"
        v-if="orderForm.studSpecialOrderExt.type == 129"
      >
        <uploadfile
          :urlarr="orderForm.originalArr"
          :nodesc="true"
          :type="0"
          @refreshUrlArr="refreshUrlArr"
        />
      </el-form-item>
      <el-form-item
        label="上传学生文件"
        v-if="orderForm.change == 0"
      >
        <uploadfile
          :urlarr="orderForm.studentFiles"
          :type="2"
          @refreshUrlArr="refreshUrlArr"
        />
      </el-form-item>
      <el-form-item
        label="请上传一篇学生近期自主完成的Essay提供讲师参考"
        v-if="orderForm.change == 1"
      >
        <uploadfile
          :urlarr="orderForm.studentEssayFiles"
          :type="3"
        />
      </el-form-item>
      <el-form-item
        label="订单备注"
        prop="remark"
        class="other-style"
      >
        <textarea
          class="order-textarea"
          v-model="orderForm.remark"
        />
      </el-form-item>
      <!-- <el-form-item
        label="选择推荐人"
        prop="recommendUserId"
        class="other-style"
        v-if="recommendModel == 1"
      >
        <el-select
          v-model="orderForm.recommendUserId"
          filterable
          placeholder="请选择推荐人"
          style="width:100%"
          size="small"
          v-loading="recommenduserloading"
        >
          <el-option
            style="width:350px"
            :label="user.username"
            :value="user.id"
            v-for="(user,indexs) in recommenduserList"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <!-- 特殊订单子订单考试类型展示 -->
      <el-form-item
        label="考试类型"
        prop="studSpecialOrderExam.examType"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128"
      >
        <el-radio-group v-model="orderForm.studSpecialOrderExam.examType">
          <el-radio :label="1">weekly Quiz</el-radio>
          <el-radio :label="2">Homework</el-radio>
          <el-radio :label="3">Mid-term</el-radio>
          <el-radio :label="4">Final exam</el-radio>
          <el-radio :label="5">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="其他考试类型"
        prop="studSpecialOrderExam.examTypeName"
        class="other-style"
        v-if="orderForm.studSpecialOrderExam.examType == 5"
      >
        <el-input
          v-model="orderForm.studSpecialOrderExam.examTypeName"
          placeholder="请输入其他原因展示"
        />
      </el-form-item>
      <el-form-item
        label="辅助考试方法"
        prop="studSpecialOrderExam.assistExamWay"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128"
      >
        <el-radio-group v-model="orderForm.studSpecialOrderExam.assistExamWay">
          <el-radio :label="1">Login(讲师独立完成)</el-radio>
          <!-- A1 -->
          <el-radio :label="2">拍照考试</el-radio>
          <!-- A2 -->
          <el-radio :label="3">屏幕共享/远程</el-radio>
          <!-- A3 -->
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="考试形式"
        class="other-style"
        prop="studSpecialOrderExam.examForm"
        v-if="orderForm.studSpecialOrderExt.type == 128"
      >
        <el-radio-group v-model="orderForm.studSpecialOrderExam.examForm">
          <el-radio :label="1">限时考试</el-radio>
          <!-- B1 -->
          <el-radio :label="2">不限时考试，>=24小时开放</el-radio>
          <!-- B2 -->
          <el-radio :label="3">限时考试，>=24小时开放</el-radio>
          <!-- B3 -->
        </el-radio-group>
      </el-form-item>
      <!-- 考试订单组合类型表单展示 -->
      <!-- A3+B1/2/3 -->
      <el-form-item
        label="如有特定软件需求，请填写清楚"
        prop="studSpecialOrderExam.softwareDemand"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.assistExamWay == 3"
      >
        <textarea
          class="order-textarea"
          v-model="orderForm.studSpecialOrderExam.softwareDemand"
        />
      </el-form-item>
      <!-- A1+B1/B2/B3 -->
      <el-form-item
        label="考试链接"
        prop="studSpecialOrderExam.examUrl"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.assistExamWay == 1 "
      >
        <el-input
          placeholder=""
          v-model="orderForm.studSpecialOrderExam.examUrl"
        />
      </el-form-item>
      <el-form-item
        label="学生系统账号"
        prop="studSpecialOrderExam.studSysAccount"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.assistExamWay == 1 "
      >
        <el-input
          placeholder=""
          v-model="orderForm.studSpecialOrderExam.studSysAccount"
        />
      </el-form-item>
      <el-form-item
        label="学生系统密码"
        prop="studSpecialOrderExam.studSysAccountPassword"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.assistExamWay == 1 "
      >
        <el-input
          placeholder=""
          v-model="orderForm.studSpecialOrderExam.studSysAccountPassword"
          type="text"
        />
      </el-form-item>
      <!-- A1+B1/B3
      &&A2+B1/B3
      && A3+B1/B3 -->
      <el-form-item
        label="考试限制时长"
        prop="studSpecialOrderExam.examLimitTime"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.examForm != 2"
      >
        <el-input
          placeholder="请输入考试限制时长"
          v-model="orderForm.studSpecialOrderExam.examLimitTime"
          type="number"
        >
          <template slot="append">Mins</template>
        </el-input>
      </el-form-item>
      <!-- A1+B1/B3
     && A2+B1/B2/B3
     && A3+B1/B2/B3-->
      <el-form-item
        label="具体考试开始时间"
        prop="studSpecialOrderExam.realExamStartTime"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.examForm == 1"
      >
        <el-date-picker
          type="datetime"
          v-model="orderForm.studSpecialOrderExam.realExamStartTime"
          :picker-options="pickerOptions"
          default-time="00:00:00"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          size="small"
          placeholder="选择日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="具体考试结束时间"
        prop="studSpecialOrderExam.realExamEndTime"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.examForm == 1"
      >
        <el-date-picker
          type="datetime"
          v-model="orderForm.studSpecialOrderExam.realExamEndTime"
          :picker-options="pickerOptionstestdetail"
          default-time="23:59:59"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          size="small"
          placeholder="选择日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <!-- A1+B2/B3 
      && A2+B2/B3
       && A3+B2/B3 -->
      <el-form-item
        label="考试开放时间"
        prop="studSpecialOrderExam.examOpenTime"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.examForm != 1"
      >
        <el-date-picker
          type="datetime"
          :picker-options="pickerOptions"
          default-time="00:00:00"
          v-model="orderForm.studSpecialOrderExam.examOpenTime"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          size="small"
          placeholder="选择日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="考试关闭时间"
        prop="studSpecialOrderExam.examCloseTime"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.examForm != 1"
      >
        <el-date-picker
          type="datetime"
          v-model="orderForm.studSpecialOrderExam.examCloseTime"
          :picker-options="pickerOptionstestclose"
          default-time="23:59:59"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          size="small"
          placeholder="选择日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <!-- A1+B2 -->
      <el-form-item
        label="讲师最晚提交时间"
        prop="studSpecialOrderExam.teacLatestCommitTime"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 && (orderForm.studSpecialOrderExam.assistExamWay == 1 && orderForm.studSpecialOrderExam.examForm == 2)"
      >
        <el-date-picker
          type="datetime"
          :picker-options="pickerOptions"
          v-model="orderForm.studSpecialOrderExam.teacLatestCommitTime"
          default-time="00:00:00"
          format="yyyy年MM月dd HH:mm:ss"
          value-format="yyyy/MM/dd HH:mm:ss"
          size="small"
          placeholder="选择日期"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
      <!-- 考试订单其他展示 -->
      <el-form-item
        label="考试题型（可多选）"
        prop="studSpecialOrderExam.examItemType"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128"
      >
        <el-checkbox-group v-model="orderForm.studSpecialOrderExam.examItemType">
          <el-checkbox
            v-for="(examItem,indexs) in examItemTypeArr"
            :label="examItem.type"
            :key="indexs"
          >{{examItem.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-if="showOther"
        prop="studSpecialOrderExam.otherExamItemName"
        label="其他考试题型名称"
      >
        <el-input
          v-model="orderForm.studSpecialOrderExam.otherExamItemName"
          placeholder="请输入其他考试题型名称"
        />
      </el-form-item>
      <el-form-item
        label="是否为补考考试"
        prop="studSpecialOrderExam.resit"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128"
      >
        <el-radio-group v-model="orderForm.studSpecialOrderExam.resit">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 考试订单/论文修改/作业订单需求 type = 4/64/128 -->
      <!-- || orderForm.studSpecialOrderExt.type == 64 || orderForm.studSpecialOrderExt.type == 8 暂时只要考试订单-->
      <el-form-item
        label="是否保分"
        prop="studSpecialOrderExam.assuring"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128 || orderForm.studSpecialOrderExt.type == 64 || orderForm.studSpecialOrderExt.type == 4"
      >
        <el-radio-group v-model="orderForm.studSpecialOrderExam.assuring">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1"> 是</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item prop="studSpecialOrderExam.defaultPassScore" v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.assuring ==0">
        订单默认
        <el-input style="width:200px" type="number" v-model="orderForm.studSpecialOrderExam.defaultPassScore">
          <template slot="append">分</template>
        </el-input>
        {{orderForm.studSpecialOrderExam.assuring == 0?'PASS':''}}
      </el-form-item> -->
      <el-form-item
        prop="studSpecialOrderExam.assuringScore"
        v-if="orderForm.studSpecialOrderExam.assuring == 1"
      >
        <el-input
          style="width:200px"
          type="number"
          v-model="orderForm.studSpecialOrderExam.assuringScore"
        >
          <template slot="append">分</template>
        </el-input>
        {{orderForm.studSpecialOrderExam.assuring == 0?'PASS':''}}
      </el-form-item>
      <template v-if="[65,71].includes(Number(orderForm.type))">
        <!-- 论文大礼包保分展示 -->
        <el-form-item
          label="是否保分"
          prop="assuring"
          class="other-style"
        >
          <el-radio-group v-model="orderForm.assuring">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1"> 是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="guaranteeScore"
          v-if="orderForm.assuring == 1"
        >
          <el-input
            style="width:200px"
            type="number"
            v-model="orderForm.guaranteeScore"
          >
            <template slot="append">分</template>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item
        label="是否上传pastPaper文件"
        prop="studSpecialOrderExam.isUploadPpastPaperFile"
        class="other-style"
        v-if="orderForm.studSpecialOrderExt.type == 128"
      >
        <el-radio-group v-model="orderForm.studSpecialOrderExam.isUploadPpastPaperFile">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="pastPaper"
        prop="pastPaperArr"
        v-if="orderForm.studSpecialOrderExt.type == 128 && orderForm.studSpecialOrderExam.isUploadPpastPaperFile == 1"
      >
        <uploadfile
          :urlarr="orderForm.pastPaperArr"
          :id="groupId"
          @refreshUrlArr="refreshUrlArr"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { disableInputSymbol,disableInputSymbol2 } from '@/utils/handleTimes'
import {
  getOrderQuestions,
  getUndoneCustomList,
  recommenduser,
  getgroupList,
  queryCourseCodeAndStudId,
  professionalList,
  channelList,
  getRed,
  getUserDetailsInfo,
} from "@/api/order";
import { SysCode } from "@/utils/Enum/Customer/Account";
import uploadfile from "./conponment/uploadfile";
import { queryMyChannelList } from '@/api/orderwy'

export default {
  props: ["orderForm", "status", "userid", "ordertype", "sonid"],
  data() {
    let that = this;
    var validateCustomerArr = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传客户信息表'));
      } else {
        callback();
      }
    };
    var validateCVArr = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传CV'));
      } else {
        callback();
      }
    };
    var validateOriginalArr = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传Original Work'));
      } else {
        callback();
      }
    };
    var validatecertificateFileList = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传渠道证明'));
      } else {
        callback();
      }
    };
    var validatePastPaperArr = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传pastPaper文件'));
      } else {
        callback();
      }
    };
    var validateProgress = (rule, value, callback) => {
      if (this.orderForm.sellerDemandDesc && this.orderForm.sellerDemandDesc[1]) {
        if (!this.orderForm.sellerDemandDesc[1].answer) {
          callback(new Error('请选择学生目前作业进度'));
        } else if (this.orderForm.sellerDemandDesc[1].answer && this.orderForm.sellerDemandDesc[1].answer == '进行中' && !this.orderForm.sellerDemandDesc[1].progress) {
          callback(new Error('填写输入当前进度'));
        } else {
          callback();
        }

      }
    };
    return {
      validateProgress,
      studentRadio: "",
      checked: false,
      channelList: [],
      recommenduserList: [],
      recommenduserloading: false,
      // {name:'Mutiple choice/True or False/填空',type:1},{name:'简答',type:2},{name:'论文',type:3},{name:'编程/代码',type:4},{name:'其他',type:5}
      examItemTypeArr: [{ name: 'Mutiple choice', type: 1 }, { name: 'True or False', type: 2 }, { name: 'fill-in-the-blank(填空)', type: 3 }, { name: 'short answer question', type: 4 }, { name: 'Essay类写作', type: 5 }, { name: 'Programming/code', type: 6 }, { name: 'Numberical question/Calculations(计算题)', type: 7 }, { name: 'Unknow', type: 8 }],
      cousterdataType: [
        { id: "1", name: "覆盖全部lecture" },
        { id: "2", name: "考点/重点优先，突击为主" },
        { id: "4", name: "越细越好，希望扩展" },
      ],
      testTypeObj: {
        1: 'weekly quiz',
        2: 'homework',
        3: 'Mid_term',
        4: 'Final_exam',
        5: '其他'
      },
      specilTypeArr: [
        { id: "1", name: "资料整理" },
        { id: "2", name: "Appeal Letter" },
        { id: "4", name: "作业订单" },
        { id: "8", name: "论文批改" },
        { id: "16", name: "Proofreading" },
        { id: "32", name: "Past-paper" },
        { id: "64", name: "论文修改" },
        { id: "128", name: "考试订单" },
        { id: "129", name: "translation" },
        { id: "130", name: "Personal Statement" },
      ],
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          let choosedate = new Date(that.orderForm.endCourseTime);
          let hours = choosedate.getHours() * 60 * 60 * 1000,
            mins = choosedate.getMinutes() * 60 * 1000,
            seconds = choosedate.getSeconds() * 1000,
            alltimes = hours + mins + seconds;
          let defaultDate = choosedate.getTime() - alltimes,
            spaceTime = choosedate > defaultDate ? 8.64e7 : 0;
          return time.getTime() < choosedate.getTime() - spaceTime;
        },
      },
      pickerOptionstestdetail: {
        disabledDate: (time) => {
          let choosedate = new Date(that.orderForm.studSpecialOrderExam.realExamStartTime);
          let hours = choosedate.getHours() * 60 * 60 * 1000,
            mins = choosedate.getMinutes() * 60 * 1000,
            seconds = choosedate.getSeconds() * 1000,
            alltimes = hours + mins + seconds;
          let defaultDate = choosedate.getTime() - alltimes,
            spaceTime = choosedate > defaultDate ? 8.64e7 : 0;
          return time.getTime() < choosedate.getTime() - spaceTime;
        },
      },
      pickerOptionstestclose: {
        disabledDate: (time) => {
          let choosedate = new Date(that.orderForm.studSpecialOrderExam.examOpenTime);
          let hours = choosedate.getHours() * 60 * 60 * 1000,
            mins = choosedate.getMinutes() * 60 * 1000,
            seconds = choosedate.getSeconds() * 1000,
            alltimes = hours + mins + seconds;
          let defaultDate = choosedate.getTime() - alltimes,
            spaceTime = choosedate > defaultDate ? 8.64e7 : 0;
          return time.getTime() < choosedate.getTime() - spaceTime;
        },
      },
      type: "",
      orderList: [],
      userList: [],
      orderloading: false,
      userloading: false,
      qustionType: {
        0: "0",
        1: "1",
        65: "4",
        67: "5",
        71: "7",
      },
      groupId: '',
      rules: {
        studSpecialOrderExam: {
          examType: [
            { required: true, message: "请选择考试类型", trigger: "change" },
          ],
          examTypeName: [
            { required: true, message: "请输入其他考试类型", trigger: "blur" },
          ],
          assistExamWay: [
            { required: true, message: "请选择辅助考试方法", trigger: "change" },
          ],
          examForm: [
            { required: true, message: "请选择考试形式", trigger: "change" },
          ],
          examUrl: [
            { required: true, message: "请输入考试链接", trigger: "blur" },
          ],
          studSysAccount: [
            { required: true, message: "请输入学生系统账号", trigger: "blur" },
          ],
          studSysAccountPassword: [
            { required: true, message: "请输入学生系统密码", trigger: "blur" },
          ],
          examLimitTime: [
            { required: true, message: "请输入考试限制时长", trigger: "blur" },
          ],
          examOpenTime: [
            { required: true, message: "请选择考试开放时间", trigger: "change" },
          ],
          examCloseTime: [
            { required: true, message: "请选择考试结束时间", trigger: "change" },
          ],
          realExamStartTime: [
            { required: true, message: "请选择具体考试开始时间", trigger: "change" },
          ],
          realExamEndTime: [
            { required: true, message: "请选择具体考试结束时间", trigger: "change" },
          ],
          resit: [
            { required: true, message: "请选择是否为补考考试", trigger: "change" },
          ],
          assuring: [
            { required: true, message: "请选择是否保分", trigger: "change" },
          ],
          defaultPassScore: [
            { required: true, message: "请输入默认不保分通过分数", trigger: "blur" },
          ],
          assuringScore: [
            { required: true, message: "请输入保分通过分数", trigger: "blur" },
          ],
          isUploadPpastPaperFile: [
            { required: true, message: "请选择是否上传pastPaper文件", trigger: "change" },
          ],
          examItemType: [
            { required: true, message: "请选择考试题型", trigger: "change" },
          ],
          otherExamItemName: [
            { required: true, message: "请输入其他考试题型", trigger: "blur" },
          ],
        },
        // recommendUserId: [
        //   { required: true, message: "请选择推荐人", trigger: "change" },
        // ],
        sellerChannelId: [
          { required: true, message: "请选择渠道", trigger: "change" },
        ],
        parentId: [
          { required: true, message: "请选择关联订单", trigger: "change" },
        ],
        examTime: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        endCourseTime: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        courseCode: [
          { required: true, message: "请输入课程代码", trigger: "blur" },
        ],
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        theSpecialOffer: [{ required: true, message: "请选择特殊报价", trigger: "change" },],
        topicDemand: [
          { required: true, message: "请输入学生的定题需求", trigger: "blur" },
        ],
        customerArr: [
          { required: true, message: "请上传客户信息表", validator: validateCustomerArr, trigger: "change" },
        ],
        cvArr: [{ required: true, message: "请上传CV", validator: validateCVArr, trigger: "change" },],
        originalArr: [{ required: true, message: "请上传Original Work", validator: validateOriginalArr, trigger: "change" },],
        certificateFileList: [{ required: true, message: "请上传渠道证明", validator: validatecertificateFileList, trigger: "change" },],
        pastPaperArr: [
          { required: true, message: "请上传pastPaper文件", validator: validatePastPaperArr, trigger: "change" },
        ],
        studSpecialOrderExt: {
          type: [
            { required: true, message: "请选择子订单类型", trigger: "change" },
          ],
          workload: [
            { required: true, message: "请输入工作量", trigger: "blur" },
          ],
        },
        courseCode: [{ required: true, message: "请输入courseCode", trigger: "change" }],
        professionalId: [{ required: true, message: "请选择Specialization", trigger: "blur" }],
      },
      coursecodetext: {
        0: '正在验证课程代码是否存在…',
        1: '课程代码验证通过，匹配到专业为',
        2: '课程代码验证失败，请确定你的课程代码是否填写无误，若无误请继续填写以下内容'
      },
      professionalLoading: false,
      professionalName: '',
      professionalEnName: '',
      coursecodesrc: {
        0: require('@/assets/images/order/coursecode-check.png'),
        1: require('@/assets/images/order/coursecode-success.png'),
        2: require('@/assets/images/order/coursecode-error.png')
      },
      courseCodeLoading: false,
      professionalListArr: [],
      isFlower: false, //小红花开关
      redFlowerNum: 0, //小红花数量
      userId: '',
    };
  },
  components: {
    uploadfile,
  },
  computed: {
    showOther() {
      let index = this.orderForm.studSpecialOrderExam.examItemType.findIndex(item => item == 8);
      console.log(index, 'index')
      return index > -1 ? true : false;
    }
  },
  async created() {
    if (['1', '2', '129', '130'].includes(this.sonid)) {
      this.orderForm.studSpecialOrderExt.type = this.sonid
      this.handleChildType(this.sonid)
    }
    this.orderForm.type = this.ordertype;
    await this.professionalList();
    if (this.qustionType[this.ordertype] && !this.orderForm.sellerDemandDesc.length) {
      //请求问题类型不同转换
      await this.getOrderQuestions(this.qustionType[this.ordertype]);
    }
    await this.getUndoneCustomList();
    // await this.recommenduser();
    // await this.getChannelList()
    if (this.ordertype == 66) {
      this.getgroupList();
    }
    //小红花
    await this.getUserDetailsInfo();
    this.getRed()
  },
  methods: {
    disableInputSymbol,
    disableInputSymbol2,
    clearcourseData() {
      this.orderForm.courseCode = null;
      this.orderForm.checkCourseCode = 0;
      this.orderForm.professionalId = null;
    },
    initStatus() {
      this.orderForm.checkCourseCode = 0;
    },
    async queryCourseCodeAndStudId() {
      if (!this.orderForm.courseCode) return;
      this.courseCodeLoading = true;
      let params = {
        courseCode: this.orderForm.courseCode,
        studId: this.userid
      }
      this.professionalName = '';
      this.professionalEnName = '';
      let { status, body } = await queryCourseCodeAndStudId(params);
      this.courseCodeLoading = false;
      if (status == 200) {
        this.orderForm.checkCourseCode = 1;
        if (!body) {
          this.orderForm.checkCourseCode = 2;
          this.professionalList();
        } else {
          this.professionalName = body.professionalName;
          this.professionalEnName = body.professionalEnName;
        }
      }
      this.$forceUpdate()
      console.log(body)
    },
    async professionalList() {
      this.professionalLoading = true;
      let { status, body } = await professionalList({ page: 1, limit: 1000, type: 2 });
      this.professionalLoading = false;
      if (status == 200) {
        this.professionalListArr = body;
      }
      console.log(body)
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
        list.length &&
          list.forEach((item) => {
            if (item.groupName == 'Past Paper') {
              this.groupId = item.id
            }
          })
      }
    },
    getTimeRange() { },
    changesModel() {
      // this.orderForm.recommendUserId = "";
      this.orderForm.sellerChannelId = ""
      this.getChannelList()
    },
    async getOrderQuestions(type) {
      let sysCode = SysCode.DAOBI;
      const { status, body } = await getOrderQuestions({ sysCode, type });
      if (status == 200) {
        body.length &&
          body.forEach((item) => {
            item.select = JSON.parse(item.select);
          });
        this.orderForm.sellerDemandDesc = body;
        console.log(9090, this.orderForm.sellerDemandDesc)
      }
    },
    // async recommenduser() {
    //   const datas = {
    //     page: 1,
    //     limit: 1000,
    //     key: "",
    //   };
    //   this.recommenduserloading = true;
    //   const { status, body } = await recommenduser(datas);
    //   this.recommenduserloading = false;
    //   if (status == 200) {
    //     this.recommenduserList = body.list;
    //     this.recommenduserloading = false;
    //   }else{
    //     this.recommenduserloading = false;
    //   }
    // },
    // 获取渠道列表
    async getChannelList() {
      const datas = {
        page: 1,
        limit: 1000,
        channelStatus: 1,//渠道状态：0-停用 1-启用
        userId: this.userid,
        contractStatus: 0,
      };
      this.recommenduserloading = true;
      const { status, body } = await queryMyChannelList(datas);

      if (status == 200) {
        if (body) {
          this.channelList = body.list || [];
        }
        this.recommenduserloading = false;
      } else {
        this.recommenduserloading = false;
      }
    },
    async getUndoneCustomList() {
      let sysCode = SysCode.DAOBI,
        userId = this.orderForm.ucId;
      this.orderloading = true;
      const { status, body } = await getUndoneCustomList({ sysCode, userId });
      this.orderloading = false;
      if (status == 200) {
        this.orderList = body;
      }
    },
    changesRadios() {
      let tapArr = [];
      if (this.orderForm.change) {
        tapArr =
          //  [
          //   "返回",
          //   "学生信息",
          //   "订单信息",
          //   "选择辅导阶段",
          //   "订单附件",
          //   "财务信息",
          //   "提交",
          // ];
          [{ name: "返回" }, { name: "学生信息" }, { name: "订单信息" }, { name: "选择辅导阶段" }, { name: "订单附件" }, { name: "财务信息" }, { name: "提交" }]
      } else {
        tapArr =
          // ["返回", "学生信息", "订单信息", "订单附件", "提交"];
          [{ name: "返回" }, { name: "学生信息" }, { name: "订单信息" }, { name: "订单附件" }, { name: "提交" }]
      }
      const change = this.orderForm.change;
      this.$store.dispatch("setToptaparr", tapArr);
      this.clearForm();
      this.orderForm.studSpecialOrderExam.assuring = ''
    },
    clearForm() {
      this.$nextTick(() => {
        this.$refs.orderform.clearValidate();
      })
    },
    handleChildType(e) {
      this.clearForm();
      this.orderForm.studSpecialOrderExt.customerInfoExcelUrl;
      this.clearForm();

    },
    chagneStatus() {
      if (!this.checked) {
        this.orderForm.parentId = "";
      }
    },
    refreshUrlArr() {
      this.$refs.orderform.validate((valid) => {
        if (valid) {
        }
      });
    },
    formjudge() {
      let status = false;
      this.$refs.orderform.validate((valid) => {
        if (valid) {
          status = true;
        }
      });
      // let typearr = ['customerArr','studentFiles','pastPaperArr','originalArr', 'cvArr'];
      // typearr.forEach(list=>{
      //   if(this.orderForm[list].length){
      //     this.orderForm[list].forEach(item=>{
      //       if(!item.description){
      //         status = false;
      //         this.$message({
      //           message: '请检查上传文件组，有未填写文件描述',
      //           type: "error",
      //         });
      //       }
      //     })
      //   }
      // })
      if (this.orderForm.studSpecialOrderExam.examType != 5) {
        this.orderForm.studSpecialOrderExam.examTypeName = this.testTypeObj[this.orderForm.studSpecialOrderExam.examType];
      }
      return status;
    },
    addNeed() {
      this.orderForm.needsList.push({
        answer: "",
      });
    },
    deleteNeed(index) {
      this.orderForm.needsList.splice(index, 1);
    },
    changeValue(val) {
      this.$set(this.orderForm, 'courseCode', val.replace(/[^A-Za-z0-9]/g, ''))//只能输英文字母及数字
    },
    // 小红花
    changeRed() {
      this.$set(this.orderForm, "hongHua", this.isFlower ? 1 : "")
    },
    async getRed() {
      let res = await getRed({
        userId: this.userId,
        type: 1,
      })
      if (res.status == 200) {
        this.redFlowerNum = res.body?.number || 0
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
<style>
.other-style .el-form-item__label {
  padding: 0;
  color: #8c8c8c;
}
/deep/.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  width: 100% !important;
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
  .order-textinput {
    height: 56px;
  }
  .order-textarea {
    width: 100%;
    height: 56px;
    border-radius: 4px;
    padding: 6px 10px;
    border: 1px solid rgba(217, 217, 217, 1);
    &::placeholder {
      line-height: 20px;

      color: #c0c4cc;
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
.courseCode-style {
  margin: 10px 0 0;
  img {
    display: block;
    margin-right: 4px;
    float: left;
    width: 14px;
    height: 14px;
  }
  span {
    display: block;
    height: 14px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
  }
}
.color0 {
  color: #48494c;
}
.color1 {
  color: #36b67d;
}
.color21 {
  color: #e45434;
}
.memo {
  color: red;
  font-size: 10px;
}
// 小红花样式
.red-flower {
  ::v-deep .el-form-item__content {
    display: inline-block;
  }
  ::v-deep .el-switch {
    margin: -5px 0 0 20px;
  }
}
.progress {
  ::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
}
</style>