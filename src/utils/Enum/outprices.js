/**
 * 报单价的产品类型
 * @enum
 */
export const productCategory = [
   {
     name: "WritingMaterials", 
     perssmisonName:'WritingMaterials',
     id:692 ,//作业订单 writing materials
     productType:692,
     showStatus:false,
   },
   {
     name: "Dissertation",
     perssmisonName:'Dissertation',
     id: 6911,// 11. Dissertation(大论文)
     productType: 6911,
     showStatus:false,
   },
   {
     name: "Exams&Quiz",
     perssmisonName:'ExamsQuiz',
     id: 693,//考试订单 
     productType:693,
     showStatus:false,
   },
   {
     name: "Presentation",
     perssmisonName:'Presentation',
     id: 694,//4.Presentation(演讲稿)
     productType:694,
     showStatus:false,
   },    
   {
     name: "Proofreading",
     perssmisonName:'Proofreading',
     id: 698,//8.Proofreading
     productType: 698,
     showStatus:false,
   },

   {
     name: "Editing",
     perssmisonName:'Editing',
     id: 699,//9.Editiong
     productType: 699,
     showStatus:false,
   },
   {
    name: "包课预估",
    perssmisonName:'all',
    id: 999,//9.Editiong
    productType: 999,
    showStatus:false,
  },
 ]
 
 export const examTypeArr = [{name:'Login or Photo Exam',id:1},{name:'Take Home',id:2},{name:'Weekly Quiz(MCQs Only)',id:3}]
 export const defficultLevel ={
  1:"困难",
  2:"较难",  
  3:"一般",
 }
