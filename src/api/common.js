import request from '@/utils/Request'

/**
 * 查询国家列表
 */
export const getCountryList = params => {
    return request({
        url: "/uc/country/v1/queryList",
        method: "get",
        params,
    })
}

/**
 * 根据国家获取学校列表
 */
export const getUniversityList = id => {
    return request({
        url: `/uc/university/v1/query/${id}`,
        method: "get",
    })
}

/**
 * 获取专业列表
 */
export const getProfessionalList = params => {
    return request({
        url: `/uc/professional/v1/list`,
        method: "get",
        params
    })
}
export const getProfessionalListcourse = params => {
    return request({
        url: `/uc/knowledge/v1/querySpecialtyList`,
        method: "get",
        params
    })
}

/**
 * 获取擅长学科列表
 */
export const getSpecialtyClassList = params => {
    return request({
        url: `/uc/specialtyClass/v1/queryByProfessionalIds`,
        method: "get",
        params
    })
}