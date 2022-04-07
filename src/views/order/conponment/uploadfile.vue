<template>
   <div class="upload-box">
      <el-upload
         class="upload-demo"
         :data="uploadData"
         :action="userIsWy?wenyaUrl:OSS_URL"
         :before-upload="userIsWy?beforeUpload:handleBefore"
         :on-progress="uploadProcess"
         :file-list="fileList"
         :multiple="type == 21?false:true"
         :show-file-list="false">
         <div  class="upload-btn" >{{userIsWy?'Upload':'上传'}}</div>
      </el-upload>
      <filelist :class="position?'filepositions':''" :userIsWy="userIsWy" :id="id"  :nodesc="nodesc" :urlarr.sync="urlarr" :required="required" :sectionOrderStatus="sectionOrderStatus"/>
   </div>
</template>
<script>
import { mapState } from "vuex";
import { OSS_URL } from "../../../../config/index";
import { getAliOSSUploadSign } from "@/api/upload";
import filelist from "./flielist";
export default {
   props:['urlarr','id','type','position','nodesc','sectionOrderStatus','required'],
   data(){
      return {
         OSS_URL,
         wenyaUrl:'',
         ossData: {},
         userIsWy:false,
         uploadOssObj: {}, // 上传的密钥
         uploadData: {
            OSSAccessKeyId: "",
            signature: "",
            expire: "",
            host: "",
            dir: "",
            key: "",
            name: "",
            success_action_status: "200",
            policy: "",
            
         },
         fileList:[],
         resultArr:[],
      }
   },
   created(){
      this.handUserCode();
   },
   computed: {
      ...mapState({
         childorderList: (e) => e.order_user.childorderlist,
      }),
   },
   watch:{
      childorderList:function(val){
         this.resultArr = [];
         val.length&&val.forEach((item,index)=>{
            this.resultArr.push(index)
         })
      }
   },
   components:{
      filelist
   },
   mounted() {
      if(this.urlarr&&this.urlarr.length){
         this.urlarr.forEach(item=>{
            if(this.id){
               if(item.groupId == this.id){
                  this.fileList.push(item)
               }
            }else{
               this.fileList.push(item)
            }
         })
      }
   },
   filters:{
      conver(limit){  
         var size = "";  
         if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
               size = limit.toFixed(2) + "B";    
         }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
               size = (limit / 1024).toFixed(2) + "KB";              
         }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
               size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
         }else{ //其他转化成GB  
               size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
         }  
            
         var sizestr = size + "";   
         var len = sizestr.indexOf("\.");  
         var dec = sizestr.substr(len + 1, 2);  
         if(dec == "00"){//当小数点后为00时 去掉小数部分  
               return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
         }  
         return sizestr;  
      }
   },
   methods:{
      handUserCode(){
         let codes = sessionStorage.getItem("state");
         this.userIsWy = codes && codes.includes('wy')?true:false;
      },
      // async getOssSign() {
      //    const { status, body } = await getAliOSSUploadSign();
      //    if (status === 200) this.uploadOssObj = body;
      // },
      async getOssSign() {
         this.ossData = {}; 
         this.wenyaUrl = '';
         this.uploadOssObj = {};
         const { status, body } = await getAliOSSUploadSign(this.userIsWy);
         if (status === 200) {
           
            if(this.userIsWy){    
               this.ossData = body;  
               this.wenyaUrl = body.host;
            }else{
               if (status === 200) this.uploadOssObj = body;
            }
        
         }
      },
      async beforeUpload(file) {
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
            size: file.size,
            date:this.toLocaleString(new Date()),
            key: `${dir}/${file.name}`,
            success_action_status: "200"
         };
         if(!this.ossData.host || !this.ossData.dir){
            return this.$notify.warning("该文件上传路径获取失败,请重新上传");
         }
         let paths = this.ossData.host + this.ossData.dir + '/' +  encodeURIComponent(this.uploadData.name);
         this.urlarr.push({
            cdId:this.cdid,
            percentage:0,
            result:this.resultArr,
            allchecked:true,
            size:this.uploadData.size,
            groupId:this.id,
            date:this.toLocaleString(new Date()),
            name: this.uploadData.name,
            url:paths ,
            canuplad:true,
            description:'',
         })
      },
      toLocaleString(date) {
         return date.getFullYear() + "-" + this.addZero(date.getMonth() + 1) + "-" + this.addZero(date.getDate()) + " " + this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes()) + ":" + this.addZero(date.getSeconds()) ;
      },
      addZero(num) {
         if(num<10)
            return "0" + num;
         return num;
      },
      async handleBefore(e) {
         await this.getOssSign();
         // if(this.urlarr.length && this.type == 21){
         //    this.urlarr = [];
         // }else{

         // };
         this.uploadData.OSSAccessKeyId = this.uploadOssObj.accessid;
         this.uploadData.signature = this.uploadOssObj.signature;
         this.uploadData.expire = this.uploadOssObj.expire;
         this.uploadData.host = this.uploadOssObj.host;
         this.uploadData.dir = this.uploadOssObj.dir + '/' + e.name;
         this.uploadData.policy = this.uploadOssObj.policy;
         const timeStamp = parseInt(new Date().getTime() / 1000) + "";
         const uploadFileUr = this.uploadData.dir;
         this.uploadData.key = uploadFileUr;
         this.uploadData.name = e.name;
         this.uploadData.size =  e.size;
         if(!this.uploadOssObj.host || !this.uploadOssObj.dir){
            return this.$notify.warning("该文件上传路径获取失败,请重新上传");
         }
         let paths =  this.uploadOssObj.dir + '/' +  encodeURIComponent(this.uploadData.name);
         this.urlarr.push({
            cdId:this.cdid,
            percentage:0,
            result:this.resultArr,
            allchecked:true,
            date:this.toLocaleString(new Date()),
            size:this.uploadData.size,
            groupId:this.id,
            name: this.uploadData.name,
            url: OSS_URL + paths,
            canuplad:true,
            description:'',
            date: this.formatDate(new Date())
         })
      },
      formatDate(date) { 
         var y = date.getFullYear(); 
         var m = date.getMonth() + 1; 
         m = m < 10 ? ('0' + m) : m; 
         var d = date.getDate(); 
         d = d < 10 ? ('0' + d) : d; 
         var h = date.getHours(); 
         h=h < 10 ? ('0' + h) : h; 
         var minute = date.getMinutes(); 
         minute = minute < 10 ? ('0' + minute) : minute; 
         var second=date.getSeconds(); 
         second=second < 10 ? ('0' + second) : second; 
         return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
      },
      // uploadProcess(event, file, fileList){
      //    let index = this.urlarr.findIndex(item=>(item.name == file.name) && item.canuplad);
      //    this.urlarr[index].percentage = event.percent.toFixed(2)*1;
      //    console.log('进度展示',event.percent.toFixed(2));
      //    if(event.percent.toFixed(2)*1 == 100){
      //       this.urlarr[index].canuplad = false;
      //       console.log('进度完成设置');
      //    }
      // },
      uploadProcess(event, file, fileList){
         let index = this.urlarr.findIndex(item=>(item.name == file.name) && item.canuplad);
         this.urlarr[index].percentage = event.percent.toFixed(2)*1;
         console.log('进度展示',event, file, fileList,event.percent.toFixed(2));
         if(event.percent.toFixed(2)*1 == 100){
            this.urlarr[index].canuplad = false;
            console.log('进度完成设置');
         }
         this.progress = file.percentage.toFixed(0);
         this.$emit('refreshUrlArr')
      },     
   }
}
</script>
<style lang="scss">
.filepositions{
   margin-left: -160px;
}
.upload-btn{
   width: 64px;
   height: 24px;
   font-size: 14px;
   line-height: 24px;
   color: #4979ff;
   text-align: center;
   border-radius: 2px;
   border: 1px solid #4979ff;
}
.upload-reason{
   width: 100%;
   height:24px;
   padding: 0 8px;
   border-radius:2px;
   border:1px solid rgba(217,217,217,1);
   margin: 0px 0 0px;
}
.labelspan{
   display: block;
   width: 60px;
}
.apload-content{
   margin-left: 20px;
}
.progress-box{
   overflow: hidden;
   height: 20px;
   display: flex;
   align-items: center;
}
</style>