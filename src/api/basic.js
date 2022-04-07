import request from "@/utils/Request";
import { wyProxyUrl } from "config"

/* 基础数据 */

/**
 * 国家列表查询
 * @function
 */
export const countryQueryList = (params) => {
  return request({
    url: `/uc/country/v1/queryList`,
    method: "get",
    params,
  });
};
//查询资源等级下拉框
export const queryIntentLevelList = (params) =>
request({
  url: `/market/sys/analysis/classbrointentlevel/queryIntentLevelList`,
  method: "get",
  params
});
/**
 * 国家单条查询
 * @param {number} countryId
 * @url http://121.43.174.41:3000/project/38/interface/api/4929
 */
export const countryQueryById = (countryId) => {
  return request({
    url: `/uc/country/v1/queryById/${countryId}`,
    method: "get",
  });
};

/**
 * 学校分页查询
 * @param {number} page
 * @param {number} limit
 * @param {string} key 模糊查询
 * @url http://121.43.174.41:3000/project/38/interface/api/5118
 */
export const universityQueryPage = (params) => {
  return request({
    url: `/uc/university/v1/queryPage`,
    method: "get",
    params,
  });
};

/**
 * 学校单条查询
 * @param {string} id
 * @url http://121.43.174.41:3000/project/38/interface/api/5125
 */
export const universityQueryById = (id) => {
  return request({
    url: `/uc/university/v1/queryById/${id}`,
    method: "get",
  });
};

/**
 * 学校通过国家查询
 * @param {number} countryId
 */
export const universityQueryByCountryId = (countryId) => {
  return request({
    url: `/uc/university/v1/query/${countryId}`,
    method: "get",
  });
};

/**
 * 专业分页查询
 * @param {number} page
 * @param {number} limit
 * @param {string} key 模糊查询
 * @url http://121.43.174.41:3000/project/38/interface/api/5006
 */
export const professionalList = (params) => {
  return request({
    url: `/uc/professional/v1/list`,
    method: "get",
    params,
  });
};

/**
 * 专业查询单条数据
 * @param {number} id 文件ID
 */
export const professionalQuertById = (id) => {
  return request({
    url: `/uc/professional/v1/queryById/${id}`,
    method: "get",
  });
};

/**
 * 学历分页查询
 * @param {number} page
 * @param {number} limit
 * @param {string} key 模糊查询
 * @url http://121.43.174.41:3000/project/38/interface/api/5293
 */
export const tEduBackgroundList = (params) => {
  return request({
    url: `/uc/tEduBackground/v1/list`,
    method: "get",
    params,
  });
};

/**
 * 学历单条查询
 * @param {number} id 学历主键
 */
export const tEduBackgroundQuertOne = (id) => {
  return request({
    url: `/uc/tEduBackground/v1/queryOne/${id}`,
    method: "get",
  });
};

/**
 * 汇率分页查询
 * @param {number} page
 * @param {number} limit
 */
export const exchangeList = (params) => {
  return request({
    url: `/uc/exchange/v1/list`,
    method: "get",
    params,
  });
};
/**
 * 汇率分页查询
 * @param {number} page
 * @param {number} limit
 */
export const exchangeListwy = (params) => {
  return request({
    url: `${wyProxyUrl}/wyoper/wy/new-order/get-coin`,
    method: "get",
    params,
  });
};
