import moment from "moment";
export default {
  /* 格式化日期 */
  fmtYMD(val) {
    if (!val) return;
    return moment(val).format("YYYY-MM-DD");
  },
  fmtYMDHM(val) {
    if (!val) return;
    return moment(val).format("YYYY-MM-DD HH:mm");
  },
};
