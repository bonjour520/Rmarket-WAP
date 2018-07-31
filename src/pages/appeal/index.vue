<template>
<div class="bg-f7 js-eliHeight x-scroll appealPage">
  <scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
    <tab :line-width="2" active-color='#00c55c' v-model="index">
		  <tab-item class="vux-center" selected>买家申诉</tab-item>
      <tab-item class="vux-center vux-1px-r">商家申诉</tab-item>
    </tab>
    <div style="margin-top:10px;">
      <div v-show="index==0">
        <ul v-if="buyerAppeal.length>0">
            <li v-for="(item,index) in buyerAppeal" :key="index" @click="toDetail(item,'buyAppeal')">
                <div class="item-top">
                    <div class="item-title">申诉退差价</div>
                    <div class="item-result" :class="item.statusCode=='fail'?'fail':''">{{ item.statusName }}</div>
                </div>
                <div class="item-content">
                  <img src="../../../static/imgs/appeal/appeal-icon.png" alt="" class="appeal-icon">
                  <div>
                    <div class="appeal-price">￥{{ item.amount }}</div>
                    <div class="appeal-time">{{ item.createTime }}</div>
                  </div>
                </div>
            </li>
        </ul>
        <div class="appeal-status" v-if="buyerAppeal.length==0&&buyerStatus.allowAudit">
          <img src="../../../static/imgs/appeal/buyer-none.png" alt="">
          <div>买家暂无申诉</div>
        </div>
        <div class="appeal-status" v-if="buyerStatus.otherStatusCode=='success'||buyerStatus.otherStatusCode=='ing'">
          <img src="../../../static/imgs/appeal/appealing.png" alt="">
          <div>商家申诉中/申诉成功，买家不可申诉</div>
        </div>
        <div class="tip" v-if="buyerStatus.currStatusCode=='fail'">买家已申诉失败3次，本订单买家不可再申诉</div>
      </div>
        
        <div v-show="index==1">
          <ul v-if="businessAppeal.length>0">
            <li v-for="(item,index) in businessAppeal" :key="index" @click="toDetail(item,'sellAppeal')">
                <div class="item-top">
                    <div class="item-title">申诉补差价</div>
                    <div>
                        <div class="item-result" v-if="item.statusCode=='success'&&item.execStatusCode">{{ item.execStatusName }}</div>
                        <div class="item-result" :class="item.statusCode=='fail'?'fail':''">{{ item.statusName }}</div>
                    </div>
                </div>
                <div class="item-content">
                  <img src="../../../static/imgs/appeal/appeal-icon.png" alt="" class="appeal-icon">
                  <div>
                    <div class="appeal-price">￥{{ item.amount }}</div>
                    <div class="appeal-time">{{ item.createTime }}</div>
                  </div>
                  <div v-if="queryObj.userType=='buy'&&item.statusCode=='success'&&item.execStatusCode=='notExect'" class="action"><span @click.stop="toRefund(item)">补差价</span></div>
                </div>
            </li>
        </ul>
        <div class="appeal-status" v-if="businessAppeal.length==0&&businessStatus.allowAudit">
          <img src="../../../static/imgs/appeal/business-none.png" alt="">
          <div>商家暂无申诉</div>
        </div>
        <div class="appeal-status" v-if="businessStatus.otherStatusCode=='success'||businessStatus.otherStatusCode=='ing'">
          <img src="../../../static/imgs/appeal/appealing.png" alt="">
          <div>买家申诉中/申诉成功，商家不可申诉</div>
        </div>
        <div class="tip" v-if="businessStatus.currStatusCode=='fail'">商家已申诉失败3次，本订单商家不可再申诉</div>
        
        </div>
    </div>
  </scroller>
  <router-link v-if="index==0&&queryObj.userType=='buy'&&buyerStatus.allowAudit" :to="'/appealApply?userType=buy&orderType='+queryObj.orderType+'&orderSn='+queryObj.orderSn">
      <div class="layout-flex" style="position: fixed;bottom: 0; width: 100%;	">
				  <button class="btn-default btn-main" style="border-radius: 0;">立即申诉</button>
		  </div>
  </router-link>
<router-link v-if="index==1&&queryObj.userType=='sell'&&businessStatus.allowAudit" :to="'/appealApply?userType=sell&orderType='+queryObj.orderType+'&orderSn='+queryObj.orderSn">
      <div class="layout-flex" style="position: fixed;bottom: 0; width: 100%;	">
				  <button class="btn-default btn-main" style="border-radius: 0;">立即申诉</button>
		  </div>
  </router-link>
