<template>
  <div class="order-content">
    <el-form
      ref="studentsform"
      :model="orderForm"
      :rules="rules"
      label-width="80px"
      size="mini"
      label-position="top"
    >
      <el-form-item label="Client name" prop="clientName" class="other-style">
      <el-input  v-model="orderForm.clientName" placeholder="Please enter your Client name" style="width:100%;"  size="small" v-if="!againstatus" type="text" :disabled="editstatus == 'edit'"></el-input>
       <el-select v-model="orderForm.clientName" placeholder="Please enter your Client name" @change="changeUser" filterable remote style="width:100%;-webkit-user-select: auto;user-select:auto" :remote-method="querySearch" size="small" :disabled="editstatus == 'edit'"  ref="agentSelect"  @hook:mounted="cancalReadOnly" 
       @visible-change="cancalReadOnly"  v-loading="userlistLoading"  v-else>
          <el-option :value="user.clientName" :label="user.clientName"  v-for="(user,indexu) in clientList" :key="indexu"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Country" prop="countryId" class="other-style">
        <el-select
          placeholder="Country"
          v-model="orderForm.countryId"
          style="width:100%"
          size="small" 
          filterable
          :disabled="editstatus == 'edit'"
          @change="getSchoolList"
        >
        <!-- clearable -->
          <el-option
            style="width:350px"
            :label="item.enName + '【'+ item.text +'】'"
            :value="item.id"
            v-for="(item,i) in countryList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="School" prop="universityId" class="other-style">
        <el-select
          placeholder="Please choose a school"
          v-model="orderForm.universityId"
          style="width:100%"
          filterable
          :disabled="editstatus == 'edit'"
          size="small"
        >
          <el-option
            style="width:350px"
            :label="item.enName + '【'+ item.text +'】'"
            :value="item.id"
            v-for="(item,i) in schoolList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="Major" prop="professionalId" class="other-style">
        <el-select
          placeholder="Please choose your major"
          v-model="orderForm.professionalId"
          style="width:100%"
          filterable
          :disabled="editstatus == 'edit'"
          size="small"
        >
          <el-option
            style="width:350px"
            :label="item.enName + '【'+ item.text +'】'"
            :value="item.id"
            v-for="(item,i) in majorList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Level" prop="eduId" class="other-style">
        <el-select placeholder="Please choose your education background" v-model="orderForm.eduId" style="width:100%" size="small" :disabled="editstatus == 'edit'">
          <el-option
            style="width:350px"
            :label="item.text"
            :value="item.id"
            v-for="(item,i) in eduList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Year" prop="schoolYear" class="other-style">
        <el-select
          placeholder="Please choose a grade"
          v-model="orderForm.schoolYear"
          style="width:100%"
          size="small"
          :disabled="editstatus == 'edit'"
        >
          <el-option
            style="width:350px"
            :label="item.text"
            :value="item.id"
            v-for="(item,i) in GradeList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Blackboard Website" prop="universityWebsite" class="other-style">
        <el-input style="width:100%" placeholder="Please input Blackboard ID"  v-model="orderForm.universityWebsite" size="small" :disabled="editstatus == 'edit'" />
      </el-form-item>
      <el-form-item label="Blackboard ID" prop="schoolAccount" class="other-style">
        <el-input style="width:100%" placeholder="Please input Blackboard ID"  v-model="orderForm.schoolAccount" size="small" :disabled="editstatus == 'edit'" />
      </el-form-item>
      <el-form-item label="Blackboard Password" prop="schoolPws" class="other-style">
        <el-input style="width:100%" placeholder="Please input Blackboard Password"  v-model="orderForm.schoolPws" size="small" :disabled="editstatus == 'edit'" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import BasicProxy from "@/proxy/customer/Basic";
