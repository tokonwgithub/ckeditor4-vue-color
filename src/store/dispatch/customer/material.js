import Store from "@/store/index";

export default {
  /**获取用户详情 */
  getUserDetail: () => Store.dispatch("customer_material/getUserDetail"),
  /**
   * 修改用户资料
   * @param {Object} form 表单
   */
  updateUserDetail: (form) =>
    Store.dispatch("customer_material/updateUserDetail", form),

  /** 初始化 列表 */
  initList: () => Store.dispatch("customer_material/initList"),
  /** 获取当前用户合同列表 */
  getContractList: () => Store.dispatch("customer_material/getContractList"),
  /**
   * 根据国家id获取学校列表
   * @param {string} countryId 国家id
   */
  getSchoolListByCountryId: (countryId) =>
    Store.dispatch("customer_material/getSchoolList", countryId),
  /**
   * 发送合同时，将合同状态修改为待签署
   * @param {string} contractId 合同id
   */
  updateContract: (contractId) =>
    Store.dispatch("customer_material/updateContract", contractId),
  /**获取所有合同类型列表 */
  getContractTypeList: () =>
    Store.dispatch("customer_material/getContractTypeList"),
  /**
   * 根据合同类型 查询模板
   * @param {string} contractType 合同类型
   */
  getContractTempListByType: (contractType) =>
    Store.dispatch("customer_material/getContractTempList", contractType),

  /**
   * 创建合同
   * @param {string} contractType 合同类型
   * @param {string} templateId 模板id
   */
  createContract: (contractType, templateId) =>
    Store.dispatch("customer_material/createContract", {
      contractType,
      templateId,
    }),
  /**
   * 清空合同模板列表
   */
  clearContractTemplates: () =>
    Store.commit("customer_material/clearContractTemplates"),
  /**
   * loading
   * @param {Boolean} bool
   */
  loading: (bool) => Store.commit("customer_material/loading", bool),

  /**
   * 添加/更新 用户标签
   * @param {Array<Object>} tags 标签对象列表
   */
  updateUserTags: (tags) =>
    Store.dispatch("customer_material/updateUserTags", tags),
  };