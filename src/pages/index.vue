<template>
<div class="x-scroll">
	<scroller lock-x height="-50px" style="background: #fff;" ref="scrollerBottom">
		<div class="home">
				<input type="search" name="" class="indexSeach" @click="$router.push('/search')" placeholder="请输入搜素商品">
        <swiper loop auto class="indexH-175" :list="bannerList" dots-position="center" :show-desc-mask="false"></swiper>		
				<section class="body">
					<!-- 导航栏 -->
					<grid :show-lr-borders="false" :show-vertical-dividers="false">
						<grid-item :label="i.title" v-for="(i,index) in iconList" :key="index" @click.native="goRouter(i.url)">
							<img slot="icon" :src="i.img">
						</grid-item>
					</grid>

					<!-- 滚动公告  -->
					<flexbox :gutter="0">
						<flexbox-item :span="2">
							<img src="../../static/imgs/index/icon-top.png" alt="" class="gongg">
						</flexbox-item>
						<flexbox-item>
							<div class="gg-marquee">
								<div class="item">
									<span>公告</span>
									<marquee :item-height="19">
										<marquee-item v-for="(i,index) in gonggaoData" :key="index"  class="align-middle" style="white-space: nowrap;overflow: hidden;    text-overflow: ellipsis">{{i.title}}</marquee-item>
									</marquee>
								</div>
								<div class="item">
									<span>交易</span>
									<marquee :item-height="19">
										<marquee-item v-for="(item,index) in jiaoyiData" :key="index" class="align-middle" style="white-space: nowrap;overflow: hidden;    text-overflow: ellipsis">{{item.turnovername + "在"+ item.turnoverarea + "以"+ item.turnoverpic + "元成交！" }}</marquee-item>
									</marquee>
								</div>
							</div>
						</flexbox-item>
					</flexbox>

					<!-- 商家图 -->
					<flexbox :gutter="0" wrap="wrap" class="shopList">
						<flexbox-item :span="1/2" v-for="(item, index) in ShopList" :key="index">
							<router-link :to="item.url">
								<img :src="item.img" alt="">
							</router-link>
						</flexbox-item>
						<flexbox-item>
							<router-link to="/supply">
								<img src="../../static/imgs/index/gg.png" alt="">
							</router-link>
						</flexbox-item>
					</flexbox>

					<!-- 资讯 -->
					<flexbox :gutter="0" >
						<flexbox-item>
							<div class="consurlt">
								资讯
								<router-link :to="homeIndex == 0 ? '/purchase' : '/supply'">更多</router-link>
							</div>
						</flexbox-item>
					</flexbox>

					<tab :line-width="0" v-model="homeIndex" active-color="#00c55d">
						<tab-item class="vux-1px-t">采购资讯</tab-item>
						<tab-item class="vux-1px">供应资讯</tab-item>
					</tab>
					<swiper v-model="homeIndex" height="320px" class="indexH-275 pb15" :show-dots="false">
						<swiper-item>
							<div class="consurlt-swiper">
								<flexbox class="vux-1px-b" v-for="(item, index) in purchaseData" :key="index" @click.native="$router.push({path: '/purchaseDetail',query: {purchaseID: item.purchase_id}})">
									<flexbox-item><div class="flex-item">{{item.purchase_name}}</div></flexbox-item>
									<flexbox-item><div class="flex-item cr-pink">{{item.purchase_number + item.unit}}</div></flexbox-item>
									<flexbox-item><div class="flex-item">{{item.province + '/' + item.city}}</div></flexbox-item>
									<flexbox-item><div class="flex-item">>></div></flexbox-item>
								</flexbox>
							</div>
						</swiper-item>
						<swiper-item >
							<div class="consurlt-swiper">
								<flexbox class="vux-1px-b" v-for="(item, index) in supplyData" :key="index" @click.native="$router.push({path: '/supplyDetail',query: {supplyID: item.supply_id}})">
									<flexbox-item><div class="flex-item">{{item.supply_name}}</div></flexbox-item>
									<flexbox-item><div class="flex-item cr-pink">{{item.productUnivalent == 0 ? '面议' : '￥' +item.productUnivalent}}</div></flexbox-item>
									<flexbox-item><div class="flex-item">{{item.province + '/' + item.city}}</div></flexbox-item>
									<flexbox-item><div class="flex-item"> <a :href="'../../supply-area-detail.html?supplyID='+ item.supply_id"></a> >></div></flexbox-item>
								</flexbox>
							</div>
						</swiper-item>
					</swiper>

				</section>	
		</div>
	</scroller>
