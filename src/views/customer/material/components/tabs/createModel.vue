<template>
  <div class="contract-create-container">
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="show"
      width="80%"
      :show-close="false"
      :before-close="closeModal"
      center
    >
      <div v-loading="modalLoading">
        <el-form>
          <el-form-item>
            <el-select
              v-model="form.contractType"
              style="width: 100%"
              placeholder="请选择合同类型"
              @change="setType"
            >
              <el-option
                v-for="(item, i) in contractTypeList"
                :key="i"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.templateId" style="width: 100%" placeholder="请选择合同">
              <el-option
                v-for="(item, i) in contractTemplates"
                :key="i"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- 取 消 -->
        <el-button @click="closeModal">取消</el-button>
        <!-- 保 存 -->
        <el-button type="primary" @click="confirm">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* 合同创建 */
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";

export default {
  data() {
    return {
      show: false,
      form: {}
    };
  },
  computed: {
    ...mapState({
      contractTypeList: e => e.customer_material.contractTypeList,
      contractTemplates: e => e.customer_material.contractTemplates,
      modalLoading: e => e.customer_material.modalLoading
    })
  },
  methods: {
    closeModal() {
      this.form = {};
      this.show = false;
    },
    async setType(type) {
      delete this.form.templateId;
      await Customer.Material.getContractTempListByType(type);
    },
    async confirm() {
      if (!this.form.templateId) {
        this.$toast("请先选择合同");
        return;
      }
      const { contractType, templateId } = this.form;
      const ok = await Customer.Material.createContract(
        contractType,
        templateId
      );
      if (ok) {
        this.closeModal();
        await Customer.Material.getContractList();
        this.$toast("操作成功");
      }
    },
    open() {
      Customer.Material.clearContractTemplates();
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.contract-create-container {
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 15px;

    .read {
      span {
        font-size: 13px;
        color: #4979ff;
      }
    }
  }
}
</style>