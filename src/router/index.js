import Vue from "vue";
import VueRouter from "vue-router";

/* 解决页面跳转 报 Uncaught (in promise)异常 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

import customer from "./customer";
import order from "./order";
import transferCapital from "./transferCapital"
// import transferCapital from "./transferCapital"
import unlockApplication from "./unlockApplication"
import outPrices from "./outPrices";

const routes = [
  /* 客户资料 */
  ...customer,
  ...order,
  ...transferCapital,
  // ...transferCapital,
  ...unlockApplication,
  ...outPrices,
  {
    path: "/redirect/:path*",
    component: () => import("@/views/redirect/index"),
  },
  {
    path: "/404",
    component: () => import("@/views/404/index"),
    hidden: true,
  },
  /**
   * 404页面默认是要添加到最底层，
   * 不然404之后的页面会因为 通配符的原因，
   * 页面刷新直接进入404页面。
   */
  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
