import request from "@/utils/Request";
import { wyProxyUrl } from "config"
// const testurl = 'http://192.168.1.65:19004'
const testurl = ''
/* 账户查询 */

/**
 * 查询账户信息
 * @param {string} sysCode db|wx
 * @param {string} id 用户详情里面的 dbId 或 wxId
 * @function
 * @url http://121.43.174.41:3000/project/81/interface/api/5846
 */
export const userAccountGetById = ({ sysCode, id, accountType}) => {
  return request({
    url: `/${sysCode}/unauthorized/customer/get-by-id?id=${id}`,
    method: "get",
    params:{accountType:accountType?accountType:1}
  });
};

/**
 * 查询历史充值记录
 * @param {string} sysCode db|wx
 * @param {string} userId
 * @function
 */
export const getHistorRecharge = ({ sysCode, userId }) => {
  return request({
    url: `/${sysCode}/userAccount/getHistorRecharge/${userId}`,
    method: "get",
  });
};

/**
 * 充值
 * @param {string} sysCode db|wx
 * @param {string} current
 * @param {string} money
 * @param {string} thumbUrl
 * @function
 */
export const evidenceThumb = (sysCode, data) => {
  return request({
    url: `/${sysCode}/userAccount/evidenceThumb`,
    method: "post",
    data,
  });
};

/**
 * 绑定用户-查询业务系统客户列表信息-导毕
 * @param {string} sysCode db|wx
 * @param {string} key
 * @function
 */ 
export const userInfoGetList = ({ sysCode, key }) => {
  return request({
    url: `/uc/ucbind/v1/dbStudList?key=${key}`,
    method: "get",
  });
};
/**
 * 绑定用户-查询业务系统客户列表信息-实习
 * @param {string} sysCode db|wx
 * @param {string} key
 * @function
 */ 
 export const userInfoGetListSx = ({ key }) => {
  return request({
    url: `${testurl}/uc/ucbind/v1/sxStudList?key=${key}`,
    method: "get",
  });
};

/**
 * 绑定用户-查询业务系统客户列表信息-文亚
 * @param {string} sysCode db|wx
 * @param {string} key
 * @function
 */ 
export const userInfoGetListWy = (data) => {
  return request({
    url: `${wyProxyUrl}/wyoper/wy/customer-record/query-app-user`,
    method: "post",
    data
  });
};
/**
 * 创建用户
 * @param {number} childType 2文亚  1导毕
 * @param {number} ucId
 * @param {string} userId 子系统学生ID
 * @param {string} clientName 文亚创建账号需要的name
 * @param {string} bindType 1绑定  2创建 3参数同步  如果选择创建 则不需要选择childType
 * @function
 */
export const bindStudUser = (data) => {
  return request({
    url: `${testurl}/uc/ucbind/v1/bindStudUser`,
    method: "post",
    data,
  });
};

/**
 * 绑定用户
 * @param {number} childType 2文亚  1导毕
 * @param {number} ucId
 * @param {string} userId 子系统学生ID
 * @param {string} bindType 1绑定  2创建   如果选择创建 则不需要选择childType
 * @function
 */
export const mergeDbStudUser = (data) => {
  return request({
    url: `${testurl}/uc/ucbind/v1/mergeDbStudUser`,
    method: "post",
    data,
  });
};
/**
 * 绑定用户
 * @param {number} childType 3实习
 * @param {number} ucId
 * @param {string} userId 子系统学生ID
 * @param {string} bindType 1绑定  2创建   如果选择创建 则不需要选择childType
 * @function
 */
 export const mergeDbStudUserSx = (data) => {
  return request({
    url: `${testurl}/uc/ucbind/v1/mergeDbStudUserV2`,
    method: "post",
    data,
  });
};
/**
 * 导毕-学生账户充值
 * @function
 */
export const saveDbAccountMoney = (data) => {
  return request({
    url: `/db/sys/account/V1/addAccountMoney`,
    method: "post",
    data,
  });
};

/**
 * 文亚-学生账户充值
 * @function
 */
export const saveWyAccountMoney = (data) => {
  return request({
    url: `${wyProxyUrl}/wyoper/wy/customer-record/save-account-money`,
    method: "post",
    data,
  });
};

/**
 * 导毕-学生账户转汇
 * @function
 * @url http://121.43.174.41:3000/project/81/interface/api/4243
 */
export const changeDbAccountMoney = (data) => {
  return request({
    url: `/db/sys/account/V1/changeAccountMoney`,
    method: "post",
    data,
  });
};

/**
 * 文亚-学生账户转汇
 * @function
 */
export const changeWyAccountMoney = (data) => {
  return request({
    url: `${wyProxyUrl}/wyoper/wy/customer-record/change-account-money`,
    method: "post",
    data,
  });
};

// /**
//  * 文亚-更新客户client name
//  * @function
//  * @param {number} clientName 文亚的client
//  * @param {number} id 文亚id wyId
//  */
// export const changeWyAccountClientname = (data) => {
//   return request({
//     url: `/wy/customer-record/update-app-user-client-name`,
//     method: "post",
//     data,
//   });
// };
/**
 * 
 * @function
 * @param {number} userId 文亚id wyId
 */
export const sendPayLinks = (data) => {
  return request({
    url: `/wy/customer-record/generate-pay-links`,
    method: "post",
    data,
  });
};
// 
export const generatePayLinkWy = (params) => {
  return request({
    url: `/db/generatePayLinkWy`,
    method: "get",
    params,
  });
};
/**
 * 查询学生是文亚还是导毕学生
 */

export const queryStudentIsDbOrWy = params => {
  return request({
    url: `${testurl}/uc/ucbind/v1/queryStudentIsDbOrWy`,
    method: "get",
    params
  });
};

/**
 * 查询学期卡账户
 */
export const queryStudCardBag = params => {
  return request({
    url: "/db/sys/student/v1/queryStudCardBag",
    method: "get",
    params
  });
}

/**
 * 划动金额（导毕、文亚互转）
 */
 export const changeStudAccount = data => {
  return request({
      url: '/db/sys/account/v1/changeStudAccount',
      method: 'post',
      data
  })
}

/**
* 获取用户可划动金额账户
*/
export const getChangeStudAccount = params => {
  return request({
      url: '/db/unauthorized/customer/change/get-by-id',
      method: 'get',
      params
  })
}