import { GradeList } from "@/views/customer/material/Cfg";
import { ucStudentSave } from "@/api/user";
import { getucStudentDetail } from "@/api/order";
import { queryInfo } from "@/api/orderwy";
import { Base64 } from 'js-base64';
export default {
  props: ["userid",'forms','againstatus','editstatus'],
  data() {
    var countryIdValidator = (rule, value, callback) => {
      if (Number(value) == 0 || !value){
        callback(new Error('请选择留学国家!'));
      } else {
        callback();
      }
    };
    return {
      orderForm:{},
      clientList:[],
      countryList: [],
      schoolList: [],
      majorList: [],
      eduList: [],
      GradeList,
      userlistLoading:false,
      rules: {
        clientName: [{ required: true, message: "请输入clientName", trigger: "blur" }],
        channel: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        nickName: [
          { required: true, message: "请输入学生昵称", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮件", trigger: "blur" }],
        countryId: [
          { required: true,  validator:countryIdValidator, trigger: "change" },
        ],
        universityId: [
          { required: true, message: "请选择学校", trigger: "change" },
        ],
        professionalId: [
          { required: true, message: "请选择在读专业", trigger: "change" },
        ],
        schoolYear: [
          { required: true, message: "请选择在读年级", trigger: "change" },
        ],
        eduId: [
          { required: true, message: "请选择在读学历", trigger: "change" },
        ],
      },
    };
  },
  components: {},
  async created() {
    if(this.userid != 'undefined' || !this.userid){
      await this.getucStudentDetail();
      await this.getCountryList();
      await this.getSchoolList();
      await this.getMajorList();
      await this.getEduList();
    }
  },
  methods: {
    cancalReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const Selects = this.$refs
          console.log(Selects)
　　　　　　// 如果只有1个下拉框，这段就足够了---start
          if (Selects.agentSelect) {
            const input = Selects.agentSelect.$el.querySelector('.el-input__inner')
            input.removeAttribute('readonly')
          }
　　　　　　// 如果只有1个下拉框，这段就足够了---end
　　　　　　// 如果有多个，就加多几个，代码可以优化，我懒了
        }
      })
    },
    changeUser(val){
      let obj = this.clientList.find(item=>item.clientName == val);
      if(obj){
        console.log(obj,'000')
        this.orderForm = obj;
        this.handleQuery();
      }
    },
    handleQuery(){
      let bdata = decodeURIComponent(this.$route.query.bdata) 
      const defaultDatas = Base64.decode(bdata);
      let defaultData = JSON.parse(defaultDatas);
      const { userId,countryId} = this.orderForm;
      defaultData.userId = userId;
      defaultData.ucId =  userId;
      defaultData.countryId = countryId;
      defaultData = JSON.stringify(defaultData);
      let urlparams = Base64.encode(defaultData);
      this.forms.ucId = defaultData.userId;
      localStorage.setItem('userId',userId);
      this.$router.push({ path: "/orderwenya/index", query: {bdata: urlparams} });
    },
    async querySearch(e){
      this.userlistLoading = true;
      const { status, body, msg } = await queryInfo({key:e});
      this.userlistLoading = false;
      if(status == 200){
        this.clientList = body;
      }
    },
    /** 修改用户资料 */
    async ucStudentSave() {
      
      const { status, body, msg } = await ucStudentSave(this.orderForm);
      if(body.sellerChannelId){
        this.forms.sellerChannelId = body.sellerChannelId;
        this.forms.channelStatus = 1;
      }
      if (status == 200) {
        console.log(status, body);
        return true
      }else{
         this.$message({
            message: msg,
            type: "error",
        });
        return false
      }
    },
    async getucStudentDetail() {
      const userId = this.userid;
      const { status, body } = await getucStudentDetail({ userId });
      if (status == 200) {
        this.orderForm = body;
        localStorage.setItem('wyid',body.wyId);
        localStorage.setItem('dbid',body.dbId);
      }
    },
    /* 国家列表 */
    async getCountryList() {
      this.countryList = await BasicProxy.getCountryList();
    },
    /* 根据国家id获取学校列表 */
    async getSchoolList() {
      this.schoolList = await BasicProxy.getSchoolListByCountryId(this.orderForm.countryId);
    },
    /* 专业列表 */
    async getMajorList() {
      this.majorList = await BasicProxy.getMajorList();
    },
    /* 学历列表 */
    async getEduList() {
      this.eduList = await BasicProxy.getEduList();
    },
    formjudge(){
      let status = false
      this.$refs.studentsform.validate((valid) => {
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
<style lang="scss" scoped>
.order-content {
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
.input-clientname{
  width: 100%;
  line-height: 32px;
}
</style>