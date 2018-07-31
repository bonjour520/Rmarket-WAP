<template>
<div class="x-scroll">
	<scroller lock-x style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f my">
			<div class="set-phone1" v-show="showStep1">
          <p>为了你的资金安全，请先设置支付密码</p>
          <div class="purch-form">
              <div class="form-group vux-1px-b">
                  <input type="text" :value="myInfo.bind_phone" placeholder="手机号码" disabled>
                  <span class="xian1 mr10 ml10"></span>
                  <span class="cr-lan" @click="sendMessageNew">{{smsText}}</span>
              </div>
              <div class="form-group vux-1px-b">
                  <input type="text" v-model="codeNo" placeholder="输入验证码">
              </div>

                <div class="form-footer">
                    <button class=" btn-default" 
										:class="codeNo != '' ? 'btn-main' : 'btn-light-main'"
										@click="checkPhoneCode">下一步</button>
                </div>
            </div>
      </div>
      <div class="set-phone2" v-show="showStep2">
          <p>请输入支付密码</p>
          <div class="purch-form">
            <div class="form-group  vux-1px-b">
              <input ref="pwd" type="text" maxlength="8" v-model="oldPwd"  style="position: absolute;z-index: -1;opacity: 0"/>
							<ul class="pwd-wrap" @click="focus">
								<li><i v-if="oldPwdLength > 0"></i></li>
								<li><i v-if="oldPwdLength > 1"></i></li>
								<li><i v-if="oldPwdLength > 2"></i></li>
								<li><i v-if="oldPwdLength > 3"></i></li>
								<li><i v-if="oldPwdLength > 4"></i></li>
								<li><i v-if="oldPwdLength > 5"></i></li>
								<li><i v-if="oldPwdLength > 6"></i></li>
								<li><i v-if="oldPwdLength > 7"></i></li>
							</ul>
            </div>
            <p>请再次输入密码</p>
            <div class="form-group  vux-1px-b">
               <input ref="pwd2" type="text" maxlength="8" v-model="newPwd"  style="position: absolute;z-index: -1;opacity: 0" @blur="checkPaypwd"/>
								<ul class="pwd-wrap" @click="focus2">
									<li><i v-if="newPwdLength > 0"></i></li>
									<li><i v-if="newPwdLength > 1"></i></li>
									<li><i v-if="newPwdLength > 2"></i></li>
									<li><i v-if="newPwdLength > 3"></i></li>
									<li><i v-if="newPwdLength > 4"></i></li>
									<li><i v-if="newPwdLength > 5"></i></li>
									<li><i v-if="newPwdLength > 6"></i></li>
									<li><i v-if="newPwdLength > 7"></i></li>
								</ul>
            </div>
            <p class="cr-pink" v-show="showSmsTips != ''"> <i class="iconfont icon-delete1"></i> {{showSmsTips}} </p>
              <div class="form-footer">
                  <button class=" btn-default"
									:class="oldPwd.length == 8 && newPwd.length == 8 ? 'btn-main' : 'btn-light-main'"
									:disabled="oldPwd.length == 8 && newPwd.length == 8 ? false : true"
									@click="submitPayEdit">提交</button>
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
			showStep1: true,
			showStep2: false,
			showSmsTips: '',
			oldPwd: '',
			newPwd: '',
			newPwdType: "password",
			codeNo: '',
			isAbled1: true,
			smsText: '获取验证码',
			oldPwdLength: 0,			
			newPwdLength: 0,			
		}
	},
	computed:{
		...mapState({
			loginState: 'loginState',
			storeInfo: 'storeInfo',
			userInfo: 'userInfo'
		})
	},
	watch:{
		oldPwd(curVal){
			this.oldPwd = this.oldPwd.replace(/[\W]/g,'');
			this.oldPwdLength = curVal.length;
		},
		newPwd(curVal){
			this.newPwd = this.newPwd.replace(/[\W]/g,'');
			this.newPwdLength = curVal.length;
		},
	},
	methods:{
		// 检查第一步
		checkPhoneCode(){
			this.$api.post(this.$interface.apiurl.checkSmsCodeForKey, {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				code: this.codeNo,
				codeType: 3,
				type: 0
			}, res => {
				setTimeout(()=>{
					this.showStep1 = false;
					this.showStep2 = true;
				},500);
			})
		},
		// 发送验证码
		sendMessageNew(){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				type: 3
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
		// 提交
		submitPayEdit(){
			CommomObj.$loading();
			this.$api.post(this.$interface.apiurl.editPaymentPwdNew,{
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				payPwd: this.oldPwd,
				rePayPwd: this.newPwd,
				phonecode: this.codeNo,
				type: 0
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
		focus(){
				this.$refs.pwd.focus();
		},
		focus2(){
				this.$refs.pwd2.focus();
		},
		checkPaypwd(){
			if(this.oldPwd != this.newPwd){
				this.showSmsTips = "两次密码不一致!";
			}else{
				this.showSmsTips = "";
			}
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
			this.codeNo = '';
			this.$refs.scrollerBottom.reset({top: 0})
		});
		this.showStep1 = true;
		this.showStep2 = false;
	},
}
</script>

<style lang="scss">
	@import "@/base/reset.scss";
	.purch-form .pwd-wrap{
    width: 90%;
    height: 44px;
    padding-bottom: 1px;
    margin: 0 auto;
    background: #fff;
    border:1px solid #ddd;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    cursor: pointer;
  }
  .pwd-wrap li{
    list-style-type:none;
    text-align: center;
    line-height: 44px;
    -webkit-box-flex: 1;
    flex: 1;
    -webkit-flex: 1;
    border-right:1px solid #ddd ;
  }
  .pwd-wrap li:last-child{
    border-right: 0;
  }
  .pwd-wrap li i{
    height: 10px;
    width: 10px;
    border-radius:50% ;
    background: #000;
    display: inline-block;
  }
</style>
