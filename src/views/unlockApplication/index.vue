<template>
  <div class="unlockApplication-container" v-loading="loading" v-if="isAudit">
    <div v-if="isAudit===1">
      <div class="tips-top">
        销售<span>{{applyData.sysSeller.username}}</span>申请解锁<span>订单号{{applyData.orderNo}}</span>订单！
      </div>
      <div class="content">
        <div class="content-item MB">
          <div class="label">订单总金额</div>
          <div class="value returnMoney">{{applyData.studPurchaseOrder.totalPrice }}</div>
        </div>
        <div class="content-item">
          <div class="label">订单定金</div>
          <div class="value returnMoney">{{applyData.studPurchaseOrder.prepayment}}</div>
        </div>
      </div>
      <div class="tips">注：申请通过后订单将自动解锁，请谨慎操作！</div>
      <div class="footer-btn">
        <el-button class="btntext" @click="onReject">拒绝</el-button>
        <el-button class="btntext" type="primary" :loading="loading" @click="onAgree">通过</el-button>
      </div>
    </div>
    <div v-else-if="isAudit===2||isAudit===3" class="img">
      <img v-if="isAudit===2" src="@/assets/images/transferCapital/agree.png" />
      <img v-else-if="isAudit===3" src="@/assets/images/transferCapital/reject.png" />
      <div class="resultTips">{{resultTips[applyData.sysSellerApunlock.applyUnlockStatused]}}</div>
    </div>
    <div class="nogoodsshow" v-else>没有相关信息</div>
    <el-dialog title="拒绝申请" :visible.sync="isShow" width="330px" append-to-body :close-on-click-modal="false">
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
import { confirmUnLockOrder, getCourseObjectClear } from '@/api/unlockApplication'
export default {
  data() {
    return {
      isShow: false,
      loading: false,
      id: '',
      token: '',
      applyData: {
        orderNo: '',
        studPurchaseOrder:{},
        sysSeller:{},
        sysSellerApunlock:{
          applyUnlockStatused:0
        },
      },
      form: {
        remark: ''
      },
      rules: {
        remark: [{required: true, message: '请输入拒绝理由', trigger: ['change']}]
      },
      resultTips: {
        2: "申请已通过",
        3: "申请已拒绝"
      },
      params: {}
    }
  },
  computed: {
    isAudit() {
      return this.applyData.sysSellerApunlock?this.applyData.sysSellerApunlock.applyUnlockStatused:4
    }
  },
  created () {
    document.title = '订单解锁申请'
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
      getCourseObjectClear({id: this.id}).then(res => {
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
            desc: this.form.remark
          }
          this.audit()
          this.isShow = false
        }
      })
    },
    onAgree() {
      this.params = {
        id: this.id,
        statused: 1,
        desc: '同意'
      }
      this.audit()
    },
    audit() {
      this.loading = true
      confirmUnLockOrder(this.params).then(res => {
        if (res.status === 200) {
          this.onQueryById()
        }else{
          this.$message({
              message: res.body.msg||'操作失败',
              type: "warning",
          });
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
.unlockApplication-container{
  margin: 0 auto;
  max-width: 600px;
  height: 100%;
  background-color: #fff;
  .nogoodsshow{
      padding-top: 150px;
      
      text-align: center;
  }
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
      font-size: 12px;
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
    // text-align: center;
    margin-left: 20px;
  }
  .footer-btn{
    text-align: center;
    padding: 40px 0 20px 0;
    .btntext{
        font-size: 15px;
        width: 166px; height: 36px;
    }
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