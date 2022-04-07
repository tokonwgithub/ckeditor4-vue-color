import ExceptionBase from "@/utils/ExceptionBase";
import {
  ucStudentQueryOne,
  ucStudentSave,
  ucStudentQueryTag,
  ucStudentAddTag,
} from "@/api/user";

class Materials extends ExceptionBase {
  /**
   * 根据用户wxId查询用户资料
   * @param {string} wxUserId 企业微信用户id
   */
  async getUserDetailByWxId(wxUserId) {
    const { ok, body } = await this.catch(ucStudentQueryOne, wxUserId);
    return ok ? body : {};
  }

  /**
   * 修改用户资料
   * @param {Object} form 表单
   */
  async updateUserDetail(form) {
    const { ok } = await this.catch(ucStudentSave, form);
    return ok;
  }

  /**
   * 获取用户标签列表
   * @param {string} wxId 企业微信用户id
   */
  async getUserTags(wxId) {
    const { ok, body } = await this.catch(ucStudentQueryTag, { wxId });
    if (ok) return body || [];
    return [];
  }

  /**
   * 更新/添加用户标签
   * @param {string} wxId
   * @param {Array<Object>} tags 标签列表
   */
  async updateUserTags(wxId, tags) {
    const { ok } = await this.catch(ucStudentAddTag, {
      wxId,
      tags,
    });
    return ok;
  }
  /**
   * 检查文亚clientname重复
   * @param {string} clientName
   */
  async updatecheckClientName(clientName) {
    const { ok } = await this.catch(ucCheckClientName, {
      clientName
    });
    return ok;
  }
  
}

export default new Materials();
