import axios from "axios";
import { getToken } from "@/utils/Auth";
import { httpsSetObj } from "@/utils/Enum/httpsSet";
import { RequestTimeout, ProxyUri as baseURL,Env } from "config";
import Router from "@/router/index";
const urls = localStorage.getItem('httpsurlIndex')? httpsSetObj[localStorage.getItem('httpsurlIndex')].ProxyUri:baseURL;
// create an axios instance
const service = axios.create({
  baseURL:Env == 'production'?urls:baseURL,
  timeout: +RequestTimeout, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers["token"] = getToken();
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const { status, data, message } = response;
    if (status !== 200) {
      console.log(message);
      return Promise.reject("error");
    } else return data;
  },
  (error) => {
    const { status, data } = error.response;
    const { status: code, msg: errorMsg } = data;
    // let { errorCode, errorMsg } = error.response.data;
    if (status == 500) {
      console.log("系统内部错误，请联系管理员维护");
      return;
    }
    if (status == 504) {
      console.log("网关超时");
      return;
    }
    if (code === 401) {
      console.log("登录状态已过期，您可以继续留在该页面，或者重新登录");
      return;
    }
    if (code === 403) {
      Router.push({
        path: "/401",
      });
      return;
    }
    console.log(errorMsg);
    return Promise.reject(error.response.data);
  }
);

export default service;
