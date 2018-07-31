<template>
<div class="x-scroll">
	<scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f7 my">
      <div class="safe-bg"></div>
      <ul class="tab-lists" id="safeList">
          <li>
              <router-link to="/setPhone">
                <span>手机号</span>
                <span class="tr mr10 cr-666">{{myInfo.bind_phone}}</span>
                <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
							</router-link>
            </li>
            <li>
              <router-link to="/setRealname" class="border_no">
                <span>实名认证</span>
                <span class="tr mr10 cr-666" >{{ isBindIdenity ? '已实名' : '未绑定'}}</span>
                <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
              </router-link>
            </li>
            <li class="rmt30 bg-f7"></li>
            <li>
              <a href="javaScript:;" @click="showMenus = true;">
                <span>登录密码</span>
                <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
              </a>
            </li>
            <li>
              <router-link :to="isBindPayPwd ? '/setPaypwd?type=edit': '/setPaypwd?type=init'" class="border_no">
                <span>支付密码</span>
                <span class="tr mr10 cr-666" id="paypwd">{{isBindPayPwd ? "已设置" : "未设置"}}</span>
                <img src="../../../static/imgs/iconleft.png" class="icon-right" alt="">
              </router-link>
            </li>
      </ul>
    </div>
	</scroller>
	<actionsheet v-model="showMenus" :menus="menus" show-cancel @on-click-menu="clickMenuItem"></actionsheet>
</div>
</template>
<script>
import {mapState} from 'vuex';
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			myInfo: [],
			isBindIdenity: false,
			isBindPayPwd: false,
			showMenus: false,
			menus: {
        menu1: "通过旧密码找回",
        menu2: "通过手机验证方式"
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
		clickMenuItem(name){
			console.log(name)
			if(name == 'menu1'){ // 通过旧密码找回
				this.$router.push({
					path: '/setLoginPwd',
					query: { 'type': 'old' }
				});
			}else if(name == 'menu2'){ // 通过手机验证方式
				this.$router.push({
					path: '/setLoginPwd',
					query: { 'type': 'phone' }
				});
			}
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
		// 检测是否绑定省份证
		checkIdenity(){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
			}
			this.$api.post(this.$interface.apiurl.checkIdenity,params,res=>{
				this.isBindIdenity = true;
			},err=>{
				this.isBindIdenity = false;
			})
		},
		// 检测是否绑定支付宝密码
		checkBindPayPwd(){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
			}
			this.$api.post(this.$interface.apiurl.checkBindPayPwd,params,res=>{
				this.isBindPayPwd = true;
			},err=>{
				this.isBindPayPwd = false;
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
		this.checkIdenity();
		this.checkBindPayPwd();
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	},
}
</script>

<style lang="scss">
  @import "@/base/reset.scss";
	

</style>
