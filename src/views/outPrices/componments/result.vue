<template>
   <div class="forms-wrap-result">
      <div :class="hasTable?'blue-show':''" >
         <ul class="total-show">
            <li class="price-box" :class="!isMobileStatus?'price-pc-show':''">
               <label >总价</label>
               <span>{{resultObj.money}} {{resultObj.currency}}</span>
            </li>
           <li class="times-box" :class="!isMobileStatus?'times-pc-show':''">
              <label for="">交付时间:{{resultObj.realDeadline}}</label>
           </li>
          
        </ul>
        <div class="show-tips-content" v-if="resultObj.termMsg">
           <p v-html="resultObj.termMsg" :class="!isMobileStatus?'termMsg-pc-show':''">
           </p>
        </div>
      </div>
     <template v-if="hasTable">
      <h5>历史出分表现</h5>
      <div class="table-wraps" v-if='isMobileStatus'> 
         <ul v-for="(rows,indexs) in tableData" :key="indexs">
            <li  v-for="(items,index) in propsArr" v-if="items.label!='Deadline'" :key="index">
               <template v-if="items.label == 'Feedback'">
                  <p>
                     <label for="" :class="index>0&&index<=3? 'purecolor':''">{{items.label}}</label><br/>
                     <span style="flex: none;">{{rows[items.prop]}} <i> /</i>100</span>
                  </p>
                  
               </template>
               <template v-else>
                  <label for="" :class="index>0&&index<=3? 'purecolor':''">{{rows[items.prop]}}</label>
                  <span v-if='items.label=="Client Name"'>{{rows.realDeadline}}</span>
               </template>
              
            </li>
         </ul>
      </div>
     
      <div class="table-wraps" v-if='!isMobileStatus'>
         <el-table  
               :data="tableData"
               class="mb10"
               style="width: 100%;">
               <el-table-column
                  prop="clientName"
                  label="Client Name">
               </el-table-column>
               <el-table-column
                  prop="currency"
                  label="Order Info">
                  <template slot-scope="scope">  
                     <div class="purecolor">
                        <p>{{scope.row.professional}}</p>
                        <p>{{scope.row.specialty}}</p> 
                        <p >{{scope.row.courseCode}}</p>
                     </div>
                  </template>
               </el-table-column>
               <el-table-column
                  prop="orderType"
                  label=" Order Type ">
               </el-table-column>
               <el-table-column
                  prop="realDeadline"
                  label="Deadline">
               </el-table-column>
               <el-table-column
                  prop="feedback"
                  label="Feedback">
               </el-table-column>
         </el-table>
      </div>
    
     </template>
     <h5>传单信息</h5>
     <div class="ordermsg-wraps">
        <p  v-if="[692,698,699,6911].includes(Number(resultObj.productType)) || resultObj.examType == 2">
           <label for="">字数要求（Word Count）：</label>
           <span>{{resultObj.wordCount}}</span>
        </p>
        <!-- Exam&Quiz-Login or Photo Exam
      订单难度：算总价时得出的难度 （简单 一般 较难 困难） -->
        <p   v-if="resultObj.productType == 693&&[1].includes(Number(resultObj.examType))">
         <label for="">订单难度：</label>
         <span>{{difficultRateObj[resultObj.difficultRate]}}</span>
        </p>
        <!-- Exam&Quiz-Weekly Quiz(MCQs Only) -->
        <p   v-if="resultObj.productType == 693&&[3].includes(Number(resultObj.examType))">
         <label for="">工作量（Workload）：</label>
         <span>{{resultObj.totalWorkload}}</span>
        </p>
        <p   v-if="(resultObj.productType != 693 || (resultObj.productType == 693&&[2].includes(Number(resultObj.examType)))) && resultObj.productType != 999">
            <label for="">额外工作量（Extra Workload）：</label>
            <span>{{resultObj.additionalWorkload}}</span>
         </p>
         <!-- ruleForm.additionalType -->
         <p  v-if="[694].includes(Number(resultObj.productType))">
            <label for="">PPT页数（PPT Pages）：</label>
            <span>{{resultObj.pptPageCount}} 页（Number）</span>
         </p>
         <p  v-if="[694].includes(Number(resultObj.productType))">
            <label for="">演讲稿和报告总字数（Word Count）：</label>
            <span>{{resultObj.wordCount}}</span>
         </p>
       
     </div>
     <template v-if='[999].includes(Number(resultObj.productType))'>
      <h5>课程作业列表（Assignment List）</h5>
      <div class="ordermsg-wraps">
         <p  v-for="(item,index) in resultObj.structs" >
            <label class="assignmentName-shows" for="">{{item.assignmentName}}</label>
            <span>{{item.workload}}</span>
         </p>
      </div>
     
    </template>
   </div>
