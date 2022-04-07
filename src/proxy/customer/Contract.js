import ExceptionBase from "@/utils/ExceptionBase";
import {
  contractListByUser,
  contractTypeAllList,
  addContract,
  sendContract,
  contractTemplate,
} from "@/api/contract";

class Contract extends ExceptionBase {
  /**
   * 根据企业微信id 获取当前用户合同列表
   * @param {string} wxUserId 微信id
   */
  async getContractList(wxUserId) {
    const { ok, body } = await this.catch(contractListByUser, wxUserId);
    return ok ? body : [];
  }

  /**
   * 获取所有合同类型列表
   */
  async getContractTypeList() {
    const { ok, body } = await this.catch(contractTypeAllList);
    if (ok) {
      return (body || []).map(({ type, name }) => {
        return {
          text: name,
          id: type,
        };
      });
    }
    return [];
  }

  /**
   * 创建合同
   * @param {string} wxUserId
   * @param {Object} data
   */
  async createContract(wxUserId, data) {
    const { ok } = await this.catch(addContract, {
      wxUserId,
      ...data,
    });
    return ok;
  }

  /**
   * 发送合同时，将合同状态修改为待签署
   * @param {string} contractId 合同id
   */
  async updateContract(contractId) {
    const { ok } = await this.catch(sendContract, contractId);
    return ok;
  }

  /**
   * 根据合同类型 查询模板列表
   * @param {string} contractType 合同类型
   */
  async getContractTempList(contractType) {
    const { ok, body } = await this.catch(contractTemplate, { contractType });
    if (ok) {
      return (body || []).map((item) => {
        const { templateId, templateName } = item;
        return {
          text: templateName,
          id: templateId,
        };
      });
    }
    return [];
  }
}

export default new Contract();
