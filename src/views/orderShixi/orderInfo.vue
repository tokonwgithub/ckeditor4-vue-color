/*editor:xulanlan
editTime:2021-03-17-16:23
title:新增实习订单类型 */
<template>
  <div class="order-content">
    <el-form
      ref="orderinfo"
      :model="orderForm"
      :rules="rules"
      label-width="80px"
      size="mini"
      label-position="top"
    >
      <!-- <el-form-item label="订单模式" class="other-style" prop="recommendModel">
        <el-radio-group v-model="orderForm.recommendModel" >
          <el-radio :label="0">默认模式</el-radio>
          <el-radio :label="1">推荐人模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="渠道来源" prop="recommendType" class="other-style" v-if="orderForm.recommendModel == 1">
        <el-select
          v-model="orderForm.recommendType"
          placeholder="请选择渠道"
          style="width:100%"
          size="small"
        >
          <el-option
            style="width:350px"
            :label="item.name"
            :value="item.id"
            v-for="(item,indexs) in channelSourceArr"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item
        label="其他渠道名称"
        prop="recommendTypeOtherName"
        class="other-style"
        v-if="orderForm.recommendType == 9"
      >
        <el-input  v-model="orderForm.recommendTypeOtherName" style="width:100%"  placeholder="请输入其他渠道名称" />
      </el-form-item> -->
      <!-- <el-form-item
        label="推荐人"
        prop="recommendUserId"
        class="other-style"
        v-if="orderForm.recommendModel == 1 && orderForm.recommendType<=4"
      >
        <el-select
          v-loading="recommenduserloading"
          v-model="orderForm.recommendUserId"
          filterable
          placeholder="请选择推荐人"
          style="width:100%"
          size="small" >
          <el-option
            style="width:350px"
            :label="user.username"
            :value="user.id"
            v-for="(user,indexs) in recommenduserList"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <template >
        <el-form-item label="Order Mode" prop="channelStatus" class="other-style" >
          <el-radio-group v-model="orderForm.channelStatus" >
              <el-radio :label="0">Default</el-radio>
              <el-radio :label="1">Sales Channel</el-radio>
          </el-radio-group>
        </el-form-item>
         <!-- Sales Channel情况下展示 -->
        <el-form-item label="Sales Channel" prop="sellerChannelId" class="other-style" v-if="orderForm.channelStatus">
          <el-select v-model="orderForm.sellerChannelId" size="small" style="width:100%" v-loading="sellerLoading" filterable >
              <el-option v-for="(seller,index) in sellerList" :key="index" :value="seller.id" :label="seller.name+`${seller.internalChannelInformation?' ('+seller.internalChannelInformation+')': ''}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道凭证" prop="certificateFileList" v-if="orderForm.channelStatus">
          <uploadfile :urlarr="orderForm.certificateFileList" :nodesc="true" :type="21"  @refreshUrlArr="refreshUrlArr"/>
        </el-form-item>
      </template>
      <el-form-item
        prop="jackarooCVO.aimCompany"
        class="other-style change-label-calss"
      >
       <label slot="label" class="label-add-box">目标企业-岗位<img src="@/assets/images/order/section-add.png" @click="addAimCompany"/></label>
        <span v-for="(item,index) in orderForm.jackarooCVO.aimCompany" :key="index" :class="index>0?'m-t-10':''">
          <el-input  v-model="orderForm.jackarooCVO.aimCompany[index]" style="width:100%"  placeholder="请输入目标企业" >
            <i slot="suffix" class="el-input__icon el-icon-delete" @click="deteleAimCompany(index)" ></i>
            <!-- <i slot="suffix" icon="el-input__icon el-icon-delete" /> -->
          </el-input>
        </span>
      </el-form-item>
      <el-form-item label="产品类型" prop="jackarooCVO.type" class="other-style">
        <el-select
          v-model="orderForm.jackarooCVO.type"
          filterable
          placeholder="请选择产品类型"
          style="width:100%"
          size="small" >
          <el-option
            style="width:350px"
            :label="itme.name"
            :value="itme.id"
            v-for="(itme,indexs) in productTypeArr"
            :key="indexs"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="其他产品类型"
        prop="typeOtherName"
        class="other-style"
        v-if="orderForm.jackarooCVO.type == 5"
      >
        <el-input  v-model="orderForm.jackarooCVO.typeOtherName" style="width:100%"  placeholder="请输入其他产品类型" />
      </el-form-item>
      <el-form-item label="增值服务" prop="jackarooCVO.valueAddedLists" class="other-style">
         <el-select
            v-model="orderForm.jackarooCVO.valueAddedLists"
            multiple
            placeholder="请选择增值服务"
            style="width:100%"
            size="small">
            <el-option
               style="width:350px"
               :label="vals.vatName"
               :value="vals.vatCode"
               v-for="(vals,indexs) in orderForm.valueAddedListArr"
               :key="indexs"
            ></el-option>
         </el-select>
      </el-form-item>
      <template>
        <span v-for="(list,index) in orderForm.jackarooCVO.valueAddedLists" :key="index" class="other-wrap">
          <el-form-item :label="lists.vatName" class="other-style" v-for="(lists,indexs) in  orderForm.valueAddedListArr" :key="indexs" :prop="'valueAddedListArr.' + indexs +'.vatCount'" v-if="lists.vatCode == list"  :rules="{required:true,validator:numVaildator, trigger:'blur'}">
            <el-input  v-model="orderForm.valueAddedListArr[indexs].vatCount"  @keypress.native="disableInputSymbol" size="small" type="number">
              <el-button slot="prepend" icon="el-icon-minus" @click="calcNum(indexs,'-')" />
              <el-button slot="append"  icon="el-icon-plus" @click="calcNum(indexs,'+')" />
            </el-input>
          </el-form-item>
        </span>
      </template>
      <el-form-item label="实习地点" prop="jackarooCVO.jackarooType" class="other-style">
        <el-checkbox-group  v-model="orderForm.jackarooCVO.jackarooType" @change="changejackarooType">
          <el-checkbox :label="1">远程</el-checkbox>
          <el-checkbox :label="2">实地</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
       <template v-if="orderForm.jackarooCVO.jackarooType.includes(2)">
          <el-form-item prop="jackarooCVO.jackarooAddress" class="other-style">
            <el-input v-model="orderForm.jackarooCVO.jackarooAddress" placeholder="请输入具体城市"/>
          </el-form-item>
        </template>
      <el-row>
        <el-col :span="11">
          <el-form-item
          label="最早入职时间"
          prop="jackarooCVO.entryStartTime"
          class="other-style"
          >
            <el-date-picker
              type="date"
              v-model="orderForm.jackarooCVO.entryStartTime"
              format="yyyy-MM-dd"
              value-format="yyyy/MM/dd"
              @change="changeDateRange"
              :picker-options="pickerOptions"
              placeholder="选择日期"
              default-time="00:00:00"
              size="small"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2" class="interval-style">
          <i  class="el-icon-minus"  />
        </el-col>
        <el-col :span="11">
          <el-form-item
            prop="jackarooCVO.entryEndTime"
            label="最晚入职时间"
            class="other-style"
          >
            <el-date-picker
              type="date"
              @change="changeDateRange"
              v-model="orderForm.jackarooCVO.entryEndTime"
              format="yyyy-MM-dd"
              value-format="yyyy/MM/dd"
              :picker-options="pickerOptions2"
              placeholder="选择日期"
              default-time="00:00:00"
              size="small"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="学生简历" prop="jackarooCVO.resumeFileList">
        <uploadfile :urlarr="orderForm.jackarooCVO.resumeFileList" :nodesc="true" :type="21"  @refreshUrlArr="refreshUrlArr"/>
      </el-form-item>
      <el-form-item label="其他" prop="jackarooCVO.otherFileList">
        <uploadfile :urlarr="orderForm.jackarooCVO.otherFileList"  :nodesc="true" :type="21" @refreshUrlArr="refreshUrlArr" />
      </el-form-item>
      <el-form-item label="要求" prop="jackarooCVO.demand" class="other-style">
        <el-input type="textarea" style="width:100%" placeholder="请输入要求"  v-model="orderForm.jackarooCVO.demand" size="small" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  recommenduser,
} from "@/api/order";
import {disableInputSymbol} from  '@/utils/handleTimes'
import uploadfile from "../order/conponment/uploadfile";
import {queryMyChannelList} from '@/api/orderwy'
export default {
  props: ["userid",'orderForm'],
  data() {
    var validateArr = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请上传文件'));
      } else {
        callback();
      }
    };
     var numVaildator = (rule, value, callback) => {
       console.log(value,'0000',!value)
      if (!value ) {
        callback(new Error('请输入数值'));
      } else if(value <= 0){
         callback(new Error('数值必须大于0'));
      }
      else {
        callback();
      }
    };
    var validatorAim = (rule, value, callback) => {
      if (!value.length || !value[0]) {
        callback(new Error('必须要有一个目标企业-岗位'));
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
    let that = this;
    return {
      numVaildator,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      // 销售渠道
      sellerLoading:false,
      sellerList:[],
      // --原来的推荐
      channelSourceArr:[
        {name:'导毕推荐',id:1}, 
        {name:'上海文亚推荐',id:2},
        {name:'南京文亚推荐',id:3},
        {name:'长沙文亚推荐',id:4},
        {name:'小红书',id:5},
        {name:'老学员推荐',id:6},
        {name:'老学员复购',id:7},
        {name:'微信',id:8},
        {name:'其他',id:9},
      ],
      productTypeArr:[
        {name:'实习大礼包',id:1}, 
        {name:'PTA',id:2}, 
        {name:'实地',id:3}, 
        {name:'全职',id:4}, 
        {name:'其他',id:5}, 
      ],
      
      
      typeOtherName:'',
      recommenduserloading:false,
      recommenduserList:[],
      rules: {
        recommendModel: [{ required: true, message: "请选择订单模式", trigger: "change" }],
        recommendType: [{ required: true, message: "请选择渠道", trigger: "change" }],
        recommendTypeOtherName: [{ required: true, message: "请输入其他渠道名称", trigger: "blur" }],
        recommendUserId: [{ required: true, message: "请选择推荐人", trigger: "change" }],
        // valueAddedListArr:[{ required: true, message: "请填写增值服务",validator:validatorAim,  trigger: "change" }],
        jackarooCVO:{
          aimCompany:[{ required: true, message: "请选择推荐人",validator:validatorAim,  trigger: "change" }],
          type:[{ required: true, message: "请选择产品类型", trigger: "change" }],
          typeOtherName: [{ required: true, message: "请输入其他产品类型", trigger: "blur" }],
          // valueAddedLists: [{ required: true, message: "请选择增值服务", trigger: "change" }],
          jackarooType: [{ required: true, message: "请选择实习地点方式", trigger: "change" }],
          jackarooAddress:[{ required: true, message: "请输入实习地址", trigger: "blur" }],
          entryStartTime:[{ required: true, message: "请选择最早入职时间", trigger: "change" }],
          entryEndTime:[{ required: true, message: "请选择最晚入职时间", trigger: "change" }],
          resumeFileList:[{ required: true, message: "请上传文件", validator: validateArr, trigger: "change" }],
          // otherFileList:[{ required: true, message: "请上传文件", validator: validateArr, trigger: "change" }],
          demand:[{ required: true, message: "请输入需求", trigger: "change" }]
        },
        certificateFileList: [{ required: true, message: "请上传渠道证明", validator: validatecertificateFileList, trigger: "change" },],
        
      },

    };
  },
  components: {
    uploadfile
  },
  watch:{
    "orderForm.channelStatus":function(val){
      if(val == 1){
        this.queryMyChannelList()
      }
    },
  },
  async created() {
    // await this.recommenduser()
    await this.queryMyChannelList();
  },
  methods: {
    disableInputSymbol,
    async recommenduser() {
      const datas = {
        page: 1,
        limit: 1000,
        key: "",
      };
      this.recommenduserloading = true;
      const { status, body } = await recommenduser(datas);
      this.recommenduserloading = false;
      if (status == 200) {
        this.recommenduserList = body.list;
      }
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
    changeDateRange(){
      let date1 = (new Date(this.orderForm.jackarooCVO.entryStartTime)).getTime();
      let date2 = (new Date(this.orderForm.jackarooCVO.entryEndTime)).getTime();
      let cha = date2 - date1;
      console.log(cha)
      if(cha && cha < 0){
        this.orderForm.jackarooCVO.entryEndTime = '';
      }
      this.pickerOptions2 =  {
        disabledDate: (time) => {
          return time.getTime() < date1;
        },
      }
      this.$forceUpdate();
    },
    refreshUrlArr(){},
    addAimCompany(){
      if(this.orderForm.jackarooCVO.aimCompany.length == 10) return false;
      this.orderForm.jackarooCVO.aimCompany.push('')
    },
    deteleAimCompany(index){
      if(this.orderForm.jackarooCVO.aimCompany.length <= 1) return false;
      this.orderForm.jackarooCVO.aimCompany.splice(index,1)
    },
    calcNum(index,type){
     
      if(type == '+'){
        this.orderForm.valueAddedListArr[index].vatCount ++;
      }else{
        if(!this.orderForm.valueAddedListArr[index].vatCount){
          return
        }
        if(this.orderForm.valueAddedListArr[index].vatCount <= 0){
          return false;
        }
        this.orderForm.valueAddedListArr[index].vatCount --;
      } 
    },
    changejackarooType(){
      // if(this.orderForm.jackarooCVO.jackarooType.length > 1){
      //   this.orderForm.jackarooCVO.jackarooType.splice(0,1)
      // }
    },
    formjudge() {
        let status = false;
        this.$refs.orderinfo.validate((valid) => {
        if (valid) {
          status = true; 
        }
      });
      return status;
    },
  },
};
</script>
<style>
.other-style .el-form-item__label {
  padding: 0;
  color: #8c8c8c;
}
</style>
<style scoped>
.change-label-calss /deep/ .el-form-item__label{
  width: 100%;
}

</style>
<style lang="scss" scoped>
.order-content {
  padding: 0 10px;
  margin: 10px;
  background: #fff;
  border-radius: 2px;
  overflow: auto;
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
  .bottom-tabbar {
    margin: 0 10px;
    height: 60px;
    width: calc(100% - 20px);
    border-radius: 0 0 4px 4px;
    flex-direction: row;
    justify-content: space-between;
    span {
      display: block;
      color: #48494c;
      font-size: 14px;
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
  .order-textarea {
    width: 100%;
    height: 56px;
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .error-tips {
    margin: 0;
    padding: 0;
    font-size: 12px;
    line-height: 30px;
    color: #e45434;
    text-align: left;
    span {
      display: block;
      float: right;
      color: #e45434;
      b {
        font-weight: normal;
        color: #4979ff;
        text-decoration: underline;
      }
    }
  }
}

.label-add-box{
  width: 100%!important;
  img{
    display: block;
    float: right;
    margin-top: 6px;
    width: 16px;
    height: 16px;
  }
}
.m-t-10{
  display: block;
  margin-top: 10px;
}
.other-wrap{
  display: inline-block;
  padding-right: 24px;
  width: 50%;
}
.interval-style{
  line-height: 86px;
  text-align: center;
}
</style>