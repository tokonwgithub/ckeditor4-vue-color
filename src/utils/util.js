export default {
  browser: function(){ 
    var u = navigator.userAgent
    var app = navigator.appVersion; 
    return {  // 移动终端浏览器版本信息 
        trident: u.indexOf('Trident') > -1,  // IE内核
        presto: u.indexOf('Presto') > -1,    // Opera内核
        webKit: u.indexOf('AppleWebKit') > -1,  // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,  // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/)&&u.indexOf('QIHU')&&u.indexOf('Chrome')<0,  // 是否为移动终端  
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),  // iOS终端
        android: u.indexOf('Android') > -1,  // Android 终端或者 UC 浏览器
        iPhone: u.indexOf('iPhone') > -1,  // 是否为 iPhone 或者 QQHD 浏览器
        iPad: u.indexOf('iPad') > -1,   // 是否 iPad
        webApp: u.indexOf('Safari') == -1,   // 是否WEB应该程序，没有头部与底部。
        ua:u 
    };
  }(),
  
  language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const isMobile = () =>{
  const { body } = document;
  const WIDTH = 1300;
  const RATIO = 3;
  const rect = body.getBoundingClientRect();
  return rect.width - RATIO < WIDTH;
}
export const formatTime = (number, format) => {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
// 解决el-select ios 唤不起软键盘的问题
export const closeReadOnly = (val) => {
  this.$nextTick(() => {
    if (!val) {
      const input = this.$refs.search.$el.querySelector('.el-input__inner')
      const timer = setTimeout(() => {
          input.removeAttribute('readonly')
          clearTimeout(timer)
       }, 200)
    }
  })
}
