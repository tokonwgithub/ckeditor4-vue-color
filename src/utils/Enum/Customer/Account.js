/* 用户账户 */

/**
 * 代写 => 文亚 辅导 => 导毕
 * @enum
 * @readonly
 * @returns {string}
 */
export const SysCode = {
  /**导毕 */
  DAOBI: "db",
  /**文亚 */
  WENYA: "wy",
};

/**
 * 用户绑定状态 1=已绑定 2=未绑定
 * @enum
 * @readonly
 */
export const UserStatus = {
  /**未绑定 */
  NOT_BIND: false,
  /**已绑定 */
  ALREADY_BIND: true,
};

/**
 * 公司
 * @enum
 * @readonly
 */
export const ChildType = {
  /**导毕 */
  DAOBI: 1,
  /**文亚 */
  WENYA: 2,
};

/**
 * 绑定类型
 * @enum
 * @readonly
 */
export const BindType = {
  /**绑定 */
  BIND: 1,
  /**创建 */
  CREATE: 2,
};

/**
 * 货币单位
 * @enum
 * @readonly
 */
export const Currency = {
  /**奥比 */
  AUD: "AUD",
  /**人民币 */
  CNY: "CNY",
};
