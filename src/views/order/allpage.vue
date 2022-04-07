<template>
  <div class="order-wrap-box" v-loading="allLoading">
    <ul class="step-wrap">
      <li v-for="(step,is) in bottomtapArr" :key="is" v-show="is<bottomtapArr.length-1 && is != 0" :class="is <= bottomtapIndex?'line-bule':''" @click="changeTap(step,is)">
          <div class="icon-box">
            <van-icon :name="is < bottomtapIndex ? step.isFull ? 'warning error':'circle active': bottomtapIndex == is? step.isFull ? 'warning error':'checked active':'circle'" />
            <p>{{step.name}}</p>
          </div>
         
          <span v-if="step.isFull" class="none-content">有必填项未填写</span>
      </li>
    </ul>
    <!-- <van-steps :active="bottomtapIndex" active-icon="checked"  active-color="#4979FF">
      <van-step v-for="(step,is) in bottomtapArr" :key="is" v-show="is<bottomtapArr.length-1 && is != 0" >
        {{step.name}}
       
      </van-step>
    </van-steps> -->
    <students ref="studentsform" :userid="userId" v-show="bottomtapArr[bottomtapIndex].name == '学生信息'"  />
    <orderform :orderForm="orderForm" :sonid="sonid" ref="orderforms" :status="hasdrainageStatus" :userid="userId" v-show="bottomtapArr[bottomtapIndex].name == '订单信息'" :ordertype="ordertype"/>
    <lunwen :orderForm="orderForm" ref="lunwens" v-show="bottomtapArr[bottomtapIndex].name == '选择辅导阶段'" />
    <uploadfiles :data.sync="orderForm.studCoursewareCVOList" @changeList="changeList" :type="orderForm.studSpecialOrderExt.type" ref="uploadfiles" v-show="bottomtapArr[bottomtapIndex].name == '订单附件'" :ordertype="ordertype" :orderforms="orderForm" @clearfiles="clearfiles"/>
    <finance :orderForm="orderForm" ref="finances" :userid="userId" :indexname="bottomtapArr[bottomtapIndex].name" v-show="bottomtapArr[bottomtapIndex].name == '财务信息'" :ordertype="ordertype"/>
    <div class="bottom-tabbar">
      <span @click="goto('back')">
        <van-icon name="arrow-left" size="16" />
        <b>{{bottomtapArr[bottomtapIndex-1].name}}</b>
      </span>
      <span @click="goto('pre')">
        <b class="go-file">{{bottomtapArr[bottomtapIndex+1].name}}</b>
        <van-icon name="arrow" size="16" />
      </span>
    </div>
  </div>
