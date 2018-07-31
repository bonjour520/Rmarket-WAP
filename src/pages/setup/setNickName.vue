<template>
<div class="x-scroll purch bg-f7 my">
	<scroller lock-x height="-50px" style="background: #f7f7f7" ref="scrollerBottom">
		<div class=" js-eliHeight">
      <div class="rmt30 bg-f7"></div>
      <div class="bg-f set-nickname">
        <input type="text" placeholder="请输入昵称" v-model="inptName">
        <i class="iconfont icon-failure fr" style="position: relative;top: .1rem" v-show="inptName != ''" @click="inptName = ''"></i>
      </div>
    </div>
	</scroller>
	<div style="position: fixed;bottom: 0; width: 100%;">
		<button class="btn-default btn-main" style="border-radius: 0" @click="editUserInfo">完成修改</button>
	</div>
</div>
</template>
<script>
import { mapState } from 'vuex';
import CommomObj from '../../utils/commom';
export default {
	data(){
		return {
			inptName: '',
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
		// 修改用户信息
		editUserInfo(){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				nikename: this.inptName,
				head: this.userInfo.head,
				gender: this.userInfo.gender,
				birth_year: this.userInfo.birth_year,
				birth_month: this.userInfo.birth_month,
				birth_day: this.userInfo.birth_day,
				provinceid: this.userInfo.provinceid,
				cityid: this.userInfo.cityid,
			}
			this.$api.post(this.$interface.apiurl.editUserInfo,params,res=>{
				CommomObj.$tips("修改成功");
				this.$getUserInfo();
				setTimeout(()=>{
					this.$router.back();
				},800)
			})
		},
		
	},
	mounted(){
		var vm = this;
		if(!this.loginState){
			CommomObj.$alertWarn("警告！非法链接操作，请重新登陆！",function () {
					vm.$router.replace('/login');
			})
		}else{
			this.inptName = this.userInfo.nikename;
		}
	},
	activated(){
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	},
}
</script>

<style lang="scss">
.set-nickname{
	padding: .387rem;
}
</style>
