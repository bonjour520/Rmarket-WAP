<template>
<div class="x-scroll">
	<scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f7 my">
			<div class="set-phone1" v-show="showStep1">
          <p>设置登录密码</p>
          <form class="purch-form">
                <div class="form-group">
                    <input type="text" v-model="oldPwd" placeholder="请输入旧的登录密码">
                    <i class="cr-999 iconfont icon-yanjing"></i>
                </div>
                <div class="form-group">
                    <input :type="newPwdType" v-model="newPwd" placeholder="请输入新的登录密码">
                    <i class="cr-999 iconfont icon-biyan" v-show="newPwdType == 'password'" @click="newPwdType = 'text'"></i>
                    <i class="cr-999 iconfont icon-yanjing" v-show="newPwdType == 'text'" @click="newPwdType = 'password'"></i>
                </div>

                <div class="form-footer">
                    <button class=" btn-default btn-main" @click.prevent="submitOldEdit">提交</button>
                </div>
            </form>
      </div>
      <div class="set-phone2" v-show="showStep2">
          <p>设置登录密码</p>
          <p class="bg-f" style="line-height:1.8; text-align: center;" v-show="showSmsTips">短信验证码已发送至 <span class="cr-red">{{myInfo.bind_phone}}</span>
					</p>
					<p style="line-height:1.8; text-align: center;" v-show="showSmsTips">请输入验证码</p>
          <form class="purch-form">
                <div class="form-group">
                    <input type="text" v-model="codeNo" placeholder="请输入验证码">
                    <span class="xian1 mr10 ml10"></span>
                    <span class="cr-lan" @click="sendMessageNew">{{ smsText }}</span>
                </div>
                <div class="form-group">
                    <input :type="newPwdType" v-model="phonePwd" placeholder="请输入新的登录密码">
                    <i class="cr-999 iconfont icon-biyan" v-show="newPwdType == 'password'" @click="newPwdType = 'text'"></i>
                    <i class="cr-999 iconfont icon-yanjing" v-show="newPwdType == 'text'" @click="newPwdType = 'password'"></i>
                </div>

                <div class="form-footer">
                    <button class=" btn-default" 
											:class="codeNo != '' && phonePwd != '' ? 'btn-main': 'btn-light-main'" 
											:disabled="codeNo != '' && phonePwd != '' ? false: true " 
											@click.prevent="submitPhoneEdit"
											>提交</button>
                </div>
            </form>
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
			showStep1: true,
			showStep2: false,
			showSmsTips: false,
			oldPwd: '',
			newPwd: '',
			newPwdType: "password",
			codeNo: '',
			isAbled1: true,
			phonePwd: '',
			smsText: '获取验证码'
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

		// 发送验证码
		sendMessageNew(){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				type: 2
			}
			this.$api.post(this.$interface.apiurl.sendMessageNew,params,res=>{
				if(_this.isAbled1){
					let o = 120;
					this.showSmsTips = true;
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
		// 通过旧密码找回
		submitOldEdit(){
			if(this.oldPwd == ''){
				CommomObj.$tips("请输入原始密码!");
				return;
			}
			if(this.newPwd == ''){
				CommomObj.$tips("请输入您要修改的密码!");
				return;
			}
			if(this.newPwd == this.oldPwd){
				CommomObj.$tips("原始密码不能与初始密码相同!");
				this.newPwd = '';
				return;
			}
			CommomObj.$loading();
			this.$api.post(this.$interface.apiurl.editUserLoginPwdNew,{
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				oldLoginPwd: this.oldPwd,
				loginPwd: this.newPwd,
				phoneCode: '',
				type: 0,
				modifyType: 1
			},res=>{
				setTimeout(()=>{
					layer.close(CommomObj.loadingIndex);					
					CommomObj.$tips("修改成功!");
					this.$router.go(-1);
				},1000)
			},err=>{
				layer.close(CommomObj.loadingIndex);					
				CommomObj.$tips(err.msg);
			})
		},
		
		// 通过手机号码找回
		submitPhoneEdit(){
			if(!CommomObj.regLoginPwd.test(this.phonePwd)){
				CommomObj.$tips("密码为6-20为字符，由英文字母、数字、下划线组成、纯数字除外");
				return;
			}
			CommomObj.$loading();
			this.$api.post(this.$interface.apiurl.editUserLoginPwdNew,{
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				oldLoginPwd: '',
				loginPwd: this.phonePwd,
				phonecode: this.codeNo,
				type: 0,
				modifyType: 2
			},res=>{
				setTimeout(()=>{
					layer.close(CommomObj.loadingIndex);					
					CommomObj.$tips("修改成功!");
					this.$router.puch("/login");
				},1000)
			},err=>{
				layer.close(CommomObj.loadingIndex);					
				CommomObj.$tips(err.msg);				
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
		this.$nextTick(() => {
			this.newPwd = '';
			this.oldPwd = '';
			this.phonePwd = '';
			this.codeNo = '';
			this.showSmsTips = false;
			this.$refs.scrollerBottom.reset({top: 0})
		});
		if(this.$route.query.type == "phone"){
			this.showStep1 = false;
			this.showStep2 = true;
		}else{
			this.showStep1 = true;
			this.showStep2 = false;
		}
	},
}
</script>

<style lang="scss">
  @import "@/base/reset.scss";
</style>
