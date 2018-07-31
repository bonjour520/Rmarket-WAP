<template>
<div class="purch order bg-f7 js-eliHeight x-scroll">
  <scroller lock-x style="background: #f7f7f7">
    <div class="purch-admin">
			<div class="purch-admin-info">
				<div class="panle">
					<div>【采购商品】{{ dataList.purchase }}</div>
					<div>【供货单价】{{ dataList.unitPrice }}(元)</div>
				</div>
				<div class="line-item border_btm1">
					<label>起售数量：</label>
					<div class="flex-item">{{ dataList.selling_count}}</div>
				</div>
				<div class="line-item border_btm1">
					<label>供应数量：</label>
					<div class="flex-item">{{ dataList.supply_number}}</div>
				</div>
				<div class="line-item border_btm1" v-if="dataList.counterpoise != null">
					<label>标准均重：</label>
					<div class="flex-item">{{ dataList.counterpoise}} Kg</div>
				</div>
				<div class="line-item border_btm1">
					<label>截止时间：</label>
					<div class="flex-item">{{ $timestampToTime(dataList.effective_time) }}</div>
				</div>
				<div class="line-item">
					<label>发货地址：</label>
					<div class="flex-item">{{ dataList.addressProvince + dataList.addressCity+ dataList.addressArea+ dataList.addressCity }}</div>
				</div>
			</div>
			<div class="purch-admin-info">
				<div class="line-item border_btm1">
					<label>采购ID：</label>
					<div class="flex-item">{{ dataList.gscID}}</div>
				</div>
				<div class="line-item border_btm1">
					<label>报价单号：</label>
					<div class="flex-item">{{ dataList.quotation_no}}</div>
				</div>
				<div class="line-item">
					<label>报价时间：</label>
					<div class="flex-item">{{ $timestampToTime(dataList.quotation_time)}}</div>
				</div>
			</div>
			<div class="purch-admin-info pb20">
					<div class="purch-admin-item">
						<div class="item-header border_btm1">
							<div><img :src="dataList.qLogo"/><span>{{ dataList.qStoreName }}</span></div>
						</div>
						<div class="layout-flex mt10">联系人：<span>{{ dataList.contacts}}</span></div>
						<div class="layout-flex mt10">联系电话：<span>{{ dataList.phone}}</span></div>
					</div>
			</div>
		</div>
  </scroller>
  <div class="layout-flex" style="position: fixed;bottom: 0; width: 100%;	">
				<button class="btn-default btn-main" style="border-radius: 0;" v-if="dataList.is_stop==0" @click="stopAction(dataList)">停止报价</button>
				<button class="btn-default btn-main" style="border-radius: 0;" v-if="dataList.is_stop!=0" @click="goBack">返回</button>
	</div>
</div>
</template>
<script>
import CommomObj from "../../utils/commom";
export default {
  data() {
    return {
      id: "",
      qid: "",
      dataList: []
    };
  },
  methods: {
   stopAction(item){
     var _this = this;
     CommomObj.$comfirm("确定要停止此报价吗？", function() {
        _this.$vux.loading.show({
          text: "loading"
        });
        let params = {
          appid: _this.$interface.$appid,
          mainKey: localStorage.$mainKey,
          tokenKey: localStorage.$tokenKey,
          ids: _this.qid,
          type: 1
        };
        _this.$api.post(
          _this.$interface.apiurl.updateOfferStatus,
          params,
          res => {
            _this.$vux.loading.hide();
            if (res.code == 0) {
              CommomObj.$tips("操作成功!");
              item.is_stop = 1;
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
   goBack() {
     this.$router.go(-1);
   }
  },
  activated() {
    this.$vux.loading.show({
      text: "loading"
    });
    this.id = this.$route.query.purchaseid;
    this.qid = this.$route.query.quotationid;
    let params = {
      appid: this.$interface.$appid,
      mainKey: localStorage.$mainKey,
      tokenKey: localStorage.$tokenKey,
      id: this.id,
			qid: this.qid,
			type: 1
    };
    this.$api.post(
      this.$interface.apiurl.offerInfo,
      params,
      res => {
        this.$vux.loading.hide();
        if (res.code == 0) {
          this.dataList = res.data[0];
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
</style>