</div>
</template>
<script>
import CommomObj from '@/utils/commom'
export default {
	data(){
		return {
			bannerList: [],
			iconList: [{
					title: '供应批发',
					url: '/supply',
          img: require("../../static/imgs/index/icon-hot.png"),
        }, {
					title: '大宗采购',
					url: '/purchase',
          img: require("../../static/imgs/index/icon-gouwu.png"),
        }, {
					title: '帮助中心',
					url: '/help',
          img: require("../../static/imgs/index/icon-ques.png"),
        }, {
					title: '商家入驻',
					url: '#',
          img: require("../../static/imgs/index/icon-home.png"),
      }],
			ShopList: [{
					url: '/purchase',
          img: require("../../static/imgs/index/pic1.png"),
        }, {
					url: '/supply',
          img: require("../../static/imgs/index/pic2.png"),
        }, {
					url: '/supply',
          img: require("../../static/imgs/index/pic3.png"),
        }, {
					url: '/supply',
          img: require("../../static/imgs/index/pic4.png"),
			}],
			homeIndex: 0,
			jiaoyiData: [],
			gonggaoData: [],
			purchaseData: [],
			supplyData: [],
		}
	},
	computed:{},
	methods:{
		// 获取banner图
		getBannerList(){
			let params = {
				locationId: 1
			}
			this.$api.post(this.$interface.apiurl.getPurchaseBanner,params,res=>{
				this.bannerList = res.data;
			})
		},
		getGonggao(){
			this.$api.post(this.$interface.apiurl.getGonggao,{
				type: 0, // 0 活动公告 1系统公告
				classes: 0, // 公告类别:0.商城公告,1:投资公告
				accept_object: 0, // 接收对象: 0:所有用户(包括商家) 1:所有商家
			},res=>{
				console.log(res);
				this.gonggaoData = res.data.data;				
			})
		},
		getJiaoyi(){
			this.$api.post(this.$interface.apiurl.getJiaoyi,null,res=>{
				this.jiaoyiData = res.data;
			})
		},
		// 采购资讯
		getPurchaseList(page,size){
			this.$api.post(this.$interface.apiurl.getPurchaseList,{
				page: page,
				pagesize: size,
				newesTime: -1
			},res=>{
				this.purchaseData = res.data.data;
			})
		},
		// 供应资讯
		getSupplyList(page,size){
			this.$api.post(this.$interface.apiurl.getSupplyList,{
				page: page,
				pagesize: size,
				newesTime: -1
			},res=>{
				this.supplyData = res.data.data;
			})
		},
		/**
		 * 路由跳转
		 */
		goRouter(url){
			if(url == "#"){
				CommomObj.$alertWarn("非常抱歉，微端暂不支持商家入驻，请登录润民网PC版申请商家入驻，<a href='http://rmw.runmin.shop/'> http://rmw.runmin.shop </a>",function(){})
			}else{
				this.$router.push(url);
			}
		},
	},
	mounted(){
		this.getBannerList();
		this.getGonggao();
		this.getJiaoyi();
		this.getPurchaseList(1,7);
		this.getSupplyList(1,7);
	},
	activated(){
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0});
			if(sessionStorage.isLoaction == undefined){
				sessionStorage.isLoaction = true;
				this.$router.push('/mapLoactionAdrss');
			}
		});
	},
}
</script>

<style lang="scss">
  @import "@/base/reset.scss";
	.home{
		.indexSeach{
			position: absolute;
			z-index: 100;
			width: rem(690);
			background: url('../../static/imgs/index/seachbg.png') no-repeat center center/100%;
			height: rem(60);
			left: 50%;
			transform: translateX(-50%);
			top: rem(15);
			font-size: rem(24);
			line-height: rem(40);
			box-sizing: border-box;
			padding-left: rem(80);
		}
		.indexSeach::-webkit-input-placeholder{
			color: #ffffff;
		}
		.body{
			position: relative;
			width: 100%;
			overflow: hidden;
			background: #ffffff;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
			top: rem(-8);
		}
		.gongg{
			display: block;
			width: rem(53);
			height: rem(55);
			float: right;
			padding-right: rem(20);
		}
		.weui-grid__icon{
			width: rem(100);
			height: rem(63);
		}
		.weui-grid:after{
			border-bottom: 0;
		}
		.gg-marquee{
			font-size: rem(24);
			.item{
				display: flex;
				align-items: center;
				span{
					width: rem(60);
					font-size: rem(20);
					line-height: 1.1;
					border:1px solid red;
					color: red;
					padding: rem(1) rem(4);
					border-radius: 4px;
					margin-right: rem(10);
				}
			}
		}
		// 商家列表
		.shopList{
			box-sizing: border-box;
			padding: rem(20);
			img{
				width: 100%;
			}
		}
		// 资讯
		.consurlt{
			text-align: center;
			height: rem(85);
			line-height: rem(85);
			font-size: rem(34);
			padding-left: rem(55);
			background: url('../../static/imgs/index/consurlt.png') no-repeat center bottom/ auto 100%;
			a{
				font-size: rem(24);
				color: red;
				float: right;
				padding-right: rem(35);
				margin-right: rem(20);
				background: url('../../static/imgs/index/fill.png') no-repeat center right/rem(30) rem(30);
			}
		}
		.consurlt-swiper{
			padding: rem(25);
			font-size: rem(26);
			.flex-item{
					text-align: center;
					line-height: rem(80);
					flex: 1;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
			}
		}
	}
</style>
