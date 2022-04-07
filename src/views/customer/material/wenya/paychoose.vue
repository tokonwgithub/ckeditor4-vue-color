
   <template>
      <el-dialog
         width="326px"
         :append-to-body="true"
         :visible.sync="show"
         title="支付申请"
         @close="closeDialog"
         :close-on-click-modal="false"
   >
   
      <currencys :showtype="showtype" @saveCurrency="saveCurrency"/>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
         <!-- 取 消 -->
         <el-button @click="show = false">取消</el-button>
         <!-- 保 存 -->
         <el-button type="primary" @click="handleSubmit">提交</el-button>
       </div>
   </el-dialog>
   </template>
   <script>
      import {generatePayUrl} from '@/api/order'
      import currencys from '@/views/chooseCurrency/index'
      export default {
         props:['showtype','studUserId'],
         computed: {
   
         },
         components:{
            currencys
         },
         data() {
            return {
               show:false,
               curr:'',
            }
         },
        async created(){
         
        },
        mounted(){
        },
        methods: {
         closeDialog(){
            this.show = false;
         },
        
         shows(){
            this.show = true;
         },
         handleSubmit(){
            this.generatePayUrl();
         },
         saveCurrency(curr){
            this.curr = curr
         },
         async generatePayUrl(){
            if(!this.curr){
               this.$notify.error('请选择货币种类')
            }
            let datas = {curr:this.curr,studUserId:this.studUserId}
            const{status,body} = await generatePayUrl(datas)
            this.$notify({type:status == 200?'success':'error', message:status == 200?'已复制到对话框, 请点击发送！':body.msg})
            if(status == 200){
               this.$emit('sendmsg',body.msg)
               this.closeDialog()
            }
         }
        },
      };
      </script>
   <style lang="scss" scoped>
   </style>