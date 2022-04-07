import AccountProxy from "@/proxy/customer/Account";
import Store from "@/store/index";
import Router from "@/router/index";
import { SysCode } from "@/utils/Enum/Customer/Account";
import Basic from "@/proxy/customer/Basic";
import Account from "@/proxy/customer/Account";

/* 客户资料-账户信息 */
export default {
  namespaced: true,

  state: {
    user: {},
    loading: false,
    modalLoading: false,
    bindUsers: [] /* 需要绑定的用户列表 */,
    accountList: [] /* 账户信息列表 */,
    accBindShow: true /* 关联账户 是否展示 */,
    currencyList: [] /* 币种列表 */,
    historyRecharge: [] /* 历史充值记录 */,
    accountBalance: {} /* 账户余额 */,
    accountTypeInfo: {} /* 账户类型 */,
    latestOrderTime: new Date() /*最后一次下单时间*/
  },
  mutations: {
    loading(state, bool) {
      state.loading = bool;
    },
  },
  actions: {
    /**查询账户信息 */
    async getAccounts({ state }) {
      let { userId } = Store.state.customer_material.user;
      let { wyId, dbId, sxId, flag } = Store.state.customer_material_account.accountTypeInfo
      // wyId = 26010
      const { WENYA, DAOBI } = SysCode;
      if (!userId) Router.replace("/customer/material");
      state.accountList = [];

      if (dbId || wyId || sxId) state.accBindShow = false;
      state.modalLoading = true;
      console.log('dbId', dbId)
      if (dbId || sxId) {
        const _data = await AccountProxy.getAccountsByData({
          sysCode: DAOBI,
          id: userId,
          accountType: flag == 3 ? 3:1
        });
        state.accountList.push({
          ..._data,
          sysCode: DAOBI,
          deptName: flag == 3 ?"万能职咖":"导毕",
        }); 
      }
      if (wyId) {
        const _data = await AccountProxy.getAccountsByData({
          sysCode: WENYA,
          id: wyId,
        });
        state.accountList.push({
          ..._data,
          sysCode: WENYA,
          deptName: "文亚",
        });
      }
      state.modalLoading = false;
    },

    /**
     * 绑定用户-查询业务系统客户列表信息
     * @param {string} sysCode db|wx
     * @param {string} key 查询信息
     */
    async getBindUserList({ commit, state }, { sysCode, key,usercode }) {
      commit("loading", true);
      const list = await AccountProxy.getBindUserList({ sysCode, key, usercode });
      commit("loading", false);
      state.bindUsers = list;
    },

    clearBindUserList({state}){
      state.bindUsers = [];
    },

    /**
     * 绑定用户
     * @param {number} childType 2文亚  1导毕
     * @param {number} ucId
     * @param {string} clientName 文亚创建账号需要的name
     * @param {string} userId 子系统学生ID
     * @param {string} bindType 1绑定  2创建   如果选择创建 则不需要选择childType
     */
    async bindUser(_, { childType, userId, bindType,clientName }) {
      const ucId = sessionStorage.getItem("userId");
      let data = {
        ucId,
        childType,
        userId,
        bindType,
      }
      if(childType == 2){
        data = {
          ...data,
          clientName
        }
      }
      const ok = await AccountProxy.bindUser(data);
      return ok;
    },

    /**查询币种列表 */
    async getCurrencyList({ state },{sysCode}) {
      state.currencyList = await Basic.getCurrencyList(sysCode);
    },

    /**
     * 查询历史充值记录
     * @param {string} sysCode db|wx
     * @param {string} userId 用户id
     */
    async getHistoryRecharge({ state }, { sysCode, userId }) {
      state.historyRecharge = await Account.getHistoryRecharge(sysCode, userId);
    },

    /**充值 */
    recharge({ state }, form) {
      const { currency, money, files } = form;
      if (state.accountBalance[currency]) {
        return false;
      }
      state.historyRecharge.push({ currency, money, files });
      return true;
    },

    /**
     * 导毕|文亚 账户充值
     */
    async createAccount(_, { sysCode, data }) {
      let userId = null;
      if(Store.state.customer_material.user.userId){
        const { wyId, dbId } = Store.state.customer_material.user;
        const { WENYA } = SysCode;
        userId = WENYA === sysCode ? wyId : dbId;
        userId = Store.state.customer_material.user.userId
      }else{
        userId = localStorage.getItem('orderUserId')
      }
      const { files } = data;
      data.files = JSON.stringify(files);
      
      const form = {
        userId,
        /**充值记录 */
        addAccountDetailVars: [data],
      };
      if(data.depositCode){
        form.depositCode = data.depositCode
      }
      if(data.accountType){
        form.accountType = data.accountType;
      }
      return await Account.createAccountBySysCode(sysCode, form);
    },

    /**
     * 导毕|文亚 转汇
     */
    async changeAccount(_, { sysCode, data }) {
      let userId = null;
      // const { wyId, dbId } = Store.state.customer_material.user;
      // const { WENYA } = SysCode;
      // userId = WENYA === sysCode ? wyId : dbId;
     
      // userId = Store.state.customer_material.user.userId || sysCode == 'wy'?localStorage.getItem('userId'):''
      userId = Store.state.customer_material.user.userId || window.localStorage.getItem("userId")
      const form = {
        userId,
        /**充值记录 */
        changeAccountDetailVars: [data],
      };
      if(data.accountType){//实习账户的换汇处理
        form.accountType = data.accountType
      }
      return await Account.changeAccountBySysCode(sysCode, form);
    },

    /**
     * 学生账户更新
     */
    async updateAccount({ state }, sysCode) {
      const { wyId, dbId } = Store.state.customer_material.user;
      const { WENYA } = SysCode;
      const userId = WENYA === sysCode ? wyId : dbId;
      /**充值参数 */
      const addAccountDetailVars = state.historyRecharge.map((item) => {
        const { current, thumbUrl, currency, files, money } = item;
        let _cache = {};
        if (current) _cache.currency = current;
        else _cache.currency = currency;
        if (thumbUrl)
          _cache.files = JSON.stringify(
            thumbUrl.map((url) => ({ thumbUrl: url, name: "" }))
          );
        else _cache.files = JSON.stringify(files);
        _cache.money = money;
        return _cache;
      });
      /**转汇参数 */
      let changeAccountDetailVars = [];
      changeAccountDetailVars = Object.keys(state.accountBalance).map((key) => {
        const _obj = state.accountBalance[key];
        return {
          fromCurrency: key,
          ..._obj,
        };
      });
      const bool = await AccountProxy.updateAccount(sysCode, {
        userId,
        changeAccountVar: {
          changeAccountDetailVars,
        },
        addAccountVar: {
          addAccountDetailVars,
        },
      });
      return bool;
    },

    /**
     * 查询账户类型 （导毕、文亚）
     */
    async getAccountType({state},{data}){
      state.accountTypeInfo = await Account.getAccountType(data);
      console.log(state.accountTypeInfo)
    },


    /**
     * 更新最后一次下单时间
     */
    async updateLatestOrderTime({state},{data}){
      state.latestOrderTime = data.time
    }
  },
};
