<template>
  <div>
    <van-popup v-model="show" position="bottom">
      <van-picker :columns="columns" show-toolbar @confirm="confirm" @cancel="show = false" />
    </van-popup>
  </div>
</template>
<script>
/* 列表选择器 */
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    open() {
      this.show = true;
    },
    confirm(val) {
      this.$emit("confirm", val);
      this.show = false;
    }
  }
};
</script>