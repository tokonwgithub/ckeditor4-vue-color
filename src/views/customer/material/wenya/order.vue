/*
 * @Author: tina
 * @Date: 2021-01-12 11:20
 * @Last Modified by: tina
 * @Name:   订单列表
 * @Last Modified time: 2021-01-25 15:44
 */
<template>
   <div class="account-wrap min-height">
      <!-- 添加按钮 -->
      <i class="el-icon-circle-plus" @click="openOrder"  />
      <van-tabs v-model="active"  type="card" color="#4979ff" v-if="!userIsSx">
         <van-tab title="文案产品">
         </van-tab>
         <van-tab title="辅导产品" >
         </van-tab>
      </van-tabs>
      <div class="container" v-show="((active == 1 && accountTypeInfo.dbId) || (active == 0 && accountTypeInfo.wyId) && !userIsSx) || (userIsSx &&  accountTypeInfo.sxId)">
         <div class="content" v-loading="loading">
            <el-row :gutter="10" v-if="active == 1 && !userIsSx">
               <el-col :span="12">
                  <el-input placeholder="搜索订单名" v-model="dbParams.key" @blur="onQuery" @keyup.enter.native="onQuery">
                     <i slot="suffix" class="el-icon-search el-input__icon" @click.stop=""></i>
                  </el-input>
               </el-col>
               <el-col :span="12">
                  <el-select v-model="dbParams.orderType" @change="onQuery">
                     <el-option v-for="(item,index) in options" :label="item.label" :value="item.value" :key="index"/>
                  </el-select>
               </el-col>
            </el-row>
            
            <el-row :gutter="10" v-if="active == 0  && !userIsSx">
               <el-col :span="12">
                  <el-input placeholder="搜索订单名" v-model="wyParams.key" @blur="onQuery" @keyup.enter.native="onQuery">
                     <i slot="suffix" class="el-icon-search el-input__icon" @click.stop=""></i>
                  </el-input>
               </el-col>
               <el-col :span="12">
                  <el-select v-model="wyParams.statused " @change="onQuery">
                     <el-option v-for="(item,index) in wyOptions" :label="item.label" :value="item.value" :key="index"/>
                  </el-select>
               </el-col>
            </el-row>
            <el-row :gutter="10" v-if="userIsSx">
               <el-col :span="12">
                  <el-input placeholder="搜索订单名" v-model="sxParams.key" @blur="onQuery" @keyup.enter.native="onQuery">
                     <i slot="suffix" class="el-icon-search el-input__icon" @click.stop=""></i>
                  </el-input>
               </el-col>
               <el-col :span="12">
                  <el-select v-model="sxParams.qType " @change="onQuery">
                     <el-option v-for="(item,index) in sxOptions" :label="item.label" :value="item.value" :key="index"/>
                  </el-select>
               </el-col>
            </el-row>
            <div class="orderBox" >
               <div class="orderItem" v-for="(item, index) in active == 1 ?dbOrderList : userIsSx?sxOrderList: wyOrderList" :key="index">
                  <div  class="name" :style="{ 'backgroundColor': active == 1 || userIsSx ? showStatued(item) : wyBackground[item.wyStatused]}">{{active == 1 ? item.statusName :userIsSx?item.statusName: wyOptions.filter(i => i.value.includes(item.wyStatused.toString()))[0].label}}</div>
                  <div class="title" @click="onDetail(item)" v-track-event="'销售系统, 侧边栏, 查看订单详情'">{{item.orderNo}}</div>
                  <div v-if="!userIsSx">
                     <span class="label">Deal deadline: </span>
                     <span class="time">{{active == 1? item.studPurchaseOrderRVO.endCourseTime : item.deadline}}</span>
                  </div>
                  <div v-if="active == 0 && !userIsSx" class="operation">
                     <img src="@/assets/images/wenya/sendLetter.png" alt="" @click="sendLetter(item.id)" v-if="item.sendConfirmOperateFlag == 1">
                     <creatChat v-if="[15,25,30].includes(item.wyStatused)  && item.groupChatFlag == 1" @success="onQuery" :orderInfo="item" ></creatChat>
                  </div>
                  <div v-if='userIsSx' class="datein-box">
                     <label for="">入职日期：</label>{{item.entryStartTime.substring(0,10)}}{{item.entryEndTime?'—' + item.entryEndTime.substring(0,10):''}}
                  </div>
               </div>
               <div class="more" v-if="active == 1 ?userIsSx?sxParams.total > 10: dbParams.total > 10 : wyParams.total > 10" :class="{'notMore': notMore}" @click="onMore">{{ notMore ? '已全部加载完' : '加载更多...'}}</div>
            </div>
         </div>
      </div>
      <!-- 未绑定提示文案 -->
      <section class="tips-container" v-show="(!userIsSx && ((active == 1 && !accountTypeInfo.dbId) || (active == 0 && !accountTypeInfo.wyId))) || (userIsSx && !accountTypeInfo.sxId)">
         <img src="@/assets/images/connection.png" alt="">
         <span @click="handleBing(active == 0 ?userIsSx?'sx' :'db' : 'wy')" v-track-event="'销售系统, 侧边栏, 关联账户'">关联/创建</span>
      </section>
   </div>
