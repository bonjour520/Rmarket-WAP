<template>
<div class="bg-f7 js-eliHeight helpPage">
	 <tab :line-width="0" active-color='#00c55c' v-model="index">
		  <tab-item class="vux-center" selected style="border-right: 1px solid #eee;">帮助中心</tab-item>
      <tab-item class="vux-center vux-1px-r">售后问题</tab-item>
    </tab>
    <group v-show="index==0">
      	<cell :title="item.title" :link="'/helpDetail?id='+item.id" v-for="(item,index) in helpList" :key="index"></cell>
    </group>
    <group v-show="index==1">
      	<cell :title="item.title"  :link="'/helpDetail?id='+item.id" v-for="(item,index) in questionList" :key="index"></cell>
    </group>
</div>
</template>
<script>
export default {
  data() {
    return {
      index: 0,
      helpList: [],
      questionList: [],
      page: 1,
      pagesize: 50
    };
  },
  methods: {
    getData(type, dataName) {
      this.$vux.loading.show({
        text: "loading"
      });
      let params = {
        typeId: type, // 文章类型 1：帮助中心；2;售后问题
        id: "",
        page: this.page,
        pagesize: this.pagesize
      };
      this.$api.post(
        this.$interface.apiurl.helpList,
        params,
        res => {
          this.$vux.loading.hide();
          if(type==1){
            this.helpList = res.data.data;
          } else{
            this.questionList = res.data.data;
          }
        },
        err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: err.msg,
            type: "text",
            width: "180px"
          });
        }
      );
    }
  },
  mounted() {
    this.getData(1);
    this.getData(2);
  }
};
</script>
<style lang="scss">
.helpPage{
  .vux-label{
    font-size: 14px;
  }
  .weui-cells{
    margin-top: 8px;
  }
  .vux-tab .vux-tab-item{
    font-size: 16px;
  }
}
</style>
