import { SysCode, UserStatus, ChildType } from "@/utils/Enum/Customer/Account";

/**帐号所属系统列表  */
export const SysCodeList = [
  {
    label: "代写",
    value: SysCode.WENYA,
  },
  {
    label: "辅导",
    value: SysCode.DAOBI,
  },
];

/**用户绑定状态 对应 */
export const UserStatus2Val = {
  [UserStatus.ALREADY_BIND]: {
    label: "已关联",
    color: "#9e9e9e",
  },
  [UserStatus.NOT_BIND]: {
    label: "未关联",
    color: "#E45434",
  },
};

/**公司对应所属系统 */
export const SysCode2Type = {
  [SysCode.DAOBI]: ChildType.DAOBI,
  [SysCode.WENYA]: ChildType.WENYA,
};
