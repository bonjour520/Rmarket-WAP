<template>
<div class="x-scroll">
	<scroller lock-x scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
	  <div class="purch bg-f7">
		<div class="purch-admin" v-if="dataList.length>0">
			<div class="purch-admin-item" v-for="(item,index) in dataList" :key="index">
        <div class="item-header">
          <div>采购ID: {{item.purchaseID}}</div>
          <div><span class="cr-pink">{{item.status}}</span></div>
        </div>
        <div class="item-body">
          <router-link :to="'/purchaseListDetail?purchaseID='+ item.purchase_id">
            <h3>{{item.supply_name}}</h3>
            <p>采购数量：<span class="cr-pink">{{item.purchase_number + '('+ item.unit +')'}}</span></p>
            <p>期望单价：<span class="cr-pink">{{item.hopePrice == 0 ? "面议" : item.hopePrice + '（元）'}}</span></p>
            <p>截止时间：<span>{{item.expiry_date}}</span></p>
          </router-link>
        </div>
        <div class="item-footer">
          <div>{{item.release_date}}</div>
          <div class="f-right">
            <span @click="delSupplyList(item.purchase_id)" 
              v-if="item.status == '待提交' || item.status == '已停止' "
              >删除</span>
            <span @click="stopSupplyList(item.purchase_id)" 
              v-if="item.status == '发布中' "
              >停止</span>
            <span @click="cancelSupplyList(item.purchase_id)" 
              v-if="item.status == '待发布' "
              >取消</span>
            <span @click="$router.push('/purchaseQuote?purchaseID=' + item.purchase_id)" 
              v-if="item.status == '发布中' &&  item.offerNumber > 0"
              class="btn-boder-cheng"
              >查看报价</span>
            <span @click="goToSuccessOrder(item.purchase_id)" 
              v-if="(item.status == '发布中' || item.status == '已停止') && item.sus > 0"
              class="btn-bg-cheng"
              >成交订单</span>
            <span @click="submitSupplyList(item.purchase_id)" 
              v-if="item.status == '待提交' "
              class="btn-bg-cheng"
              >提交</span>
          </div>
        </div>
      </div>
			<divider v-show="showDivider" class="f12">没有更多数据了</divider>
		</div>
		<div class="purch-admin notMore" v-if="dataList.length==0">
			<i class="iconfont icon-zizhishenhe"></i>
			<p>没有相关供应</p>
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
      showDivider: false
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
        status: -1,
        page: this.page,
        pagesize: this.pagesize
      };
      this.$api.post(this.$interface.apiurl.getPurchaseAdminList,params,res => {
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
            if(this.dataList.length==0){
              this.scrollerStatus.pullupStatus = "disabled"; // 禁用下拉
            }
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
          vm.getData();
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
          vm.getData();
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
          vm.getData();
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
          vm.getData();
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
     this.getData();
  }
};
</script>
<style lang="scss" scoped>
</style>
