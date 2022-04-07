/**
 * 流程类型
 * @enum
 */
export const FlowType = {
  LEAVE: 1 /* 请假 */,
  REIMBURSEMENT: 2 /* 报销 */,
  PAYMENT: 3 /* 付款申请流程 */,
  FORMAL_APPLY: 4 /* 转正申请流程 */,
  QUIT_APPLY: 5 /* 离职申请流程 */,
  QUIT_HANDOVER: 6 /* 离职交接申请流程 */,
};

/**
 * 流程状态
 * 状态 0初始化  1进行中 2 已完成  3已终止 退回 4撤销 5 通过后撤销
 * @enum
 */
export const FlowStatus = {
  INIT: 0 /* 初始化 */,
  DOING: 1 /* 进行中| 进行中 */,
  DONE: 2 /* 已完成|已通过 */,
  RETURN: 3 /* 已终止 退回|已驳回 */,
  STOP: 4 /* 撤销| 已撤销 */,
  DONE_STOP: 5 /* 通过后撤销 */,
};

/**
 * 用户审批状态
 * @enum
 * @returns {string}
 */
export const UserApproveStatus = {
  SUBMIT: "submit" /* 同意 */,
  REJECT: "reject" /* 驳回 */,
  WAIT: "wait" /* 待审批|审批中 */,
};

/**
 * 页脚 页签枚举
 * @enum
 * @returns {string}
 */
export const FooterTab = {
  NEW: "new" /* 新申请 */,
  MINE: "mine" /* 我的审批 */,
  DONE: "done" /* 已提交 */,
};

/**
 * 页签路由枚举
 * @enum
 */
export const FooterTabPath = {
  NEW: "/newapproval",
  MINE: "/approvalList",
  DONE: "/resignList",
};


