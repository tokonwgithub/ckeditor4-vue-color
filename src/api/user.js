import request from "@/utils/Request";
// const testUrl = 'http://192.168.1.65:19004'
const testUrl = ''
/* 用户 */

/**
 * 根据用户wxId查询用户资料
 * @param {string} wxUserId 用户微信ID
 * @function
 */
export const ucStudentQueryOne = (wxUserId) => {
  return request({
    url: `${testUrl}/uc/ucStudent/v1/queryOne/${wxUserId}`,
    method: "get",
  });
};
/**
 * 获取用户权限
 * @param {Number} appId App Id
 */
 export const getUserMenuAndPermission = (params) => {
  return request({
    url: `/uc/menu/v1/getUserMenu`,
    method: "get",
    params,
  });
};
/**
 * 获取用户详细信息
 */
 export function getUserDetailsInfo() {
  return request({
    url: `${testUrl}/uc/account/v1/getUserDetailsInfo`,
    method: "get",
  });
};

/**
 * 新增或修改用户资料
 * @param {string} wxUserId 用户微信ID
 * @param {string} username 用户名
 * @param {string} mobile 手机号
 * @param {string} nickName 昵称
 * @param {number} countryId 国家ID
 * @param {number} universityId 学校ID
 * @param {number} professionalId 专业ID
 * @param {number} schoolYear 学年
 * @param {number} eduId 学历Id
 * @param {string} schoolAccount 教务系统账号
 * @param {string} schoolPws 教务系统密码
 * @param {string} remark 备注
 * @param {number} studId 学生ID，修改的时候传
 * @function
 */
export const ucStudentSave = (data) => {
  return request({
    url: `/uc/ucStudent/v1/save`,
    method: "post",
    data,
  });
};

/**
 * 查询学生标签
 * @param {string} wxId 用户微信id
 * @url http://test.classbro.com:3000/project/38/interface/api/5825
 */
export const ucStudentQueryTag = (params) => {
  return request({
    url: "/uc/ucStudent/v1/queryTag",
    method: "get",
    params,
  });
};

/**
 * 添加学生标签
 * @param {string} wxId 用户微信id
 * @param {Array} tags
 */
export const ucStudentAddTag = (data) => {
  return request({
    url: "/uc/ucStudent/v1/addTag",
    method: "post",
    data,
  });
};

/**
 * 文亚clientname检查重复
 * @param {string} clientName 用户输入的clientname
 */
export const ucCheckClientName = (clientName,params) => {
  return request({
    url: `/uc/ucStudent/v1/checkClientName/${clientName}`,
    method: "get",
    params 
  });
};



