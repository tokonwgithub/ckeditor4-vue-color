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
      <h3>学生信息</h3>
      <el-form-item label="姓名" prop="username" class="other-style">
        <el-input style="width:100%" placeholder="请输入姓名" v-model="orderForm.username" size="small" />
      </el-form-item>
      <el-form-item label="所属渠道" prop="sellerChannelName" class="other-style" v-if="orderForm.sellerChannelName">
        <el-input style="width:100%" placeholder="请选择渠道" v-model="orderForm.sellerChannelName" size="small" disabled />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile" class="other-style">
        <el-input style="width:100%" placeholder="请输入手机号"  v-model="orderForm.mobile" size="small" />
      </el-form-item>
      <el-form-item label="学生昵称" prop="nickName" class="other-style">
        <el-input
          style="width:100%"
          placeholder="请输入学生昵称"
          v-model="orderForm.nickName"
          size="small"
        />
      </el-form-item>
      <!-- <el-form-item label="微信号" prop=""  class="other-style" >
            <el-input style="width:100%"    v-model="orderForm.mobile" size="small" />
      </el-form-item>-->
      <el-form-item label="Email" prop="email" class="other-style">
        <el-input style="width:100%" placeholder="请输入Email"  v-model="orderForm.email" size="small"  @blur="regEmailFun"/>
      </el-form-item>
      <el-form-item label="留学国家" prop="countryId" class="other-style">
        <el-select
          placeholder="请选择留学国家"
          v-model="orderForm.countryId"
          style="width:100%"
          size="small" 
          @change="getSchoolList"
        >
          <el-option
            style="width:350px"
            :label="item.text + '【'+ item.enName +'】'"
            :value="item.id"
            v-for="(item,i) in countryList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学校" prop="universityId" class="other-style">
        <el-select
          placeholder="请选择学校"
          v-model="orderForm.universityId"
          style="width:100%"
          filterable
          size="small"
        >
          <el-option
            style="width:350px"
            :label="item.text + '【'+ item.enName +'】'"
            :value="item.id"
            v-for="(item,i) in schoolList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在读专业" prop="professionalId" class="other-style">
        <el-select
          placeholder="请选择在读专业"
          v-model="orderForm.professionalId"
          style="width:100%"
          filterable
          size="small"
        >
          <el-option
            style="width:350px"
            :label="item.text + '【'+ item.enName +'】'"
            :value="item.id"
            :disabled="item.type == 1"
            v-for="(item,i) in majorList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在读年级" prop="schoolYear" class="other-style">
        <el-select
          placeholder="请选择在读年级"
          v-model="orderForm.schoolYear"
          style="width:100%"
          size="small"
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
      <el-form-item label="在读学历" prop="eduId" class="other-style">
        <el-select placeholder="请选择在读学历" v-model="orderForm.eduId" style="width:100%" size="small">
          <el-option
            style="width:350px"
            :label="item.text"
            :value="item.id"
            v-for="(item,i) in eduList"
            :key="i"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import BasicProxy from "@/proxy/customer/Basic";
import { GradeList } from "@/views/customer/material/Cfg";
import { ucStudentSave } from "@/api/user";
import { getucStudentDetail } from "@/api/order";
export default {
  props: ["userid"],
  data() {
          const validateEmail = (rule, value, callback) => {
         const mailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
         if (!value) {
            callback()
         }
         if (mailReg.test(value)) {
            callback()
         } else {
            callback(new Error('请输入正确的邮箱格式'))
         }
      }
    return {
      countryList: [],
      schoolList: [],
      majorList: [],
      eduList: [],
      GradeList,
      rules: {
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        channel: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        nickName: [
          { required: true, message: "请输入学生昵称", trigger: "blur" },
        ],
         email:[ { required: false, trigger: 'blur', validator: validateEmail }],
        countryId: [
          { required: true, message: "请选择留学国家", trigger: "change" },
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
      orderForm: {
         professionalId:''
      },
    };
  },
  components: {},
  async created() {
    await this.getucStudentDetail();
    await this.getCountryList();
    await this.getSchoolList();
    await this.getMajorList();
    await this.getEduList();
  },
  methods: {
    // 邮箱验证
    regEmailFun(){
       const mailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
         if (!mailReg.test(value)) {
            return this.$message({
              message: "请输入正确的邮箱格式",
              type: "warning",
            });
         }
    },
    /** 修改用户资料 */
    async ucStudentSave() {
      const { status, body, msg } = await ucStudentSave(this.orderForm);
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
        localStorage.setItem('dbid',body.dbId);
      }
    },
    /* 国家列表 */
    async getCountryList() {
      this.countryList = await BasicProxy.getCountryList();
      console.log(this.countryList);
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
    formjudge() {
       let status = false;
       this.$refs.studentsform.validate((valid) => {
          if (valid) {
            status = this.ucStudentSave();
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
</style>