</template>
<script>
import { Base64 } from 'js-base64';
import orderform from "../order/orderform";
import lunwen from "../order/lunwen";
import uploadfiles from "../order/uploadfiles";
import finance from "../order/finance";
import students from "../order/students";
import { savePurchaseOrderV2, hasdrainage } from "@/api/order";
import { SysCode } from "@/utils/Enum/Customer/Account";
import { mapState } from "vuex";
import { Dialog } from "vant";
import { setToken, getToken } from '@/utils/Auth';
import { webUrl } from "config";
export default {
  data() {
    return {
      bottomtapIndex: 1,
      hasdrainageStatus: false,
      userId: "",
      ordertype: "",
      sonid: '',
      allLoading: false,
      orderForm: {
        bigPackageType:1,
        checkCourseCodeFlag:1,
        recommendModel:0,
        courseCode:'',
        professionalId:'',
        type:'',
        ucId: "",
        flag: 1,
        countryId: "",
        // recommendUserId: "",
        sellerChannelId: '',
        studSpecialOrderExt: {
          type:'',
          workload:''
        },
        studSpecialOrderExam:{
          examItemType:[]
        },//考试信息
        // 特殊消耗
        cardSpecialPriceFlag:0,
        studCoursewareCVOList: [],
        currency: "AUD",
        fromCard: false,
        theSpecialOffer: false,
        sellerDemandDesc: "",
        studentEssayFiles: [],
        stageEntity: [],
        studentFiles: [],
        customerArr: [],
        cvArr: [],
        originalArr: [],
        pastPaperArr:[],
        decimalTotalPrice: 0,
        decimalPrice:0,
        needsList: [{ answer: "" }],
        theSpecialOffer: false,
        productTypeId: '',
        certificateFileList: [],
      },
      examItemTypeArr: [{name:'Mutiple choice',type:1},{name:'True or False',type:2},{name:'fill-in-the-blank(填空)',type:3},{name:'short answer question',type:4},{name:'Essay类写作',type:5},{name:'Programming/code',type:6},{name:'Numberical question/Calculations(计算题)',type:7},{name:'Unknow',type:8}],
      // bottomtapArr: ["学生信息","订单信息", "订单附件", "财务信息", "提交"]
    };
  },
  components: {
    students,
    orderform,
    lunwen,
    uploadfiles,
    finance,
  },
  computed: {
    ...mapState({
      // orderusedata: (e) => e.order_user.orderusedata,
      bottomtapArr: (e) => e.order_user.toptaparr,
    }),
  },
  watch: {
    // orderusedata: {
    //   handler(obj) {
    //     let objs = JSON.parse(localStorage.getItem("setOrderusedata"));
    //     this.orderForm.ucId = obj.ucId ? obj.ucId : objs.ucId;
    //     this.orderForm.countryId = obj.countryId
    //       ? obj.countryId
    //       : objs.countryId;
    //     this.userId = obj.userId ? obj.userId : objs.userId;
    //   },
    //   immediate: true,
    //   deep: true,
    // },
  },
  created() {
    let bdata = decodeURIComponent(this.$route.query.bdata) 
    const defaultDatas = Base64.decode(bdata);
    let defaultData = JSON.parse(defaultDatas);
    const { type,sonid,productType } = defaultData;
    this.ordertype = type;
    this.sonid = sonid
    const data = {
       ucId: defaultData.ucId ,
       countryId:defaultData.countryId,
       userId:defaultData.userId 
    };
    this.orderForm.ucId = data.ucId;
    this.orderForm.countryId = data.countryId;
    this.orderForm.productTypeId = productType
    this.userId = data.userId;
    if(!data.ucId){
      return
    }
    // this.$store.dispatch('setOrderusedata',data);
    // localStorage.setItem('setOrderusedata', JSON.stringify(data));
    if (type == "67") {
      this.hasdrainage();
    }
    console.log(sonid);
    if (sonid == 1 || sonid == 2 || sonid == 129 || sonid == 130) {
      this.goto('pre')
    }
  },
  methods: {
    changeList(arr){
      this.orderForm.studCoursewareCVOList = arr;
    },
    changeTap(step,index){
      console.log(step.name,index,this.bottomtapIndex)
      this.changeTapStatus(index)
      this.bottomtapIndex = index;
    },
    async hasdrainage() {
      const sysCode = SysCode.DAOBI,
        data = { studentId: this.orderusedata.ucId };
      const { status, body } = await hasdrainage({ sysCode, data });
      if (status == 200) {
        if (body.status != 2) {
          this.hasdrainageStatus = true;
        }
      }
    },
    clearfiles(){
      this.orderForm.studCoursewareCVOList = [];
    },
    goto(type) {
      if (this.bottomtapArr[this.bottomtapIndex].name == "选择辅导阶段") {
        this.$refs.lunwens.fileStroge();
      }
      if(this.bottomtapArr[this.bottomtapIndex].name == '订单附件'){
        this.$refs.uploadfiles.addFileData()
      }
      if (type == "back") {
        this.changeTapStatus(this.bottomtapIndex);
        this.bottomtapIndex--;
      } else {
        this.changeTapStatus(this.bottomtapIndex);
        // let status = this.judgeForm(this.bottomtapArr[this.bottomtapIndex]);
        // if (!status) return;
        let number = 2;
        if (this.bottomtapIndex >= this.bottomtapArr.length - number) {
          this.bottomtapIndex = this.bottomtapArr.length - number;
          this.submitSave();
          return;
        }
        this.bottomtapIndex++;
      }
      if (this.bottomtapIndex < 1) {
        this.bottomtapIndex = 1;
        this.$router.go(-1);
      }
      
    },
    changeTapStatus(bottomtapIndex){
      if(this.bottomtapArr[bottomtapIndex].isFull == true){
        let status = this.judgeForm(this.bottomtapArr[bottomtapIndex].name);
        if(status == true){
          this.$set(this.bottomtapArr[bottomtapIndex],'isFull',false)
        }
      }
    },
    judgeForm(type) {
      let formName = "";
      switch (type) {
        case "订单信息":
          formName = "orderforms";
          break;
        case "订单附件":
          formName = "uploadfiles";
          break;
        case "选择辅导阶段":
          formName = "lunwens";
          break;
        case "财务信息":
          formName = "finances";
          break;
        case "学生信息":
          formName = "studentsform";
          break;
          default:
      }
      console.log(formName,'formName')
      if(!formName){
        return 'none';
      }
      return this.$refs[formName].formjudge();
    },
    timehandle(str) {
      if (!str) return;
      return str.split("/").join("-");
    },
    async submitSave() {
     
      let cantStep = 0;
      this.bottomtapArr.forEach((item,index)=>{
        let status = this.judgeForm(this.bottomtapArr[index].name);
        console.log('status',status)
        if(status == false){
          this.$set(this.bottomtapArr[index],'isFull',true)
          cantStep ++;
          console.log(this.bottomtapArr[index])
        }else if(status == 'none'){
          
        }
        
      })
      if(cantStep) return;
      let sysCode = SysCode.DAOBI,
      data = JSON.parse(JSON.stringify(this.orderForm));
      // if (this.ordertype == 65) {
      if ([65,71].includes(Number(this.ordertype))){
        let strhhh = [];
        this.orderForm.sellerDemandDesc.map((v) => {
          if (v.question.includes("学生的订单需求是")) {
            if (this.orderForm.needsList.length) {
              let answerList = this.orderForm.needsList.map((v) => v.answer);
              answerList = answerList.filter((v) => v != "");
              v.answer = answerList.join(",");
              strhhh.push(v);
            }
          }else{
            if(v.type == 4 && this.ordertype == 71){
              
            }else{
              strhhh.push(v);
            }
            
          }
        });
        if (strhhh.find((v) => !v.answer)) {
          this.$notify.error("有必填项未填");
          return false;
        }
        data.sellerDemandDesc = JSON.stringify(strhhh);
      }
      // if (data.type != 68  && data.type != 66 && data.type != 65 ){
      if (![65,66,68,71].includes(Number(data.type))){
        data.sellerDemandDesc.length &&
          data.sellerDemandDesc.forEach((items) => {
            items.select = JSON.stringify(items.select);
          });
        data.sellerDemandDesc = JSON.stringify(data.sellerDemandDesc);
      }
      data.ucId = this.userId;
      if (
        this.orderForm.customerArr.length &&
        (this.orderForm.studSpecialOrderExt.type == 2 || this.orderForm.studSpecialOrderExt.type == 130)
      ) {
        data.studSpecialOrderExt.customerInfoExcelName =  this.orderForm.customerArr[0].name;
        data.studSpecialOrderExt.customerInfoExcelUrl = this.orderForm.customerArr[0].url;
      }
      // translation original work
      if (
        this.orderForm.originalArr.length &&
        this.orderForm.studSpecialOrderExt.type == 129
      ) {
        data.studSpecialOrderExt.originalWork = JSON.stringify(this.orderForm.originalArr);
      }
      // CV
      if (
        this.orderForm.cvArr.length &&
        this.orderForm.studSpecialOrderExt.type == 130
      ) {
        data.studSpecialOrderExt.cvFile =  JSON.stringify(this.orderForm.cvArr);
      }
      if (this.ordertype == 67 && this.orderForm.change == 0) {
        data.courseName = "大论文订单";
        data.currency = "AUD";
        data.decimalTotalPrice = 0;
        data.decimalPrice = 0;
        data.courseCode = 67;
        data.minMoney = 0;
      }
      if (this.orderForm.type == 68) {
        data.minMoney = data.decimalTotalPrice;
      }
      if (this.orderForm.change == 1) {
        //毕业论文
        data.courseName = "大论文订单";
        data.courseCode = 67;
        data.confirmEntrust = this.orderForm.confirmEntrust ? 1 : 0; //确认委托参数转化
      }
      data.endCourseTime = this.timehandle(data.endCourseTime);
      data.examTime = this.timehandle(data.examTime);
      data.decimalTotalPrice = data.decimalTotalPrice?data.decimalTotalPrice:0;
      delete data.customerArr;
      delete data.cvArr;
      delete data.originalArr;
      // 特殊订单考试订单数据处理
        // 如果有pastPaper
      if(data.studSpecialOrderExam.isUploadPpastPaperFile){
        console.log(data.pastPaperArr,data.studCoursewareCVOList,'pastPaperArr')
        data.studCoursewareCVOList = data.studCoursewareCVOList.concat(data.pastPaperArr);
        console.log(data.studCoursewareCVOList,'data.studCoursewareCVOList')
        delete data.pastPaperArr
      }
      // 保分数据处理
      // if(data.studSpecialOrderExam.assuring){
      //   delete data.studSpecialOrderExam.assuringScore;
      // }else {
      //   delete data.studSpecialOrderExam.defaultPassScore;
      // }   
      // 时间处理
      data.studSpecialOrderExam.realExamStartTime = this.timehandle(data.studSpecialOrderExam.realExamStartTime);
      data.studSpecialOrderExam.realExamEndTime = this.timehandle(data.studSpecialOrderExam.realExamEndTime);
      data.studSpecialOrderExam.examOpenTime = this.timehandle(data.studSpecialOrderExam.examOpenTime);
      data.studSpecialOrderExam.examCloseTime = this.timehandle(data.studSpecialOrderExam.examCloseTime);
      data.studSpecialOrderExam.teacLatestCommitTime = this.timehandle(data.studSpecialOrderExam.teacLatestCommitTime);
      let examItemType = [];
      if(data.studSpecialOrderExam.examItemType){
        data.studSpecialOrderExam.examItemType.forEach(arr=>{
          const index = this.examItemTypeArr.findIndex(obj=>obj.type == arr);
          examItemType.push(this.examItemTypeArr[index])
        })
        data.studSpecialOrderExam.examItemType = examItemType;
      }
        // 其他考试题型名称替换
      if(data.studSpecialOrderExam.otherExamItemName){
        const index = data.studSpecialOrderExam.examItemType.findIndex(item=>item.type == 8);
        data.studSpecialOrderExam.examItemType[index].name = data.studSpecialOrderExam.otherExamItemName;
      }
      data.checkCourseCodeFlag = data.checkCourseCodeFlag?1:0;
      data.cardSpecialPriceFlag = data.cardSpecialPriceFlag?1:0;
      data.checkCourseCodeFlag = data.checkCourseCodeFlag?1:0;
      console.log(data,'alldata')
      if(data.sellerChannelId&&data.fromCard){
        this.$message({
          message: '推荐人模式下不支持学期卡支付',
          type: "warning",
        });
        return
      }
      if(this.allLoading) return;
      this.allLoading = true;
      const { status, body, msg } = await savePurchaseOrderV2({
        sysCode,
        data,
      });
      this.allLoading = false;
      if (status == 200) {
        window.open(`${webUrl}seller/#/system/orderInformation?courseId=${body.courseId}&orderType=daobi&token=${getToken('TOKEN')}&orderNo=${body.orderNo}`, '_blank');
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
      console.log(status, body, "0000");
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
    },
    changeStep(index) {
      this.bottomtapIndex = index;
    },
  },
};
</script>
<style >
.van-step--horizontal .van-step__title {
  transform: translateX(0%);
}
.van-step--horizontal .van-step__circle-container {
  left: 15px;
}
</style>
<style lang="scss" scoped>
// .none-content{
//   position: absolute;
//   width: 200px;
//   left: -10px;
//   top: 34px;
//   color: #E45434;
// }
.order-wrap-box {
  padding: 0 10px;
  margin: 10px;
  overflow: hidden;
  // height: 100%;
  // overflow-y:auto;
  background: #fff;
  border-radius: 2px;
  .step-wrap{
    width: 100%;
    display: flex;
    height: 60px;
    position: relative;
    width: 100%;
    margin-top: 0px;
    flex-direction: row;
    li{
      height: 100%;
      position: relative;
      flex-grow: 1;
      flex-basis: 0;
      &.line-bule{
        &::after{
          background-color: #4979ff;
        } 
      }
      &::after{
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #ebedf0;
      }
      .active{
        color: #4979ff;
      }
      .error{
        color: #E45434;
      }
      i{
        font-size: 12px;
        background: #fff;
        z-index: 9;
      }
      .icon-box{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;
      }
      p{
        margin: 0;
        font-size: 14px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
      }
      span{
        position: relative;
        display: block;
        margin: 0px auto 0;
        font-size: 10px;
        height: 18px;
        line-height: 20px;
        border-radius: 4px;
        max-width: 100px;
        width: auto;
        text-align: center;
        background: #E45434;
        color: #fff;
        &::after{
          content: '';
          position: absolute;
          bottom: -6px;
          left: 49%;
          width: 0;
          height: 0;
          border-top: 3px solid #E45434;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-bottom: 3px solid transparent;
        }
      }
    }
  }
  h3 {
    padding: 14px 0;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(44, 45, 47, 1);
    line-height: 16px;
  }
  .bottom-tabbar {
    display: flex;
    align-items: center;
    align-content: center;
    margin: 0 10px;
    height: 60px;
    width: calc(100% - 20px);
    border-radius: 0 0 4px 4px;
    flex-direction: row;
    justify-content: space-between;
    span {
      display: flex;
      align-items: center;
      color: #48494c;
      font-size: 14px;
      align-items: center;
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
}
</style>