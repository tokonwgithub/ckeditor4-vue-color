import request from "@/utils/Request";
// import {Env} from "config";
let chatSingle = ''
// Env == 'production'?'http://consoleapi.orderpool.net/routapi':''
/* 查询订单问题列表 */

/**
 * 查询文亚订单类型
 * @param {string} sysCode db|wx
 */
export const getWyorderType = ({ sysCode }) => {
  return request({
    url: `${sysCode}/new-order/get-order-type`,
    method: "get"
  });
};

/**
 * 查询关联订单
 * @param {string} sysCode db|wx
 */
export const getUndoneCustomList = ({ sysCode, userId }) => {
  return request({
    url: `${sysCode}/sys/sellerOrder/v1/getUndoneCustomList`,
    method: "get",
    params:{userId}
  });
};

/**
 * 获取学生个人信息
 * @param {string} userId 
 */
export const getucStudentDetail = ({ userId }) => {
  return request({
    url: `/uc/ucStudent/v1/info/${userId}`,
    method: "get",
  });
};

/**
 * 查询报价人
 * @param {string} sysCode db|wx
 */
export const queryQuotableUserList = ({ sysCode, key }) => {
  return request({
    url: `${sysCode}/sys/sellerOrder/v1/queryQuotableUserList`,
    method: "get",
    params:{key}
  });
};
/**
 * 工作量计算论文
 * @param {string} sysCode db|wx
 */
export const calculate = ({ sysCode, data }) => {
  return request({
    url: `${sysCode}/sys/sellerOrder/v1/calculate`,
    method: "get",
    params:data
  });
};
/**
 * 查询账户信息
 * @param {string} sysCode db|wx
 * @param {string} type 订单类型展示
 * @function
 * @url http://121.43.174.41:3000/project/81/interface/api/5846
 */
export const getOrderQuestions = ({ sysCode, type }) => {
  return request({
    url: `${sysCode}/sys/sellerOrder/v1/getOrderQuestions`,
    method: "get",
    params:{type}
  });
};


/**
 * 保存订单信息
 * @param {string} sysCode db|wx
 * @param {string} data 订单类型展示
 */
export const savePurchaseOrderV2 = ({ sysCode, data }) => {
  return request({
    url: `${sysCode}/sys/sellerOrder/v1/savePurchaseOrderV2`,
    method: "post",
    data
  });
};
/**
 * @param {string} sysCode db|wx
 * 获取上传数组
 */
export const getgroupList = ({sysCode,data}) => {
  return request({
    url: `${sysCode}/sys/courseware/v1/groupList`,
    method: "get",
    params:data
  });
};

/**
 * 根据币种查询账户信息
 */
export const queryByCurrency = ({sysCode,data}) => {
  return request({
    url: `${sysCode}/sys/account/v1/queryByCurrency/${data.userId}/${data.current}`,
    method: "get",
    params:{accountType:data.accountType?data.accountType:1}
  });
};


/**
 * 查询毕业论文阶段
 */
export const queryConfig = ({sysCode}) => {
  return request({
    url: `${sysCode}/sys/bigpaper/v1/config`,
    method: "get",
  });
};

/**
 * 查询老师是否上过引流课
 */
export const hasdrainage = ({sysCode,data}) => {
  return request({
    url: `${sysCode}/sys/bigpaper/v1/hasdrainage`,
    method: "post",
    params:data
  });
};
/**
 * 查询学期卡
 */
export const studCurrentCardBag = ({sysCode,data}) => {
  return request({
    url: `${sysCode}/sys/student/v1/studCurrentCardBag`,
    method: "get",
    params:data
  });
};
/**查询客户订单列表 */
export const getListByStudId = (data) => {
  return request({
    url: `/db/sys/student/v1/getListByStudId`,
    method: "get",
    params:data
  });
};

/**推荐人列表 */
export const recommenduser = (data) => {
  return request({
    url: `/db/sys/recommenduser/v1/list`,
    method: "get",
    params:data
  });
};
/**渠道列表 */
export const channelList = (params) => {
  return request({
    url: `/db/sys/seller/channel/v1/queryMyChannelList`,
    method: "get",
    params
  });
};
/**
 * 下单查询学生学期卡列表
 */
