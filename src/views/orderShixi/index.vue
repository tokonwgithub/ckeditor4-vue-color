/**author:xulanlan 
createTime:2021-01-14-14:52 
title:文亚订单展示入口首页 
editor:xulanlan
editTime:2021-01-14-14:52
editor:xulanlan
editTime:2021-03-17-16:23
title:新增实习订单类型  */
<template>
   <div class="order-wrap-box" v-loading="allLoading">
    <taps :bottomtapArr="bottomtapArr" :bottomtapIndex="bottomtapIndex" @changeTap="changeTap"/>
    <div class="content-height" >
      <clientinfo ref="clientinfo" :userid="userId" :forms="form" v-show="bottomtapIndex == 1"/>
      <orderinfo  ref="orderinfo"  :ordertypes.sync="ordertype"  :orderForm.sync="form" :userid="userId" v-show="bottomtapIndex == 2"/>
      <financeinfo   ref="financeinfo"  :ordertype="ordertype" :userid="userId" :orderForm.sync="form" :indexs="bottomtapIndex" v-show="bottomtapIndex == 3"/>
    </div>
    <bottombar :back="backTxt"  :pre="preTxt" @bottombarchange="bottombarchange" />
   </div>
</template>
<script>
import { mapState } from "vuex";
import { Base64 } from 'js-base64';
import {saveJackarooOrderV1} from '@/api/orderwy'
import taps from '../orderWenya/components/tap'
import bottombar from '../orderWenya/components/bottombar'
import clientinfo from '../order/students'
import orderinfo from './orderInfo'
import financeinfo from './financeinfo'
import {timehandle,timechangedefault} from '@/utils/handleTimes'
import { Dialog } from "vant";
import { setToken, getToken } from '@/utils/Auth';
import { webUrl } from "config";
export default {
   data(){
      return {
        form:{
          recommendModel:0,
          valueAddedListArr:[
//              1-简历精修
//  *  2-技能课
//  *  3-赠品
//  *  4-职业性格测试
//  *  5-导师课
//  *  6-面试突击（基础版）
//  *  7-面试突击（强化版）
            {vatName:'简历精修',vatCode:1,vatCount:1}, 
            {vatName:'职业性格测试',vatCode:4,vatCount:1}, 
            {vatName:'导师课',vatCode:5,vatCount:1}, 
            {vatName:'面试突击（基础版）',vatCode:6,vatCount:1}, 
            {vatName:'面试突击（强化版）',vatCode:7,vatCount:1}, 
            {vatName:'技能课',vatCode:2,vatCount:1}, 
            {vatName:'赠品',vatCode:3,vatCount:1}, 
            {vatName:'科研',vatCode:8,vatCount:1}, 
            {vatName:'升学',vatCode:9,vatCount:1}, 
          ],
          jackarooCVO:{
            aimCompany:[''],
            otherFileList:[],
            resumeFileList:[],
            jackarooType:[],
            valueAddedList:[],
            valueAddedLists:[],
          },
          // --------
          channelStatus:0,
          currencyWy:'',
          currency:'',
          certificateFileList: [],
        },
        ordertype:'',
        userId:'',
        backTxt:'返回',
        preTxt:'学生信息',
        bottomtapIndex:1,
        bottomtapArr:[{name:"返回"},{name:"学生信息",ref:'clientinfo'},{name:"订单信息",ref:'orderinfo'}, {name: "财务信息",ref:'financeinfo'}, {name:"save",}],
        allLoading:false,
        productTypeId: '',
      }
   },
   components:{
     taps,
     bottombar,
     clientinfo,
     orderinfo,
     financeinfo,
   },
   computed: {
      ...mapState({
         childorderList: (e) => e.order_user.childorderlist,
      }),
   },
   created(){
    sessionStorage.setItem('state','');
    this.childsform = JSON.parse(JSON.stringify(this.form));
    this.initUrlParams();
   },
   methods:{
     initUrlParams(){
      let bdata = decodeURIComponent(this.$route.query.bdata) 
      const defaultDatas = Base64.decode(bdata);
      let defaultData = JSON.parse(defaultDatas);     
      const { type } = defaultData;
      this.ordertype = type;
      this.form.type = type;
      this.form.ucId = defaultData.userId;
      this.form.productTypeId = defaultData.productType;
      const data = {
        ucId: defaultData.userId ,
        countryId:defaultData.countryId,
        userId:defaultData.userId 
      };
      localStorage.setItem('userId',data.userId)
      this.userId = data.userId;
     },
      changeTap(step,index){//头部step切换
        console.log(step.name,index,this.bottomtapIndex)
        if(this.bottomtapArr[this.bottomtapIndex].name == '学生信息'){//学生信息及时保存
          console.log('信息保存')
          this.$refs.clientinfo.formjudge()
        }
        this.bottomtapIndex = index;
          let nums = 3,
          lagreNums = 4,
          showText = 'Cancel';
          this.changetapErrorStatus(this.bottomtapIndex,1);
          this.backTxt = index>1?this.bottomtapArr[index-1].name:showText;
          this.preTxt = this.bottomtapArr[index+1].name;
      },
      bottombarchange(type){//底部step切换
        let nums = 3,
        lagreNums = 4,
        showText = 'Cancel';
        this.changetapErrorStatus(this.bottomtapIndex,0);
        if(type == '+'){
            if(this.bottomtapArr[this.bottomtapIndex].name == '学生信息'){//学生信息及时保存
              this.$refs.clientinfo.formjudge()
            }
            this.bottomtapIndex ++;
          }else{
            this.bottomtapIndex --;
          }
          let bottomShowIndex = this.bottomtapIndex;
          if(this.bottomtapIndex == lagreNums){
            this.bottomtapIndex = nums;
              if(!this.allstepReg()){
                return false;
              }
            this.submitSave();
          }
          this.backTxt = bottomShowIndex>1?this.bottomtapArr[bottomShowIndex-1].name:showText;
          this.preTxt = this.bottomtapArr[bottomShowIndex+1].name;
          if (this.bottomtapIndex < 1) {
            this.bottomtapIndex = 1;
            this.$router.go(-1); 
          }
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
        index = index - Number(num);
        let formName = this.bottomtapArr[index].ref;
        console.log(formName,'formName')
        let status = true;
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
      async submitSave(){ 
        let datas = JSON.parse(JSON.stringify(this.form));
        datas.jackarooCVO.entryStartTime = timehandle(datas.jackarooCVO.entryStartTime);
        datas.jackarooCVO.entryEndTime = timehandle(datas.jackarooCVO.entryEndTime);
        datas.jackarooCVO.jackarooType = JSON.stringify(datas.jackarooCVO.jackarooType);
        // datas.jackarooCVO.aimCompany = JSON.stringify(datas.jackarooCVO.aimCompany)
        datas.jackarooCVO.valueAddedList = [];
        let nums = 0;
        datas.jackarooCVO.otherFileList.forEach(itme => {
          if(itme.percentage != 100){
            nums += 1;
          }
        });
        datas.jackarooCVO.resumeFileList.forEach(itme => {
          if(itme.percentage != 100){
            nums += 1;
          }
        });
        if(nums>0){
          return this.$message({
            message: '有文件尚未上传完成！',
            type: "error",
          });
        }
        datas.jackarooCVO.valueAddedLists.forEach(item=>{
          let obj =datas.valueAddedListArr.find(list=>list.vatCode == item);
          if(obj){
            datas.jackarooCVO.valueAddedList.push(obj)
          }
        })
        if(datas.sellerChannelId&&datas.fromCard){
          this.$message({
            message: '推荐人模式下不支持学期卡支付',
            type: "warning",
          });
          return
        }
        this.allLoading = true;
        let {status,body,msg} = await saveJackarooOrderV1(datas);
        this.allLoading = false;
        if (status == 200) {
          window.open(`${webUrl}seller/#/system/orderInformationShixi?courseId=${body.courseId}&type=0&orderType=daobi&token=${getToken('TOKEN')}&orderNo=${body.orderNo}`, '_blank');
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
        console.log('submit')
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
      postMessage(){
        window.parent.postMessage({msg: 'success' }, '*');
      },
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
</style>