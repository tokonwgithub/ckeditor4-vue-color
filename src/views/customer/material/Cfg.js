import { Gender } from "@/utils/Enum/User";
import { ContractStatus, Grade } from "@/utils/Enum/Customer/Material";

/** 性别对应样式 */
export const Gender2Css = {
  [Gender.FEMALE]: "#F97597",
  [Gender.MALE]: "#4979FF",
};
/** 性别对应图标 */
export const Gender2Sex = {
  [Gender.FEMALE]: true,
  [Gender.MALE]: false,
};

/** 合同状态对应样式和label */
export const Contract2Val = {
  [ContractStatus.DONE]: {
    label: "已签署",
    color: "#8B909D",
  },
  [ContractStatus.NOT_DONE]: {
    label: "未签署",
    color: "#eb755c",
  },
  [ContractStatus.NOT_SENT]: {
    label: "未发送",
    color: "#eb755c",
  },
};

/** 年级列表 */
export const GradeList = [
  {
    text: "一年级",
    id: Grade.ONE,
  },
  {
    text: "二年级",
    id: Grade.TWO,
  },
  {
    text: "三年级",
    id: Grade.THREE,
  },
];
