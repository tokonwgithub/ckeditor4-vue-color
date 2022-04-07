import Store from "@/store/index";

export default {
  /**查询账户信息列表 */
  getAccounts: () => Store.dispatch("customer_material_account/getAccounts"),
  /**
   * 绑定用户-查询业务系统客户列表信息
   * @param {string} sysCode db|wx
   * @param {string} key 查询信息
   */
  getBindUserList: ({ sysCode, key,usercode }) =>
    Store.dispatch("customer_material_account/getBindUserList", {
      sysCode,
      key,
      usercode
    }),
  
  clearBindUserList: () => Store.dispatch("customer_material_account/clearBindUserList",{}),

  /**
   * 绑定用户
   * @param {number} childType 2文亚  1导毕
   * @param {number} ucId
   * @param {string} userId 子系统学生ID
   * @param {string} bindType 1绑定  2创建   如果选择创建 则不需要选择childType
   */
  bindUser: ({ childType, userId, bindType,clientName }) =>{
    Store.dispatch("customer_material_account/bindUser", {
      childType,
      userId,
      bindType,
      clientName
    })

  },
    
  /**查询币种列表 */
  getCurrencyList: (sysCode) =>
    Store.dispatch("customer_material_account/getCurrencyList",{sysCode}),
  /**
   * 查询历史充值记录
   * @param {string} sysCode db|wx
   * @param {string} userId 用户id
   */
  getHistoryRecharge: (sysCode, userId) =>
    Store.dispatch("customer_material_account/getHistoryRecharge", {
      sysCode,
      userId,
    }),
  /**
   * 充值
   * @param {string} current
   * @param {number} money
   * @param {string} thumbUrl
   */
  recharge: (form) =>
    Store.dispatch("customer_material_account/recharge", form),
  /**
   * 学生账户更新
   */
  updateAccount: (sysCode) =>
    Store.dispatch("customer_material_account/updateAccount", sysCode),

  /**
   * 导毕|文亚 账户充值
   * @param {string} sysCode
   * @param {Object} data
   */
  createAccount: (sysCode, data) =>
    Store.dispatch("customer_material_account/createAccount", {
      sysCode,
      data,
    }),

  /**
   * 导毕|文亚 转汇
   * @param {string} sysCode
   * @param {Object} data
   */
  changeAccount: (sysCode, data) =>
    Store.dispatch("customer_material_account/changeAccount", {
      sysCode,
      data,
    }),
  
    /**
   * 导毕|文亚 转汇
   * @param {string} sysCode
   * @param {Object} data
   */
  getAccountType: ( data) =>{
    console.log(data)
    Store.dispatch("customer_material_account/getAccountType", {
      data,
    })
  },


  /**
   * 更新最新的下单时间
   */
  updateLatestOrderTime: (data) => {
    Store.dispatch("customer_material_account/updateLatestOrderTime", {
      data,
    })
  }
};
