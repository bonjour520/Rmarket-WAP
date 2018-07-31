<template>
<div class="x-scroll">
	<scroller lock-x scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
	  <div class="purch bg-f7">
		<div class="purch-admin" v-if="dataList.length>0">
			<div class="purch-admin-item" v-for="(item,index) in dataList" :key="index">
        <div class="item-header">
          <div> <img :src="item.logo" alt=""> {{item.store_name}}</div>
          <div><span class="cr-pink">{{item.status}}</span></div>
        </div>
        <div class="item-body">
          <router-link :to="'/purchaseQuoteDetail?purchaseID='+ item.quotation_purchase_id + '&quotationID=' + item.quotation_id">
            <h3>{{item.supply_name}}</h3>
            <p>起售数量：<span class="cr-pink">{{item.quotation_selling_count}}</span></p>
            <p>供货单价：<span class="cr-pink">{{item.quotationPrice + '（元）'}}</span></p>
            <p>供货地区：<span class="cr-pink">{{item.add_province + '/'+ item.add_city }}</span></p>
            <p>截止时间：<span>{{$timestampToTime(item.effective_time)}}</span></p>
          </router-link>
        </div>
        <div class="item-footer">
          <div>{{$timestampToTime(item.quotation_time)}}</div>
          <div class="f-right">
            <span @click="$router.push('/purchaseIn?id='+ item.quotation_purchase_id)" class="btn-bg-cheng">成交订单</span>
          </div>
        </div>
      </div>
			<divider v-show="showDivider" class="f12">没有更多数据了</divider>
		</div>
		<div class="purch-admin notMore" v-if="dataList.length==0">
			<i class="iconfont icon-zizhishenhe"></i>
			<p>没有相关报价</p>
		</div>
	   </div>
	</scroller>
</div>
</template>
<script>
import CommomObj from "../../utils/commom";
export default {
  data() {
    return {
      dataList: [],
      page: 1,
      pagesize: 10,
      isShow: false,
      scrollerStatus: {
        pullupStatus: "default"
      },
      showUp: true,
      upobj: {
        content: "",
        pullUpHeight: 60,
        height: 40,
        autoRefresh: false,
        downContent: "请上拉刷新数据",
        upContent: "",
        loadingContent: "加载中...",
        clsPrefix: "xs-plugin-pullup-"
      },
      showDivider: false,
      purchaseID: ''
    };
  },
  methods: {
    getData() {
      this.$vux.loading.show({
        text: "loading"
      });
      let params = {
        appid: this.$interface.$appid,
        mainKey: localStorage.$mainKey,
        tokenKey: localStorage.$tokenKey,
        purchase_id: this.purchaseID,
        page: this.page,
        pagesize: this.pagesize
      };
      this.$api.post(this.$interface.apiurl.getPurchaseOffer,params,res => {
          this.$vux.loading.hide();
          this.isShow = true;

          if (this.page > 1) {
            if (res.data.rows < (this.page - 1) * this.pagesize) {
              this.showDivider = true;
              this.scrollerStatus.pullupStatus = "disabled"; // 禁用下拉
              return;
            }
            this.dataList.push(res.data.data);
            this.showDivider = false;
            this.scrollerStatus.pullupStatus = "default";
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset();
            });
          } else {
            this.dataList = res.data.data;
            this.$nextTick(() => {
              this.$refs.scrollerBottom.reset({
                top: 0
              });
            });
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
    },
    selPullUp() {
      this.page++;
      this.getData();
    },
    // 提交
    submitSupplyList(id){
      let vm = this;
      CommomObj.$comfirm("确定发布采购订单吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.putPurchaseRelease,{
          appid: vm.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: id
        },res=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(res.data);
          this.getData();
        },err=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(err.msg);
        })
      })
    },
    // 取消
    cancelSupplyList(id){
      let vm = this;
      CommomObj.$comfirm("确定取消发布采购吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.putPurchaseCancel,{
          appid: vm.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: id
        },res=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(res.data);
          this.getData();
        },err=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(err.msg);
        })
      })
    },
    // 删除
    delSupplyList(id){
      let vm = this;
      CommomObj.$comfirm("确定删除采购订单吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.putPurchaseDelete,{
          appid: vm.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: id
        },res=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(res.data);
          this.getData();
        },err=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(err.msg);
        })
      })
    },
    // 停止
    stopSupplyList(id){
      let vm = this;
      CommomObj.$comfirm("确定停止发布采购吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.putPurchaseStop,{
          appid: vm.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: id
        },res=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(res.data);
          this.getData();
        },err=>{
          vm.$vux.loading.hide();
          vm.$vux.toast.text(err.msg);
        })
      })
    },
    // 供应买入
    goToSuccessOrder(id){
      this.$router.push("/purchaseIn?id=" + id);
    }
  },
  activated() {
     this.purchaseID = this.$route.query.purchaseID;
     this.getData();
  }
};
</script>
<style lang="scss" scoped>
</style>
