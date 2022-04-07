const debug = require("debug")(":::");
// 判断是否在浏览器环境下，node运行环境没有window
debug(`current env is`);
		debug('process.browser)',process.browser)
		console.log('process.browser)',process.browser)
const {
  VUE_APP_ENV: Env,
  VUE_APP_PROXY_URI: ProxyUri,
  VUE_APP_REQUEST_TIMEOUT: RequestTimeout,
  VUE_APP_OSS_URL: OSS_URL,
  NODE_RUN: NodeRun,
  VUE_APP_APP_ID: AppId,
  VUE_APP_APP_ID_CUSTOMER:AppIdCustomer,
  VUE_APP_PROXY_BASE_URL: webUrl,
  VUE_APP_PROXY_BASE_URL_WY:wenyaUrl,
  VUE_APP_WY_PROXY_URI: wyProxyUrl
} = process.env;

let objs =  {
  Env /* 环境变量 */,
  ProxyUri /* 服务端uri */,
  RequestTimeout /* axios 接口请求超时 */,
  OSS_URL /* 阿里云 oss地址 */,
  BaseUrl: ProxyUri /* baseUrl */,
  wenyaUrl /* 文亚baseUrl */,
  NodeRun /* 启动环境 local 本地 */,
  AppId,
  AppIdCustomer,/* 客户资料的权限接口appid*/
  webUrl,
  wyProxyUrl
};
/* 根据url参数改变地址 */
const corpIdArr ={
  1:['ww4a9fae8a5a120c60','ww1672309d8c7d86d2','consoleapi.classbro.com','localhost'],
  2:['consoleapi.jianxiong100.com','wwb7fde5ac77e4b8ca'],
  3:['wwf5354a5e272858b4','console.lantingwl.net'],
  4:['consoleapi.taolilanghua.com','ww1c19e32bfd4efd2a'],
  5:['console.shengxuels.com','wwea9dcecd070804e5'],
  6:['console.yuanyuewl.com','ww3155b8a8cc2eaef7']
}
const httpsSetObj = {
  1:{
     // # ProxyUri 代理服务器地址
     ProxyUri:'https://consoleapi.classbro.com/routapi',
     webUrl:'https://console.classbro.com/',
  },
  2:{
     // # ProxyUri 代理服务器地址
     ProxyUri:'https://consoleapi.jianxiong100.com/routapi',
     webUrl:'https://console.jianxiong100.com/',
  },
  3:{
    // # ProxyUri 代理服务器地址
    ProxyUri:'https://consoleapi.lantingwl.net/routapi',
    webUrl:'https://console.lantingwl.net',
 },
  4:{
    // # ProxyUri 代理服务器地址
    ProxyUri:'https://consoleapi.taolilanghua.com/routapi',
    webUrl:'https://console.taolilanghua.com',
  },
  5:{
    // # ProxyUri 代理服务器地址
    ProxyUri:'https://consoleapi.shengxuels.com/routapi',
    webUrl:'https://console.shengxuels.com',
  },
  6:{
    // # ProxyUri 代理服务器地址
    ProxyUri:'https://consoleapi.yuanyuewl.com/routapi',
    webUrl:'https://console.yuanyuewl.com',
  }
}
// 设置idindex
/* 捕获url Token */
// import {corpIdArr, qyexArr} from '@/utils/Enum/httpsSet'
const catchUrlHandle = function () {
	if (process.browser) {
		let location = window.location;
		let url = location.href;
		return new Promise((resolve) => {
			let params = {},
				h;
			let hash = url.slice(url.indexOf("?") + 1).split("&"),
			https = location.hostname;
			for (let i = 0; i < hash.length; i++) {
				h = hash[i].split("="); //
				params[h[0]] = h[1];
			}
			const { wxCorpId } = params;
			let urlsparams = {
				https,
				corpId:wxCorpId
			}
			setUrlvariable(urlsparams)
		});
		
	}
  
 }
function setUrlvariable(urlvariable){
   const {https,corpId} = urlvariable;
   let indexs = '',//记录属于使用那个对象得id 索引
   objsindex = '';//记录这个值属于哪一个对象索引
   for(let k in corpIdArr){
     if(corpId){
       objsindex = corpIdArr[k].findIndex((item) =>item == corpId);
     }else{
       objsindex = corpIdArr[k].findIndex((items) =>items == https);
     }
     if(objsindex > -1) {
       indexs = k;
     }
   }
	if (process.browser) {
		localStorage.setItem('httpsurlIndex',indexs);
		
	}
 }
if( Env == "production"){
	catchUrlHandle();
	if (process.browser) {
		let keys = localStorage.getItem('httpsurlIndex');
		if(httpsSetObj[keys]){
			console.log(httpsSetObj[keys])
			for(let i in httpsSetObj[keys]){
				if(httpsSetObj[keys][i]){
					console.log(httpsSetObj[keys][i]);
					objs[i] = httpsSetObj[keys][i]
				}
			}
		}
	}
}

debug.enabled = Env !== "production";
debug(`current env is ${Env}`);
module.exports = objs
