<template>
<div class="x-scroll">
	<scroller lock-x height="-50px" style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f7 my">
      <div class="set-phone1" v-show="showStmp1">
          <p>请先验证身份</p>
          <div class="purch-form">
                <div class="form-group">
                    <label for="shopName">当前手机号:</label>
                    <input type="text" :value="myInfo.bind_phone"  disabled>
                </div>
                <div class="form-group">
                    <input type="text" v-model="smsCode1" placeholder="请输入验证码">
                    <span class="xian1 mr10 ml10"></span>
                    <span :class="isAbled1 ? 'cr-lan' : 'cr-999'"  @click="sendMessageNew">{{smsText}}</span>
                </div>

                <div class="form-footer">
                    <button class="btn-default" :class="smsCode1 == '' ? 'btn-light-main' : 'btn-main'" @click.prevent="setPhoneOne">下一步</button>
                </div>
            </div>
      </div>
      <div class="set-phone2" v-show="showStmp2">
          <p>输入您希望绑定的手机号码</p>
          <div class="purch-form">
                <div class="form-group">
                    <label for="shopName">中国+86 <i class="iconfont icon-xiangxia1 f12"></i> </label>
                    <span class="xian1 mr10"></span>
                    <input type="text" v-model="nowPhone">
                </div>
               <div class="form-group">
                    <input type="text" v-model="smsCode2" placeholder="请输入验证码">
                    <span class="xian1 mr10 ml10"></span>
                    <span :class="isAbled2 ? 'cr-lan' : 'cr-999'"  @click="sendMessageNew2">{{ smsText1 }}</span>
                </div>
								 <div class="form-footer">
                    <button class="btn-default" :class="smsCode2 == '' || nowPhone == '' ? 'btn-light-main' : 'btn-main'" @click.prevent="submitSetPhone">提交</button>
                </div>
            </div>
      </div>
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
			nowPhone: '',
			showStmp1: true,
			showStmp2: false,
			smsText: '发送验证码',
			isAbled1: true,
			smsCode1: '',
			smsText1: '发送验证码',
			isAbled2: true,
			smsCode2: ''
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
		// 检查第一步
		setPhoneOne(){
			CommomObj.$loading()
			this.$api.post(this.$interface.apiurl.checkSmsCodeForKey, {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				code: this.smsCode1,
				codeType: 4,
				type: 0
			}, res => {
				setTimeout(()=>{
					layer.close(CommomObjloadingIndex)
					this.showStmp1 = false;
					this.showStmp2 = true;
				},500);
			})
		},
		// 提交
		submitSetPhone(){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				code: this.smsCode1,
				newBindPhone: this.nowPhone,
				newPhonecode: this.smsCode2,
				type: 0
			}
			CommomObj.$loading();
			if(this.nowPhone == '' || this.nowPhone.length != 11){
				CommomObj.$tips("请输入正确的手机号码!");
				return;
			}
			if(this.smsCode2 == ''){
				CommomObj.$tips("请输入短信验证码!");
				return;
			}

			this.$api.post(this.$interface.apiurl.editPhoneNew,params,res=>{
				setTimeout(()=>{
					layer.close(CommomObj.loadingIndex);
					CommomObj.$tips("修改成功!");
				},500);
			},err=>{
				CommomObj.$tips(err.msg);
				this.$route.go(0);
			})
		},
		// 发送验证码
		sendMessageNew(){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				type: 4
			}
			this.$api.post(this.$interface.apiurl.sendMessageNew,params,res=>{
				if(_this.isAbled1){
					let o = 120;
					_this.isAbled1 = false;
					_this.smsText = "重新发送(" + o + "s)";
					let timer = setInterval(()=>{
						o--;
						if(o < 0){
							clearInterval(timer);
							_this.smsText = "重新发送";
							_this.isAbled1 = true;
						}else{
							_this.smsText = "重新发送(" + o + "s)";
						}
					},1000)
				}
			},err=>{
				CommomObj.$tips(err.msg);
				this.isAbled1 = true;
			})
		},
		// 发送验证码2
		sendMessageNew2(){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				phone: this.nowPhone,
				codeType: 4,
				type: 0
			}

			if(this.nowPhone == '' || this.nowPhone.length != 11){
				CommomObj.$tips("请输入正确的手机号码!");
				return;
			}

			this.$api.post(this.$interface.apiurl.sendMessageNotValid,params,res=>{
				if(_this.isAbled2){
					let o = 120;
					_this.isAbled2 = false;
					_this.smsText1 = "重新发送(" + o + "s)";
					let timer = setInterval(()=>{
						o--;
						if(o < 0){
							clearInterval(timer);
							_this.smsText1 = "重新发送";
							_this.isAbled2 = true;
						}else{
							_this.smsText1 = "重新发送(" + o + "s)";
						}
					},1000)
				}
			},err=>{
				CommomObj.$tips(err.msg);
				this.isAbled2 = true;
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
		this.$getMyInfo();
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
