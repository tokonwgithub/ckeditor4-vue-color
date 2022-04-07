/* 企业微信 api */

/**
 * 聊天工具栏分享消息到会话
 * @param {string} url H5消息页面url
 * @param {string} title H5消息标题
 * @param {string} desc H5消息摘要
 * @param {string} imgUrl H5消息封面图片URL
 */
export function sendNewsMsg(params) {
  const { url: link, title, desc, imgUrl } = params;
  return new Promise((resolve, reject) => {
    wx.invoke(
      "sendChatMessage",
      {
        msgtype: "news", //消息类型，必填
        news: {
          link, //H5消息页面url 必填
          title, //H5消息标题
          desc, //H5消息摘要
          imgUrl, //H5消息封面图片URL
        },
      },
      function(res) {
        if (res.err_msg == "sendChatMessage:ok")
          //发送成功
          resolve();
        else reject(res.err_msg);
      }
    );
  });
}

/**
 * 获取当前外部联系人userid
 */
export function getOutUserId() {
  return new Promise((resolve, reject) => {
    wx.invoke(
      "getCurExternalContact",
      {
        //一些配置
      },
      function(res) {
        alert(JSON.stringify(res));
        if (res.err_msg == "getCurExternalContact:ok") {
          resolve(res.userId); //返回当前外部联系人userId
        } else {
          reject("获取用户id异常", res);
        }
      }
    );
  });
}
