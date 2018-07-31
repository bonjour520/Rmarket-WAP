<template>
<div class="purch helpDetail">
	 <div v-html="helpInfo"></div>
</div>
</template>
<script>
export default {
  data() {
    return {
      index: "",
      helpInfo: '',
      page: 1,
      pagesize: 50
    };
  },
  methods: {
    getData(id) {
      this.$vux.loading.show({
        text: "loading"
      });
      let params = {
        id: id,
      };
      this.$api.post(
        this.$interface.apiurl.helpList,
        params,
        res => {
          this.$vux.loading.hide();
          this.helpInfo = res.data.data[0].content;
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
  activated() {
    let id = this.$route.query.id;
    this.getData(id);
  }
};
</script>
<style lang="scss">
.helpDetail{
  hr{
    display: block;
    unicode-bidi: isolate;
    -webkit-margin-before: 0.5em;
    -webkit-margin-after: 0.5em;
    -webkit-margin-start: auto;
    -webkit-margin-end: auto;
    overflow: hidden;
    border-style: inset;
    border-width: 1px;
}
p{
  padding: 0 5px;
}
}
</style>
