<template>
<div class="x-scroll">
	<scroller lock-x style="background: #fff" ref="scrollerBottom">
		<div class="purch bg-f">
			<div class="payment">
				<div class="pay-check rmt20 pay-wayList">
					<h2 class="border_btm1">充值付方式</h2>
					<div class="list-item border_dbtm1" @click="isSelectBank = 2">
						<i class="iconfont icon-yinhangqia cr-zi iconleft"></i>
						<div class="flex1">银联支付</div>
						<i class="iconfont iconright" :class="isSelectBank == 2 ? 'icon-queren1' :'icon-xuanze' "  data-type="0"  data-paytype="2"></i>
					</div>
					<div class="list-item" @click="isSelectBank = 3">
						<i class="iconfont icon-chuzhiqia cr-lan iconleft"></i>
						<div class="flex1">通联支付</div>
						<i class="iconfont iconright" :class="isSelectBank == 3 ? 'icon-queren1' :'icon-xuanze' "  data-type="0" data-paytype="3"></i>
					</div>
				</div>
				<div class="bg-f7 pt15"></div>
				<div class="pay-check">
					<h2>充值金额</h2>
					<group>
						<x-input title="￥" placeholder="请输入充值金额" v-model="rechargeMonery" type="number"></x-input>
					</group>
				</div>
				<div class="layout-flex flex-ai-c" style="width: 92%;margin: 0 auto;">
					<button class="btn-default" :class="rechargeMonery != '' ? 'btn-main' : 'btn-light-main'" @click="submitRechargeOrder">提交充值</button>
				</div>
			</div>
		<!-- 支付密码确认框 -->
		<form action="" class="hide" ref="rechargeFrom" method="get">
			<input type="text" :name="index" :value="item"  v-for="(item, index) in orderData" :key="index">
		</form>
	</div>
	</scroller>
</div>
</template>
<script>
import {mapState} from 'vuex';
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			myInfo: [],
			rechargeMonery: '',
			isSelectBank: 2,
			orderData: [],
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			storeInfo: 'storeInfo',
			userInfo: 'userInfo'
		})
	},
	methods:{
		submitRechargeOrder(){
			this.$vux.loading.show({text: "Loading..."});
			this.$api.post(this.$interface.apiurl.submitRechargeOrder,{
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				orderId: '',
				money: this.rechargeMonery,
				payType: this.isSelectBank,
			},res=>{
				this.orderData = res.data[0];
				this.$set(this.orderData,'money',this.rechargeMonery);
				this.$refs.rechargeFrom.action = res.data[1].payUrl;
				this.$nextTick(()=>{
					this.$refs.rechargeFrom.submit();
					this.$vux.loading.hide();
				})
			})
		}
	},
	mounted(){
		var vm = this;
		if(!this.loginState){
			CommomObj.$alertWarn("警告！非法链接操作，请重新登陆！",function () {
					vm.$router.replace('/login');
			})
		}
	},
	activated(){
		console.log(this.$refs.rechargeFrom.action)
		this.$getMyInfo();
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
		if(this.$route.query.cz){ // 判断是否充值成功
			this.$api.post(this.$interface.apiurl.SelectRechargeResult,{
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				orderSn: this.$route.query.orderSn,
				orderType: this.$route.query.orderType
			},res=>{
				this.$router.push({
					path: "/rechargeResult",
					query: res.data
				})
			})
		}
	},
}
</script>

<style lang="scss"></style>
