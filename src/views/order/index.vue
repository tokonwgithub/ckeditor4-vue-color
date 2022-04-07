/*editor:xulanlan
editTime:2021-03-17-16:23
title:新增实习订单类型 */
<template>
  <div class="order-content">
    <div class="title">请选择订单类型</div>
    <taglist :tagobj="tag" v-for="(tag,index) in tagallArrShow" :creatertype="qywxOrder" :key="index" @goto="gotoOrderfun"  />
  </div>
</template>
<script>
import { orderTypeQywx,orderType } from '@/utils/Enum/Permission'
import { Base64 } from 'js-base64';
import taglist from "./conponment/taglist";
import { getWyorderType } from "@/api/order";
import { SysCode } from "@/utils/Enum/Customer/Account";
import { queryStudentIsDbOrWy, queryOrderProductList} from '@/api/orderwy';
import { checkPermission } from "@/directives/permission";
export default {
  data() {
    return {
      orderTypeQywx,
      orderType,
      chooseproductType:null,
      tagallArrShow:[
        {
          title: "辅导类产品",
          imgsrc: require("@/assets/images/order/order-choose-bg2.png"),
          arrlist: []
        }
      ],
      //  1 定制辅导 2 论文大礼包 3 特殊订单 4 毕业论文 5 智能课程 6 Appeal Letter 7 资料整理 8 Personal Statement 9 Translation 10 Writing materials 12 Dissertation 13 Exam&Quiz 14 Presentation 15 Profeading 16 Editing
      tagallArr: [
        {
          title: "辅导类产品",
          imgsrc: require("@/assets/images/order/order-choose-bg2.png"),
          arrlist: [
            {
              name: "WritingMaterials", 
              id: "2",//作业订单 writing materials
              productType:10,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Writing-materials.png")
            },
             {
              name: "ExamsQuiz",
              id: "3",//考试订单 
              productType:12,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Quizzes-Exams-Weekly-tasks.png")
            },
            {
              name: "Dissertation",
              id: "11",// 11. Dissertation(大论文)
              productType:11,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Dissertation.png")
            },
           
            {
              name: "Presentation",
              id: "4",//4.Presentation(演讲稿)
              productType:13,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Presentation.png")
            },
            
            // {//暂时不要
            //   name: "Revision",
            //   id: "5",//5.revision
            //   imgsrc: require("@/assets/images/order/Revision.png")
            // },
            
            {
              name: "Proofreading",
              id: "8",//8.Proofreading
              productType:14,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Profreading.png")
            },

            {
              name: "Editing",
              id: "9",//9.Editiong
              productType:15,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Editiong.png")
            },
            {
              name: "dzfd",//定制辅导
              id: "0",
              productType:1,
              showStatus:false,
              imgsrc: require("@/assets/images/order/order-db0.png")
            },
            {
              name: "kqtj",//考前突击
              id: "1",
              productType:2,
              showStatus:false,
              imgsrc: require("@/assets/images/order/order-db1.png")
            },
            {
              name: "lwdlb",//论文大礼包
              productType:3,
              showStatus:false,
              id: "65",
              imgsrc: require("@/assets/images/order/order-db2.png")
            },
            // {
            //   name: "特殊订单",
            //   id: "66",
            //   productType:3,
            //   showStatus:false,
            //   imgsrc: require("@/assets/images/order/order-db3.png")
            // },
            {
              name: "bylw",//毕业论文
              productType:4,
              showStatus:false,
              id: "67",
              imgsrc: require("@/assets/images/order/order-db4.png")
            },
            
            // 改为走导毕的
            {
              name: "AppealLetter",
              sonid: "2",//特殊订单的子订单id
              id: "66",
              productType:6,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Appeal-Letter.png")
            },
            {
              name: "znkc",//智能课程
              productType:5,
              showStatus:false,
              id: "68",
              imgsrc: require("@/assets/images/order/order-db5.png")
            },
            {
              name: "CourseMaterialPackage",
              sonid: "1",//特殊订单的子订单id
              id: "66",
              productType:7,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Course-Material-Package.png")
            },
            {
              name: "PersonalStatement",
              sonid: "130",//特殊订单的子订单id
              id: "66",
              productType:8,
              showStatus:false,
              imgsrc: require("@/assets/images/order/Personal-Statement.png")
            },
            {
              name: "Translation",
              productType:9,
              showStatus:false,
              sonid: "129",//特殊订单的子订单id
              id: "66",
              imgsrc: require("@/assets/images/order/Translation.png")
            },
            {
              name: "homeworkguidance",
              productType:18,
              showStatus:false,
              id: "71",
              imgsrc: require("@/assets/images/order/homeworkguidance.png")
            },
            // 作业辅导
            // 1.团体订单group order
        // 2.作业订单 writing materials
        // 3.考试订单 Quizzes/Exams/Weekly  tasks
        // 4.Presentation(演讲稿)
        // 5.revision
        // 8.Proofreading
        // 9.Edting
        // 11. Dissertation(大论文)
            {
              name: "shixi",
              id: "70",
              productType:17,
              showStatus:false,
              imgsrc: require("@/assets/images/order/shixi.png")
            },
            {
              name: "GroupOrder",
              id: "1",
              productType:16,
              showStatus:false,
              imgsrc: require("@/assets/images/order/GroupOrder.png")
            },
            // 
            
            // {
            //   name: "Past paper",//第二版本不要
            //   id: "10",
            //   imgsrc: require("@/assets/images/order/Past-paper.png")
            // },
            // {
            //   name: "Paper Annotation",
            //   id: "11",
            //   imgsrc: require("@/assets/images/order/Paper-Annotation.png")
            // },
          ]
        },

        // 第二版本文亚类ing
        // 1.团体订单group order
        // 2.作业订单 writing materials
        // 3.考试订单 Quizzes/Exams/Weekly  tasks
        // 4.Presentation(演讲稿)
        // 5.revision
        // 8.Proofreading
        // 9.Edting
        // 11. Dissertation(大论文)
        // {
        //   title: "文案类产品",
        //   imgsrc: require("@/assets/images/order/order-choose-bg1.png"),
        //   arrlist: [
            
           
        //   ]
        // },
      ],
      intervalId: null,
      defaultData:{},
      wenyaStatus:2,//2真实数据
      daobiStatus:1,
      studentIsDbOrWy:{},
      qywxOrder:false,//导毕销售在企业微信端一律不可以下文案订单，只有在浏览器端可以，包括批量下单。文亚销售不限制
    };
  },
  components: {
    taglist
  },
  async created() {
    let bdata = decodeURIComponent(this.$route.query.bdata) 
    let defaultData = Base64.decode(bdata) ;
    defaultData = JSON.parse(defaultData) ;
    console.log(defaultData,'defaultDataindex')
    const data = {
       ucId: defaultData.ucId ,
       countryId:defaultData.countryId,
       userId:defaultData.userId ,
    };
    console.log(data.userId,'index')
    this.qywxOrder = defaultData.qywxOrder == 'daobi'?true:false;
    // this.qywxOrder = true;
    
    await this.queryStudentIsDbOrWy(data.userId);
    await this.queryOrderProductList(data.userId)
    this.defaultData = defaultData;
    const tapArr = [{name:"返回"},{name:"学生信息"},{name:"订单信息"}, {name:"订单附件"},{name: "财务信息"}, {name:"提交"}]
    // ["返回","学生信息","订单信息", "订单附件", "财务信息", "提交"];
    this.$store.dispatch('setToptaparr',tapArr);
    if(!data.ucId){
      return
    }
  },
  methods: {
    checkPermission,
    async queryOrderProductList(userId){
      const {status,body} = await queryOrderProductList(userId);
      console.log(status,'-------------',body)
      if(status == 200){
        let productArr = body;
        this.tagallArr.forEach((listGroup)=>{
          // let nums = 0;
          // let grouporder = [10,12,13,15],
          //   indexsCount = 0;
          listGroup.arrlist.forEach(item=>{
            let iindexs = productArr.findIndex(arr=>arr.productType == item.productType);
           console.log(this.checkPermission(this.qywxOrder?[this.orderTypeQywx[item.name]]:[this.orderType[item.name]]))
            if(iindexs>-1 && this.checkPermission(this.qywxOrder?[this.orderTypeQywx[item.name]]:[this.orderType[item.name]])){ 
              console.log(item.productType,iindexs,'888888888')
              this.tagallArrShow[0].arrlist.push(item)
              console.log(this.tagallArrShow[0],'999999999999')
          //     console.log(this.qywxOrder,item.productType,this.studentIsDbOrWy.flag,this.daobiStatus)
          //     if(this.qywxOrder && item.productType == 12 && (this.studentIsDbOrWy.flag == this.daobiStatus)){//企业微信进入并且学生是导毕的不能下考试订单
              
          //     }else{
          //       item.showStatus = true;
          //     }
          //     nums ++;
          //   }
          //   //当文案类型产品有grouporder可以下单的四种类型,grouporder类型展示
          //   let index = grouporder.findIndex(arr=>arr == item.productType);
          //   if(index>-1){
          //     indexsCount ++;
          //   }
          //   if(indexsCount == 4){
          //     listGroup.arrlist[15].showStatus = true;
            }
            // if(item.productType == 18){
            //   this.tagallArrShow[0].arrlist.push(item)
            // }
          })
          this.$forceUpdate()
          console.log(this.tagallArrShow);
        })
      }
    },
    async queryStudentIsDbOrWy(studUserId){
      const {status,body} = await queryStudentIsDbOrWy({studUserId:studUserId});
      // console.log(status,body)
      if(status == 200){
        this.studentIsDbOrWy = body;
        // flag (1  导毕学生   2 文亚学生	)
        if(this.studentIsDbOrWy.flag == this.daobiStatus){
          sessionStorage.clear()
        }
       this.showWyAccountNoDbId()
      }
    },
    // 文亚学生没有导毕的账户
    showWyAccountNoDbId(type){
      if(!([1,2,3].includes(this.studentIsDbOrWy.flag))){//这个如果不是1也不是2 直接报错：学生无法定位归属，请联系系统管理员
        this.$toast('学生无法定位归属，请检查关联账户信息！');
        return  false
      }
      if(!this.studentIsDbOrWy.dbId && !this.studentIsDbOrWy.wyId && !this.studentIsDbOrWy.sxId){
        this.$toast('该学生没有绑定任何类型的账户，请前往绑定账户！');
        return  false
      }
      sessionStorage.setItem("comefrom",'')
      // 来源导毕
      if(this.studentIsDbOrWy.flag == this.daobiStatus){
        if(!this.studentIsDbOrWy.dbId && type == 'daobi'){//没有导毕的时候，不能下导毕的单子
          this.$toast("该学生没有辅导类产品账户，请前往绑定账户！");
          return false
        }
        if(type == 'wenya'  && !this.studentIsDbOrWy.wyId && ![13,14,15].includes(this.chooseproductType)){//导毕账号存在不能下文亚单子
          this.$toast("该学生没有文案类产品账户，请前往绑定账户！");
          return  false;
        }
        if([13,14,15].includes(this.chooseproductType)){
          sessionStorage.setItem("comefrom",'db')
        }
      }
      if(this.studentIsDbOrWy.flag == this.wenyaStatus){// flag显示是文亚账户的时候
        if(!this.studentIsDbOrWy.dbId && type == 'daobi'){//没有导毕的时候，不能下导毕的单子
          this.$toast("该学生没有辅导类产品账户，请前往绑定账户！");
          return false
        }
        if(!this.studentIsDbOrWy.wyId && type == 'wenya'){//没有绑定文亚的时候，不能下文亚的单子
          this.$toast("该学生没有文案类产品账户，请前往绑定账户！");
          return false
        }
        if(this.studentIsDbOrWy.dbId && this.studentIsDbOrWy.wyId){//文亚学生有导毕账户全都可以下单
          if(type == 'daobi'){
            sessionStorage.clear()
          }
          if(type == 'wenya'){
            sessionStorage.setItem("state",'wyAccout')

          }
        }
      }
      return true
    },
    gotoOrderfun(id,sonid,productType) {
      let paramsUrl = {};
      if(sonid){
          this.defaultData.sonid = sonid//考试订单的子订单id
      }
      this.chooseproductType = productType;
      if(productType){
         this.defaultData.productType = productType;
      }
      let qywxOrdersCome = this.qywxOrder;
      if(this.defaultData.type){
        this.defaultData.type = id;
        paramsUrl = JSON.stringify({...this.defaultData,qywxOrder:qywxOrdersCome});
      }else{
        paramsUrl = JSON.stringify({type:id,qywxOrder:qywxOrdersCome,...this.defaultData});//正常数据
        // paramsUrl = JSON.stringify({type:id,courseId:7254,orderType:id,...this.defaultData});//下子订单
        // paramsUrl = JSON.stringify({type:id,courseId:7254,orderType:'again',...this.defaultData});//再来一单数据调试
      }
      localStorage.setItem('showMoneyTip','');
      if(Number(productType)<10 || Number(productType) == 18){
        if(!this.showWyAccountNoDbId('daobi')){
          return false
        }else{
          const tapArr = [{name:"返回"},{name:"学生信息"},{name:"订单信息"}, {name:"订单附件"},{name: "财务信息"}, {name:"提交"}]
          // ["返回","学生信息","订单信息", "订单附件", "财务信息", "提交"];
          this.$store.dispatch('setToptaparr',tapArr);
          this.$router.push({ path: "/order/allpage", query: {bdata: Base64.encode(paramsUrl)} });
        }
      }else{
          if(Number(productType) == 17){
            let comeform = this.studentIsDbOrWy.flag == 1?'db':'';
            sessionStorage.setItem("comefrom",comeform)
            this.$router.push({ path: "/ordershixi/index", query: {bdata: Base64.encode(paramsUrl)}})
          }else{
             if(!this.showWyAccountNoDbId('wenya')){
              return false;
            }else{
                //  企业微信不能下考试订单
              this.$router.push({ path: "/orderwenya/index", query: {bdata: Base64.encode(paramsUrl)} });
            }
           
          }
        
      }
    },
    async getWyorderType() {
      const {WENYA} = SysCode;
      const { status, body } = await getWyorderType({ sysCode:WENYA });
      if (status == 200) {
        const keysArr = Object.keys(body),
          valuesArr = Object.values(body);
        if (keysArr.length <= 0) return;
        keysArr.forEach((item, index) => {
          let obj = {
            name: valuesArr[index],
            id: item
          };
          this.tagallArr[0].arrlist.push(obj);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.title {
  color: #2C2D2F;
  font-size: 16px;
  line-height: 60px;
  padding-left: 10px;
  font-weight: 600;
}
.order-content {
  height: calc(100% - 20px);
  padding: 0 10px;
  margin: 10px;
  box-sizing: content-box;
  background: #fff;
  border-radius: 2px;
  overflow-y: auto;
  // display: flex;
  // flex-direction: column;
  h3 {
    padding: 14px 0;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(44, 45, 47, 1);
    line-height: 16px;
  }
}
</style>