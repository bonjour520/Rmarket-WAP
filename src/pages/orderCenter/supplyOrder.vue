<template>
<div class="x-scroll supplyOrder">
	<scroller lock-x scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
	  <div class="purch bg-f7 js-eliHeight">
		<div class="purch-admin" v-if="dataList.length>0">
			<div class="purch-admin-item supply-item" v-for="(item,index) in dataList" :key="index">
              <div class="item-header">
                <div>订单号: {{ item.order_sn }}</div>
                <div>
                  <span v-if="(item.status=='待发货'||item.status=='待收货'||item.status=='已完成')&&item.orderAuditStatus" class="cr-666 mr10">{{'('+item.orderAuditStatus+')'}}</span>
                  <span v-if="item.is_cancel==1" class="cr-pink">已取消</span>
                  <span v-else class="cr-pink">{{item.status==null?'已关闭':item.status}}</span>
                </div>
              </div>
              <div class="item-body">
                <router-link :to="'/orderDetail?type=supply&id='+item.id">
                  <img :src="item.showProduct_img[0]" />
                  <p class="pt20">{{ item.order_name }}</p>
                  <p class="pb25 rmt10 layout-flex"><span class="cr-pink flex1">供应ID：{{ item.gscID }}</span> <span class="tr">数量：x{{ item.order_numb }}</span></p>
                </router-link>                
    
              </div>
              <div class="item-footer">
                <div>{{ item.order_time }}</div>
                <div class="f-right">
                  <div class="mr10">共{{ item.order_numb }}件商品</div>
                  <div>订单总额： <b class="money">￥{{ item.sumOrderprice }}</b></div>
                </div>
              </div>
			        <div class="item-footer action-wrap">
				            <div></div>
                    <div class="f-right">
                      <router-link v-if="item.isAudit==0&&(item.status=='待发货'||item.status=='待收货'||item.status=='已完成')" 
                        :to="{path:'/orderAppeal',query:{orderType:'supply',userType:'sell',orderSn:item.order_sn,orderId:item.id}}">
                        <span class="btn-boder-cheng">查看申诉</span>
                      </router-link>
                      <span v-if="item.status=='待发货'" class="btn-bg-cheng" @click="deliverAction(item)">发货</span>
                      <span v-if="item.status=='已关闭'||item.status==null||item.is_cancel==1" @click="delAction(item,index)">删除</span>
                    </div>
              </div>
			</div>
			<divider v-show="showDivider" class="f12">没有更多数据了</divider>
		</div>
		<div class="purch-admin notMore" v-if="dataList.length==0">
			<i class="iconfont icon-zizhishenhe"></i>
			<p>没有相关订单</p>
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
        transactionType: 0,
        orderStatus: "",
        orderSn: "",
        phone: "",
        orderName: "",
        gscID: "",
        saveTimeStart: "",
        saveTimeEnd: "",
        page: this.page,
        pagesize: this.pagesize
      };
      this.$api.post(
        this.$interface.apiurl.getSupplyOrder,
        params,
        res => {
          this.$vux.loading.hide();
          this.isShow = true;

          if (this.page > 1) {
            if (res.data.rows < (this.page - 1) * this.pagesize) {
              this.showDivider = true;
              this.scrollerStatus.pullupStatus = "disabled"; // 禁用下拉
              return;
            }
            for (let i = 0; i < res.data.data.length; i++) {
              this.dataList.push(res.data.data[i]);
            }
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
    deliverAction(item) {
      let _this = this;
      CommomObj.$comfirm("确定要发货吗？", function() {
        _this.$vux.loading.show({
          text: "loading"
        });
        let params = {
          appid: _this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          id: item.id
        };
        _this.$api.post(
          _this.$interface.apiurl.deliverGoods,
          params,
          res => {
            _this.$vux.loading.hide();
            CommomObj.$tips("发货成功!");
              item.status = "待收货";
          },
          err => {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              text: err.msg,
              type: "text",
              width: "180px"
            });
          }
        );
      });
    },
    delAction(item, index) {
      let _this = this;
      CommomObj.$comfirm("确定要删除吗？", function() {
        _this.$vux.loading.show({
          text: "loading"
        });
        let params = {
          appid: _this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: item.id
        };
        _this.$api.post(
          _this.$interface.apiurl.delelteOrder,
          params,
          res => {
            _this.$vux.loading.hide();
            CommomObj.$tips("删除成功!");
              _this.dataList.splice(index, 1);
          },
          err => {
            _this.$vux.loading.hide();
            _this.$vux.toast.show({
              text: err.msg,
              type: "text",
              width: "180px"
            });
          }
        );
      });
    }
  },
  activated() {
    this.getData();
  },
  watch:{
    '$route' (to, from) {
      if(from.path=='/orderCenter'){
        this.$refs.scrollerBottom.reset({top: 0})
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.supplyOrder{
  .action-wrap{
    height: inherit;
    line-height: inherit;
    padding: 0;
    border-top:1px solid #eee;
  }
  .action-wrap .f-right span{
    margin: .2rem;
  }
}
</style>
