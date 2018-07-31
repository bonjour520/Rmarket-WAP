<template>
<div class="x-scroll">
	<scroller lock-x height="-50px" style="background: #fff;" ref="scrollerBottom" :use-pulldown="true" :pulldown-config="downobj" @on-pulldown-loading="uploadStroeInfo">
			<section class="purch my">
				<div class="my-top">
					<div class="my-top-body">
						<img :src="storeInfo.logo != undefined ? storeInfo.logo : '../../../static/imgs/touxiang.png'" alt="" id="userImg">
						<div class="login" v-if="!loginState">
							<span @click="$goRoterPage('login')">登录</span>
							<span>/</span>
							<span @click="$goRoterPage('login')">注册</span>
						</div>
						<div class="title" v-else>
							<!-- <span class="logout" @click="$store.commit('userSignout')" style="left: 8px; right: unset;">退出</span> -->
							<h3>{{storeInfo.name}}</h3>
							<p>{{ storeInfo.phone }}</p>
						</div>
					</div>
					<router-link class="btn-wode" to="/personnel" v-if="loginState">个人中心</router-link>
				</div>
				<section class="my-info">
					<div class="info-item bg-rline">
						<a href="javascript:;" @click="$vux.toast.text('暂不支持线上充值!')">
							<img src="../../../static/imgs/qianbao.png" alt="">
							<p>充值</p>
						</a>
					</div>
					<div class="info-item">
						<p class="cr-pink">{{ moneyArr.account_funds != undefined ? moneyArr.account_funds: '0.00' }}</p>
						<p>总资产</p>
					</div>
					<div class="info-item">
						<p class="cr-999">{{ moneyArr.sum_money_YE != undefined ? moneyArr.sum_money_YE : "0.00" }}</p>
						<p>可用余额</p>
					</div>
					<div class="info-item">
						<p class="cr-999">{{ moneyArr.sum_money_DJ != undefined ? moneyArr.sum_money_DJ : "0.00" }}</p>
						<p>冻结余额</p>
					</div>
				</section>
				<ul class="tab-lists rmt30">
					<li>
						<router-link to="/orderCenter">
							<img src="../../../static/imgs/icon3.png" class="icon-left" alt="">
							<span>订单中心</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
				</ul>
				<ul class="tab-lists">
					<li>
						<router-link to="/supplyAdmin">
							<img src="../../../static/imgs/icon1.png" class="icon-left" alt="">
							<span>供应管理</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
					<li>
						<router-link to="/purchaseAdmin">							
							<img src="../../../static/imgs/icon2.png" class="icon-left" alt="">
							<span>采购管理</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
					<li>
						<router-link to="/myOffer">
							<img src="../../../static/imgs/icon4.png" class="icon-left" alt="">
							<span>我的报价</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
					<li>
						<router-link to="/help">
							<i class="cr-lv iconfont icon-tianping"></i>
							<span>帮助中心</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
				</ul>
				<section class="hot-phone">
					<div class="tit"> <em></em> <span>服务热线</span> <em></em></div>
					<p>谢经理 13923788854</p>
					<p>冷经理 18970588288</p>
					<div class="phone-btn">拨打电话</div>
				</section>
			</section>
	</scroller>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	data(){
		return {
			storeCapital: [],
			downobj:{
					content: '请下拉刷新数据.',
					pullUpHeight: 60,
					height: 50,
					autoRefresh: false,
					downContent: '下拉刷新数据',
					upContent: '下拉刷新数据',
					loadingContent: `<img src="../../../static/imgs/loading-2.gif" />`,
					clsPrefix: 'xs-plugin-pullup-'
			},
			moneyArr: {}
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
		getStoreMoney(){
				this.$api.post(this.$interface.apiurl.getStoreMoney, {
					appid: this.$interface.$appid,
					mainKey: localStorage.$mainKey,
					tokenKey: localStorage.$tokenKey,
				}, res => {
					this.moneyArr = res.data;
				})
		},
		uploadStroeInfo(){
			this.$vux.loading.show({text: 'loading'});
			if(this.loginState){
				this.$api.post(this.$interface.apiurl.getStoreInfo, {
					appid: this.$interface.$appid,
					mainKey: localStorage.$mainKey,
					tokenKey: localStorage.$tokenKey,
					}, res => {
						this.$store.commit("saveStoreInfo",res.data);
						this.getStoreMoney();
					},err=>{
						
					});
			}
			this.$nextTick(() => {
		    this.$vux.loading.hide();
				this.$refs.scrollerBottom.reset()
				this.$refs.scrollerBottom.donePulldown();
			})
		}
	},
	activated(){
		if(this.loginState){
			this.$nextTick(()=>{
				this.getStoreMoney();
				this.$getStoreInfo();
			})
		}
	}
}
</script>
<style lang="less" scoped>
.btn-wode{
	position: absolute;
	right: -12px;
	top:1.6rem;
	background-color: #ff7d3b;
	border-radius: 20px;
	padding: 5px 30px 5px 25px;
	color: #fff;
	font-size: 12px;
	}
</style>
