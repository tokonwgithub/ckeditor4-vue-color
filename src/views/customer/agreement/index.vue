<template>
   <div class="agreement-box">
      <van-nav-bar
         :title="titles"
         color="white"
      />
      <div class="agreement-content" :class="signStatus >= 2 ? 'agreement-content-nobtm-height':''"  v-html="htmlContent"></div>
      <van-tabbar class="agreement-footer" v-if="signStatus < 2">
         <div class="bottom-box" >
            <p><van-checkbox v-model="checked" icon-size="14px" checked-color="#07c160">我已阅读并同意遵守以上服务协议</van-checkbox></p>
            <van-button type="info" class="button-style" @click="submitCtractContent">确认</van-button>
         </div>
      </van-tabbar>
   </div>
</template>

<script>
import { getContractContent,signContract } from "@/api/agreement";
   export default {
      data(){
         return{
            checked:false,
            htmlContent:'',
            contractId:'',
            titles:'服务协议',
            signStatus:null,// status=> 0未发送 1待签署  2已签署  3已经确认 4已经废弃
            canSign:true,
         }
      },
      created(){
      },
      mounted() {
         document.title = '服务协议';
         let id = this.GetParam('id');
         // id = 'ZIjVe32f9tA='
         if(id){
            this.contractId = id;
            this.getCtractContent(id)
         }else{
            return this.$vConfirm.warning("缺少协议id");
         }
      },
      methods:{
         GetParam(paraName) {
            var url = document.location.toString()
            var arrObj = url.split('?')
            if (arrObj.length > 1) {
               var arrPara = arrObj[1].split('&');
               if(arrObj.length > 2){
                  arrPara = arrObj[2].split('&');
               }
               var arr
               for (var i = 0; i < arrPara.length; i++) {
                  arr = arrPara[i].split('=')
                  if (arr != null && arr[0] == paraName) {
                     return arr[1]
                  }
               }
               return ''
            } else {
               return ''
            }
         },
         async getCtractContent(id){//获取合同内容
            const {status,body} = await getContractContent({contractId:id});
            if(status == 200){
               this.htmlContent = body.contractContent;
               this.titles = body.templateName;
               this.signStatus = body.status;
            }else this.$vConfirm.warning(body.msg);
         },
         async submitCtractContent(){//提交合同内容
            if(!this.checked){
               return this.$vConfirm.warning("请勾选同意协议规则");
            }
            if(!this.canSign) return false;//点击限制
            this.canSign = false;
            const {status,body} = await signContract({contractId:this.contractId});
            this.canSign = true;
            if(status == 200){
               this.getCtractContent(this.contractId);
               return this.$vConfirm.success("协议签成功！");
            }else this.$vConfirm.warning(body.msg);
         },
      }
   }
</script>

<style lang="scss" scoped>
.agreement-box{
   background: #f5f5f5;
   height: 100%;
}
.agreement-content{
   padding: 4px 10px;
   width: 100%;
   font-size: 14px;
   line-height: 20px;
   height: calc(100% - 146px);
   overflow-y: scroll;
}
.agreement-content-nobtm-height{
   height: calc(100% - 46px);
}
.agreement-footer{
   height: 100px;
}
.bottom-box{
   padding: 0 20px;
   width: 100%;
   p{
      font-size: 12px;
      text-align: center;
   }
   .button-style{
      width: 100%;
   }
   
}
</style>