<template>
<div class="x-scroll">
	<scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f7 my">
      <div class="setup-head" @click="showUpimg = true">
        <p class="flex1">我的头像</p>
        <img :src="userInfo.head != null ? userInfo.head : require('../../../static/imgs/touxiang.png')" alt="" class="headpic mr10">
        <img src="../../../static/imgs/iconleft.png" alt="" class="iconleft">
      </div>
      <div class="rmt30 bg-f7"></div>
      <ul class="tab-lists">
          <li>
            <a href="javascript:;">
              <span>用户名</span>
              <span class="tr">{{myInfo.login_key}}</span>
						</a>
          </li>
          <li>
            <router-link to="/setNickName" class="border_no">
              <span>我的昵称</span>
							<span class="tr mr10">{{userInfo.nikename}}</span>
              <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
            </router-link>
          </li>
        </ul>
    </div>
	</scroller>
	<actionsheet v-model="showUpimg" :menus="menus" show-cancel @on-click-menu="click5"></actionsheet>
</div>
</template>
<script>
import {mapState} from 'vuex';
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			myInfo: [],
			showUpimg: false,
			menus: {
        menu1: "拍照",
        menu2: "从相册中选择"
      },
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
		click5(){

		},
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
