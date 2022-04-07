<template>
    <div class="mobile-box-warp">
       <van-row class="header-show">
         <van-col  offset="20" span="4"  @click="showPop">
            <van-button size="small" plain  :type="showRed?'danger':'info'" class="mar-4"><van-icon name="coupon-o"/>筛选</van-button> 
         </van-col>
       </van-row>
       <van-popup v-model="show" position="right"  :close-on-click-overlay="false" :style="{ height: '100%',width:'100%'}">
          <van-cell  @click="closePop">
              <template #title>
                  <van-icon name="arrow-left"  />返回
               </template>
          </van-cell>
           <van-cell-group>
              <div v-for="(item,index) in searchobjArr">
               <van-cell :title="item.name" :value="form[item.bind]" v-if="item.type == 1"  :key="index" @click="showpops(item.bind)" is-link />
               
               <van-cell v-if="item.type == 2" :title="item.name" >
                  <van-stepper :allow-empty="true" @minus="changeplus(item.bind,'-')"  input-width="100px" integer  v-model="form[item.bind]" @plus="changeplus(item.bind,'+')"/>
               </van-cell>
               <van-field v-if="item.type == 3" v-model="form[item.bind]" label-width="8.2em" :label="item.name" placeholder="请输入" />
               
              </div>
              <div style="margin: 16px;text-align: center;">
               <van-button   type="default"  class="search-submit-btn-left width100" @click="reset">重置</van-button>
               <van-button   type="info"  class="search-submit-btn-right width100" @click="submitFun">提交</van-button>
             </div>
         </van-cell-group>
       </van-popup>
       <chooseSchool ref="universityName" />
       <chooseMajor ref="professionalName" />
       <chooseSales ref="businessName" />
    </div>
   
</template>
<script>
   import chooseSchool from './chooseSchool'
   import chooseMajor from './chooseMajor'
   import chooseSales from './chooseSales'
   export default {
        data() {
          
            return {
               form: {
                  universityId:'',
                  universityName:'',
                  professionalId:'',
                  professionalName:'',
                  businessId:'',
                  orderKey:'',
                  businessName:'',
                  scoreStart:'',
                  scoreEnd:'',
               },
               show:false,
               searchobjArr:[
                  {name:'School',bind:'universityName',type:1},
                  {name:'Course Code或Course Name',bind:'orderKey',type:3},
                  {name:'Specialization',bind:'professionalName',type:1},
                  {name:'分数起始值',bind:'scoreStart',type:2},
                  {name:'分数结束值',bind:'scoreEnd',type:2},
                  {name:'Sales',bind:'businessName',type:1},
               ]
            };
        },
        computed: {
            showRed(){
               if(this.form.universityId ||this.form.professionalId ||this.form.orderKey ||this.form.businessId ||this.form.scoreStart || this.form.scoreEnd){
                  return true
               }
               return false
            }
        },
        created(){
         let serchObj = localStorage.getItem('serchObj')
         if(serchObj){
            serchObj = JSON.parse(serchObj)
         }
         for(let i in serchObj){
            this.form[i] = serchObj[i]
         }
         this.$forceUpdate()
        },
        components: {
         chooseSchool,
         chooseMajor,
         chooseSales
        },
        methods: {
            showPop(){
               let serchObj = localStorage.getItem('serchObj')
               if(serchObj){
                  serchObj = JSON.parse(serchObj);
                  for(let i in serchObj){
                     this.form[i] = serchObj[i]
                  }
               }
               
               console.log(this.form)
               this.show = true;
               this.$forceUpdate()
            },
            closePop(){
               this.show = false;
               this.reset()
            },
            showpops(name){
               this.$refs[name].open()
            },
            changeplus(name,type){
               console.log(this.form[name])
               if(this.form[name]){
                  if(type == '+'){
                     this.form[name] = Number(this.form[name]) + 1
                  }else{
                     this.form[name] = Number(this.form[name]) - 1;
                  }
               }else{
                  this.form[name] = this.form[name] == 0?'0':'1';
               }
               this.$forceUpdate()
            },
            reset(){
               this.form = {
                  universityId:'',
                  universityName:'',
                  professionalId:'',
                  orderKey:'',
                  professionalName:'',
                  businessId:'',
                  businessName:'',
                  scoreStart:'',
                  scoreEnd:'',
               }
               localStorage.setItem('serchObj',JSON.stringify(this.form))
            },
            submitFun(){
               this.show = false;
               localStorage.setItem('serchObj',JSON.stringify(this.form))
               const {universityId,professionalId,businessId,scoreStart,scoreEnd,orderKey} = this.form
               const datas = {
                  universityId,orderKey,professionalId,businessId,scoreStart,scoreEnd
               }
               this.$emit('refresh',datas);
            },
        }
   }
</script>
<style>

</style>