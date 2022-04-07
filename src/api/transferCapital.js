import request from "@/utils/Request";
/* 销售主管审核划拨 */
export function auditOrderBalanceReturn(data){
  return request({
    url: "/db/sys/sellerOrder/v1/auditOrderBalanceReturn",
    method: "POST",
    data: data,
  })
} 
/* 主管查询销售申请单 */
export function queryOrderBalanceReturnRecord(data){
  return request({
    url: `/db/sys/sellerOrder/v1/queryOrderBalanceReturnRecord/${data.id}`,
    method: "GET"
  })
} 