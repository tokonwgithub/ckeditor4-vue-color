<template>
  <div class="select-container">
    <el-form-item :label="label">
      <el-select
        v-model="form[field]"
        style="width: 100%"
        filterable
        :placeholder="placeholder"
        @change="setData"
      >
        <el-option
          style="max-width: 300px"
          v-for="(item, i) in columns"
          :key="i"
          :label="item.text"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Customer } from "@/store/dispatch/index";

export default {
  props: ["label", "placeholder", "field", "columns"],
  computed: {
    ...mapState({
      form: state => state.customer_material.user
    })
  },
  methods: {
    setData(id) {
      this.$emit("event", id);
      this.submit(this.form);
    },
    async submit(form) {
      const bool = await Customer.Material.updateUserDetail(form);
      if (bool) this.$toast("操作成功");
    }
  }
};
</script>