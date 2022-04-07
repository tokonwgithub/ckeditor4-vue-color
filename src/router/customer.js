/* 客户模块 */

export default [
  {
    /* 客户资料 */
    path: "/customer/material",
    name: 'customerMaterial',
    component: () => import("@/views/customer/material/index.vue"),
  },
  {
    /* 关联用户 */
    path: "/customer/material/bind",
    component: () =>
      import("@/views/customer/material/components/account/bindUser/index.vue"),
  },
  {
    /* 签署协议 */
    path: "/customer/agreement",
    component: () => import("@/views/customer/agreement/index.vue"),
    meta: {
      title: "服务协议",
    },
  },
  {
    /* 选择币种 */
    path: "/chooseCurrency",
    component: () => import("@/views/chooseCurrency/index.vue"),
    meta: {
      title: "选择币种",
    },
  },
  {
    /* 发送问卷 */
    path: "/sendQuestionre",
    component: () => import("@/views/sendQuestionre/index.vue"),
    meta: {
      title: "发送问卷",
    },
  },
  {
    // 售后工具
    path: '/afterSalesTools',
    component: ()=>import("@/views/afterSalesTools/index.vue")
  },
  {
    /* 打开群聊 */
      path: "/openGroupChat",
      component: () => import("@/views/openGroupChat/index"),
  },
];
