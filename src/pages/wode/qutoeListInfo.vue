<template>
<div class="x-scroll">
	<scroller lock-x height="-50px" style="background: #fff;" ref="scrollerBottom" :use-pulldown="true" :pulldown-config="downobj" @on-pulldown-loading="uploadStroeInfo">
			<section class="purch bg-f7">
				<div class="purch-admin">
					<div class="purch-admin-info" >
						<div class="panle">
							<div>【采购商品】<span>{{qutoeListInfo.purchase}}</span></div>
							<div>【供货单价】<span>{{qutoeListInfo.unitPrice}}（元）</span></div>
						</div>
						<div class="line-item border_btm1">
							<label>起售数量：</label>
							<div class="flex-item">{{qutoeListInfo.selling_count}}</div>
						</div>
						<div class="line-item border_btm1">
							<label>供应数量：</label>
							<div class="flex-item">{{qutoeListInfo.supply_number}}</div>
						</div>
						<div class="line-item border_btm1" v-if="qutoeListInfo.counterpoise != null">
							<label>标准均重：</label>
							<div class="flex-item">{{qutoeListInfo.counterpoise}} Kg</div>
						</div>
						<div class="line-item border_btm1">
							<label>截止时间：</label>
							<div class="flex-item">{{$timestampToTime(qutoeListInfo.effective_time)}}</div>
						</div>
						<div class="line-item">
							<label>发货地址：</label>
							<div class="flex-item">{{qutoeListInfo.addressProvince + qutoeListInfo.addressCity + qutoeListInfo.addressArea + qutoeListInfo.address}}</div>
						</div>
					</div>
					<div class="purch-admin-info rmt30">
						<div class="line-item border_btm1">
							<label>采购ID：</label>
							<div class="flex-item">{{qutoeListInfo.gscID}}</div>
						</div>
						<div class="line-item border_btm1">
							<label>报价单号：</label>
							<div class="flex-item">{{qutoeListInfo.quotation_no}}</div>
						</div>
						<div class="line-item">
							<label>报价时间：</label>
							<div class="flex-item">{{$timestampToTime(qutoeListInfo.quotation_time)}}</div>
						</div>
					</div>
					<div class="purch-admin-info rmt30">
							<div class="purch-admin-item">
								<div class="item-header border_btm1">
									<div><img :src="qutoeListInfo.qLogo"/><span>{{qutoeListInfo.qStoreName}}</span></div>
								</div>
								<div class="layout-flex mt10">联系人：<span>{{qutoeListInfo.contacts}}</span></div>
								<div class="layout-flex mt10">联系电话：<span>{{qutoeListInfo.phone}}</span></div>
							</div>
					</div>
				</div>
			</section>
	</scroller>
	<div class="layout-flex" style="position: fixed;bottom: 0; width: 100%;	">
		<button class="btn-default btn-main" style="border-radius: 0;" v-if="isstop == 0">停止报价</button>
		<button class="btn-default btn-main" style="border-radius: 0;" v-else>返回</button>
	</div>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	data(){
		return {
			qutoeListInfo: {},
			downobj:{
					content: '请下拉刷新数据.',
					pullUpHeight: 60,
					height: 40,
					autoRefresh: false,
					downContent: '下拉刷新数据',
					upContent: '下拉刷新数据',
					loadingContent: `<img src="../../../static/imgs/loading-2.gif" />`,
					clsPrefix: 'xs-plugin-pullup-'
			},
			quotationid: '',
			purchaseid: '',
			isstop: ''
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			userInfo: "userInfo",
			storeInfo: "storeInfo"
		})
	},
	methods:{
		uploadStroeInfo(){
			this.$vux.loading.show({text: 'loading'});
			if(this.loginState){
				// 下拉数据数据刷新
				this.getQutoeListInfo();
			}
			this.$nextTick(() => {
		    this.$vux.loading.hide();
				this.$refs.scrollerBottom.reset()
				this.$refs.scrollerBottom.donePulldown();
			})
		},
		getQutoeListInfo(){
			this.$vux.loading.show({text: "Loading..."});
			this.$api.post(this.$interface.apiurl.getQutoeListInfo,{
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				id: this.purchaseid,
				qid: this.quotationid,
				type: 1
			},res=>{
				this.$vux.loading.hide()
				this.qutoeListInfo = res.data[0];
			},err=>{
				this.$vux.taost.text(err.msg);
				this.$vux.loading.hide()
			})
		}

	},
	activated(){
		this.quotationid = this.$route.query.quotationid;
		this.purchaseid = this.$route.query.purchaseid;
		this.isstop = this.$route.query.isstop;
		this.getQutoeListInfo();
		if(this.loginState){
			this.$nextTick(()=>{
				this.$refs.scrollerBottom.reset({top:0})
			})
		}
	}
}
</script>
<style lang="less" scoped>
</style>
