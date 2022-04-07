import request from "@/utils/Request";

/**
 * 获取指定客户的合同列表
 * @param {string} wxUserId 客户的微信用户ID
 * @url http://121.43.174.41:3000/project/38/interface/api/5678
 */
export const contractListByUser = (wxUserId) => {
  return request({
    url: `/uc/contract/v1/listByUser/${wxUserId}`,
    method: "get",
  });
};

/**
 * 查询所有合同类型
 */
export const contractTypeAllList = () => {
  return request({
    url: `/uc/contractTemplate/v1/contractType`,
    method: "get",
  });
};

/**
 * 创建合同，给用户绑定合同
 * @param {string} wxUserId 客户的微信用户ID
 * @param {string} templateId 模板ID
 * @param {string} contractType 合同类型
 */
export const addContract = (data) => {
  return request({
    url: `/uc/contract/v1/addContract`,
    method: "post",
    data,
  });
};

/**
 * 发送合同时，将合同状态修改为待签署
 * @param {string} contractId 合同ID
 */
export const sendContract = (contractId) => {
  return request({
    url: `/uc/contract/v1/sendContract/${contractId}`,
    method: "post",
  });
};

/**
 * 创建合同时，用该接口查询合同模板列表
 * @param {string} contractType 合同类型 1：业务合同  2：服务协议
 */
export const contractTemplate = (params) => {
  return request({
    url: `/uc/contractTemplate/v1/listByOperator`,
    method: "get",
    params,
  });
};
