import axios from 'axios'

function download(src, fileName) {
    console.log(src, fileName);
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
      window.open(src)
    }else{
      let link = document.createElement('a')
      axios.get(src,{
        responseType: 'blob',
      }).then(res => {
        //console.log(res)
        let blob = new Blob([res.data])
        //console.log(blob)
        let objectUrl = URL.createObjectURL(blob)
        link.href = objectUrl;
        console.log(objectUrl);
        link.download = fileName
        link.click()
        URL.revokeObjectURL(objectUrl)
      })
    }
  }
  
  /**
   * 打开文件或者下载文件
   */ 
   export const downloadFile = (url, fileName ='') => {
    fileName&&fileName.indexOf(".txt") > -1 ||
    fileName&&fileName.indexOf(".pdf") > -1 ||
    fileName&&fileName.indexOf(".jpg") > -1 ||
    fileName&&fileName.indexOf(".png") > -1 ||
    fileName&&fileName.indexOf(".jpeg") > -1 ||
    fileName&&fileName.indexOf(".TXT") > -1 ||
    fileName&&fileName.indexOf(".PDF") > -1 ||
    fileName&&fileName.indexOf(".JPG") > -1 ||
    fileName&&fileName.indexOf(".PNG") > -1 ||
    fileName&&fileName.indexOf(".JPEG") > -1 ||
    url.indexOf(".txt") > -1 ||
    url.indexOf(".pdf") > -1 ||
    (url.indexOf(".jpeg") > -1) | (url.indexOf(".jpg") > -1) ||
    url.indexOf(".png") > -1 ||
    url.indexOf(".TXT") > -1 ||
    url.indexOf(".PDF") > -1 ||
    (url.indexOf(".JPEG") > -1) | (url.indexOf(".JPG") > -1) ||
    url.indexOf(".PNG") > -1
      ? window.open(url)
      : download(url,fileName);
  }