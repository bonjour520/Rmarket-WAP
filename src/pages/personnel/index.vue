<template>
<div class="x-scroll">
	<scroller lock-x height="-50px" style="background: #fff;" ref="scrollerBottom" :use-pulldown="true" :pulldown-config="downobj" @on-pulldown-loading="uploadStroeInfo">
			<section class="purch my">
				<div class="my-top">
					<i class="iconfont icon-shezhi" @click="$goRoterPage('setup')" v-if="loginState"></i>
					<div class="my-top-body">
						<img :src="userInfo.head ? userInfo.head : require('../../../static/imgs/touxiang.png')" alt="" id="userImg">
						<div class="login" v-if="!loginState">
							<span @click="$goRoterPage('login')">登录</span>
							<span>/</span>
							<span @click="$goRoterPage('login')">注册</span>
						</div>
						<div class="title" v-else>
							<h3>{{userInfo.nikename == '' ? '暂无昵称' : userInfo.nikename}}</h3>
							<p>{{ myInfo.bind_phone }}</p>
						</div>
					</div>
				</div>
				<grid :show-lr-borders="false" :show-vertical-dividers="false">
						<grid-item :label="i.title" v-for="(i,index) in iconList" :key="index" @click.native="gridAction(i.url)">
							<img slot="icon" :src="i.img">
						</grid-item>
				</grid>
			</section>
	</scroller>
</div>
</template>
<script>
import { mapState } from 'vuex'
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			storeCapital: [],
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
			moneyArr: {},
			iconList: [{
					title: '个人资料',
					url: '/setData',
          img: require("../../../static/imgs/info.png"),
        }, {
					title: '地址管理',
					url: '/setAddress',
          img: require("../../../static/imgs/address.png"),
        }, {
					title: '账户安全',
					url: '/setSafe',
          img: require("../../../static/imgs/safe.png"),
        }, {
					title: '卖家中心',
					url: '#',
          img: require("../../../static/imgs/store.png"),
			}],
			myInfo: {}
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
				this.$getMyInfo();
			}
			this.$nextTick(() => {
				this.$vux.loading.hide();
				this.$refs.scrollerBottom.reset()
				this.$refs.scrollerBottom.donePulldown();
			})
		},
		gridAction(url) {
			if(this.loginState){
				if(url=='#'){
					this.$api.post(this.$interface.apiurl.getUserType, {
						appid: this.$interface.$appid,
						mainKey: localStorage.$mainKey,
						tokenKey: localStorage.$tokenKey,
					}, res => {
						if(res.data.typeCode == 'merchant'){   //商户
							this.$router.push('/wode');
						} else if(res.data.typeCode == 'person'){   //个人
							CommomObj.$alertWarn("非常抱歉，微端暂不支持个人用户登录，请登录润民网PC版申请商家入驻，<a href='http://rmw.runmin.shop/'> http://rmw.runmin.shop </a>",function(){
								window.open("http://rmw.runmin.shop/");
							})
						}
					});
				}else{
					this.$router.push(url);
				}
			}else{
				CommomObj.$tips("请先登录~");
				return;
			}
		}
	},
	activated() {
		if(this.loginState){
			this.$getMyInfo();
		}
	},
}
</script>
<style lang="scss">
@import '@/base/reset.scss';
.account-wrap{
	.vux-flexbox-item{
		text-align: center;
		.account-value{
			color:#222;
			font-size: 20px;
		}
		img{
			width: rem(38);
		}
	}
}
</style>
