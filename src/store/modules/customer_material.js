import { getOutUserId } from "@/utils/Wechat/WxUtils";
import MaterialsProxy from "@/proxy/customer/Materials";
import BasicProxy from "@/proxy/customer/Basic";
import ContractProxy from "@/proxy/customer/Contract";
import {shixiNumber} from '@/utils/Enum/User'

/* 客户资料 */
export default {
  namespaced: true,

  state: {
    user: {},
    userTags: [] /* 用户标签列表 */,
    countryList: [],
    schoolList: [],
    majorList: [],
    eduList: [],
    intentLevelList:[],
    contractList: [],
    contractTypeList: [],
    contractTemplates: [] /* 合同模板列表 */,
    loading: false,
    modalLoading: false,
    contractLoading: false,
  },
  mutations: {
    clearContractTemplates(state) {
      state.contractTemplates = [];
    },
    loading(state, bool) {
      state.loading = bool;
    },
  },
  actions: {
    /* 根据企业微信id获取用户详情 */
    async getUserDetail({ state, dispatch, commit }) {
      commit("loading", true);
      const wxUserId = await getOutUserId();//正式接口
      // const wxUserId = 'wmYs_gEAAAo_dyOkcIeT77nodl_uhnxw';//测试数据
      console.log(wxUserId,'wxUserId')
      const body = await MaterialsProxy.getUserDetailByWxId(wxUserId);
      commit("loading", false);
      const { userId, wyOrDbSeller } = body;
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("isShixi", wyOrDbSeller == shixiNumber?true:false);
      state.user = {  ...state.user, ...body };
      state.user.wxUserId = wxUserId;
      console.log('state.user',state.user)
      const { countryId } = body;
      if (countryId) await dispatch("getSchoolList", countryId);
    },
    /** 修改用户资料 */
    async updateUserDetail({ dispatch, commit }, form) {
      commit("loading", true)
      const bool = await MaterialsProxy.updateUserDetail(form);
      if (!bool) await dispatch("getUserDetail");
      commit("loading", false)
      return bool;
    },
    /* 国家列表 */
    async getCountryList({ state }) {
      state.countryList = await BasicProxy.getCountryList();
    },
    /* 根据国家id获取学校列表 */
    async getSchoolList({ state }, countryId) {
      state.schoolList = await BasicProxy.getSchoolListByCountryId(countryId);
    },
    /* 专业列表 */
    async getMajorList({ state }) {
      state.majorList = await BasicProxy.getMajorList();
    },
    /* 学历列表 */
    async getEduList({ state }) {
      state.eduList = await BasicProxy.getEduList();
    },
    // 资源等级
    async getIntentLevelList({ state }) {
      state.intentLevelList = await BasicProxy.getIntentLevelList();
    },
    
    /* 初始化 列表 */
    async initList({ state,dispatch }) {
      console.log(state.user.userId)
      dispatch("getCountryList");
      dispatch("getMajorList");
      dispatch("getEduList");
      dispatch("getIntentLevelList");
      state.user.userId && dispatch("getUserTags");
    },
    /* 获取当前用户合同列表 */
    async getContractList({ state }) {
      const wxUserId = await getOutUserId();
      state.contractLoading = true;
      state.contractList = await ContractProxy.getContractList(wxUserId);
      state.contractLoading = false;
    },
    
    /* 获取所有合同类型列表 */
    async getContractTypeList({ state }) {
      state.contractTypeList = await ContractProxy.getContractTypeList();
    },
    /* 创建合同 */
    async createContract(_, data) {
      const wxUserId = await getOutUserId();
      const ok = await ContractProxy.createContract(wxUserId, data);
      return ok;
    },
    /* 发送合同时，将合同状态修改为待签署 */
    async updateContract(_, contractId) {
      await ContractProxy.updateContract(contractId);
    },
    /* 根据合同类型 查询模板 */
    async getContractTempList({ state, commit }, contractType) {
      commit("clearContractTemplates");
      state.modalLoading = true;
      state.contractTemplates = await ContractProxy.getContractTempList(
        contractType
      );
      state.modalLoading = false;
    },
    /** 获取用户标签列表 */
    async getUserTags({ state }) {
      // const wxUserId = await getOutUserId();
      const tags = await MaterialsProxy.getUserTags(state.user.userId);
      state.userTags = tags;
    },
    /** 添加/更新 用户标签 */
    async updateUserTags({ state }, tags) {
      state.userTags = tags;
      const wxUserId = await getOutUserId();
      const ok = await MaterialsProxy.updateUserTags(wxUserId, tags);
      return ok;
    },
    // 修改手机号
    // emptyMobile({ state }, date) {
    //   commit()
    // }
  },
};
