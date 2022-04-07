import request from "@/utils/Request";

/**
 * 获取微信配置
 * @param {string} state 客户的微信用户ID
 * @param {string} url
 * @param {string} type
 */
export const wxChatSign = (data) => {
  return request({
    url: `/uc/auth/sign`,
    method: "post",
    data,
  });
};
