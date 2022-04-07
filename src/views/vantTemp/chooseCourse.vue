/*
 * @Author: sunowter 
 * @Date: 2021-11-23 18:24:18 
 * @Last Modified by: sunowter
 * @Name:选择专业支持多选
 * @Last Modified time: 2021-12-01 17:55:03
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
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
     
      >
        <van-cell
          v-for="(item,index) in list"
          :key="index"
          :title="`${item.name}(${item.enName})`"
          @click="selectOne(item)"
          :icon="item.id== $parent.ruleForm.specialtyId?'success':''"
        />
        <template slot="title">
          
        </template>
      </van-list>
    </van-popup>
     </div>
</template>
 
<script>
  import { Toast } from 'vant'
    import {
      getSpecialtyClassList,
      } from "@/api/common.js"
export default {
  data() {
    return {
      isShowPage: false,
      loading: false,
      finished: false,//是否加载完成，加载完成后不在触发onload事件
      list: [],
      query: {
        page: 0,
        limit: 1000,
        key: "",
      },
      defaultList:[],
    }
  },
  computed: {
  },
  methods: {
    open() {
      this.isShowPage = true;
      this.getList()
    },
    selectOne(val) {
      this.$set(this.$parent.ruleForm,'courseNameshow', val.enName?`${val.name}(${val.enName})`:`${val.name}`)
      this.$set(this.$parent.ruleForm, 'specialtyId', val.id)
      this.isShowPage = false
    },
    async getList() {
      this.loading =true;
      let query = { professionalIds: this.$parent.ruleForm.professionalId}
      let res = await getSpecialtyClassList(query)
      this.loading = false;
      if (res && res.status == 200) {
        this.finished = true;
        this.list = res.body || [];
        this.defaultList = JSON.parse(JSON.stringify( res.body || []))
      } else {
        this.finished = true;
        Toast(res.body.msg || '请求失败')
      }
    },
    closePage() {
      this.finished = false;
    },
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
/deep/ .van-popup__close-icon--top-left {
  left: 0.5rem;
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
/deep/.van-overlay {
  background: #eee;
}
</style>