/**
 * 微信入口环境
 * @enum
 * @readonly
 * @returns {string}
 */
export const WeChatEnv = {
  /** 从联系人详情进入 */
  CONTACT_PROFILE: "contact_profile",
  /** 从单聊会话的工具栏进入 */
  SINGLE_CHAT_TOOLS: "single_chat_tools",
  /** 从群聊会话的工具栏进入 */
  GROUP_CHAT_TOOLS: "group_chat_tools",
  /** 除以上场景之外进入，例如工作台，聊天会话等 */
  NORMAL: "normal",
};
