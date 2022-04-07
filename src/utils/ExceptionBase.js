import { Notify } from "vant";
import KError from "@/utils/KError";

/**
 * 异常捕获类
 */
export default class ExceptionBase {
  /**
   * 异常捕获，接口调用
   * @param {Function} apiFunc api
   * @param  {...any} args 参数
   * @function
   */
  async catch(apiFunc, ...args) {
    if (!apiFunc || typeof apiFunc !== "function")
      throw KError.InvalidParameters("func catchConfirm api undefined");
    try {
      const { status, msg, body } = await apiFunc(...args);

      if (status === 200) return { ok: true, body };
      else {
        Notify(msg || "接口异常");
        return { ok: false };
      }
    } catch (error) {
      return { ok: false };
    }
  }
}
