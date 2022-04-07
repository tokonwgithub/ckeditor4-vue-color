/**author:xulanlan 
createTime:2021-01-14-14:52 
title:文亚订单展示入口首页 
editor:xulanlan
editTime:2021-01-14-14:52 */
<template>
   <div class="order-wrap-box" v-loading="allLoading" >
     <template v-if="allPremissionSatuts == 'have'">
      <h2 v-if="showStepBottom && !sectionOrderStatus"><span>Order Info</span>/Add Section</h2>
      <taps :bottomtapArr="bottomtapArr" :bottomtapIndex="bottomtapIndex" @changeTap="changeTap"/>
      <div class="content-height" :class="showStepBottom?'grouporder-height':''" id="allboxs">
        <clientinfo v-show="bottomtapIndex == 1&&!showStepBottom"  ref="clientinfo" :userid="userId" :forms="form" :againstatus.sync="againStatus" :editstatus.sync="orderEditType" />
        <orderinfo v-show="(!showStepBottom&&bottomtapIndex == 2)||(showStepBottom && bottomtapIndex == 1)"  ref="orderinfo"  :ordertypes.sync="ordertype" @hiddenBottomStep="hiddenBottomStep" :addchildstatus.sync="showStepBottom" :orderForm.sync="form" :userid="userId" :qywxOrder="qywxOrder" :againstatus.sync="againStatus" :ordereditstatus="orderEditType" :sectionOrderStatus.sync="sectionOrderStatus" @chagneTips="chagneTips"/>
        <orderfiles v-show="(bottomtapIndex == 3&&!showStepBottom) || (sectionOrderStatus&&bottomtapIndex == 2 )"  ref="orderfiles" :ordertype="ordertype" :allFile.sync="form.studCoursewareCVOList" @changeFiles="changeFile" :sectionstatus="sectionOrderStatus" />
        <financeinfo v-show="(!sectionOrderStatus && ((![1,11].includes(Number(ordertype)) && bottomtapIndex == 4 )|| (showStepBottom && bottomtapIndex == 2)) )|| (sectionOrderStatus && bottomtapIndex == 3)"  ref="financeinfo"  :ordertype="ordertype" :userid="userId" :orderForm.sync="form" :indexs="bottomtapIndex" :ordereditstatus="orderEditType" />
        <financeall v-show="[1,11].includes(Number(ordertype))&& bottomtapIndex == 4"  />
      </div>
      <bottombar :back="backTxt"  :pre="preTxt" @bottombarchange="bottombarchange" />
     </template>
     <template v-if="allPremissionSatuts == 'none'">
       <div class="none-perssmion">无权创建当前订单所属产品类型！</div>
     </template>
   </div>
</template>
<script>
  import { orderTypeQywx,orderType } from '@/utils/Enum/Permission'
  import { checkPermission } from "@/directives/permission";
