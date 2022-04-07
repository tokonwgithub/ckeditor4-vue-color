import request from "@/utils/Request";
const mockpath = ''
// 'http://192.168.1.110:9337'
// 'http://192.168.1.6:9333'
/**
 * 查询国家列表
 */
 export const getCountryList = params => {
  return request({
      url: "/wyoper/sys/country/selectAllNameAndId",
      method: "get",
      params,
  })
}

/**
* 过留学国家获取学校列表
* key	否	
搜索关键字
countryId	是	
17
国家ID

*/
export const getUniversityList = params => {
  return request({
      url: `/wyoper/sys/university/selectNameAndIdByCountryId`,
      method: "get",
      params
  })
}

/**
* 获取全部的学校列表
*/
export const getUniversityAllList = () => {
  return request({
      url: `/wyoper/sys/university/queryList`,
      method: "get",
  })
}

/**
* 获取专业列表
*/
export const getProfessionalList = params => {
  return request({
      url: `/oper/sys/teac/v1/professionalList`,
      method: "get",
      params
  })
}
/**
* 获取全部专业
*/
export const getSpecialization = params => {
  return request({
      url: `/wyoper/sys/specialization/queryAll`,
      method: "get",
      params
  })
}
/**
* 所有学科,根据专业ID
* courseFields,key
*/
export const selectByCourseField = (params) =>
request({
  url: `/wyoper/sys/specialization/selectByCourseField`,
  method: "get",
  params
});
// 销售的---------------------

export const sellerList = (params) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/sellerList`,
  method: "get",
  params
});
export const sellerCancel = (params) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/sellerCancel`,
  method: "post",
  params
});
export const exportResult = (params) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/exportResult`,
  method: "post",
  params
});
export const sellerGetById = (params) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/sellerGetById`,
  method: "get",
  params
});
// 申请报价
export const applyNewOffer = (data) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/applyNewOffer`,
  method: "post",
  data
});
// 申请报价
export const sellerUpdate = (data) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/sellerUpdate`,
  method: "post",
  data
});

//courseCode检查是否存在作业结构
// countryId	是	
// 国家ID
// universityId	是	
// 学校ID
// courseCode	是	

export const checkCodeAssignment = (params) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/checkCodeAssignment`,
  method: "get",
  params
});
//查询报价结果
//uuid
export const getNewOfferResult = (params) =>
request({
  url: `${mockpath}/db/sys/newOffer/v1/getNewOfferResult`,
  method: "get",
  params
});

//报价专员----------------------------------------------
// 报价回显报价数据
export const queryUpdateData = (params) =>
request({
  url: `${mockpath}/newoffer/sys/newOffer/v1/queryUpdateData`,
  method: "get",
  params
});
// 更新coursecode
export const updateCourseCode = (data) =>
request({
  url: `${mockpath}/newoffer/sys/newOffer/v1/updateCourseCode`,
  method: "post",
  data
});
// 更新coursecode
export const queryCourseCodeId = (params) =>
request({
  url: `${mockpath}/newoffer/sys/newOffer/v1/queryCourseCodeId`,
  method: "get",
  params
});

// 添加courseCode
export const addCourseCode = data => {
  return request({
    url: `/uc/courseCode/v1/add`,
    method: "post",
    data,
  });
};
// 编辑courseCode
export const editCourseCode = (data) => {
  return request({
    url: `/uc/courseCode/v1/update`,
    method: "post",
    data,
  });
};
// 提交作业结构
export const saveNewOfferStruct = (data) => {
  return request({
    url: `${mockpath}/newoffer/sys/newOffer/v1/saveNewOfferStruct`,
    method: "post",
    data,
  });
};
// 提交作业结构
export const reviewNewOffer = (data) => {
  return request({
    url: `${mockpath}/newoffer/sys/newOffer/v1/reviewNewOffer`,
    method: "post",
    data,
  });
};
