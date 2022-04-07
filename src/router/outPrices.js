/* 客户模块 */

export default [
  {
    /* 销售报价单首页 */
    path: "/outPrices/index",
    component: () => import("@/views/outPrices/index.vue"),
  },
  {
    /* 报价专员报价单首页 */
    path: "/outPrices/handleCourse",
    component: () => import("@/views/outPrices/handleCourse"),
  },
  {
    /* 侧边栏报价单入口 */
    path: "/outPrices/enter",
    component: () => import("@/views/outPrices/enterQuto"),
  },
  {
    /* 报价单结果 */
    path: "/outPrices/result",
    component: () => import("@/views/outPrices/componments/result"),
  },
];
