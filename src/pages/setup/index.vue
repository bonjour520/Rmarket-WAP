<template>
<div class="x-scroll">
	<scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f7 my">
      <div class="setup-head" @click="$goRoterPage('setData')">
        <img :src="userInfo.head ? userInfo.head : require('../../../static/imgs/touxiang.png')" alt="" class="headpic">
        <div class="body">
          <h2>{{userInfo.nikename}}</h2>
          <p>{{myInfo.bind_phone}}</p>
        </div>
        <img src="../../../static/imgs/iconleft.png" alt="" class="iconleft">
      </div>
      <div class="rmt30 bg-f7"></div>
      <ul class="tab-lists">
          <li>
            <router-link  to="/setAddress">
              <span>收货地址</span>
              <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
						</router-link>
          </li>
          <li>
            <router-link to="/setSafe" class="border_no">
              <span>账号安全</span>
              <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
            </router-link>
          </li>
        </ul>
				<div class="rmt100"></div>
				<box gap="15px">
					<div class="rpt100"></div>
					<x-button type="primary" class="btn-default btn-main" @click.native="$store.commit('userSignout')">退出登录</x-button>
				</box>
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
		// 获取banner图
		getBannerList(){
			let params = {
				locationId: 1
			}
			this.$api.post(this.$interface.apiurl.getPurchaseBanner,params,res=>{
				this.bannerList = res.data;
			})
		},
		
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
		this.$getMyInfo();
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	},
}
</script>

<style lang="scss">
  @import "@/base/reset.scss";
	

</style>
