import { validateLanguage } from "@/utils/index";
import i18n from "@/lang/index";

/**
 * 校验 init 登录账户
 * max 30
 * min 5
 * @param rule
 * @param value
 * @param callback
 * @description 账号组成规则：“a-z, A-Z,0-9,-,_,.，@”区分大小写，首字母只能是英文字母。用户名必须5-30位。
 */
export const validAccount = (rule, value, callback) => {
  if (!value) return callback();
  const re = /^[a-zA-Z]([a-zA-z0-9]|[.@_-])*$/;
  const max = 31;
  const min = 4;
  if (re.test(value)) {
    if (value.length < max && value.length > min) {
      return callback();
    }
  }
  return callback(i18n.t("validate.illegal"));
};

/**
 * 验证邮箱
 * @param str
 * @returns {boolean}
 */
export function validatEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return reg.test(str);
}

/**
 * 校验 岗位 中 | 英 名称
 * 是否为 中|英 文
 */
export function validateStationName(rule, value, callback) {
  if (!value) return callback();
  const { lang } = rule;
  const bool = validateLanguage(value, lang);
  if (!bool) callback(i18n.t("validate.formatErr")[lang]);
  return callback();
}

/**
 * 校验 正整数
 * @function
 */
export function validatePositiveInteger(rule, value, callback) {
  if (!value) return callback();
  if (!/(^[1-9]\d*$)/.test(value))
    return callback(i18n.t("validate.inputError"));
  return callback();
}

/**
 * 数字校验（只能是数字或者 空格）
 * @function
 */
export function validateNumber(rule, value, callback) {
  if (!value) return callback();
  const reg = new RegExp("^[0-9 ]*$");
  if (!reg.test(value)) return callback(i18n.t("validate.inputError"));
  return callback();
}

/**
 * 校验货币
 * 保留小数点后5位
 * @function
 */
export function validateCurrency(rule, value, callback) {
  if (!value) return callback();
  if (!/^\d+\.?\d{0,5}$/.test(value))
    return callback(i18n.t("validate.currencyError"));
  return callback();
}

/**
 * 校验小数
 * 保留小数点后4位
 * @function
 */
export function validateFloat(rule, value, callback) {
  if (!value) return callback();
  if (!/^\d+\.?\d{0,4}$/.test(value))
    return callback(i18n.t("validate.inputError"));
  return callback();
}

/**
 * 校验手机号
 * @function
 */
export function validatePhone(rule, value, callback) {
  if (!value) return callback();
  const strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
  if (!strTemp.test(value)) return callback(i18n.t("validate.phone"));
  return callback();
}

/**
 * 校验身份证格式
 * 仅英文和数字
 * @function
 */
export function validateIdCard(rule, value, callback) {
  if (!value) return callback();
  //判断字符串是否为数字和字母组合
  const reg = /^[0-9a-zA-Z]*$/;
  if (!reg.test(value)) return callback(i18n.t("validate.idCard"));
  else return callback();
}

/**
 * 校验英文
 */
export function validateEnglish(rule, value, callback) {
  if (!value) return callback();
  const bool = validateLanguage(value, "en");
  if (!bool) callback(i18n.t("validate.formatErr.en"));
  return callback();
}

/**
 * 校验中文
 */
export function validateLangZh(rule, value, callback) {
  if (!value) return callback();
  const bool = validateLanguage(value, "zh");
  if (!bool) callback(i18n.t("validate.formatErr.zh"));
  return callback();
}

/**
 * 校验 只包含中文或英文 包含空格
 */
export function validateEnOrZh(rule, value, callback) {
  if (!value) return callback();
  const reg = /^[a-zA-Z\u4e00-\u9fa5\s]+$/;
  if (!reg.test(value)) callback(i18n.t("validate.inputError"));
  return callback();
}

/**
 * 校验 域名格式
 */
export function validateDomain(rule, value, callback) {
  if (!value) return callback();
  if (!isIPV4ValidIP(value)) callback(i18n.t("validate.domainErr"));
  return callback();
}

//ipv4校验
export function isIPV4ValidIP(ip) {
  var v4reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return v4reg.test(ip);
}

//ipv6校验
export function isIPV6ValidIP(ip) {
  var v6reg = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/gm;
  return v6reg.test(ip);
}

//ip校验
export function isIPValid(ip) {
  return isIPV6ValidIP(ip) && isIPV4ValidIP(ip);
}
