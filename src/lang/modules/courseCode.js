
/* courseCode管理 */
export const zh = {
  searchPlaceholder:"请输入内容",
  buttonList:[
    {
      text:'搜索',
      event:'query',
    },
    {
      text:'添加',
      event:'add',
      permission:'ADD',
    },
    {
      text:'批量删除',
      event:'deleteMany',
      permission:'DELETE_MANY',
    }
  ],
  TableColumn : [
      {
        label: "Course Code",
        prop: "courseCode",
      },
      {
        label: "学校",
        prop: "universityName",
        prop1: "universityEnName",
      },
      {
        label: "国家",
        prop: "countryName",
        prop1: "countryEnName",
      },
      {
        label: "Specialization",
        prop: "professionalName",
        prop1: "professionalEnName",
      },
      {
        label: "学科",
        prop: "specialtyName",
        prop1: "specialtyEnName",
      },
      {
        label: "Software",
        prop: "professionalExtPlus",
      },
      {
        label: "最后更新时间",
        prop: "updateAt",
      },
      {
        slot: "operate",
        width: "110px",
        label: "操作",
      },
    ],
    addDialog:{
    addTitle:'添加courseCode',
    editTitle:'修改courseCode',
    CourseCode:'Course Code',
    CourseCodePlaceholder:'请填写Course Code',
    Specialization:'Specialization',
    SpecializationPlaceholder:'请选择专业',
    CourseName:'Course Name',
    CourseNamePlaceholder:'请选择课程名称',
    Country:'Country',
    CountryPlaceholder:'请选择国家',
    SChool:'School',
    SChoolPlaceholder:'请选择学校',
    memo:'备注',
    memoPlaceholder:'备注',
    },
    deleteDialog:{
      title:'删除Course Code',
      text:'删除该条Course Code所绑定的信息都会清除，是否确定删除？'

    },
    linkDialog:{
      title:'关联单号',
      label:' 订单号',
      daobi:'导毕',
      wenya:'文亚',
    },
    errflag:'维护失败，',
    errordes1:'该学校和Course Code库中已经存在',
    content:'数据为：',
    errordes2:'请确定以下数据是否正确，若有问题请联系主管处理',
    

};

export const en = {
  searchPlaceholder:"请输入内容",
  buttonList:[
    {
      text:'搜索',
      event:'query',
    },
    {
      text:'添加',
      event:'add',
      permission:'ADD',
    },
    {
      text:'批量删除',
      event:'deleteMany',
      permission:'DELETE_MANY',
    }
  ],
  TableColumn : [
      {
        label: "Course Code",
        prop: "courseCode",
      },
      {
        label: "University",
        prop: "universityName",
        prop1: "universityEnName",
      },
      {
        label: "国家",
        prop: "countryName",
        prop1: "countryEnName",
      },
      {
        label: "Specialization",
        prop: "professionalName",
        prop1: "professionalEnName",
      },
      {
        label: "学科",
        prop: "specialtyName",
        prop1: "specialtyEnName",
      },
      {
        label: "Software",
        prop: "professionalExtPlus",
      },
      {
        label: "最后更新时间",
        prop: "updateAt",
      },
      {
        slot: "operate",
        width: "110px",
        label: "操作",
      },
    ],
    addDialog:{
    addTitle:'添加courseCode',
    editTitle:'修改courseCode',
    CourseCode:'Course Code',
    CourseCodePlaceholder:'请填写Course Code',
    Specialization:'Specialization',
    SpecializationPlaceholder:'请选择专业',
    CourseName:'Course Name',
    CourseNamePlaceholder:'请选择课程名称',
    Country:'Country',
    CountryPlaceholder:'请选择国家',
    SChool:'School',
    SChoolPlaceholder:'请选择学校',
    memo:'备注',
    memoPlaceholder:'备注',
    },
    deleteDialog:{
      title:'删除Course Code',
      text:'删除该条Course Code所绑定的信息都会清除，是否确定删除？'

    },
    linkDialog:{
      title:'关联单号',
      label: ' 订单号',
      daobi:'导毕',
      wenya:'文亚',
    },
    errflag:'维护失败，',
    errordes1:'该学校和Course Code库中已经存在',
    content:'数据为：',
    errordes2:'请确定以下数据是否正确，若有问题请联系主管处理',
      
};
