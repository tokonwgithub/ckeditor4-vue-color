import router from "@/router";
import store from "@/store";
import NProgress from "nprogress";
import { Base64 } from 'js-base64';
import { getToken, setToken } from "@/utils/Auth";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
});

/* 捕获url Token */
function catchUrlToken(url) {
  return new Promise((resolve) => {
    let params = {},
      h;
    let hash = url.slice(url.indexOf("?") + 1).split("&");
    for (let i = 0; i < hash.length; i++) {
      h = hash[i].split("="); //
      params[h[0]] = h[1];
    }
    let token = null;
    let { bdata } = params;
    if(bdata){
      bdata = decodeURIComponent(bdata)
      let urlParams = Base64.decode(bdata);
      urlParams = JSON.parse(urlParams);
      token = urlParams.token
    }else{
      token = params.token;
    }
    if (token && getToken() !== token) setToken(token);
    resolve();
  });
}

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  await catchUrlToken(location.href);
  if (!store.getters.routerLoadDone) {
    const { isAdmin } = await store.dispatch("getUserInfo");
    let comeForm = null;
    if(to.path == '/order/index' || to.path == '/orderwenya/index'){
     let bdata = decodeURIComponent(to.query.bdata) 
      let defaultData = Base64.decode(bdata) ;
      defaultData = JSON.parse(defaultData) ;
      comeForm = defaultData.qywxOrder?true:false;
    }
    const querydata = {isAdmin,comeForm}
    await store.dispatch("generateRoutes", querydata);
  }
  if (from.query.state) {
    //路由切换时，如果没有就添加，有就跳过执行，添加固定参数
    if (!to.query.state) {
      //准备一个跳转的query对象
      let query = to.query;
      query.state = from.query.state;
      NProgress.done();
      next({
        path: to.path,
        query: query,
      });
    } 
  } 
  next();
  NProgress.done();
  if (!getToken()) {
    NProgress.done();
    console.error(">>> 缺少token <<<");
  }
});

router.afterEach(() => {
  NProgress.done();
});