</div>
</template>
<script>
export default {
  data() {
    return {
      index: 0,
      buyerAppeal: [],
      businessAppeal: [],
      buyerStatus: {},
      businessStatus: {},
      queryObj:{},
    };
  },
  methods: {
    getData(type) {
      this.$vux.loading.show({
        text: "loading"
      });
      let params = {
        orderSn: this.queryObj.orderSn, 
        initiatorTypeCode: type,  // 发起人Code,买家=buy,卖家=sell
        appid: this.$interface.$appid,
        mainKey: localStorage.$mainKey,
        tokenKey: localStorage.$tokenKey,
      };
      this.$api.get(
        this.$interface.apiurl.appealList,
        params,
        res => {
          this.$vux.loading.hide();
          if(type=='buy'){
            this.buyerAppeal = res.data;
          } else{
            this.businessAppeal = res.data;
          }
        },
        err => {
          this.$vux.loading.hide();
          this.$vux.toast.show({
            text: err.message,
            type: "text",
            width: "180px"
          });
        }
      );
    },
    getAppealStatus(type) {
      //获取订单当前的申诉状态
      let params = {
        orderSn: this.queryObj.orderSn, 
        orderTypeCode: this.queryObj.orderType,  // 订单类型 采购：purchase 供应：supply
        fromUserType:type,               //申诉方 买家：buy， 卖家：sell
        appid: this.$interface.$appid,
        mainKey: localStorage.$mainKey,
        tokenKey: localStorage.$tokenKey,
      };
      this.$api.get(
        this.$interface.apiurl.appealStatus,
        params,
        res => {
          this.$vux.loading.hide();
          if(type=='buy'){
            this.buyerStatus = res.data;
          } else{
            this.businessStatus = res.data;
          }
        },
        err => {
          this.$vux.toast.show({
            text: err.message,
            type: "text",
            width: "180px"
          });
        }
      );
    },
    toDetail(item,appealType){
      this.$router.push({
        path:'/appealDetail',
        query:{
          userType:this.queryObj.userType,  //卖出订单为sell  买入订单为buy
          appealId:item.id,
          orderType:this.queryObj.orderType,
          orderSn:this.queryObj.orderSn,
          orderId:this.queryObj.orderId, 
          appealType:appealType   //买家申诉：buyAppeal  卖家申诉：sellAppeal
        }
      });
    },
    toRefund(item){
      this.$router.push({
        path:'/offlinePay',
        query:{
          orderSn:this.queryObj.orderSn,
          orderId:this.queryObj.orderId,
          orderTypeCode:this.queryObj.orderType,
          typeCode:'difference',
        }
      });
    }
  },
  mounted() {
    this.queryObj = this.$route.query;
    this.getData('buy');
    this.getData('sell');
    this.getAppealStatus('buy');
    this.getAppealStatus('sell');
  }
};
</script>
<style lang="scss">
@import '@/base/reset.scss';
.appealPage{
  .vux-label{
    font-size: 14px;
  }
  .weui-cells{
    margin-top: 8px;
  }
  .vux-tab .vux-tab-item{
    font-size: 16px;
  }
  ul{
    margin-bottom: rem(150);
  }
  li{
    padding: rem(28);
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }
  .item-top{
    -webkit-display: flex;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;
    .item-title{
      font-size: rem(32);
      color: #333;
    }
    .item-result{
      font-size: rem(28);
      color: #fff;
      padding: 2px 8px;
      border-radius: 20px;
      display: inline-block;
      background:linear-gradient(-90deg,rgba(165,222,132,1),rgba(0,197,93,1));
      &.fail{
        background:linear-gradient(-90deg,rgba(253,198,0,1),rgba(249,149,76,0.92));
      }
    }
  }
  .item-content{
    -webkit-display: flex;
    display: flex;
    align-items: center;
  }
  .appeal-icon{
    width: rem(68);
    height: rem(68);
    margin-right: rem(41);
  }
  .appeal-price{
    font-size: rem(32);
    color: #FF0000;
  }
  .appeal-time{
    font-size: rem(24);
    color: #999;
  }
  .action{
    flex: 1;
    text-align: right;
    span{
      font-size: rem(28);
      color: #04BE02;
      padding: 2px 8px;
      border-radius: 20px;
      border: 1px solid #04BE02;
    }
  }
  .appeal-status{
    text-align: center;
    margin-top: rem(300);
    img{
      width: auto;
      height: rem(112);
    }
    div{
      color: #9B9B9B;
      font-size: rem(28);
      margin-top: 5px;
    }
  }
  .tip{
    color: #FF0000;
    font-size: rem(28);
    text-align: center;
  }
}
</style>
