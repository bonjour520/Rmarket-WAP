<template>
<div class="x-scroll">
	<scroller lock-x scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
	  <div class="purch bg-f7 js-eliHeight">
		<div class="purch-admin" v-if="dataList.length>0">
			<div class="purch-admin-item" v-for="(item,index) in dataList" :key="index">
              <div class="item-header">
                <div>报价单号：{{ item.quotation_no }}</div>
                <div>
					<span :class="item.quotation_status== 1 ? 'cr-999' : 'cr-pink'"> {{ item.quotation_iSstop == 0 ? "报价中" : "已停止" }}</span>
				</div>
              </div>
              <div class="item-body">
                <router-link :to="{path:'/myOfferDetail',query:{quotationid:item.quotation_id,purchaseid:item.purchase_id}}">
                  	<h3>{{ item.store_name }}</h3>
                    <p>采购商品：<span class="cr-pink">{{ item.purchase_name }}</span></p>
                    <p>起售数量：<span class="cr-pink">{{ item.quotation_selling_count }}</span></p>
                    <p>供货单价：<span class="cr-pink">{{ item.quotationPrice }}（元）</span></p>
                    <p>截止时间：<span>{{ $timestampToTime(item.effective_time) }}</span></p>
                </router-link>                
              </div>
              <div class="item-footer">
                  <div>{{ $timestampToTime(item.quotation_time) }}</div>
                  <div class="f-right">
                    <span v-if="item.quotation_status!=1" @click="delAction(item,index)">删除</span>
                    <span v-if="new Date().valueOf() < item.effective_time && item.quotation_iSstop==0" @click="stopAction(item)">停止</span>
                    <router-link to="/offerOrder">
                      <span v-if="item.num>0" class="btn-bg-cheng">成交订单</span>
                    </router-link>
                  </div>
                </div>
			</div>
			<divider v-show="showDivider" class="f12">没有更多数据了</divider>
		</div>
		<div class="purch-admin notMore" v-if="dataList.length==0">
			<i class="iconfont icon-zizhishenhe"></i>
			<p>暂无报价</p>
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
        type:0,
        page: this.page,
        pagesize: this.pagesize
      };
      this.$api.post(this.$interface.apiurl.offerList,params,res => {
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
    stopAction(item) {
		//停止报价
      let _this = this;
      CommomObj.$comfirm("确定要停止此报价吗？", function() {
        _this.$vux.loading.show({
          text: "loading"
        });
        let params = {
          appid: _this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: item.quotation_id,
          type: 1
        };
        _this.$api.post(
          _this.$interface.apiurl.updateOfferStatus,
          params,
          res => {
            _this.$vux.loading.hide();
            if (res.code == 0) {
              CommomObj.$tips("操作成功!");
              item.quotation_iSstop = 1;
            } else {
              CommomObj.$tips(res.msg);
            }
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
		  ids: item.quotation_id,
		  type: 2
        };
        _this.$api.post(
          _this.$interface.apiurl.updateOfferStatus,
          params,
          res => {
            _this.$vux.loading.hide();
            if (res.code == 0) {
              CommomObj.$tips("删除成功!");
              _this.dataList.splice(index, 1);
            } else {
              CommomObj.$tips(res.msg);
            }
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
      if(from.path=='/wode'){
        this.$refs.scrollerBottom.reset({top: 0})
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
