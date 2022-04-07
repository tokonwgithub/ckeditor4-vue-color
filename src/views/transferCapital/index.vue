<template>
  <div class="transferCapital-container" v-loading="loading">
    <div v-if="isAudit">
      <div class="tips-top">
        销售<span>{{applyData.applyUserName}}</span>申请划拨<span>订单号{{applyData.orderNo}}</span>订单余额
      </div>
      <div class="content">
        <div class="content-item MB">
          <div class="label">申请划拨金额</div>
          <div class="value returnMoney">{{applyData.currency}} {{applyData.applyMoney}}</div>
        </div>
        <div class="content-item">
          <div class="label">申请划拨理由</div>
          <div class="value remark">{{applyData.applyRemark}}</div>
        </div>
      </div>
      <div class="tips">注：申请被主管通过后金额会自动进入客户账户余额，请注意查看！</div>
      <div class="footer-btn">
        <el-button style="width: 166px; height: 36px;" @click="onReject">拒绝</el-button>
        <el-button style="width: 166px; height: 36px;" type="primary" :loading="loading" @click="onAgree">同意</el-button>
      </div>
    </div>
    <div v-else class="img">
      <img v-if="isAgree" src="@/assets/images/transferCapital/agree.png" />
      <img v-else src="@/assets/images/transferCapital/reject.png" />
      <div class="resultTips">{{resultTips[applyData.statused]}}</div>
    </div>
    <el-dialog title="拒绝申请" :visible.sync="isShow" width="400px" append-to-body :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" :inline="true" class="demo-ruleForm">
        <el-form-item prop="remark" label="拒绝理由" style="margin:0 0 16px">
          <el-input v-model="form.remark" type="textarea" :rows="4" resize="none" style="width: 100%;"/>
        </el-form-item>
      </el-form>
      <div class="footer_center">
        <el-button type="primary" style="width: 100%; height: 36px;" :loading="loading" @click="onSure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { auditOrderBalanceReturn, queryOrderBalanceReturnRecord } from '@/api/transferCapital'
export default {
  data() {
    return {
      isShow: false,
      loading: false,
      id: '',
      token: '',
      applyData: {
        applyUserName: '',
        orderNo: '',
        applyMoney: '',
        currency: '',
        applyRemark: '',
        statused: 0
      },
      form: {
        remark: ''
      },
      rules: {
        remark: [{required: true, message: '请输入拒绝理由', trigger: ['change']}]
      },
      resultTips: {
        1: "申请已通过",
        2: "申请已拒绝"
      },
      params: {}
    }
  },
  computed: {
    isAgree() {
      return this.applyData.statused === 1
    },
    isAudit() {
      return this.applyData.statused === 0
    }
  },
  created () {
    document.title = '订单余额划拨申请'
    const query = window.location.href.split("?")[1];
    if (query) {
      const params = query.split('&')
      const arr_id = params[0].split('=')
      const arr_token = params[1].split('=')
      this[arr_id[0]] = arr_id[1]
      this[arr_token[0]] = arr_token[1]
      
      this.onQueryById()
    }
  },
  methods: {
    onQueryById() {
      this.loading = true
      queryOrderBalanceReturnRecord({id: this.id}).then(res => {
        if (res.status === 200) {
          this.applyData = res.body
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onReject() {
      this.isShow = true
    },
    onSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.params = {
            id: this.id,
            statused: 2,
            rejectRemark: this.form.remark
          }
          this.audit()
        }
      })
    },
    onAgree() {
      this.params = {
        id: this.id,
        statused: 1
      }
      this.audit()
    },
    audit() {
      this.loading = true
      auditOrderBalanceReturn(this.params).then(res => {
        if (res.status === 200) {
          this.isShow = false
          this.applyData.statused = this.params.statused
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
/deep/.el-button{
  border: 1px solid #4979FF;
  border-color: #4979FF;
  color: #4979FF;
}
/deep/.el-button--primary{
  color: #FFFFFF;
  background-color: #4979FF;
  border-color: #4979FF;
}
/deep/.el-form-item,
/deep/.el-form-item__content{
  width: 100%;
}
/deep/.el-form-item__label{
  height: 12px;
  font-size: 12px;
  font-weight: 400;
  color: #8C8C8C;
  line-height: 12px;
  margin-bottom: 3px;
}
/deep/.el-dialog__header{
  text-align: center;
  line-height: 16px;
  border-bottom: 1px solid #D9D9D9;
}
/deep/.el-dialog__title{
  font-size: 16px;
  font-weight: 600;
  color: #2C2D2F;
}
/deep/.el-dialog__body{
  padding: 20px 20px 30px;
}
</style>
<style lang="scss" scoped>
@import url("../../font/font.css");
.transferCapital-container{
  margin: 0 auto;
  max-width: 600px;
  height: 100%;
  background-color: #fff;
  .title{
    background-color: #1D1D1D;
    font-size: 18px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 40px;
    text-align: center;
    position: relative;
    .el-icon-arrow-left{
      position: absolute;
      left: 20px;
      top: 10px;
    }
  }
  .tips-top{
    font-size: 14px;
    font-weight: 400;
    color: #2C2D2F;
    line-height: 14px;
    width: calc(100% - 40px);
    padding: 30px 20px;
    span{
      color: #6484FF;
      margin: 0 3px;
    }
  }
  .content{
    width: calc(100% - 40px);
    margin: 0 auto 20px;
    padding: 24px 16px;
    box-shadow: 0px 2px 11px 0px rgba(66, 70, 78, 0.18);
    .content-item{
      display: flex;
    }
    .MB{
      margin-bottom: 30px;
    }
    .label{
      font-size: 14px;
      font-weight: 400;
      color: #8C8C8C;
      line-height: 22px;
    }
    .value{
      flex: 1;
      padding-left: 30px;
      vertical-align: top;
    }
    .returnMoney{
      font-size: 14px;
      font-family: "YouSheBiaoTiHei";
      color: #507AEF;
      line-height: 22px;
    }
    .remark{
      font-size: 14px;
      font-weight: 400;
      color: #48494C;
      line-height: 22px;
    }
  }
  .tips{
    height: 12px;
    font-size: 12px;
    font-weight: 400;
    color: #E45434;
    line-height: 12px;
    text-align: center;
  }
  .footer-btn{
    text-align: center;
    padding: 40px 0 20px 0
  }
  .img{
    padding-top: 140px;
    margin: 0 auto;
    text-align: center;
  }
  .resultTips{
    height: 18px;
    font-size: 18px;
    font-weight: 600;
    color: #2C2D2F;
    line-height: 18px;
    padding: 30px;
  }
}
</style>