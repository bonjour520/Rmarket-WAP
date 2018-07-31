<template>
<div class="x-scroll">
	<scroller lock-x scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
	  <div class="purch bg-f7 js-eliHeight">
		<div class="purch-admin" v-if="dataList.length>0">
			<div class="purch-admin-item supply-item" v-for="(item,index) in dataList" :key="index">
        <div class="item-header">
          <div>供应ID: {{item.supplyID}}</div>
          <div><span class="cr-pink">{{item.status}}</span></div>
        </div>
        <div class="item-body">
          <router-link :to="'/supplyListDetail?supplyID='+ item.supply_id">
            <img :src="item.showProduct_img[0]" />
            <h3>{{item.supply_name}}</h3>
            <p>供应库存：<span class="cr-pink">{{item.adequacy == 0 ? '充足': item.surplus_inventory + '('+ item.unit +')'}}</span></p>
            <p>货品单价：<span class="cr-pink">{{item.productUnivalent + '（元）'}}</span></p>
            <p>截止时间：<span>{{item.showEnd_date}}</span></p>
          </router-link>
        </div>
        <div class="item-footer">
          <div>{{item.release_date}}</div>
          <div class="f-right">
            <span @click="delSupplyList(item.supply_id)" 
              v-if="item.status == '待提交' || item.status == '已停止' "
              >删除</span>
            <span @click="stopSupplyList(item.supply_id)" 
              v-if="item.status == '发布中' "
              >停止</span>
            <span @click="cancelSupplyList(item.supply_id)" 
              v-if="item.status == '待发布' "
              >取消</span>
            <span @click="goToSuccessOrder(item.supply_id)" 
              v-if="item.status == '发布中' || item.status == '已停止' "
              class="btn-bg-cheng"
              >成交订单</span>
            <span @click="submitSupplyList(item.supply_id)" 
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
      this.$api.post(this.$interface.apiurl.getMySupply,params,res => {
          this.$vux.loading.hide();
          this.isShow = true;

          if (this.page > 1) {
            if (res.data.rows < (this.page - 1) * this.pagesize) {
              this.showDivider = true;
              this.scrollerStatus.pullupStatus = "disabled"; // 禁用下拉
              return;
            }
              this.dataList.push(res.data.data);
            // for (let i = 0; i < res.data.data.length; i++) {
            // }
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
      CommomObj.$comfirm("确定提交发布供应吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.submitSupplyList,{
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
      CommomObj.$comfirm("确定取消发布供应吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.cancelSupplyList,{
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
      CommomObj.$comfirm("确定删除发布供应吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.delSupplyList,{
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
      CommomObj.$comfirm("确定停止发布供应吗?",function(){
        vm.$vux.loading.show({text:"Loading..."});
        vm.$api.post(vm.$interface.apiurl.stopSupplyList,{
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
      this.$router.push("/supplyIn?id=" + id);
    }
  },
  activated() {
     this.getData();
  }
};
</script>
<style lang="scss" scoped>
</style>
