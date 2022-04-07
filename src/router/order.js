/* 客户模块 */

export default [
  {
    /* 订单选择 */
    path: "/order/index",
    component: () => import("@/views/order/index.vue"),
  },
  {
    /* 订单详情 */
    path: "/order/orderInfo",
    component: () => import("@/views/order/orderInfo.vue"),
  },
  {
    /* 全部页面切换 */
    path: "/order/allpage",
    component: () => import("@/views/order/allpage.vue"),
  },
  // 文亚订单展示
  {
    /* 订单选择 */ // 文亚添加子订单
    path: "/orderwenya/index",
    component: () => import("@/views/orderWenya/index.vue"),
  },
  // 实习订单
  {
    
    path: "/ordershixi/index",
    component: () => import("@/views/orderShixi/index.vue"),
  },
];
