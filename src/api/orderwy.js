import request from "@/utils/Request";
import { wyProxyUrl } from "config"
// 通过clientName或wxUserId查询当前销售的学生列表
/**
 *key:clientName或wxUserId
 */
 export const queryInfo = (params) => {
  return request({
    url: `/uc/ucStudent/v1/queryInfo`,
    method: "get",
    params
  });
};

// 通过学生ID查询下单产品列表
/**
 *studUserId  学生ID ucId
 */
export const queryOrderProductList = (userId) => {
  return request({
    url: `/uc/product/v1/queryOrderProductList/${userId}`,
    method: "get",
  });
};
// 查询学生是文亚还是导毕学生
/**
 *studUserId  学生ID ucId
 */
export const queryStudentIsDbOrWy = (params) => {
  return request({
    url: `/uc/ucbind/v1/queryStudentIsDbOrWy`,
    method: "get",
    params
  });
};
/**
 * 销售渠道列表
 * @param {string}
 *  @param {string}page	是	
*  @param {string}limit	是	
*  @param {string}key	是	
*  @param {string}channelStatus
 */
export const queryMyChannelList = (params) => {
  return request({
    url: `/db/sys/seller/channel/v1/queryMyChannelList`,
    method: "get",
    params
  });
};
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
 * 查询学生referenceStyle列表
 * @param {string}studId
 * 
 */
export const getReferenceStyleByDbStudId = (params) => {
  return request({
    url: `/uc/referenceStyle/v1/getReferenceStyleByDbStudId`,
    method: "get",
    params
  });
};

/**
 * 通过db学生编号查询国家保分列表
 * @param {string}studId
 * 
 */
export const getPassScoreByDbStudId = (params) => {
  return request({
    // url: `/uc/country/v1/getPassScoreByDbStudId`,
    url: `/uc/country/v1/getHighScoreByDbStudId`,
    method: "get",
    params
  });
};

/**
 * 获取高分费分组档次
 */
 export function getHighScoreByDbStudIdV2(params) {
  return request({
    url: `/uc/country/v1/getHighScoreByDbStudIdV2`,
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
 * 查询文亚订单文件
 * @param {string} sysCode db|wx
 */
export const getWyFileType = (params) => {
  return request({
    url: `/db/sys/wyOrder/v1/copywritingGroupList`,
    method: "get",
    params
  });
};
/**
 * 查询文亚关联订单列表
 * @param {string} sysCode db|wx
 */
export const linkOrderList = (params) => {
  return request({
    url: `/db/sys/wyOrder/v1/linkOrderList`,
    method: "get",
    params
  });
};/**
* 查询特殊报价人列表
* @param {string} sysCode db|wx
role_type
*/
export const getEmpListByRoleType = (params) => {
 return request({
   url: `/uc/user/v1/getEmpListByRoleType`,
   method: "get",
   params
 });
};
/**
* 查询w文亚币种类型余额
* @param {string} 
userId  totalCoin 
*/
export const getbalancebycoin = (params) => {
 return request({
   url: `${wyProxyUrl}/wyoper/wy/customer-record/get-balance-by-coin`,
   method: "get",
   params
 });
};
/**
* 查询文亚下单统一接口
* @param {string} 
userId  totalCoin 
*/
export const saveCopywritingOrderV1 = (data) => {
  return request({
    url: `/db/sys/wyOrder/v1/saveCopywritingOrderV1`,
    method: "post",
    data
  });
 };
 /**
* 查询实习系统统一接口
* @param {string} 
userId  totalCoin 
*/
export const saveJackarooOrderV1 = (data) => {
  return request({
    url: `/db/sys/jackarooOrder/v1/saveJackarooOrderV1`,
    method: "post",
    data
  });
 };

/**
* 【查询】再来一单查询订单参数信息
* @param {string} courseId
*/
export const queryOrderVarInfo = (courseId) => {
  return request({
    url: `/db/sys/wyOrder/v1/queryOrderVarInfo/${courseId}`,
    method: "get",
  });
 };


/**
* 通过courseCode查询courseName
*/
export const queryCourseName = (params) => {
  return request({
    url: `/db/sys/wyOrder/v1/queryCourseName`,
    method: "get",
    params
  });
 };
  /**
* 修改订单接口
*/
export const updateCopywritingOrder = (data) => {
  return request({
    url: `/db/sys/wyOrder/v1/updateCopywritingOrder`,
    method: "post",
    data
  });
 };
 //获取当前人可以下小于30%的单子吗
 export const canCreatePrepaymentLess30 = (params) => {
  return request({
    url: `/db/sys/wyOrder/v1/canCreatePrepaymentLess30`,
    method: "get",
    params
  });
 };