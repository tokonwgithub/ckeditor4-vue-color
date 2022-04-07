/**
 * 下单权限管理
 * @enum
 */
export const orderType = {
  // web
  //定制辅导
  dzfd:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:DiZhiFuDao",
  // 考前突击		
  kqtj:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:KaoQianTuJi",
  // 论文辅导大礼包
  lwdlb:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:LunWenFuDaoDaLiBao",
  // 毕业论文辅导
  bylw:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:BiYeLunWenFuDao",
  // 智能课程		
  znkc:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:ZhiNengKeCheng",
  // appeal letter		
  AppealLetter:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:AppealLetter",
  // 资料整理		
  CourseMaterialPackage:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:ZiLiaoZhengLi",
  // Personal Statement		
  PersonalStatement:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:PS",
  // Translation		
  Translation:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:TS",
  // Writing Materials		
  WritingMaterials:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:WM",
  // Dissertation		
  Dissertation:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:DT",
  // Exams&Quiz		
  ExamsQuiz:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:EQ",
  // Presentation		
  Presentation:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:PT",
  // Proofreading		
  Proofreading:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:PF",
  // Editing		
  Editing:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:ET",
  // 作业辅导
  homeworkguidance:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:ZuoYeFuDao",
  // Group Order		
  GroupOrder:"app:XiaoShouXiTong_catalog:YeWuGuanLi_menu:KeHuGuanLi_button:ChuangJianDingDan_button:GroupOrder",
  // 实习产品
  shixi:"app:xiaoshouxitong_catalog:yewuguanli_menu:kehuguanli_button:chuangjiandingdan_button:shixichanpin"
};
export const orderTypeQywx = {
//企业微信
  // 客户资料						app:KeHuZiLiao
	// 	订单信息				app:KeHuZiLiao_menu:DingDanXinXi
	// 		创建订单			
  CreatorOrder:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan",
	// 			定制辅导		
  dzfd:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:DiZhiFuDao",
	// 			考前突击		
  kqtj:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:KaoQianTuJi",
	// 			论文辅导大礼包		
  lwdlb:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:LunWenFuDaoDaLiBao",
	// 			毕业论文辅导		
  bylw:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:BiYeLunWenFuDao",
	// 			智能课程		
  znkc:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:ZhiNengKeCheng",
	// 			appeal letter		
  AppealLetter:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:AppealLetter",
	// 			资料整理		
  CourseMaterialPackage:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:ZiLiaoZhengLi",
	// 			Personal Statement		
  PersonalStatement:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:PS",
	// 			Translation		
  Translation:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:TS",
	// 			Writing Materials		
  WritingMaterials:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:WM",
	// 			Dissertation		
  Dissertation:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:DT",
	// 			Exams&Quiz		
  ExamsQuiz:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:EQ",
	// 			Presentation		
  Presentation:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:PT",
	// 			Proofreading		
  Proofreading:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:PF",
	// 			Editing		
  Editing:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:ET",
  // 作业辅导
  homeworkguidance:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:ZuoYeFuDao",
	// 			Group Order		
  GroupOrder:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:GroupOrder",
  shixi:"app:KeHuZiLiao_menu:DingDanXinXi_button:ChuangJianDingDan_button:shixichanpin"
};