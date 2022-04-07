import Vue from "vue";

import "babel-polyfill"; //解决vue在ie的兼容性问题
import "normalize.css/normalize.css"; //优化 css 跨浏览器的一致性

import App from "./App.vue";
import router from "./router";
import store from "./store";
import permission from "./directives/index";

import "./icons"; //icon
import "@/utils/Interceptor"; //拦截器
import i18n from "./lang/index"; //internationalization

import filters from "@/filters/index";
import uweb from 'vue-uweb'
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// youzan
import Vant from "vant";
import "vant/lib/index.css";
import VMessage from "@/components/VMessage/index";
import "@/styles/index.scss"; //global css
import "@/styles/common.scss"; 
Vue.use(VMessage);
Vue.use(permission);
Vue.use(Vant);

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(Element, {
  size: "small",
  i18n: (key, value) => i18n.t(key, value),
});
let uwebOptions = {
  siteId: 1279528870,
  debug: false,
  autoPageview: false,
}
Vue.use(uweb,uwebOptions)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
