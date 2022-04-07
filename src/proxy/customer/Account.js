import ExceptionBase from "@/utils/ExceptionBase";
import {
  userAccountGetById,
  userInfoGetList,
  userInfoGetListWy,
  userInfoGetListSx,
  bindStudUser,
  getHistorRecharge,
  evidenceThumb,
  saveDbAccountMoney,
  saveWyAccountMoney,
  changeDbAccountMoney,
  changeWyAccountMoney,
  queryStudentIsDbOrWy,
} from "@/api/account";
import { SysCode } from "@/utils/Enum/Customer/Account";

class Account extends ExceptionBase {
  /**
   * 查询账户信息
   * @param {string} sysCode db|wx
   * @param {string} id 用户详情里面的 dbId 或 wxId
   */
  async getAccountsByData({ sysCode, id,accountType }) {
    const { ok, body } = await this.catch(userAccountGetById, { sysCode, id, accountType});
    return ok ? body : {};
  }

  /**
   * 绑定用户-查询业务系统客户列表信息
   * @param {string} userode db|wx区分是导毕还是文亚
   * @param {string} key 查询信息
   */
  async getBindUserList(data) {
    if(data.usercode){//文亚查询列表
      const newData = {
        key:data.key
      }
      const { ok, body } = await this.catch(userInfoGetListWy, newData);
      return body || [];
    }else{
      const { ok, body } = await this.catch(data.sysCode == 'sx'? userInfoGetListSx:userInfoGetList, data);
      return body || [];
    }
  }

  /**
   * 绑定用户
   * @param {number} childType 2文亚  1导毕
   * @param {number} ucId
   * @param {string} clientName 文亚创建账号需要的name
   * @param {string} userId 子系统学生ID
   * @param {string} bindType 1绑定  2创建   如果选择创建 则不需要选择childType
   */
  async bindUser(data) {
    const { ok } = await this.catch(bindStudUser, data);
    return ok;
  }

  /**
   * 查询历史充值记录
   * @param {string} sysCode db|wx
   * @param {string} userId 用户id
   */
  async getHistoryRecharge(sysCode, userId) {
    const { ok, body } = await this.catch(getHistorRecharge, {
      sysCode,
      userId,
    });
    if (ok) {
      const { list } = body;
      return list || [];
    }
    return [];
  }
  /**
   * 充值
   * @param {string} sysCode
   * @param {string} current
   * @param {number} money
   * @param {string} thumbUrl
   */
  async recharge(sysCode, form) {
    const { ok } = await this.catch(evidenceThumb, sysCode, form);
    return ok;
  }

  /**
   * 学生账户充值 db|wy
   */
  async createAccountBySysCode(sysCode, data) {
    const { DAOBI, WENYA } = SysCode;
    const { ok } = await this.catch(
      DAOBI === sysCode ? saveDbAccountMoney : WENYA === sysCode ?  saveWyAccountMoney : null,
      data
    );
    return ok;
  }

  /**
   * 学生转汇 db|wy
   */
  async changeAccountBySysCode(sysCode, data) {

    const { DAOBI } = SysCode;
    const { ok } = await this.catch(
      DAOBI === sysCode ? changeDbAccountMoney : changeWyAccountMoney,
      data
    );
    return ok;
  }

  /**
   * 查询账户类型 （导毕、文亚）
   */
  async getAccountType(data) {
    const { ok,body } = await this.catch(
      queryStudentIsDbOrWy,
      data
    );
    if(ok){
      return body || {}
    }
    
  }
}

export default new Account();
