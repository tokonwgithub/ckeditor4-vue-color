<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :data="uploadData"
       :action="userIsWy?wenyaUrl:OSS_URL"
      :show-file-list="false"
      :on-success="onSuccess"
      :on-remove="removeImg"
      :on-error="onError"
      multiple
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus avatar-uploader-icon" v-loading="loading"></i>
    </el-upload>
  </div>
</template>

<script>
import { getAliOSSUploadSign } from "@/api/upload";
import { OSS_URL } from "config";

export default {
  data() {
    return {
      OSS_URL,
      wenyaUrl:'',
      ossData: {},
      uploadData: {},
      userIsWy:false,
      loading: false
    };
  },
  created(){
    this.handUserCode();
  },
  methods: {
    handUserCode(){
      let codes = sessionStorage.getItem("state");
      this.userIsWy = codes && codes.includes('wy')?true:false;
    },
    onSuccess() {
      this.loading = false
      const { name, key, dir,host } = this.uploadData;
      console.log(this.uploadData,'this.uploadData',host)
      const paths =  dir + '/' +  encodeURIComponent(name) ;
      console.log(paths,'paths')
      const _url = (this.userIsWy?host:OSS_URL) + paths;
      console.log( _url,' _url')
      this.$emit("upload", {
        thumbUrl: _url,
        name
      });
    },
    removeImg(file, fileList){
      console.log('99999',file, fileList)
    },
    async beforeUpload(file) {
      this.loading = true
      await this.getOssSign();
      const {
        accessid: OSSAccessKeyId,
        signature,
        expire,
        host,
        dir,
        policy
      } = this.ossData;

      this.uploadData = {
        OSSAccessKeyId,
        signature,
        expire,
        host,
        dir,
        policy,
        name: file.name,
        key: `${dir}/${file.name}`,
        success_action_status: "200"
      };
    },
    async getOssSign() {
      const { status, body } = await getAliOSSUploadSign(this.userIsWy);
      if (status === 200) {
        this.ossData = body;
        this.wenyaUrl = body.host;
      }
    },
    onError(){
      this.loading = false
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>