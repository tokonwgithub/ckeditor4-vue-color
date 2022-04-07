<template>
  <div class="private-vant-confirm-container">
    <private-dialog
      v-model="show"
      :before-close="beforeClose"
      :show-cancel-button="showCancelButton"
      :show-confirm-button="showConfirmButton"
      :close-on-click-overlay="closeOnClickOverlay"
    >
      <section>
        <svg-icon :icon-class="iconClass" v-if="iconClass" class-name="icon"></svg-icon>
        <span v-if="tips" class="tips">{{tips}}</span>
        <span v-if="message" class="message">{{message}}</span>
      </section>
    </private-dialog>
  </div>
</template>

<script>
/* 确认弹窗 */
import { Dialog } from "vant";

export default {
  components: {
    "private-dialog": Dialog.Component
  },
  data() {
    return {
      show: false,
      type: "success",
      tips: "",
      icon: "",
      message: "",
      showCancelButton: false /* 是否展示取消按钮 */,
      showConfirmButton: false /* 是否展示确认按钮 */,
      closeOnClickOverlay: false /* 是否在点击遮罩层后关闭弹窗 */,
      onClose: null,
      duration: 2000
    };
  },
  watch: {
    show(val) {
      const { showCancelButton, showConfirmButton, duration } = this.$data;
      if (val && !showCancelButton && !showConfirmButton) {
        setTimeout(() => {
          this.show = false;
          this.handleCallback("close");
        }, duration);
      }
    }
  },
  computed: {
    iconClass() {
      return this.icon || this.type;
    }
  },
  methods: {
    beforeClose(action, done) {
      this.show = false;
      done();
      this.handleCallback(action);
    },
    handleCallback(action) {
      if (typeof this.onClose === "function") {
        this.onClose(action);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.private-vant-confirm-container {
  section {
    padding: 20px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    .icon {
      font-size: 65px;
    }
    span {
      margin-top: 10px;
    }
    .tips {
      color: #2c2d2f;
      font-size: 20px;
    }
    .message {
      color: #48494c;
      font-size: 17px;
    }
  }
}
</style>