</template>
<script>
   import { Base64 } from 'js-base64';
   import {getNewOfferResult}  from '@/api/outPrices'
   export default {
      props:[],
      data(){
         return {
            uuid:'',
            id:'',
            resultObj:{},
            tableData:[{},{}],
            hasTable:true,
            propsArr:[{label:'Client Name',prop:'clientName'},{label:'professional',prop:'professional'},
            {label:'specialty',prop:'specialty'},{label:'courseCode',prop:'courseCode'},{label:'Order Type',prop:'orderType'},{label:'Deadline',prop:'realDeadline'},{label:'Feedback',prop:'feedback'}],
            difficultRateObj:{
               1:'简单',2:' 一般', 3 :'较难', 4 :'困难',
            },
            extendsArr:[
               {name:'图表',id:1},
               {name:'计算',id:2},
               {name:'代码',id:3},
               {name:'仿真模拟',id:4},
            ],
         }
      },
      components:{

      },
      computed: {
         isMobileStatus:function(){
            const { body } = document;
            const WIDTH = 1100;
            const RATIO = 3;
            const rect = body.getBoundingClientRect();
            return rect.width - RATIO < WIDTH;
         }
     },
      created(){
         document.title="导出报价结果"
         if(this.$route.query.bdata){
            let bdata = decodeURIComponent(this.$route.query.bdata) 
            const defaultDatas = Base64.decode(bdata);
            this.defaultData = JSON.parse(defaultDatas); 
            this.uuid = this.defaultData.uuid || '';
            this.id = this.defaultData.id || ''
         }else{
            this.uuid = this.$route.query.uuid || '';
            this.id = this.$route.query.id || ''
         }
         this.getNewOfferResult()
      },
      methods:{
        async getNewOfferResult(){
           const{status,body} = await getNewOfferResult({uuid:this.uuid,newOfferId:this.id});
           if(status != 200){
            this.$message({
               message: body.msg,
               type: "warning",
            }); 
           }
            
           this.resultObj = body
           this.tableData = body.highScoreOrderVos
           this.hasTable = body.highScoreOrderVos&&body.highScoreOrderVos.length
        } 
      }
   }
</script>
<style lang="scss" scoped>
.forms-wrap-result{
   position: relative!important;
    overflow: hidden auto;
    height: 100%;
    margin: 0!important;
    padding: 0!important;
    box-sizing: border-box;
    background: #fff;
    border-radius: 2px;
   
}
h5{
   margin: 16px 16px 12px;
   height: 22px;
   font-size: 16px;
   font-weight: 600;
   line-height: 22px;
   color: #333333;
}
.total-show{
   text-align: center;
   margin-top: 24px;
   /* color: #333333; */
   padding: 0 16px;
   /* display: flex;
   justify-content: space-between; */
}
.price-box{
   margin-bottom: 16px;
   label{
      display: block;
      line-height: 25px;
      font-size: 18px;
      margin-bottom:7px;
   }  
   span{
      display: block;
      line-height: 26px;
      font-size: 20px;
      font-family: Roboto;
      font-weight: bold;
   }
  
}
.times-box{
   width: 202px;
   line-height: 26px;
   margin: 0 auto;
   background: #F2FFED;
   opacity: 1;
   text-align: center;
   font-weight: bold;
   color: #2C9001;
   font-size: 12px;
   border-radius: 15px;
}
.show-tips-content{
   padding: 12px;
   margin: 16px 10px 0;
   background: #F0F0F0;
   border-radius: 4px;
   p{
     
      line-height:20px;
      font-size: 12px;
      /* color: #333333; */
   }
}
.ordermsg-wraps{
   margin: 0 16px;
   p{
      font-size: 14px;
      display:flex;
      justify-content: space-between;
      margin:0;
      padding-bottom:8px;
      margin-bottom:10px;
      border-bottom: 1px solid #ccc;
      label{
         color: #808080;
      }
   }
}
.table-wraps{
   padding: 0 16px;
   ul{
      padding:12px;
      border: 1px dotted #707070;
      margin-bottom:12px;
      border-radius: 12px;
      li{
         min-height: 16px;
         font-size: 12px;
         font-family: Arial;
         line-height: 16px;
         display: flex;
         justify-content: space-between;
         color: #333333;
         margin-bottom:12px;
         p{
            margin: 0;
            span{
               line-height: 20px;
               i{
                  margin: 0 10px;
               }
            }
         }
         &:nth-of-type(1){
            font-weight: bold;
         }
         &:last-child{
            font-weight: bold;
            margin-bottom: 0;
         }
      }
   }
}
.assignmentName-shows{
  color: #638bfb!important;
}
.purecolor{
   color: #964661;
   p{
      margin: 0;
   }
}
.price-pc-show{
   label{
      font-size: 24px;
      height: 33px;
      line-height: 33px;
      font-family: Roboto;
      font-weight: bold;
   }
   span{
      height: 43px;
      font-size: 32px;
      font-family: Roboto;
      font-weight: bold;
      line-height: 43px;
      color: #333333;
   }
   
}
.times-pc-show{
   width: 347px;
   height: 49px;
   line-height: 49px;
   font-size: 20px;
   border-radius: 25px;
   label{
      line-height: 49px;
   }
}
.termMsg-pc-show{
   font-size: 16px;
}
.blue-show{
   overflow: hidden;
   background: #4B8CF5;
   color: #fff!important;
   .show-tips-content{
      background: none;
      color:#fff;
   }
   .times-box{
      background:#fff;
      color: #41951D;
   }
}
</style>