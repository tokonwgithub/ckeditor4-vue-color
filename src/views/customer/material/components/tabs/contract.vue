<template>
  <div class="contract-container" v-loading="contractLoading">
    <ul>
      <li v-for="(contract, i) in contractList" :key="i">
        <!-- 第一行 -->
        <div>
          <!-- 判断合同编号，如果没有 就显示 部门名称 谢遒龙 说的 -->
          <span class="label">{{contract.contractNo || contract.deptName}}</span>
          <span class="time">{{contract.createdTime | fmtYMDHM}}</span>
        </div>
        <!-- 第二行 -->
        <div style="margin-top: 10px;">
          <span
            class="status"
            :style="{ color: Contract2Val[+contract.status || 0].color }"
          >{{Contract2Val[+contract.status || 0].label}}</span>
          <section class="icon-box">
            <!-- <svg-icon icon-class="search-file" class-name="icon"></svg-icon> -->
            <svg-icon
              @click="handlePlane(contract)"
              v-show="+contract.status < 2"
              icon-class="plane"
              class-name="icon"
            ></svg-icon>
          </section>
        </div>
      </li>
    </ul>
    <van-cell :border="false">
      <template #title>
        <div class="tag-container" @click="openModal">
          <svg-icon icon-class="add" class-name="icon-add"></svg-icon>
          <span class="add-title">创建合同</span>
        </div>
      </template>
    </van-cell>
    <!-- 组件 -->
    <createModal ref="create" />
  </div>
</template>

<script>
/* 合同信息 */
import createModal from "./createModel";
import { Contract2Val } from "@/views/customer/material/Cfg";
import { sendNewsMsg } from "@/utils/Wechat/WxUtils";
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";

export default {
  components: { createModal },
  data() {
    return {
      Contract2Val
    };
  },
  computed: {
    ...mapState({
      contractList: e => e.customer_material.contractList,
      contractLoading: e => e.customer_material.contractLoading
    })
  },
  methods: {
    async handlePlane(data) {
      const { url, contractId } = data;
      const link = location.href.split("#")[0] + "#" + url;
      console.log(link, " link");
      await sendNewsMsg({
        title: "服务协议",
        url: link,
        desc: "请点击查看并确认服务协议",
        imgUrl:
          "https://classbro-oss.oss-cn-hongkong.aliyuncs.com/statice-resource/images/contract-ico.png"
      });
      await Customer.Material.updateContract(contractId);
    },
    async openModal() {
      await Customer.Material.getContractTypeList();
      this.$refs.create.open();
    }
  }
};
</script>

<style lang="scss" scoped>
.contract-container {
  ul {
    margin-top: 10px;
  }
  li {
    border: 1px solid rgba(217, 217, 217, 1);
    border-radius: 2px;
    width: 100%;
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 13px;
      }
      .label {
        color: #4979ff;
      }
      .time {
        color: #8c8c8c;
      }
      .status {
        font-size: 12px;
      }
      .icon-box {
        .icon {
          margin-left: 10px;
          color: #4979ff;
          font-size: 18px;
        }
      }
    }
  }
  .tag-container {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-add {
      color: #4979ff;
      font-size: 21px;
    }
    .add-title {
      font-size: 14px;
      color: #4979ff;
      margin-left: 10px;
    }
  }
}
</style>