export const studCardBag = data => {
  return request({
    url: `/db/sys/student/v1/queryStudCardBag`,
    method: "get",
    params:data
  });
}

/**
 * 通过courseCode和学生userId定位courseCode
 * @param {string}
 * courseCode
  studId
 */
export const queryCourseCodeAndStudId = (params) => {
  return request({
    url: `/uc/courseCode/v1/queryCourseCodeAndStudId`,
    method: "get",
    params
  });
};

/**
 * 通过courseCode错误的时候获取专业
 * @param {string}
 * 
 */
export const professionalList = (params) => {
  return request({
    url: `/oper/sys/teac/v1/professionalList`,
    method: "get",
    params
  });
};
/**
 * 查询学生文亚订单列表
 */
export const queryWyOrderByStudentId = params => {
  return request({
    url: `/db/sys/wyOrder/v1/queryWyOrderByStudentId`,
    method: "get",
    params
  });
}
/**
 * 实习订单保存
 */
 export const saveCopywritingOrderV1 = data => {
  return request({
    url: `/db/sys/sellerOrder/saveCopywritingOrderV1`,
    method: "post",
    data
  });
}

/**
 * 发送确认函
 */
 export const sendConfirmOrder = courseId => {
  return request({
    url: `/db/sys/wyOrder/v1/sendConfirmOrder/${courseId}`,
    method: "get",
  });
} 

//实习账户处理
/**实习账户
 * 根据币种查询账户信息
 */
 export const queryByCurrencyShixi = ({sysCode,data}) => {
  return request({
    url: `/db/sys/jackarooAccount/V1/queryByCurrency/${data.userId}/${data.current}`,
    method: "get",
  });
};
/**实习账户
 * 根据币种类型充值
 */
export const addAccountMoneyShixi = (data) => {
  return request({
    url: `/db/sys/jackarooAccount/V1/addAccountMoney`,
    method: "post",
    data
  });
};
/**实习账户
 * 根据币种换汇
 */
 export const changeAccountMoneyShixi = (data) => {
  return request({
    url: `/db/sys/jackarooAccount/V1/changeAccountMoney`,
    method: "post",
    data
  });
};
/**实习账户
 * 查询客户实习订单列表
 */
 export function getListByStudIdShixi(data) {
  return request({
    url: "/db/sys/jackarooOrder/v1/getListByStudId",
    method: "get",
    params: data,
  });
}
/**
 * 获取小红花数量
 */
 export const getRed = (params) => {
  return request({
    url: `/db/sys/sysStudArticle/v1/getSysStudArticle`,
    method: "get",
    params
  });
};
/**
 * 获取用户详细信息
 */
export function getUserDetailsInfo() {
  return request({
    url: `/uc/account/v1/getUserDetailsInfo`,
    method: "get",
  });
};

// copy订单
// orderNo    type: 1 辅导 2 文案

export function queryCourseListByOrderNo(params) {
  return request({
    url: `/db/sys/sellerOrder/v1/queryCourseListByOrderNo`,
    method: "get",
    params
  });
};

// 通过订单ID查询课件信息
//  get
// 参数 courseId
export function queryCreateOrderCourseware(params) {
  return request({
    url: `/db/sys/sellerOrder/v1/queryCreateOrderCourseware`,
    method: "get",
    params
  });
};
// 通过订单ID查询课件组文件信息
//  get
// 参数 courseId
export function queryCreateOrderCoursewareV2(params) {
  return request({
    url: `/db/sys/sellerOrder/v1/queryCreateOrderCoursewareV2`,
    method: "get",
    params
  });
};
/**
 * 根据识别码获取预存金额
 */
 export const getMoneyByCode = params => {
  return request({
    url: `/db/sys/seller/channel/v1/queryDepositByCode`,
    method: "get",
    params
  });
};


// 生成支付链接
//  get
// 参数 curr,
//studUserId
export function generatePayUrl(params) {
  return request({
    url: `/uc/api/payAccount/generatePayUrl`,
    method: "get",
    params
  });
};
// 24小时内是否有一比自动充值
export function autoRechargeCheck(params) {
  return request({
    url: `/db/sys/account/V1/autoRechargeCheck/${params.studentId}`,
    method: "get",
    params
  });
};


