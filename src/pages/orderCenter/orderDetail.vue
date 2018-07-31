<template>
<div class="purch order bg-f7 js-eliHeight">
	<section class="order-top" style="background: url('../../static/imgs/rm_order_detail_img.png') no-repeat center top;background-size:100%;">
		<h2 id="orderStatus">{{dataList.status?dataList.status:''}}</h2>
	</section>
	<section class="order-addres">
		<i class="iconfont icon-4"></i>
		<div>
			<p>收货人： <span>{{dataList.buyers}}</span><span class="fr">{{dataList.buyers_phone}}</span></p>
			<p v-if="type!='report'">地址：<span>{{ dataList.province+" "+dataList.city+" "+dataList.area+" "+dataList.add_field4}}</span></p>
      <p v-if="type=='report'">地址：{{ dataList.add_province +" "+ dataList.add_city +" "+ dataList.add_area +" "+ dataList.add_details }}</p>
		</div>
	</section>
	<section class="order-item border_btm1" v-if="type=='purch'">
		<img :src="dataList.logo" class="logo" />
		<h2 class="shop-title">{{dataList.name}}</h2>
		<i class="cr-666 iconfont icon-xiangyou" style="margin-top:4px;"></i>          
	</section>
	<section class="order-list mt0" v-if="type=='purch'">
		<p>{{dataList.order_name}} <span class="fr">数量：x{{dataList.order_numb}}</span></p>
	</section>
	<section class="order-issue" v-if="type!='purch'">
		<img v-if="type!='report'" :src="dataList.showProduct_img&&dataList.showProduct_img[0]" alt="">
		<p>{{dataList.order_name}}</p>
		<p class="tr">数量：x{{dataList.order_numb}}</p>
	</section>
	<section class="order-list">
		<p>订单编号：{{dataList.order_sn}}</p>
		<p>下单时间：{{dataList.order_time}}</p>
		<p>付款方式：{{ dataList.pay_type | getPayType }}</p>
		<p>付款时间：{{ dataList.pay_time?dataList.pay_time:''}}<span class="cr-pink" v-if="dataList.pay_time==null">未付款</span></p>
		<p>订单备注：{{dataList.descInfo}}</p>
	</section>
	<section class="order-item">
		<div><span style="visibility: hidden;">1</span></div>
		<div> <a href="tel:${data.self_phone}" class="cr-333"> <i class="iconfont icon-dianhua cr-lan"></i> 拨打电话 </a></div>
	</section>
	<section class="order-list mb10">
		<p>商品总额： <span class="cr-pink">￥{{dataList.sumPrice}}</span></p>
		<p>运费: ￥0.00</p>
		<p>店铺优惠：-￥0.00</p>
		<p>订单总额：￥{{dataList.sumOrderprice}}</p>
		<p>润民优惠：-￥0.00</p>
		<p>实付总额：<span class="cr-pink">{{dataList.payAmountBD}}</span></p>
	</section>
</div>
</template>
<script>
import CommomObj from "../../utils/commom";
export default {
  data() {
    return {
      id: "",
      type: "",
      dataList: []
    };
  },
  methods: {
    
  },
  filters: {
    getPayType(type) {
      var typeList = ["账户余额", "银联支付", "通联支付", "商家账户余额"];
      return typeList[type];
    }
  },
  activated() {
    this.$vux.loading.show({
      text: "loading"
    });
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    //供应订单、采购买入
    let params = {
      appid: this.$interface.$appid,
      mainKey: localStorage.$mainKey,
      tokenKey: localStorage.$tokenKey,
      transactionType: 0,
      id: this.id
    };
    let url;
    if (this.type == "supplyBuy") {
      // 供应买入
      Object.assign(params, { isStore: 0 });
      url = this.$interface.apiurl.getSupplyInOrder;
    } else if(this.type == "supply"){
      //供应订单
      url = this.$interface.apiurl.getSupplyOrder;
    } else if(this.type == "purch"){
      //采购买入
      url = this.$interface.apiurl.getPurchaseInOrder;
    } else if(this.type == "report"){
      url = this.$interface.apiurl.getPriceOrderDetail;
      params = {
          appid: this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
					order_sn: this.id
      }

    }
    this.$api.post(
      url,
      params,
      res => {
        this.$vux.loading.hide();
        if (res.code == 0) {
          if(this.type == "report"){
              this.dataList = res.data;
          } else{
              this.dataList = res.data.data[0];
          }
        } else {
          CommomObj.$comfirm(res.msg, function() {
            this.$router.replace("/login");
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
  }
};
</script>
<style lang="scss">
@import "@/base/order.scss";
.icon-right {
}
</style>
