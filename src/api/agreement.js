import request from "@/utils/Request";
// 用户协议签署内容获取
export const getContractContent = (data) => {
   return request({
     url: `/uc/contract/v1/getContractContent`,
     method: "get",
     params:data,
   });
 };
 // 用户协议签署
export const signContract = (data) => {
   return request({
     url: `/uc/contract/v1/signContract`,
     method: "post",
     params:data,
   });
 };
 