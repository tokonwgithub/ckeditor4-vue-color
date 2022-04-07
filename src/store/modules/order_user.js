/* 客户资料 */
export default {
   state: {
      orderusedata: {},
      wenyaordertype:'',
      stagelist:[],
      childorderlist:[],//文亚子订单保存数组
      toptaparr: [{name:"返回"},{name:"学生信息"},{name:"订单信息"}, {name:"订单附件"},{name: "财务信息"}, {name:"提交"}],
   },
   mutations: {
      SET_ORDERUSEDATA: (state, content) => {
         state.orderusedata = content;
      },
      SET_TOPTAPARR: (state, content) => {
         state.toptaparr = content;
      },
      SET_STAGELIST: (state, content) => {
         state.stagelist = content;
      },
      SET_CHILDORDERLIST: (state, content) => {
         state.childorderlist = content;
      },
      SET_WYORDERTYPE: (state, content) => {
         state.wenyaordertype = content;
      },
   },
   actions: {
      setChildorderlist({ commit }, data) {
         commit("SET_CHILDORDERLIST", data);
      },
      setOrderusedata({ commit }, data) {
         commit("SET_ORDERUSEDATA", data);
      },
      setToptaparr({ commit }, data) {
         commit("SET_TOPTAPARR", data);
      },
      setStagelist({ commit }, data) {
         commit("SET_STAGELIST", data);
      },
      setWenyaordertype({ commit }, data) {
         commit("SET_WYORDERTYPE", data);
      },
   },

}