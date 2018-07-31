<template>
<div class="purchaseIn x-scroll">
	<scroller lock-x scrollbar-y v-show="isShow" v-model="scrollerStatus" style="background: #f2f2f2;" ref="scrollerBottom"
      :bounce="false" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
	  <div class="purch bg-f7 js-eliHeight">
		<div class="purch-admin" v-if="dataList.length>0">
			<div class="purch-admin-item supply-item" v-for="(item,index) in dataList" :key="index">
              <div class="item-header">
                <div class="shop-name">
                  <img :src="item.logo" />
                  <h2>{{ item.name}}</h2>
                </div> 
                <div>
                  <span v-if="(item.status=='待发货'||item.status=='待收货'||item.status=='已完成')&&item.orderAuditStatus" class="cr-666 mr10">{{'('+item.orderAuditStatus+')'}}</span>
                  <span v-if="item.is_cancel==1" class="cr-pink">已取消</span>
                  <span v-else class="cr-pink">{{item.status==null?'已关闭':item.status}}</span>
                </div>
              </div>
              <div class="item-body">
                <router-link :to="'/orderDetail?type=purch&id='+item.id" class="pl0 layout-flex flex-ai-c">
                  <div class="flex1">
                    <h2>订单号：{{ item.order_sn}}</h2>
                    <p class="rmt20">采购ID：{{ item.gscID }}</p>
                    <p class="rmt10">报价单号：{{ item.quotation_no }}</p>
                    <h2 class="rmt20">{{ item.order_name }}</h2>
                  </div>
                  <p class="tr">数量：x{{ item.order_numb }}</p>
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
                        :to="{path:'/orderAppeal',query:{orderType:'purchase',userType:'buy',orderSn:item.order_sn,orderId:item.id}}">
                        <span class="btn-boder-cheng">查看申诉</span>
                  </router-link>
                  <span v-if="item.orderAuditStatus=='待补差价'" class="btn-bg-cheng" @click="toRefund(item)">补差价</span>
                  <span v-if="item.status=='待付款'&&(item.orderAuditStatus=='审核中'||item.orderAuditStatus=='审核失败')" class="btn-bg-cheng" @click="toAuditDetail(item)">{{item.orderAuditStatus}}</span>
                  <span v-if="item.status=='待付款'&&item.orderAuditStatus!='审核中'&&item.orderAuditStatus!='审核失败'" @click="cancelAction(item)">取消</span>
                  <span v-if="item.status=='待付款'&&item.orderAuditStatus!='审核中'&&item.orderAuditStatus!='审核失败'" class="btn-bg-cheng" @click="payAction(item)">立即付款</span>
                  <span v-if="item.status=='待收货'" @click="acceptConfirm(item)" class="btn-bg-cheng">确认收货</span>
                  <span v-if="item.status=='已关闭'||item.status==null||item.is_cancel==1"  @click="delAction(item,index)">删除</span>
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
  <!-- 支付密码确认框 -->
    <div v-transfer-dom>
      <confirm v-model="payConfirm"
      :title="'请输入支付密码'"
      @on-confirm="acceptAction">
        <form class="purch-form">
            	<div class="form-group">
                <input ref="pwd" type="text" maxlength="8" v-model.trim="password" style="position: absolute;z-index: -1;opacity: 0"/>
						        <ul class="pwd-wrap" @click="inputFocus">
						        	  <li><i v-if="password.length > 0"></i></li>
						        		<li><i v-if="password.length > 1"></i></li>
						        		<li><i v-if="password.length > 2"></i></li>
						        		<li><i v-if="password.length > 3"></i></li>
						        		<li><i v-if="password.length > 4"></i></li>
						        		<li><i v-if="password.length > 5"></i></li>
						        		<li><i v-if="password.length > 6"></i></li>
						        		<li><i v-if="password.length > 7"></i></li>
						        </ul>
            </div>
          </form>
      </confirm>
    </div>
</div>
</template>
<script>
import CommomObj from "../../utils/commom";
import { TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
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
      showPayModel: false,
      password: '',
      payConfirm:false,
      payOrder:{}
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
        page: this.page,
        pagesize: this.pagesize
      };
      this.$api.post(
        this.$interface.apiurl.getPurchaseInOrder,
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
    cancelAction(item) {
      //取消订单
      let _this = this;
      CommomObj.$comfirm("确定要取消订单吗？", function() {
        _this.$vux.loading.show({
          text: "loading"
        });
        let params = {
          appid: _this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          id: item.id,
          type: 2
        };
        _this.$api.post(
          _this.$interface.apiurl.cancelOrder,
          params,
          res => {
            _this.$vux.loading.hide();
            CommomObj.$tips("订单取消成功");
            item.status = "已关闭";
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
    payAction(item) {
      // 支付
      this.$router.push({
        path:'/offlinePay',
        query:{
          orderSn:item.order_sn,
          orderId:item.id,
          orderTypeCode:'purchase',
          typeCode:'firstPayment',
        }
      });
    },
    acceptConfirm(item) {
      //确认收货
      this.payOrder = item;
      this.password = '';
      this.payConfirm = true;
      setTimeout(() =>{
        this.$refs.pwd.focus();
      })
    },
    acceptAction() {
      if(this.password.length<8){
         CommomObj.$tips("请输入支付密码!");
         this.payConfirm = true;
         return;
      }
      this.$vux.loading.show({
          text: "loading"
        });
        let params = {
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          id: this.payOrder.id,
          type: 1,
          payPassword:this.password
        };
        this.$api.post(
          this.$interface.apiurl.acceptGoods,
          params,
          res => {
            this.$vux.loading.hide();
            if (res.code == 0) {
              CommomObj.$tips("确认收货成功!");
              item.status = "已完成";
            } else {
              CommomObj.$tips(res.msg);
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
    },
    inputFocus(){
				this.$refs.pwd.focus();
    },
    toRefund(item){
      //补差价
      this.$router.push({
        path:'/offlinePay',
        query:{
          orderSn:item.order_sn,
          orderId:item.id,
          orderTypeCode:'purchase',
          typeCode:'difference',
        }
      });
    },
     toAuditDetail(item){
       //审核结果
      this.$router.push({
        path:'/offlineResult',
        query:{
          orderSn:item.order_sn,
          orderId:item.id,
          orderTypeCode:'purchase',
          typeCode:'firstPayment'
        }
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
<style lang="scss">
.purchaseIn{
  .weui-dialog__bd{
    padding: 0 1em 0.8em;
  }
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
.purch-form .pwd-wrap{
    width: 90%;
    height: 30px;
    padding-bottom: 1px;
    margin: 0 auto;
    background: #fff;
    border:1px solid #ddd;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    cursor: pointer;
  }
  .pwd-wrap li{
    list-style-type:none;
    text-align: center;
    line-height: 30px;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-flex: 1;
    border-right:1px solid #ddd ;
  }
  .pwd-wrap li:last-child{
    border-right: 0;
  }
  .pwd-wrap li i{
    height: 10px;
    width: 10px;
    border-radius:50% ;
    background: #000;
    display: inline-block;
  }
</style>
