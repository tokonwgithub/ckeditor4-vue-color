export const timehandle = function(str){
      if (!str) return;
      if(!(str.includes('/'))){
            str = renderTime(str)
      }
      return str.split("/").join("-");
}
export const timechangedefault = function(str){
      if (!str) return;
      return str.split("-").join("/");
}
const renderTime = function (date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    }
/**
 * 禁止输入负数
 */

 export const disableInputSymbol = (e) => {
      if(e.keyCode == 45){
            e.preventDefault();
      }
}
export const disableInputSymbol2 = (e) => {
      if(e.keyCode == 45 || e.keyCode  == 46){
            e.preventDefault();
      }
}
export const toTrim = function(str){
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
    }