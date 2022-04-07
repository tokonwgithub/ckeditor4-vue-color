import request from "@/utils/Request";
import { OSS_URL, Env } from "config";
 
/**
 * 获取oss 私钥
 */
export const getAliOSSUploadSign = (syscode) => {
  const urls = syscode?`/wy/common/get-sign-url`:`/uc/oss/getAliOSSUploadSign?dir=courseware/${Date.now()}`;
  return request({
    url: urls,
    method: "get",
  });
};

/**
 * 附件上传
 */
export const ossUpload = async (file) => {
  const { status, body } = await getAliOSSUploadSign();
  const { dir, signature, accessid, policy, host } = body;
  console.log(dir,'dir')
  let data = new FormData();
  data.append("name", file.name);
  data.append("key", dir + file.name);
  data.append("signature", signature);
  data.append("success_action_status", 200);
  data.append("OSSAccessKeyId", accessid);
  data.append("policy", policy);
  data.append("host", host);
  data.append("file", file);
  if (status === 200) {
    await request({
      url: OSS_URL,
      method: "post",
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      status: 200,
      body: host + "/" + dir + encodeURIComponent(file.name),
    };
  } else throw "获取oss 私钥 异常";
};
const filterStr = function(str){
  console.log(str.replace(/[\（\+\，\,\。\：\；\“\”\‘\！\’\@\#\￥\%\&\*\）\s+]/g, '_'),'00999');
  return str.replace(/[\（\+\，\,\。\：\；\“\”\‘\！\’\@\#\￥\%\&\*\）]/g, '_');
}