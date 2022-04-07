<template>
  <div class="container" v-loading="loading">
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input placeholder="搜索订单名" v-model="key" @blur="onQuery" @keyup.enter.native="onQuery">
            <i slot="suffix" class="el-icon-search el-input__icon" @click.stop="onQuery"></i>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="orderType" @change="onQuery">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
      </el-row>
      <div class="orderBox">
        <div class="orderItem" v-for="(item, index) in orderList" :key="index">
          <div>
            <i class="dot" :style="{ 'backgroundColor': showStatued(item)}" />
            <span class="name">{{item.statusName}}</span>
          </div>
          <div class="title" @click="onDetail(item)" v-track-event="'销售系统, 侧边栏, 查看订单详情'">{{item.orderNo}}</div>
          <div>
            <span class="label">Deal deadline: </span>
            <span class="time">{{item.studPurchaseOrderRVO.endCourseTime}}</span>
          </div>
        </div>
        <div class="more" v-if="total > 10" :class="{'notMore': notMore}" @click="onMore">{{ notMore ? '已全部加载完' : '加载更多...'}}</div>
      </div>
    </div>
    <i class="el-icon-circle-plus" @click="openOrder" v-track-event="'销售系统, 侧边栏, 创建订单'"/>
  </div>
</template>
<script>
import { Base64 } from 'js-base64';
import { webUrl } from "config";
import { getToken } from "@/utils/Auth";
import { getListByStudId } from '@/api/order'
import { Storage } from "@/utils/Enum/index";
import { WeChatEnv } from "@/utils/Enum/WeChat";
import { getOutUserId,getWeChatEnv } from "@/utils/Wechat/WxUtils";
import MaterialsProxy from "@/proxy/customer/Materials";

export default {
  data() {
    return {
      webUrl,
      loading: false,
      key: '',
      userId: null,
      countryId: null,
      orderType: 1,
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
      page: 1,
      total: 0,
      orderList: [],
      intervalId1: null,
      intervalId2: null,
      user: null
    }
  },
  computed: {
    notMore() {
      return this.total <= 10 || this.page !== 1 && this.orderList.length === this.total
    }
  },
  async mounted () {

      this.intervalId2 = setInterval(() => {
        const config = localStorage.getItem(Storage.AGENT_CONFIG);
        if (!config) clearInterval(this.intervalId2);
        else if (+config === 1) {
          clearInterval(this.intervalId2);
          this.init();
        }
      }, 500);
  },
  methods: {
    async init() {
        if (await this.validateEnv()) {
          console.log("开始初始化");
          const wxUserId = await getOutUserId();
          console.log("开始初始化wxUserId",wxUserId);
          const body = await MaterialsProxy.getUserDetailByWxId(wxUserId);
          console.log("请求接口",body);
          this.user = body;
          this.userId = body.userId;
          this.countryId = body.countryId;
          this.getListByStudId()
        } else {
          this.$message({
            duration: 0,
            message: "请前往与客户的聊天窗口右侧工具栏查看",
            type: "warning",
          });
        }
    },
    /**校验当前入口环境 */
    async validateEnv() {
      const _env = await getWeChatEnv();
      console.log("当前入口环境:", _env);
      return _env != WeChatEnv.NORMAL;
    },
    onQuery() {
      this.page = 1
      this.total = 0
      this.orderList = []
      this.getListByStudId()
    },
    getListByStudId() {
      this.loading = true
      const params = {
        page: this.page,
        limit: 10,
        key: this.key,
        userId: this.userId,
        ...this.getParamsByOrderType(this.orderType)
      }
      getListByStudId(params).then(res => {
        if (res.status === 200) {
          this.total = res.body.totalCount
          this.orderList = [ ...this.orderList, ...res.body.list]
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onMore() {
      if (this.notMore) {
        return
      }
      this.page++
      this.getListByStudId()
    },
    onDetail(row) {
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
    },

    openOrder(){
      if(!this.user.dbId || !this.user.wyId){
        return this.$notify.warning("该账户没有关联账号，请去关联账号");
      }
      const tokens = getToken('TOKEN');
      let params = JSON.stringify({
        ucId: this.userId,
        countryId: this.countryId,
        userId: this.user.userId,
        token: tokens
      })
      // // 测试数据
      // let testdata = {
      //   countryId: 63,
      //   token: 'f8663e1f549d976b8adf96f5698dc239',
      //   ucId: 12951,
      //   userId: 12951,
      // }
      // let params = JSON.stringify(testdata);
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
  }
}
</script>
<style lang="scss" scoped>
.container{
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .content{
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .orderBox {
      flex: 1;
      overflow: auto;
    }
    .orderItem{
      width: 100%;
      padding: 10px;
      margin-top: 18px;
      font-size: 12px;
      box-sizing: border-box;
      border-radius: 3px;
      border: 1px solid #d9d9d9;
    }
    .dot{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .time,
    .name{
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
      margin: 16px 0;
      font-weight: 500;
      font-size: 14px;
      color: #4979FF;
      cursor: pointer;
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
}
.el-icon-circle-plus{
  font-size: 45px;
  cursor: pointer;
  color: #4979FF;
  position: fixed;
  right: 8px;
  bottom: 50px;
}
</style>
