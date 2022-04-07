import { wxChatSign } from "@/api/wechat";

export default class WxChat {
  constructor(state, url) {
    this.state = state;
    this.url = url;
  }

  /**
   * 接口获取 config
   */
  async wxConfig() {
    const { status, body } = await wxChatSign({
      state: this.state,
      url: this.url,
      type: "config",
    });
    if (status === 200) {
      const { appId, timestamp, nonceStr, signature } = body || {};
      /**
       * {
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，企业微信的corpID
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: ["openDefaultBrowser"], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来'chooseImage' , 'openDefaultBrowser' , 'getCurExternalContact'
      }
       */
      const _config = {
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，企业微信的corpID
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: ["openDefaultBrowser"], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来'chooseImage' , 'openDefaultBrowser' , 'getCurExternalContact'
      };
      console.log(_config, " _config");
      alert(JSON.stringify(_config));
      wx.config(_config);
    } else throw "获取企业微信config接口异常";
  }

  ready() {
    return new Promise(function(resolve) {
      wx.ready(function() {
        resolve();
      });
    });
  }

  /**
   * 应用配置
   */
  wxAgentConfig() {
    return new Promise((resolve, reject) => {
      this.ready().then(async () => {
        const { status, body } = await wxChatSign({
          state: this.state,
          url: this.url,
          type: "agent_config",
        });
        if (status === 200) {
          const {
            appId: corpid,
            agentId: agentid,
            timestamp,
            nonceStr,
            signature,
          } = body || {};

          /**
           * corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
           */
          const _agentConfig = {
            corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
          };
          console.log(_agentConfig, " _agentConfig");
          alert(JSON.stringify(_agentConfig));
          wx.agentConfig({
            ..._agentConfig,
            jsApiList: [
              "getCurExternalContact",
              "sendChatMessage",
              "openUserProfile",
              "selectEnterpriseContact",
            ], //必填
            success: function(res) {
              alert("agent成功！");
              alert(JSON.stringify(res));
              resolve(res);
            },
            fail: function(rej) {
              reject(rej);
            },
          });
        }
      });
    });
  }

  /**
   * 自动鉴权
   */
  async autoAuth() {
    try {
      await this.wxConfig();
      await this.wxAgentConfig();
      return true;
    } catch (error) {
      console.error(error);
      throw Error("企业微信 鉴权失败");
    }
  }
}
