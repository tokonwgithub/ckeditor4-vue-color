import request from "@/utils/Request";
/* 审核解锁订单 */
export function confirmUnLockOrder(data){
  return request({
    url:`/db/sys/sellerOrder/v1/confirmUnLockOrder/${data.id}/${data.statused}/${data.desc}`,
    method: "POST",
    data: data,
  })
} 
/* 查订单信息 */
export function getCourseObjectClear(data){
  return request({
    url: `/db/sys/sellerOrder/v1/getCourseObjectClear`,
    method: "GET",
    params: data
  })
} 