import { mapState } from "vuex";
import { Base64 } from 'js-base64';
import {saveCopywritingOrderV1,queryOrderVarInfo,updateCopywritingOrder,queryStudentIsDbOrWy} from '@/api/orderwy'
import taps from './components/tap'
import bottombar from './components/bottombar'
import clientinfo from '../orderWenya/clientinfo'
import orderinfo from '../orderWenya/orderinfo'
import orderfiles from '../orderWenya/orderfiles'
import financeinfo from '../orderWenya/financeinfo'
import financeall from '../orderWenya/financeall'
import {timehandle,timechangedefault} from '@/utils/handleTimes'
import { Dialog } from "vant";
import { webUrl } from "config";
import { getToken } from '@/utils/Auth';
export default {
   data(){
      return {
        orderTypeQywx,
        orderType,
        childsform:{},
        form:{
          lockFlag:1,
          channelStatus:0,
          linkStatus:0,
          linkOrder:null,
          checkCourseCodeFlag :1,
          courseCode:'',
          hongHua:0,
          referenceSwitch: 0,
          theSpecialOffer: 0,
          guaranteeScoreSwitch: 0,
          guaranteeScore:'',
          referenceGuideArr:[],
          referenceStyle: null,
          // referenceSwitch:true,
          referenceStyleId: '',
          sellerChannelId:'',
          childFlag:0,
          checkCourseCode:0,
          professionalId:'',
          studCoursewareCVOList:[],
          groupOrderList:[],
          edtingCVO:{
            originalWork:[],
            editingFeedBack:[],
            specificFeedback:true,
          },
          profreadingCVO:{
            originalWork:[],
          },
          presentationCVO: {
            pptSlides: ''
          },
          feeCVOS:[],
          currencyWy:'',
          currency:'',
          deadline: '',
          realDeadline:'',
          examCVO: {
            examType: null,
            examTypeName: null,
            examLimitTimeLevel: null,
            realExamStartTime: null,
            realExamEndTime: null,
            examOpenTime: null,
            examCloseTime: null,
            examLimitTime: null,
            requireSpecificSoftware: null,
            difficultyDegree: null,
            assistExamWay: null,
            examUrl: '',
          },
          workload: 0,
          productTypeId: '',
          certificateFileList: [],
        },
        showStepBottom:false,
        ordertype:'',
        userId:'',
        backTxt:'Cancel',
        preTxt:'Order Info',
        bottomtapIndex:1,
        bottomtapArr:[{name:"Cancel"},{name:"Client Info",ref:'clientinfo'},{name:"Order Info",ref:'orderinfo'}, {name:"Order Files",ref:'orderfiles'},{name: "Finance Info",ref:'financeinfo'}, {name:"save",}],
        childtapArr:[{name:"Back"},{name:"Section Info",ref:'orderinfo'},{name:"Section Financial Info",ref:'financeinfo'},{name:"save"}],
        sectiontapchildArr:[{name:"Cancel"},{name:"Section Info",ref:'orderinfo'},{name:"Section Files",ref:'orderfiles'},{name:"Section Financial Info",ref:'financeinfo'},{name:"save"}],
        beforebotttomIndex:'',
        beforebotttomArr:'',
        childOrderIndex:'',//编辑子订单的索引
        sectionOrderStatus:false,//单独子订单下单展示标记字段
        againStatus:false,//再来一单标识
        orderEditType:'',//标识是不是修改订单类型
        allLoading:false,
        qywxOrder:false,//企业微信进入的标识
        wenyaStatus:2,//2真实数据区分来源于文亚还是导毕
        daobiStatus:1,
        studentIsDbOrWy:{},
        editcourseId:'',//修改订单的courseid记录
        productTypeIdObj: {
          2:10,
          3:12,
          11:11,
          4:13,
          8:14,
          9:15,
          // 0:1,
          // 1:2,
          // 65:3,
          // 67:4,
          // 66:6,
          // 68:5,
          // 66:7,
          // 66:8,
          // 66:9,
          // 71:18,
          // 70:17,
          // 1: 16,
        },
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
        allPremissionSatuts:null,
      }
   },
   components:{
     taps,
     bottombar,
     clientinfo,
     orderinfo,
     orderfiles,
     financeinfo,
     financeall
   },
   computed: {
      ...mapState({
         childorderList: (e) => e.order_user.childorderlist,
      }),
   },
   watch:{
     bottomtapArr(val){
       if(val.length==4){
           this.$refs.orderinfo.demoRedFlowerNum= this.$refs.orderinfo.redFlowerNum-(this.childorderList.filter(v=>v.hongHua)?.length||0)
       }
     }
   },
   created(){
     console.log('更新了没');
    sessionStorage.setItem('state','wy45');
    this.childsform = JSON.parse(JSON.stringify(this.form));
    this.initUrlParams();
   },
   methods:{
    checkPermission,
    changeFile(val){
      if(val && val.length){
        this.form.studCoursewareCVOList = this.form.studCoursewareCVOList.concat(val)
      }else{
        this.form.studCoursewareCVOList = [];
      }
     
    },
     hiddenBottomStep(status,index){
       this.showStepBottom = status;
       this.childOrderIndex = '';
       if(status){
          this.beforebotttomIndex = this.bottomtapIndex;
          this.beforebotttomArr = JSON.parse(JSON.stringify(this.bottomtapArr));
          this.beforeForm = JSON.parse(JSON.stringify(this.form));
          if(index>-1&&this.beforeForm.groupOrderList[index]){
            this.childOrderIndex = index;
            this.form = JSON.parse(JSON.stringify(this.beforeForm.groupOrderList[index]));
          }else{
            // grouporder/大论文创建子订单继承原订单数据
            const {referenceSwitch,referenceGuide,referenceGuideName,referenceGuideArr,referenceStyle,referenceStyleId,description,remark,type,linkOrder,checkCourseCodeFlag,courseName,courseCode,guaranteeScoreSwitch,guaranteeScore,feeCVOS,checkCourseCode,professionalId,channelStatus,sellerChannelId,childType,hongHua} = this.form;
            this.childsform.referenceSwitch = referenceSwitch;
            this.childsform.referenceGuide = referenceGuide;
            this.childsform.referenceGuideName = referenceGuideName;
            this.childsform.referenceGuideArr = referenceGuideArr;
            this.childsform.referenceStyle = referenceStyle;
            this.childsform.referenceStyleId = referenceStyleId;
            this.childsform.description = description;
            this.childsform.remark = remark;
            this.childsform.guaranteeScoreSwitch = guaranteeScoreSwitch;
            this.childsform.guaranteeScore = guaranteeScore;
            this.childsform.feeCVOS = feeCVOS;
            this.childsform.hongHua = hongHua;
            if(Number(this.ordertype)  == 11 || Number(this.ordertype)  == 1){//grouporder/大论文订单继承外层订单的这几条数据
              this.childsform.checkCourseCodeFlag = checkCourseCodeFlag;
              this.childsform.courseCode = courseCode;
              this.childsform.checkCourseCode = checkCourseCode;
              this.childsform.professionalId = professionalId;
              this.childsform.courseName = courseName;
            }
            if( Number(this.ordertype)  == 1){
              this.childsform.childType = childType;
              this.childsform.channelStatus = channelStatus;
              this.childsform.sellerChannelId = sellerChannelId;
            }
            if(this.sectionOrderStatus){
                this.childsform.type = type;
                this.childsform.linkOrder =  linkOrder;
            }
            this.form = JSON.parse(JSON.stringify(this.childsform));
          }
          this.bottomtapArr = this.sectionOrderStatus ?this.sectiontapchildArr:this.childtapArr;//再来一单数据修改
          this.bottomtapIndex =  1;
          this.backTxt = this.bottomtapArr[this.bottomtapIndex-1].name;
          this.preTxt = this.bottomtapArr[this.bottomtapIndex+1].name;
       }else{ 
          this.bottomtapIndex = this.beforebotttomIndex;
          this.bottomtapArr = JSON.parse(JSON.stringify(this.beforebotttomArr));
          this.form = JSON.parse(JSON.stringify(this.beforeForm));
          this.backTxt = this.bottomtapArr[this.bottomtapIndex-1].name;
          this.preTxt = this.bottomtapArr[this.bottomtapIndex+1].name;
          this.$forceUpdate()

       }
     },
    //  查询学生来自于哪一个机构
    async queryStudentIsDbOrWy(studUserId,type){
      if(!studUserId){
        this.$toast('不能确认学生信息！');
      }else{
        const {status,body} = await queryStudentIsDbOrWy({studUserId:studUserId});
        // console.log(status,body)
        if(status == 200){
          this.studentIsDbOrWy = body;
          // flag (1  导毕学生   2 文亚学生	)
          if(this.studentIsDbOrWy.flag == this.daobiStatus){
            sessionStorage.clear()
          }
          this.showWyAccountNoDbId(type)
        }
      }
      
    },
    showWyAccountNoDbId(type){
      if(!([1,2].includes(this.studentIsDbOrWy.flag))){//这个如果不是1也不是2 直接报错：学生无法定位归属，请联系系统管理员
        this.$toast('学生无法定位归属，请检查关联账户信息！');
      }
      if(!this.studentIsDbOrWy.dbId && !this.studentIsDbOrWy.wyId){
        this.$toast('该学生没有绑定任何类型的账户，请前往绑定账户！');
      }
      sessionStorage.setItem("comefrom",'')
      // 来源导毕
      if(this.studentIsDbOrWy.flag == this.daobiStatus){
        if(!this.studentIsDbOrWy.wyId && ![4,8,9].includes(type)){//导毕账号存在不能下文亚单子
          this.$toast("该学生没有文案类产品账户，请前往绑定账户！");
        }
        if([4,8,9].includes(type)){
          sessionStorage.setItem("comefrom",'db')
        }
      }
      if(this.studentIsDbOrWy.flag == this.wenyaStatus){// flag显示是文亚账户的时候
        if(!this.studentIsDbOrWy.wyId){//没有绑定文亚的时候，不能下文亚的单子
          this.$toast("该学生没有文案类产品账户，请前往绑定账户！");
        }
      }
    },
    editOrderPermission(type){
      let allCounter = 0;
      this.typeArrlist.forEach(item=>{
        console.log(type)
        if((type == item.id) && (this.checkPermission([this.orderTypeQywx[item.perssmisonName]])||this.checkPermission([this.orderType[item.perssmisonName]]))){
          allCounter += 1;
        }
      })
      console.log(allCounter,'allCounter')
      if(allCounter == 0){
        this.allPremissionSatuts = 'none';
      }else{
        this.allPremissionSatuts = 'have';
      }
      this.$forceUpdate()
    },
     initUrlParams(){
      let bdata = decodeURIComponent(this.$route.query.bdata) 
      const defaultDatas = Base64.decode(bdata);
      let defaultData = JSON.parse(defaultDatas);
      console.log(defaultData,'defaultData')
      this.form.productTypeId = defaultData.productType || this.productTypeIdObj[defaultData.type]
      // console.log(this.form.productTypeId);
      this.qywxOrder = defaultData.qywxOrder;
      // 从详情页面过来添加grouporder/大论文单独子订单、修改订单
      if(defaultData.courseId){
        this.editcourseId = defaultData.courseId;        
        this.form.childType = Number(defaultData.orderType) == 11?11:'';//大论文type处理
        this.setionhandleFun(defaultData);
      }else{
        this.allPremissionSatuts = 'have';
        const { type } = defaultData;
        this.ordertype = type;
        this.form.type = type;
      }
      const data = {
        ucId: defaultData.userId ,
        countryId:defaultData.countryId,
        userId:defaultData.userId 
      };
      this.$store.dispatch('setChildorderlist',this.form.groupOrderList);//初始化修改childtype的值
      localStorage.setItem('userId',data.userId);
      this.form.ucId = localStorage.getItem('userId');
      this.userId = localStorage.getItem('userId');
      console.log(this.userId,'wenya')
     },
      changeTap(step,index){//头部step切换
        console.log(step.name,index,this.bottomtapIndex)
        if(this.bottomtapArr[this.bottomtapIndex].name == 'Client Info'){//学生信息及时保存
          this.$refs.clientinfo.ucStudentSave()
        }
        this.bottomtapIndex = index;
          let nums = 4,
          lagreNums = 5,
          showText = 'Cancel';
          if(this.showStepBottom){
            showText = this.sectionOrderStatus?showText:"Back";
            nums = 2;
            lagreNums = 3;
          }else{
            
          }
          this.changetapErrorStatus(this.bottomtapIndex,1);
          if(this.bottomtapIndex == nums){
            // index = lagreNums;
          };
          this.backTxt = index>1?this.bottomtapArr[index-1].name:showText;
          this.preTxt = this.bottomtapArr[index+1].name;
      },
      bottombarchange(type){//底部step切换
        let nums = 4,
        lagreNums = 5,
        showText = 'Cancel';
        if(this.showStepBottom){
          if(this.sectionOrderStatus){//订单详情添加子订单
            showText = "Cancel";
            nums = 3;
            lagreNums = 4;
          }else{//grouporder/大论文的子订单
            showText = "Back";
            nums = 2;
            lagreNums = 3;
          }
         
        }else{
          this.changetapErrorStatus(this.bottomtapIndex,0);
        }
        if(type == '+'){
            if(this.bottomtapArr[this.bottomtapIndex].name == 'Client Info'){//学生信息及时保存
              this.$refs.clientinfo.ucStudentSave()
            }
            this.bottomtapIndex ++;
          }else{
            this.bottomtapIndex --;
          }
          let bottomShowIndex = this.bottomtapIndex;
          if(this.bottomtapIndex == lagreNums){
            this.bottomtapIndex = nums;
            if(!this.showStepBottom){
              if(!this.allstepReg()){
                return false;
              }
              this.submitSave();
            }else{
              if(!this.allstepReg()){
                return false;
              }
              //正常grouporder与大论文下单
              if(!this.sectionOrderStatus){
                if(this.beforeForm.groupOrderList[this.childOrderIndex]){//编辑子订单的时候
                  this.beforeForm.groupOrderList[this.childOrderIndex] = this.form;
                }else{
                  this.beforeForm.groupOrderList.push(this.form);
                }
                this.$store.dispatch('setChildorderlist',this.beforeForm.groupOrderList);
                this.hiddenBottomStep(false);
              }else{//从订单详情过来的子订单
                this.submitSave();
              }
            }
            return
          }
          if(this.bottomtapIndex  >= nums){
            bottomShowIndex = nums;
          }
          this.backTxt = bottomShowIndex>1?this.bottomtapArr[bottomShowIndex-1].name:showText;
          this.preTxt = this.bottomtapArr[bottomShowIndex+1].name;
          if (this.bottomtapIndex < 1) {
            this.bottomtapIndex = 1;
            if(this.showStepBottom){
              if(!this.sectionOrderStatus){
                this.hiddenBottomStep(false);
              }else{
                if(this.qywxOrder){
                  this.$router.go(-1);
                }else{
                  window.parent.postMessage({msg: 'cancel' }, '*');
                }
              }
            }else{
              this.$router.go(-1);
            }
            
          }
      },
      async setionhandleFun(defaultData){
        const {orderType,type,courseId,userId} = defaultData;
        this.queryStudentIsDbOrWy(userId,type);//查询学生来源
        //再来一单数据展示处理回填与修改订单
        localStorage.removeItem('feeCVOSnumber');
        if(orderType == 'again' || orderType == 'supersearchAgain' || orderType == 'edit'){
          this.againStatus = true;
          if(orderType == 'edit'){
            
            this.allPremissionSatuts = 'have';
            this.orderEditType = orderType;
          }
          this.$forceUpdate()
          this.ordertype = type;
          this.form.type =  type;
          this.queryOrderVarInfo(courseId,orderType);
        }else{
          this.allPremissionSatuts = 'have';
          this.form.linkOrder =  defaultData.courseId;
          this.sectionOrderStatus = true;
          this.ordertype = orderType | type ;
          this.form.type =  orderType| type;
          this.form.childType =  Number(orderType | type);
        }
        if(!this.againStatus){
          this.allPremissionSatuts = 'have';
          await this.hiddenBottomStep(true)
        }
        if(orderType == 'again' || orderType == 'supersearchAgain'){//再来一单的页面自动定位order info页面
          this.bottomtapIndex = 1
        }
      },
      //再来一单数据回填
      async queryOrderVarInfo(courseId,orderType){
        const {status,body} = await queryOrderVarInfo(courseId)
        if(status == 200){
          let datas = this.changeData(body);
          let keys = Object.keys(datas);
          let formObj = JSON.parse(JSON.stringify(this.form));
          //通过key值存在赋值
          keys.forEach(item=>{
            if(datas[item]){
              formObj[item] = datas[item];
              if(item == 'referenceStyleId'){
                formObj.referenceGuideArr = [{name: datas.referenceGuideName,url:datas.referenceGuide,percentage:100}];
              }
            }
          })
          this.form = JSON.parse(JSON.stringify(formObj));
          if(orderType == 'again' || orderType == 'supersearchAgain'){
            this.editOrderPermission(formObj.type);
            if(this.allPremissionSatuts == 'none') return ;
          }
          // this.form.childType =  this.form.type;
          // this.form.linkStatus = this.form.linkOrder?1:0;
          // this.form.channelStatus = this.form.sellerChannelId?1:0;
          // this.form.checkCourseCodeFlag = this.form.courseCode?1:0;
          this.$set(this.form,'childType',formObj.type);
          this.$set(this.form,'linkStatus',formObj.linkOrder?1:0);
          this.$set(this.form,'channelStatus',formObj.sellerChannelId?1:0);
          this.$set(this.form,'checkCourseCodeFlag',formObj.courseCode?1:0);
          this.$set(this.form.examCVO,'hasrequireSpecificSoftware',formObj.examCVO.hasrequireSpecificSoftware || 0);
          this.$set(this.form.examCVO,'examOpenTime',formObj.examCVO.examOpenTime || null);
          this.$set(this.form.examCVO,'examCloseTime',formObj.examCVO.examCloseTime || null);
          this.$set(this.form.examCVO,'realExamStartTime',formObj.examCVO.realExamStartTime || null);
          this.$set(this.form.examCVO,'realExamEndTime',formObj.examCVO.realExamEndTime || null);
          this.ordertype = this.form.type;
          console.log(this.form,'this.form')
          this.$forceUpdate()
        }
      },
      changeData(itemdata){
        if(itemdata.profreadingCVO){
          itemdata.profreadingCVO.originalWork = itemdata.profreadingCVO.originalWork?JSON.parse(itemdata.profreadingCVO.originalWork):[];
        }
        if(itemdata.edtingCVO){  
          itemdata.edtingCVO.originalWork = itemdata.edtingCVO.originalWork?JSON.parse(itemdata.edtingCVO.originalWork):[];
          itemdata.edtingCVO.editingFeedBack = itemdata.edtingCVO.editingFeedBack?JSON.parse(itemdata.edtingCVO.editingFeedBack):[];
        }
        if(itemdata.referenceGuideArr){
          itemdata.referenceGuideArr = itemdata.referenceGuideArr&&itemdata.referenceGuideArr?JSON.parse(itemdata.referenceGuideArr):null;
        }
        if(itemdata.examCVO){
          itemdata.examCVO.examOpenTime = timechangedefault(itemdata.examCVO.examOpenTime);
          itemdata.examCVO.examCloseTime = timechangedefault(itemdata.examCVO.examCloseTime);
          itemdata.examCVO.realExamStartTime = timechangedefault(itemdata.examCVO.realExamStartTime);
          itemdata.examCVO.realExamEndTime = timechangedefault(itemdata.examCVO.realExamEndTime);
        }
        itemdata.realDeadline = timechangedefault(itemdata.realDeadline);
        itemdata.deadline = timechangedefault(itemdata.deadline);
        return itemdata
      },
      allstepReg(){
        let allstep = 0;
        this.bottomtapArr.forEach((item,index)=>{
          let status = this.changetapErrorStatus(index,0);
          if(!status){
            allstep += 1 ;
          }
        })
        if(allstep){
          return false
        }
        return true;
      },
      changetapErrorStatus(index,num){
         console.log(this.childorderlist,this.ordertype ,!this.showStepBottom , index )
        index = index - Number(num);
        let formName = this.bottomtapArr[index].ref;
        let status = true;
        this.$set(this.bottomtapArr[index],'contents','')
        if(!formName || (formName == 'financeinfo' && ([1,11].includes(Number(this.ordertype))) && !this.showStepBottom)){
          return 'none';
        } //没有formName/grouporder与大论文情况下financeinfo不做验证
        this.$set(this.bottomtapArr[index],'isFull',false)
        if(!this.$refs[formName]) {
          return 'none';
        }else{
          status = this.$refs[formName].formjudge();
          this.$set(this.bottomtapArr[index],'isFull',false)
        };
        
        if(status == false){
          this.$set(this.bottomtapArr[index],'isFull',true)
        }
        return status
      },
      chagneTips(){
          this.$set(this.bottomtapArr[this.bottomtapIndex - 1],'contents','sections是必填')
          // this.$set(this.bottomtapArr[index],'isFull',true)
      },
      async submitSave(){ 
        let datas = JSON.parse(JSON.stringify(this.form));
        // datas.realDeadline = timehandle(datas.realDeadline);
        // datas.deadline = timehandle(datas.deadline);
        console.log(this.form.deadline,this.form.realDeadline,datas.deadline,datas.realDeadline)
        datas.examCVO.examOpenTime = timehandle(datas.examCVO.examOpenTime);
        datas.examCVO.examCloseTime = timehandle(datas.examCVO.examCloseTime);
        datas.examCVO.realExamStartTime = timehandle(datas.examCVO.realExamStartTime);
        datas.examCVO.realExamEndTime = timehandle(datas.examCVO.realExamEndTime);
        //一级订单提交数据修改
        this.handleData(datas)
        datas.workload = datas.workload<=0?'':datas.workload;//workload小于0传'''
        // if(!datas.linkStatus){//最后修改关联订单
        //   datas.linkOrder = null;
        // }
        //子订单数据修改
        let childorderList = JSON.parse(JSON.stringify(this.childorderList));
        if([1,11].includes(Number(this.ordertype)) && !this.sectionOrderStatus){//grouporder/大论文正常下单文件处理
            datas.studCoursewareCVOList.forEach(item=>{
            item.result.forEach(num=>{
              childorderList[num].studCoursewareCVOList.push(item)
            })
          })
          //正常下单 大论文传参：type:1,子订单childtype:11
          if(Number(this.ordertype) == 11){//原订单是大论文11改为1
            datas.type = 1;
          }
          childorderList.forEach((itemdata)=>{
            // itemdata.realDeadline = timehandle(itemdata.realDeadline);
            // itemdata.deadline = timehandle(itemdata.deadline);
            itemdata.examCVO.examOpenTime = timehandle(itemdata.examCVO.examOpenTime);
            itemdata.examCVO.examCloseTime = timehandle(itemdata.examCVO.examCloseTime);
            itemdata.examCVO.realExamStartTime = timehandle(itemdata.examCVO.realExamStartTime);
            itemdata.examCVO.realExamEndTime = timehandle(itemdata.examCVO.realExamEndTime);
            const {type,checkCourseCodeFlag,courseName,courseCode,checkCourseCode,professionalId,channelStatus,sellerChannelId} = datas;
            if(Number(type)  == 11 || Number(type)  == 1){//grouporder/大论文订单继承外层订单的这几条数据
              itemdata.checkCourseCodeFlag = checkCourseCodeFlag;
              itemdata.courseCode = courseCode;
              itemdata.checkCourseCode = checkCourseCode;
              itemdata.professionalId = professionalId;
              itemdata.courseName = courseName;
            }
            if( Number(type)  == 1){
              itemdata.channelStatus = channelStatus;
              itemdata.sellerChannelId = sellerChannelId;
            }
            if(Number(this.ordertype) == 11 ){//原订单是11大论文类型子订单处理类型
              itemdata.childType = 11;
            }
            this.handleData(itemdata)
            //子订单
          })
          datas.groupOrderList = childorderList;
        }
        if(this.sectionOrderStatus){//订单详情单独下子订单
          datas.checkCourseCodeFlag = 0;
           datas.addChildOrderFlag = 1;
          console.log(datas,'单独子订单000提交3333')
        }
        if(this.againStatus){
          datas.ucId = localStorage.getItem('userId');
        }
        if((datas.examCVO.examType == 1 && datas.examCVO.examStyle == 1 && datas.examCVO.examLimitTimeLevel == 2) || (datas.examCVO.examType == 1 && datas.examCVO.examStyle == 2)){
          datas.deadline == datas.realDeadline;
        }
        if(this.orderEditType){
          datas.courseId = this.editcourseId;
        }
        console.log(datas,'datas')
        if(this.judgeNum(datas)){
          this.$message.error('订单使用小红花数量大于剩余数量')
          return 
        }
        if(datas.sellerChannelId&&datas.fromCard){
          this.$message({
            message: '推荐人模式下不支持学期卡支付',
            type: "warning",
          });
          return
        }
        this.allLoading = true;
        let {status,msg,body} = await (this.orderEditType?updateCopywritingOrder: saveCopywritingOrderV1)(datas);
        this.allLoading = false;
        if (status == 200) {
          window.open(`${webUrl}seller/#/system/wyOrderDetails?courseId=${body.courseId}&orderNo=${encodeURIComponent(body.orderNo)}&token=${getToken('TOKEN')}`,'_blank')
          Dialog.alert({
            title: "提示",
            message: "下单成功！",
          }).then(() => {
            this.closeWindow();
          });
        } else {
          return this.$message({
            message: msg,
            type: "error",
          });
        }
      },
      
      handleData(itemdata){
        itemdata.profreadingCVO.originalWork = itemdata.profreadingCVO.originalWork.length?JSON.stringify(itemdata.profreadingCVO.originalWork):null;
        itemdata.edtingCVO.originalWork = itemdata.edtingCVO.originalWork.length?JSON.stringify(itemdata.edtingCVO.originalWork):null;
        itemdata.edtingCVO.editingFeedBack = itemdata.edtingCVO.editingFeedBack.length?JSON.stringify(itemdata.edtingCVO.editingFeedBack):null;
        itemdata.referenceGuideArr = itemdata.referenceGuideArr&&itemdata.referenceGuideArr.length?JSON.stringify(itemdata.referenceGuideArr):null;
        itemdata.realDeadline = timehandle(itemdata.realDeadline);
        itemdata.deadline = timehandle(itemdata.deadline);
        if(Number(itemdata.type) == 8 || Number(itemdata.childType) == 8){
          itemdata.workload = itemdata.wordsNum * 0.3;
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
        if(this.sectionOrderStatus){
          this.postMessage();
        }
      },
      postMessage(){
        window.parent.postMessage({msg: 'success' }, '*');
      },
      //判断使用的小红花是否大于剩余
      judgeNum(data){
        if(data.groupOrderList?.length){
        let useNum= data.groupOrderList.filter(v=>v.hongHua)?.length||0
        return useNum>this.$refs.orderinfo.redFlowerNum?true:false
        }else{
          return false
        }
      }
   }
}
</script>
<style lang="scss" scoped>
.order-wrap-box {
  padding: 10px;
  margin: 10px;
  overflow: hidden;
  height: calc(100% - 20px);
  box-sizing: border-box;
  background: #fff;
  border-radius: 2px;
  h2{
    margin: 16px 0 0;
    height: 16px;
    font-size: 16px;
    font-weight: 600;
    color:  #2C2D2F;
    line-height: 16px;
    span{
      color: #8C8C8C;
    }
  }
  .content-height{
    margin-top: 20px;
    height: calc(100% - 128px);
    overflow-y: auto;
  }
  .grouporder-height{
    height: calc(100% - 164px);
  }
}
.none-perssmion{
  font-size: 18px;
  padding:20px;
  color: #D33443;
}
</style>