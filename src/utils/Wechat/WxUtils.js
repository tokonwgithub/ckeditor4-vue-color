import { wxChatSign } from "@/api/wechat";
import { Storage } from "@/utils/Enum/index";

export async function autoAuth(url) {
  localStorage.setItem(Storage.AGENT_CONFIG, 0);
  console.log(localStorage.getItem(Storage.AGENT_CONFIG));
  const state = sessionStorage.getItem("state");
  const res = await wxChatSign({
    state: state,
    url: url,
    type: "config",
  });
  if (res.status === 200) {
    initWXContext(res, state, url);
  }
}

function initWXContext(obj, state, url) {
  console.info("开始配置wx.config:%O", obj);
  wx.config({
    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: obj.body.appId, // 必填，企业微信的corpID
    timestamp: obj.body.timestamp, // 必填，生成签名的时间戳
    nonceStr: obj.body.nonceStr, // 必填，生成签名的随机串
    signature: obj.body.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: ["openDefaultBrowser","openEnterpriseChat","getCurExternalChat","getCurExternalContact"], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来'chooseImage' , 'openDefaultBrowser' , 'getCurExternalContact'
  });

  wx.ready(function() {
    //initAgentConfig初始化
    wxChatSign({
      url: url,
      state: state,
      type: "agent_config",
    }).then(function(res) {
      initAgentConfig(res);
    });
  });
  wx.error(function(res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    console.log("初始化失败%O", res);
  });
}

function initAgentConfig(obj) {
  console.info("配置initAgentConfig:%O", obj);
  wx.agentConfig({
    corpid: obj.body.appId, // 必填，企业微信的corpid，必须与当前登录的企业一致
    agentid: obj.body.agentId, // 必填，企业微信的应用id （e.g. 1000247）
    timestamp: obj.body.timestamp, // 必填，生成签名的时间戳
    nonceStr: obj.body.nonceStr, // 必填，生成签名的随机串
    signature: obj.body.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
    jsApiList: [
      "getCurExternalContact",
      "sendChatMessage",
      "openUserProfile",
      "selectEnterpriseContact",
      "getContext",
      "getCurExternalChat",
      "openEnterpriseChat",
      "openExistedChatWithMsg",
    ], //必填
    success: function(res) {
      localStorage.setItem(Storage.AGENT_CONFIG, 1);
      console.log(localStorage.getItem(Storage.AGENT_CONFIG));
      // 回调
      console.info("配置initAgentConfig成功:%O", res);
    },
    fail: function(res) {
      if (res.errMsg.indexOf("function not exist") > -1) {
        // alert("版本过低请升级");
      }
    },
  });
}

export function getOutUserId() {
  // return "wmYs_gEAAAYM3hBIOE4ROMrBV_AMmMAQ" //天宇客户
  // return "wmk6W0DAAAwAfgjT2wv7nnoseF79yEJQ";  //db\wy
  // TODO:
  return new Promise((resolve) => {
    wx.invoke(
      "getCurExternalContact",
      {
        //一些配置
      },
      function(res) {
        if (res.err_msg == "getCurExternalContact:ok") {
          let userId = res.userId; //返回当前外部联系人userId
          resolve(userId);
          // wx.invoke(
          //   "openUserProfile",
          //   {
          //     type: 2, //1表示该userid是企业成员，2表示该userid是外部联系人
          //     userid: userId, //可以是企业成员，也可以是外部联系人
          //     // "type": 1, //1表示该userid是企业成员，2表示该userid是外部联系人
          //     // "userid": "wmEAlECwAAHrbWYDetiu3Af13xlYDAAA" //可以是企业成员，也可以是外部联系人
          //   },
          //   function(res) {
          //     if (res.err_msg != "openUserProfile:ok") {
          //       //错误处理
          //     }
          //   }
          // );
        } else {
          //错误处理
        }
      }
    );
  });
}

/**
 * 获取进入H5页面的入口环境
 */
export function getWeChatEnv() {
  return new Promise((resolve) => {
    wx.invoke("getContext", {}, function(res) {
      if (res.err_msg == "getContext:ok") {
        let entry = res.entry; //返回进入H5页面的入口类型，目前有normal、contact_profile、single_chat_tools、group_chat_tools
        resolve(entry);
      } else {
        resolve(null);
        //错误处理
      }
    });
  });
}

export function sendNewsMsg(params) {
  const { url: link, title, desc, imgUrl } = params;
  return new Promise((resolve) => {
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

export function sendLetter(params) {
  const { url: link, title, desc, imgUrl } = params;
  return new Promise((resolve) => {
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
export function createdGroupChat(params){
  const {userId,externalUserIds,groupName,chatId} = params;
  return new Promise((resolve,reject) => {
    console.log(userId,externalUserIds,groupName,chatId)
    wx.openEnterpriseChat({
      userIds: userId,    //参与会话的企业成员列表，格式为userid1;userid2;...，用分号隔开。
      externalUserIds:externalUserIds, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
      groupName: groupName,  // 会话名称。单聊时该参数传入空字符串""即可。
      chatId:chatId,//指定此参数。如果是新建会话，chatId必须为空串
      success: function(res) {
        let item = window.localStorage.getItem("cdebug")
        if(item){
          alert("创建群聊成功1"+res.toString())
        }
        console.log(res,'调用结果')
        var chatIds = res; //返回当前群聊ID，仅当使用agentConfig注入该接口权限时才返回chatId
        if (res.errMsg == "openEnterpriseChat:ok"){
          if(item){
            alert("创建群聊成功2"+res.toString())
          }
          resolve(chatIds);
        }
      },
      fail: function(res) {
          let item2 = window.localStorage.getItem("cdebug")
          if(item2){
            alert("创建群聊失败"+res.toString())
          }
          if(res.errMsg.indexOf('function not exist') > -1){
              alert('版本过低请升级')
          }
          reject(res.err_msg);
      }
    });
  })
}
export function getChatId() {
  return new Promise((resolve) => {
    wx.invoke(
      "getCurExternalChat",
      {
      },
      function(res) {
        if (res.err_msg == "getCurExternalChat:ok")
          resolve(res.chatId);
        else reject(res.err_msg);
      });
  });
}
// 打开群聊
export function openChatGroup(chatId){
  return new Promise((resolve,reject) => {
    console.log(chatId);
    wx.invoke("openExistedChatWithMsg", {chatId: chatId,},
          function(res){
            console.log(res);
            if (res.err_msg == "openExistedChatWithMsg:ok"){
              resolve(res.chatId);
            }else{
              reject(res.err_msg);
            }
          }
      );
    });
}