</template>
<script>
import { shixiNumber} from "@/utils/Enum/User";
import { mapState } from "vuex";
import { webUrl, wenyaUrl } from "config";
import { getToken } from '@/utils/Auth';
import { getListByStudId, queryWyOrderByStudentId,getListByStudIdShixi, sendConfirmOrder } from '@/api/order'
import { Base64 } from 'js-base64'
import creatChat from './creatChat'
import { sendLetter } from "@/utils/Wechat/WxUtils";
export default {
   data(){
      return {
         shixiNumber,
         loading: false,
         active: 0,
         showCreatChat:false,
         accountLink:[
            {name:'创建订单',imgsrc:require("@/assets/images/wenya/creatOrder.png")},
         ],
         bindUsers:[],
         sxOptions: [
            { label: "全部", value: 0 },
            { label: "锁单", value: 8 },
            { label: "待安置", value: 1 },
            { label: "安置中", value: 2 },
            { label: "已安置", value: 3 },
            { label: "进行中 ", value: 4 },
            { label: "已结束", value: 5 },
            { label: "售后", value: 6 },
            { label: "坏单 ", value: 7 },
         ],
         options: [
            { value: 1, label: '所有订单' },
            { value: 2, label: '待规划' },
            { value: 3, label: '进行中' },
            { value: 4, label: '待解锁' },
            { value: 5, label: '待缴费' },
            { value: 6, label: '售中/售后' },
            { value: 7, label: '已结课' },
            { value: 8, label: '退款' },
            { value: 9, label: '坏单' }
         ],
         wyOptions:  [
            { value: '', label: 'All' },
            { value: '0,1', label: 'Cancelled orders' },
            { value: '3,5', label: 'waiting for schedules' },
            { value: '4', label: 'locked' },
            { value: '10', label: 'order  is been taken' },
            { value: '15,20', label: 'waiting for QC' },
            { value: '25', label: 'approved by QC' },
            { value: '30', label: 'waiting for feedback' },
            { value: '35', label: 'Completed orders' },
         ],
         wyBackground: {
            0: '#D0D0D0',
            3: '#6484FF',
            4: '#FF6464',
            5: '#4CC3AB',
            10: '#4CC3AB',
            15: '#3785E5',
            20: '#3785E5',
            25: '#339766',
            30: '#6E64FF',
            33: '#70737E',
            35: '#A6ABBD',
         },
         dbOrderList: [],
         wyOrderList: [],
         sxOrderList: [],
         dbParams: {
            page: 1,
            limit: 10,
            total: 0
         },
         wyParams: {
            page: 1,
            limit: 10,
            total: 0
         },
         sxParams: {
            key: "",
            qType: 0,
            page: 1,
            total:0,
            userId:null,
            limit: 10,
         },
      }
   },
   components: {creatChat },
   computed: {
      ...mapState({
         form: (e) => e.customer_material.user,
         accountTypeInfo: e => e.customer_material_account.accountTypeInfo,
         latestOrderTime: e => e.customer_material_account.latestOrderTime,
      }),
      notMore() {
         if(this.active == 1){
            return this.dbParams.total <= 10 || this.dbParams.page !== 1 && this.dbOrderList.length === this.dbParams.total
         }else{
            return this.wyParams.total <= 10 || this.wyParams.page !== 1 && this.wyOrderList.length === this.wyParams.total
         }
      },
      userIsSx(){
         return this.accountTypeInfo.flag == this.shixiNumber?true:false
      }
   },
   filters: {
      orderStatus(code) {
         switch (code) {
               case 1:
                  return "待解锁";
               case 2:
                  return "待规划";
               case 3:
                  return "进行中";
               case 4:
                  return "代缴费";
               case 5:
                  return "已结课";
               case 6:
                  return "售后/售中";
               case 7:
                  return "退款";
               case 8:
                  return "坏单";
               default:
                  return "-";
         }
      },
   },
   watch: {
      latestOrderTime(){
         this.dbParams.page = 1
         this.wyParams.page = 1
         this.dbOrderList = []
         this.wyOrderList = []
         this.accountTypeInfo.dbId && this.getListByStudId()
         this.accountTypeInfo.wyId && this.queryWyOrderByStudentId()
         this.accountTypeInfo.sxId && this.getListByStudIdShixi()
      }
   },
   created(){
      this.showCreatChat = localStorage.getItem('creatChatShow')
      this.accountTypeInfo.dbId && this.getListByStudId()
      this.accountTypeInfo.wyId && this.queryWyOrderByStudentId()
      this.accountTypeInfo.sxId && this.getListByStudIdShixi()
   },
   methods:{
      clickFun(index){
         switch(index){
            case 0:
               this.createdOrder();
               break;
         }
      },

      // 获取导毕订单列表
      async getListByStudId(){
         let params = {
            page: this.dbParams.page,
            limit: 10,
            key: this.dbParams.key,
            userId: this.form.userId,
            ...this.getParamsByOrderType(this.orderType)
         }
         this.loading = true
         let res = await getListByStudId(params)
         if(res.status == 200){
            this.dbOrderList = [...this.dbOrderList,...res.body.list]
            this.dbParams.total = res.body.totalCount
         }
         this.loading = false
      },
      // 获取实习订单列表
      async getListByStudIdShixi(){
         this.sxParams.userId = this.form.userId;
         let params = JSON.parse(JSON.stringify(this.sxParams))
         this.loading = true
         let res = await getListByStudIdShixi(params)
         if(res.status == 200){

            this.sxOrderList = [...this.dbOrderList,...res.body.list]
            this.sxParams.total = res.body.totalCount
         }
         this.loading = false
      },
      // 获取文亚订单列表
      async queryWyOrderByStudentId(){
         let params = {
            page: this.wyParams.page,
            limit: 10,
            key: this.wyParams.key,
            userId: this.form.userId,
            statused: this.wyParams.statused
         }
         this.loading = true
         let res = await queryWyOrderByStudentId(params)
         if(res.status == 200){
            this.wyOrderList = [...this.wyOrderList,...res.body.list]
            this.wyParams.total = res.body.totalCount
         }
         this.loading = false
      },

      onMore() {
         if (this.notMore) {
            return
         }
         if(this.accountTypeInfo.flag == this.shixiNumber){//实习账户处理
            this.sxParams.page++
             this.getListByStudIdShixi()
         }else{
            if(this.active == 1){
               this.dbParams.page++
               this.getListByStudId()
            }else{
               this.wyParams.page++
               this.queryWyOrderByStudentId()
            }
         }
        
      },

      onQuery(){
         if(this.accountTypeInfo.flag == this.shixiNumber){//实习账户处理
            this.sxParams.page = 1
            this.sxOrderList = []
            this.getListByStudIdShixi()
         }else{
            if(this.active == 1){
               this.dbParams.page = 1
               this.dbOrderList = []
               this.getListByStudId()
            }else{
               this.wyParams.page = 1
               this.wyOrderList = []
               this.queryWyOrderByStudentId()
            }
         }
         
      },

      getParamsByOrderType(type) {
         let params = {}
         switch (type) {
         case 5:
            params = { qType: 'ToBePaid' }
            break;
         case 6:
            params = { qType: 'AfterSale' }
            break;
         case 8:
            params = { qType: 'Refund' }
            break;
         case 9:
            params = { qType: 'BadOrder' }
            break;
         default:
            params = { qType: 'all'}
            if (type === 4) {
               params = { ...params, deleteFlag: 1}
            }
            if (type === 2) {
               params = { ...params, stringStatused: '8,64,16,32', deleteFlag: 0 }
            }
            if (type === 3) {
               params = { ...params, stringStatused: '128,256,512' }
            }
            if (type === 7) {
               params = { ...params, stringStatused: '1204,2048' }
            }
            break;
         }
         return params
      },

      showStatued(row) {
         const arr = [
            {color: '#4979FF', value: '待解锁'},
            {color: '#49BFFF', value: '待规划'},
            {color: '#49D295', value: '进行中'},
            {color: '#A3AAB3', value: '已结课'},
            // 实习类型展示颜色
            {color: '#4979FF', value: '锁单'},
            {color: '#49D295', value: '待安置'},
            {color: '#A3AAB3', value: '安置中'},
            {color: '#626B88', value: '已安置'},
            {color: '#A3AAB3', value: '已结束'},
            {color: '#626B88', value: '售后'},
            {color: '#FF0000', value: '坏单'},
            // -----
            {color: '#626B88', value: '售中/售后'},
            {color: '#1344e2', value: '售后/待处理'},
            {color: '#547af5', value: '售后/已处理'},
            {color: '#0540ff', value: '售后/已处理/更换讲师'},
            {color: '#7b8dc7', value: '售后/已处理/强制结课'},
            {color: '#FFAF2B', value: '待缴费'},
            {color: '#b57307', value: '待规划/派单中'},
            {color: '#fb9d04', value: '待规划/等待运营接单'},
            {color: '#FF7F2B', value: '退款'},
            {color: '#FF0000', value: '坏单/已处理'},
            {color: '#d03838', value: '坏单/待处理'},
         ]
         const item = arr.filter(e => {
         return row.statusName === e.value
         })
         const flag = item && item.length ? item[0].color : false
         return flag
      },

      onDetail(row) {
         if(this.active == 1){
            let query = {}
            const type = row.studPurchaseOrderRVO.type
            const typeed = row.studPurchaseOrderRVO.typeed
            /**当字段type =32 ||66 并且字段typeed=4 的时候 为文亚订单**/
            if (typeed == 4 && (type == 32 || type == 66)) {
               query = {courseId: row.id, orderType: "wenya", userId: row.userId,orderNo: row.orderNo}
            } else {
               query = {courseId: row.id, orderType: "daobi", userId: row.userId,orderNo: row.orderNo}
            }
            window.open(`${webUrl}seller/#/system/orderInformation?courseId=${query.courseId}&orderType=${query.orderType}&userId=${query.userId}&token=${getToken('TOKEN')}&orderNo=${query.orderNo}`, '_blank');
         }else if(this.active == 0){
            if(this.userIsSx){
               window.open(`${webUrl}seller/#/system/orderInformationShixi?courseId=${row.courseId}&type=0&orderNo=${encodeURIComponent(row.orderNo)}&token=${getToken('TOKEN')}`,'_blank');
            }else{
               if(row.typeed == 5){
                  window.open(`${wenyaUrl}site/auto-login?token=${getToken('TOKEN')}&redirect=neworder/view&orderNum=${row.wyOrderId}`,'_blank')
               }else{
                  window.open(`${webUrl}seller/#/system/wyOrderDetails?courseId=${row.id}&orderNo=${encodeURIComponent(row.orderNo)}&token=${getToken('TOKEN')}`,'_blank');
               }
            }
            
         }

      },

      openOrder(){//下单按钮
         if(this.accountTypeInfo.flag == this.shixiNumber){//实习处理
            if(!this.accountTypeInfo.sxId){
               return this.$notify.warning("该账户没有关联账号，请去关联账号");
            }
         }else{
            if(this.active == 1 && !this.accountTypeInfo.dbId){
               return this.$notify.warning("该账户没有关联账号，请去关联账号");
            }
            if(this.active == 0 && !this.accountTypeInfo.wyId){
               return this.$notify.warning("该账户没有关联账号，请去关联账号");
            }
         }
         
         const tokens = getToken('TOKEN');
         let params = JSON.stringify({
            ucId: this.form.userId,
            countryId: this.form.countryId,
            userId: this.form.userId,
            qywxOrder: 'daobi',
            token: tokens
         })
         console.log(params)
         let routeData = this.$router.resolve({
            path: "/order/index",
            query:{
               bdata:Base64.encode(params)
            }
         });
         console.log(routeData,'routeData')
         window.open(routeData.href, '_blank','width=400,height=600,left=600');
      },
      handleBing(type) {
         this.$router.push({path: "/customer/material/bind",query: {type}});
      },

      // 发送确认函
      sendLetter(courseId){
         sendConfirmOrder(courseId).then(async res => {
            if(res.status == 200){
               await sendLetter({
                  title: "订单确认函",
                  url: res.body.url,
                  desc: "请点击链接确认订单信息",
                  imgUrl: "http://classbro-oss.oss-cn-hongkong.aliyuncs.com/statice-resource/1599823260309/confirm_icon.png"
               });
            }else{
               this.$message.error(res.msg)
            }
         })
      }
   }
}
</script>
<style lang="scss" scoped>
.account-wrap{
   background: #fff;
   margin: 10px 0;
   padding: 16px 10px;
   .icon-box{
      padding: 20px 10px;
      span{
         display: inline-block;
         overflow: hidden;
         font-size: 12px;
         line-height: 14px;
         color: #4979ff;
         margin-right: 20px;
         img{
            margin-right: 4px;
            display: block;
            float: left;
            width: 14px;
            height: 14px;
         }
      }
   }
}
.orderBox {
   flex: 1;
   overflow: auto;
}
.orderItem{
   padding: 10px;
   margin-top: 18px;
   font-size: 12px;
   box-sizing: border-box;
   border-radius: 3px;
   border: 1px solid #d9d9d9;
}
.name{
   display: inline-block;
   color: white;
   padding: 5px;
   border-radius: 2px;
   font-size: 12px;
}
.time{
   color: #48494C;
}
.label{
   color: #8C8C8C;
   margin-right: 5px;
}
.title{
   width: 100%;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
   margin: 7px 0;
   font-weight: 500;
   font-size: 14px;
   color: #4979FF;
   cursor: pointer;
}

.tips-container {
   width: 100%;
   height: 50px;
   display: flex;
   justify-content: center;
   align-items: center;
   cursor: pointer;
   span {
      line-height: 25px;
      font-size: 16px;
      color: #4979ff;
   }
   .guanlian {
      margin-right: 5px;
      color: #4979ff;
      font-size: 20px;
   }
   img{
      width: 16px;
      height: 16px;
      margin-right: 8px;
   }
}
.more {
   line-height: 30px;
   text-align: center;
   font-size: 12px;
}
.notMore{
   color: #8C8C8C;
}
::v-deep .van-tabs__nav--card{
   margin: 0;
}
.van-tabs{
   margin-bottom: 16px;
}
.min-height{
   min-height: calc(100vh - 80px);
}
.operation{
   margin-top: 10px;
   display: flex;
   align-items: center;
   img{
      width: 16px;
      height: 16px;
      margin-right: 16px;
   }
}
.datein-box{
   label{
      font-weight: normal;
      color:#808080;
   }
}
</style>
