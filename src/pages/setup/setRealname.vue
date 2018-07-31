<template>
<div class="x-scroll">
	<scroller lock-x height="-50px" style="background: #f7f7f7" ref="scrollerBottom">
		<div class="purch bg-f7 my">
      <!-- 步骤一 -->
      <div class="set-phone1" v-show="showStmp1">
        <div class="set-realname-top">
          <img src="../../../static/imgs/realname-temp1.jpg" alt="" width="100%">
          <p class="tc myphone" v-show="shopSuccessTips">短信验证码已发送至 <span class="cr-red">{{myInfo.bind_phone}}</span> <br>请输入验证码。</p>
        </div>
          <div class="purch-form">
              <div class="form-group">
                  <input type="text" id="stepCodeOne" v-model="smsCode1" placeholder="请输入验证码">
                  <span class="xian1 mr10 ml10"></span>
                  <span class="cr-lan" id="sendCodeOneBtn" @click="sendMessageNew">{{smsText}}</span>
              </div>
              <div class="form-footer">
                  <button class=" btn-default btn-main" @click="setPhoneOne">下一步</button>
              </div>
          </div>
      </div>
			<!-- 步骤二 -->
      <div class="set-phone2"  v-show="showStmp2">
          <div class="set-realname-top">
            <img src="../../../static/imgs/realname-temp2.jpg" alt="" width="100%">
          </div>
          <div class="purch-form">
                <div class="form-group">
                    <label for="realName">真实姓名</label>
                    <input type="text" id="realName" v-model="form.relName" placeholder="请输入您的真实姓名">
                </div>
                <div class="form-group">
                    <label for="cardNo">身份证号码</label>
                    <input type="text" id="cardNo" v-model="form.cardNo" placeholder="请输入您的身份证号码">
                </div>
                <div class="form-group">
                    <label for="bankNo">银行卡号</label>
                    <input type="text" id="bankNo" v-model="form.bankNo" placeholder="请输入您的银行卡号">
                </div>
                <div class="form-group">
                    <label for="bankType">银行</label>
                    <select name="shopAddrs" id="bankType" v-model="form.bankType" style="width: 20%;">
                        <option :value="item.id" v-for="(item, index) in bankListData" :key="index">{{item.bank_name}}</option>
                      </select>
                </div>
                <div class="form-group">
                    <label for="bankPhone">预留手机号</label>
                    <input type="text" id="bankPhone" v-model="form.bankPhone" placeholder="请输入银行预留手机号">
                </div>
                <div class="form-group">
                    <label for="codeNo">手机验证码</label>
                    <input type="text" id="codeNo" v-model="form.codeNo" placeholder="请输入验证码" style="width: 100px;">
                    <span class="xian1 mr10 ml10"></span>
                    <span class="cr-lan" id="sendCodeTwoBtn" @click="sendMessageNew2">{{smsText1}}</span>
                </div>

                <div class="form-footer">
                    <button class=" btn-default btn-main" @click="submitSetRelName">提交</button>
                </div>
            </div>
      </div>
      <!-- 认证完成结果 -->
      <div class="set-realname-result js-eliHeight"  v-show="showResult">
          <img src="../../../static/imgs/realname-headpic.png" alt="">
          <p>恭喜您，实名认证成功！</p>
          <div class="border_btm1 mt20"></div>
          <div class="cardBox">
            <div><span>真实姓名</span><span class="cr-999" id="relName">{{bankData.real_name}}</span></div>
            <div><span>性别</span><span class="cr-999" id="relSex">{{bankData.gender == 0 ? '男' : '女'}}</span></div>
            <div><span>身份证号码</span><span class="cr-999" id="relCard">{{bankData.card_number}}</span></div>
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
			showStmp1: false,
			showStmp2: false,
			showResult: false,
			shopSuccessTips: false,
			smsText: '发送验证码',
			isAbled1: true,
			smsCode1: '',
			smsText1: '发送验证码',
			isAbled2: true,
			bankListData: [],
			bankData: [],
			form: {
				relName: '',
				cardNo: '',
				bankNo: '',
				bankType: '',
				bankPhone: '',
				codeNo: ''
			},
			selectBank:{},	
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
		"form.bankNo": {
        handler(newValue, oldValue) {
					if(newValue != ''){
						this.queryBankType(newValue)
					}
      　},deep: true
    　},
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
				codeType: 7,
				type: 0
			}, res => {
				setTimeout(()=>{
					layer.close(CommomObj.loadingIndex)
					this.showStmp1 = false;
					this.showStmp2 = true;
				},500);
			},err=>{
					CommomObj.$tips(err.msg);
					layer.close(CommomObj.loadingIndex)
			})
		},
		// 提交
		submitSetRelName(){
			
			// if(this.form.bankType != ''){
			// 	for (let i = 0; i < this.bankListData.length; i++) {
			// 		if(this.form.bankType == this.bankListData[i].id){
			// 			var _genre = this.bankListData[i].bank_genre;
			// 		}
			// 	}
			// }
			
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				bindPhone: this.form.bankPhone,
				phonecode: this.form.codeNo,
				realName: this.form.relName,
				cardNumber: this.form.cardNo,
				bankTypeId: this.form.bankType,
				bank_genre: this.selectBank.bank_genre,
				bankCard: this.form.bankNo,
				userCode: this.smsCode1,
				type: 0
			}
			if(this.form.relName == ''){
				CommomObj.$tips("请输入真实姓名!");
				return;
			}
			if(this.form.cardNo == ''){
				CommomObj.$tips("请输入身份证号码!");
				return;
			}
			if(this.form.bankNo == ''){
				CommomObj.$tips("请输入银行卡号!");
				return;
			}
			if(this.form.bankType == ''){
				CommomObj.$tips("请选择银行!");
				return;
			}
			if(this.form.bankPhone == '' || this.form.bankPhone.length != 11){
				CommomObj.$tips("请输入正确的手机号码!");
				return;
			}
			if(this.form.codeNo == ''){
				CommomObj.$tips("请输入短信验证码!");
				return;
			}
			CommomObj.$loading();

			this.$api.post(this.$interface.apiurl.bindUserBankNew,params,res=>{
				setTimeout(()=>{
					layer.close(CommomObj.loadingIndex);
					CommomObj.$tips("绑定成功!");
					setTimeout(() => {
						this.$router.go(0);
					}, 1000);
				},500);
			},err=>{
				layer.close(CommomObj.loadingIndex);
				CommomObj.$tips(err.msg);
				setTimeout(() => {
					this.$router.go(0);
				}, 1000);
			})
		},
		// 发送验证码
		sendMessageNew(){
			let _this = this;
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
				type: 7
			}
			this.$api.post(this.$interface.apiurl.sendMessageNew,params,res=>{
				if(_this.isAbled1){
					let o = 120;
					_this.shopSuccessTips = true;
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
				phone: this.form.bankPhone,
				codeType: 7,
				type: 0
			}

			if( this.form.bankPhone == '' ||  this.form.bankPhone.length != 11){
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
		// 检测是否绑定银行卡信息
		checkIdenity(){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
			}
			this.$api.post(this.$interface.apiurl.checkIdenity,params,res=>{
				this.showResult = true;
				this.showStmp1 = false;
				this.bankData = res.data;
			},err=>{
				this.showStmp1 = true;
				this.showResult = false;
			})
		},
		// 获取银行卡列表
		getBankList(){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
			}
			this.$api.post(this.$interface.apiurl.getBankList,params,res=>{
				this.bankListData = res.data;
			})
		},
		// 根据银行卡号查询银行信息
		queryBankType(bankNo){
			let params = {
				appid: this.$interface.$appid,
				mainKey: localStorage.$mainKey,
				tokenKey: localStorage.$tokenKey,
        bankCard: bankNo
			}
			this.$api.post(this.$interface.apiurl.queryBankType,params,res=>{
				this.selectBank = res.data;
				this.form.bankType = res.data.id;
			},err=>{})
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
		this.checkBindPayPwd();
		this.checkIdenity();
		this.getBankList();
		this.$nextTick(() => {
			this.$refs.scrollerBottom.reset({top: 0})
		})
	},
}
</script>

<style lang="scss">
  @import "@/base/reset.scss";
	

</style>