// 文亚运营的状态添加售后群聊
// /
// 获取默认售后专员
export const getAfterSales = (params) => {
  return request({
    url: `${chatSingle}/wyoper/operation/processingGroupChat/getAfterSales`,
    method: "get",
    params
  })
} 

// 获取售后专员列表
export const getAfterSalesList = (data) => {
  return request({
    url: `${chatSingle}/wyoper/operation/processingGroupChat/getAfterSalesList`,
    method: "get",
  })
} 
// https://previewconsoleapi.classbro.com/routapi/uc/group/v1/afterSalesGroup?studUserId=30796&afterSalesUserId=5018
export const afterSalesGroup = (data) => {
  return request({
    url:  `/uc/group/v1/afterSalesGroup`,
    method: "get",
    params:data
  })
} 
//保存群聊信息
// orderNum	string	
// 必须
// wyOrderId	
// courseId	string	
// 非必须
// 导毕订单ID	
// userId	number	
// 必须
// 售后userId	
// groupChatId	string	
// 必须
// 群ID
export const processingGroupChatsave = (data) => {
  return request({
    url: `${chatSingle}/wyoper/operation/processingGroupChat/save`,
    method: "post",
    data
  })
} 
// 获取问卷链接
// groupChatId
export const getQuestionnaireUrl = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/getQuestionnaireUrl`,
    method: "post",
    data
  })
} 

// 发送问卷掉用
// groupChatId
export const updateQuestionnaireStatus = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/updateQuestionnaireStatus`,
    method: "post",
    data
  })
} 
// /routapi/wyoper/operation/processingGroupChat/selectListPage  订单列表列表接口，参数固定currPage=1&pageSize=2000&groupChatIdNull=1
export const getQuestionnaireUrlorderGroup = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/selectListPage`,
    method: "get",
    params:data
  })
} 
// /routapi/wyoper/operation/processingGroupChat/checkCreate   检查接口      GET请求
// 参数：groupChatId  -- 群ID
export const checkCreate = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/checkCreate`,
    method: "get",
    params:data
  })
} 
// /routapi/wyoper/operation/processingGroupChat/updateGroupChatId  修改群ID      GET请求
// 参数：
// groupChatId  -- 群ID
// id      -- 所选列表数据ID
export const updateGroupChatId = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/updateGroupChatId`,
    method: "get",
    params:data
  })
} 

// /routapi/wyoper/operation/processingGroupChat/updateGroupChatId  修改群ID      GET请求
// 参数：
// groupChatId  -- 群ID
// id      -- 所选列表数据ID
export const updateSellerGroupChatId = (data) => {
  return request({
    url:`/wyoper/operation/processingGroupChat/updateSellerGroupChatId`,
    method: "get",
    params:data
  })
} 
// 校验群聊对应的Revision订单状态
export const checkRevision = (data) => {
  return request({
    url:`/wyoper/operation/processingGroupChat/checkRevision`,
    method: "get",
    params:data
  })
} 
//设置 OR取消 自动发送文件
export const updateAutoSendFile = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/updateAutoSendFile`,
    method: "post",
    data
  })
} 
// 发送文件
export const sendMsg = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/sendMsg`,
    method: "post",
    data
  })
} 
//售后工具 - 订单文件列表
export const getOrderFiles = (data) => {
  return request({
    url:`/wyoper/operation/processingGroupChat/getOrderFiles`,
    method: "get",
    params:data
  })
} 
// 创建群聊
export const createChat = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/createChat`,
    method: "post",
    data
  })
} 
// 群操作日志列表
export const getChatLogList = (data) => {
  return request({
    url:`/wyoper/operation/processingGroupChat/getChatLogList`,
    method: "get",
    params:data
  })
} 
// 获取待处理群聊信息
export const getGroupChatInfo = (data) => {
  return request({
    url:`/wyoper/operation/processingGroupChat/getGroupChatInfo`,
    method: "get",
    params:data
  })
} 
// 获取当天排班售后列表
export const dayArrangeList = (data) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/dayArrangeList`,
    method: "get",
    data
  })
} 
// 获取客户欠费账单
export const getCustomerBills = (params) => {
  return request({
    url: `/wyoper/operation/processingGroupChat/getCustomerBills`,
    method: "get",
    params
  })
} 