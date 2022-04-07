import ExceptionBase from "@/utils/ExceptionBase";
import {
  countryQueryList,
  professionalList,
  tEduBackgroundList,
  universityQueryByCountryId,
  exchangeList,
  exchangeListwy,
  queryIntentLevelList,
} from "@/api/basic";

class Basic extends ExceptionBase {
  /**
   * 生成列表结果集
   * @param {Array} list
   * @function
   */
  _genVantListResults(list) {
    return (list || []).map(({ name, id ,enName,type,code,intentName}) => ({
      enName,
      text: name || intentName,
      type,
      id,
      code
    }));
  }

  /**
   * 国家列表
   * @function
   */
  async getCountryList() {
    const { ok, body } = await this.catch(countryQueryList, {
      page: 1,
      limit: 1000,
    });
    if (ok) {
      const { list } = body;
      return this._genVantListResults(list);
    }
    return [];
  }

  /**
   * 学校通过国家查询
   * @param {string} countryId 国家id
   */
  async getSchoolListByCountryId(countryId) {
    const { ok, body } = await this.catch(
      universityQueryByCountryId,
      countryId
    );
    if (ok) return this._genVantListResults(body);
    return [];
  }

  /**
   * 专业列表
   */
  async getMajorList() {
    const { ok, body } = await this.catch(professionalList, {
      page: 1,
      limit: 1000,
      // type:2,
    });
    if (ok) {
      const { list } = body;
      return this._genVantListResults(list);
    }
    return [];
  }

  /**
   * 学历列表
   * @function
   */
  async getEduList() {
    const { ok, body } = await this.catch(tEduBackgroundList, {
      page: 1,
      limit: 1000,
    });
    if (ok) {
      const { list } = body;
      return this._genVantListResults(list);
    }
    return [];
  }

  /**
   * 查询币种列表
   * @function
   */
  async getCurrencyList(syscode) {
    const { ok, body } = await this.catch((syscode == "wy"?exchangeListwy:exchangeList), {
      page: 1,
      limit: 1000,
    });
    if (ok) {
      let list = body.list;
      if(syscode == "wy"){
        list = body;
      }
      return (list || []).map((item) => {
        const { currency, exchange, id } = item;
        return {
          /* 货币 */
          label: currency,
          /* 汇率 */
          exchange,
          /*文亚传id */
          id
        };
      });
     
    }
    return [];
  }
  // 获取资源等级
  async getIntentLevelList() {
    const { ok, body } = await this.catch(queryIntentLevelList, {
      page: 1,
      limit: 1000,
    });
    if (ok) {
      const list = body;
      return this._genVantListResults(list);
    }
    return [];
  }
}

export default new Basic();
