<template>
  <div id="app">
    <router-view v-if="authorize" :key="$route.fullPath" />
  </div>
</template>
<script>
// import WxChatAuth from "@/utils/Wechat/Auth";
import { getQueryString } from "@/utils/index";
import { autoAuth } from "@/utils/Wechat/WxUtils";

export default {
  data() {
    return {
      authorize: true /* 授权 */,
    };
  },
  methods: {
    /* 获取用户权限 */
    async getAuth() {
      const url = window.location.href + "";
      const state = getQueryString("state", url);
      if (state) sessionStorage.setItem("state", state);
      autoAuth(location.href.split("#")[0]);
    },
  },
  mounted() {
    this.getAuth();
  },
};
</script>