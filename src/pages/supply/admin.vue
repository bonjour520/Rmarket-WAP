<template>
<div class="x-scroll">
	<scroller lock-x style="background: #fff;" ref="scrollerBottom">
			<section class="purch my">
				<ul class="tab-lists">
					<li>
						<router-link to="/publishSupply">
							<img src="../../../static/imgs/icon5.png" class="icon-left" alt="">
							<span>发布供应</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
					<li>
						<router-link to="/supplyList">
							<img src="../../../static/imgs/icon2.png" class="icon-left" alt="">
							<span>供应管理</span>
							<i class="cr-666 iconfont icon-xiangyou"></i>
						</router-link>
					</li>
				</ul>
			</section>
	</scroller>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	data(){
		return{

		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			userInfo: "userInfo",
			storeInfo: "storeInfo"
		})
	},
	methods:{},
	activated(){
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	}
}
</script>
<style lang="less" scoped></style>
