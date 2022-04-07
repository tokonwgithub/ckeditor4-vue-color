/*
 * @Author: sunowter 
 * @Date: 2021-11-23 18:24:18 
 * @Last Modified by: sunowter
 * @Name 选择学校
 * @Last Modified time: 2021-12-03 19:09:43
 */
<template>
   <div>
      <van-popup
      v-model="isShowPage"
      closeable
      close-icon="arrow-left"
      position="right"
      :close-on-click-overlay="false"
      close-icon-position="top-left"
      :style="{ height: '100%',width:'100%'}"
      @click-close-icon="closePage"
    >

      <van-search
        class="search"
        v-model="query.key"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @clear="onSearch"
      />
      <span></span>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <van-cell
          v-for="(item,index) in list"
          :key="index"
          :title="item.enName?`${item.name}(${item.enName})`:`${item.name}`"
          @click="selectOne(item)"
          :icon="item.id==(type?$parent.ruleForm.sellerSubmitUniversityId:$parent.ruleForm.universityId)?'success':''"
        />
      </van-list>
    </van-popup>
     </div>
</template>
 
<script>
  import {
        getUniversityList,
      } from "@/api/common.js"
import { Toast } from 'vant'
export default {
  props: ['type'],
  data() {
    return {
      isShowPage: false,
      loading: false,
      finished: false,//是否加载完成，加载完成后不在触发onload事件
      list: [],
      query: {
        page: 1,
        limit: 1000,
        key: "",
      },
      defaultList:[],
    }
  },
  methods: {
    open(type) {
      this.isShowPage = true;
      this.getList();
    },
    selectOne(val) {
      this.$set(this.$parent.ruleForm, 'sellerSubmitUniversityIdName', val.enName?`${val.name}(${val.enName})`:`${val.name}`)
      this.$set(this.$parent.ruleForm, this.type?'sellerSubmitUniversityId':'universityId', val.id)
      this.isShowPage = false
    },
    closePage() {
      this.finished = false;
    },
    async getList() {
      this.loading = true;
      let query = { ...this.query }
      let res = await getUniversityList(this.type?this.$parent.ruleForm.sellerSubmitCountryId:this.$parent.ruleForm.countryId)
      this.loading = false;
      this.list= [];
      this.finished = true;
      if (res && res.status == 200) {
        this.list = res.body || []
        this.defaultList = JSON.parse(JSON.stringify( res.body || []))
      } else {
        this.showToast(res)
      }
    },
    // 滚动条与底部距离小于 offset(默认300) 时触发
    async onSearch() {
      this.finished = false
      this.list = [];
      let arr = []
      this.defaultList.forEach(item => {
        if(item.enName&&item.enName.includes(this.query.key) || item.name&&item.name.includes(this.query.key)){
          arr.push(item)
        }
      });
      this.list = JSON.parse(JSON.stringify(arr))
      this.finished = true;
    },
    showToast(res) {
      Toast(res.msg || res && res.msg || res && res.body && res.body.msg || "请求失败");
    }
  },
}
</script>
 
<style scoped >
.search {
  padding-left: 2.5rem;
  background: #eee;
}
/deep/.van-search__content {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 0.3rem;
}
/deep/ .van-cell {
  position: relative;
}
/deep/.van-icon-success:before {
  position: absolute;
  left: 0;
  color: #0dba09;
}
/deep/ .van-cell__title {
  padding-left: 1.8rem;
}
/deep/ .van-popup__close-icon--top-left {
  left: 0.5rem;
}
/deep/.van-overlay {
  background: #eee;
}
</style>