<template>
  <div class="login">
    <section>
      <div class="logoBox">
        <img class="logo" src="../../static/imgs/login/logo.png" alt="">
        <p class="welcome">欢迎来到润民网</p>
      </div>
    </section>
    <main>
      <div class="ipts">
          <div class="step1" v-show="showStep1">
              <!--用户名-->
              <div class="userName">
                  <span class="headtext">+86</span>
                  <input class="userPhone" type="text" v-model="submitFrom.phone" placeholder="请输入手机号码">
              </div>
              <!-- 图形验证码 -->
              <div style="position: relative;">
                <input class="step2picIpt" type="text" v-model="submitFrom.imgCode" placeholder="请输入图形验证码">
                <img class="getImgCode" :src="'data:image/jpg;base64,'+ imgCode.url" alt="" @click="getImgCode">
              </div>
              <!--短信验证码-->
              <div class="pwd">
                  <input type="text" style="padding-right: 90px;" v-model="submitFrom.smsCode" class="pwdIpt" placeholder="请输入短信验证码">
                  <button class="getPhoneCode" :class="isAbled ? '' : 'active'"  :disabled="isAbled"  @click="checkImgCode">{{smsText}}</button>
              </div>
              <button class="loginBtn" :class="submitFrom.phone != '' && submitFrom.imgCode != '' && submitFrom.smsCode != '' ? 'active' : ''" :disabled="submitFrom.phone != '' && submitFrom.imgCode != '' && submitFrom.smsCode != '' ? false : true " @click="validateStepTwo" >下一步</button>
          </div>
          <div class="step3" v-show="showStep2">
              <!--用户名-->
              <div class="userName">
                  <input class="userIpt" type="text" v-model="submitFrom.userName" placeholder="请输入用户名">
              </div>
              <div class="msg-tips" v-show="warnText1">{{ warnText1 }}</div>
              <!--密码-->
              <div class="pwd">
                  <input type="password" class="pwdIpt" v-model="submitFrom.pwd" placeholder="请输入登录密码">
              </div>
              <div class="msg-tips" v-show="warnText2">{{warnText2}}</div>
              <!--密码-->
              <div class="pwd">
                  <input type="password" class="pwdIpt" v-model="submitFrom.rePwd" placeholder="请输入登录密码">
              </div>
              <div class="msg-tips" v-show="warnText3">{{warnText3}}</div>
              <button class="loginBtn" :class="submitFrom.userName != '' && submitFrom.pwd != '' && submitFrom.rePwd != '' && warnText1 == '' && warnText2 == '' && warnText3 == '' ? 'active' : ''" :disabled="submitFrom.userName != '' && submitFrom.pwd != '' && submitFrom.rePwd != '' && warnText1 == '' && warnText2 == '' && warnText3 == '' ? false : true " @click="submitFromRegister" >马上注册</button>
          </div>
      </div>
    </main>
    <footer>
      <p>客服热线：
        <span>400-107-1988</span>
      </p>
    </footer>
  </div>
</template>
<script>
  import CommomObj from '../utils/commom.js';
  export default {
    data() {
      return {
       showStep1: true,
       showStep2: false,
       imgCode:{
         id:'',
         url: '',
       },
       submitFrom:{
         phone: '',
         imgCode: '',
         smsCode: '',
         userName: '',
         pwd: '',
         rePwd: '',
       },
       isAbled: true,
       smsText: '获取验证码',
       warnText1: '',
       warnText2: '',
       warnText3: '',
      }
    },
    watch:{
      "submitFrom.imgCode": {
        handler(newValue, oldValue) {
          if(newValue == '' ){
            this.isAbled = true;
          }else{
            this.isAbled = false;
          }
      　},deep: true
    　},
      "submitFrom.userName": {
        handler(newValue, oldValue) {
          if(!CommomObj.loginUserName.test(newValue)){
            if(CommomObj.verifyNo.test(newValue)){
                this.warnText1 = "用户名不能为纯数字";
            }else if(CommomObj.verifyLetter.test(newValue)){
              this.warnText1 = "用户名不能为纯字母";
            }else if(CommomObj.delSpace.test(newValue)){
              this.warnText1 = "用户名不能有空格";
            }else{
              this.warnText1 = "5-20为字符，由英文字母、数字、中文组成、纯数字(空格)除外";
            }
          }else{
            this.warnText1 = "";
          }
      　},deep: true
    　},
      "submitFrom.pwd": {
        handler(newValue, oldValue) {
          if(!CommomObj.regLoginPwd.test(newValue)){
            if(CommomObj.verifyNo.test(newValue)){
                this.warnText2 = "密码不能为纯数字";
            }else if(CommomObj.verifyLetter.test(newValue)){
              this.warnText2 = "密码不能为纯字母";
            }else if(CommomObj.delSpace.test(newValue)){
              this.warnText2 = "密码不能有空格";
            }else{
              this.warnText2 = "6-20为字符，由英文字母、数字组成、纯数字除外";
            }
          }else{
            this.warnText2 = "";
            if(newValue == this.submitFrom.rePwd){
              this.warnText3 = "";
            }
          }
      　},deep: true
    　},
      "submitFrom.rePwd": {
        handler(newValue, oldValue) {
          if(!CommomObj.regLoginPwd.test(newValue)){
            if(CommomObj.verifyNo.test(newValue)){
                this.warnText3 = "密码不能为纯数字";
            }else if(CommomObj.verifyLetter.test(newValue)){
              this.warnText3 = "密码不能为纯字母";
            }else if(CommomObj.delSpace.test(newValue)){
              this.warnText3 = "密码不能有空格";
            }else{
              this.warnText3 = "6-20为字符，由英文字母、数字、中文组成、纯数字除外";
            }
          }else{
            if(this.submitFrom.pwd != newValue){
              this.warnText3 = "两次密码不一致,请重新输入!";
            }else{
              this.warnText3 = "";
            }
          }
      　},deep: true
    　},
    },
    computed: {},
    methods: {
      // 获取图形验证码
      getImgCode(){
        this.$api.post(this.$interface.apiurl.getImgCodeBase64, null, res => {
          this.imgCode.id = res.data.validateCodeId;
          this.imgCode.url = res.data.buffImgBase64;
        })
      },
      // 检查图形验证码是否正确并发送短信
      checkImgCode(){
        if(this.submitFrom.phone.length == ''){
          CommomObj.$tips("请输入手机号!");
          return;
        }
        if(this.submitFrom.phone.length != 11){
          CommomObj.$tips("请输入正确的手机号!");
          return;
        }

        this.$api.post(this.$interface.apiurl.checkRegister, {
          loginKey: this.submitFrom.phone
        }, res => {},error => {
           if(error.code == 2007){
             this.$api.post(this.$interface.apiurl.checkImgCode, {
                validateCodeId: this.imgCode.id,
                validateCode: this.submitFrom.imgCode,
              }, res => {
                  this.$getSmsCode(this.submitFrom.phone,this.imgCode.id,this.submitFrom.imgCode,1,0,res=>{ 
                    if(res.code == 0){
                      this.isAbled = true;
                      CommomObj.$tips("发送成功，请注意查收!");
                      let i = 60;
                      this.smsText = i + 'S';
                      const timer = setInterval(()=>{
                        i--;
                        if(i<0){
                          this.isAbled = false;
                          this.smsText = "重新发送";
                          clearInterval(timer);
                        }else{
                          this.smsText = i + 'S';
                        } 
                      },1000)
                    }else{
                      this.getImgCode();
                    }
                  });
              },err=>{
                  CommomObj.$tips(err.msg);
                  setTimeout(()=>{
                    this.getImgCode();
                  },600);
              })
           }else{
             CommomObj.$tips(error.msg)
           }  
        });
        
      },
      // 验证第二步
      validateStepTwo(){
        this.$api.post(this.$interface.apiurl.checkSmsCode, {
          PhoneOrEmail: this.submitFrom.phone,
          code: this.submitFrom.smsCode,
          codeType: 1,
          type: 0
        }, res => {
          this.showStep1 = false;
          this.showStep2 = true;
        })
      },
      submitFromRegister() {
        let _this = this;
        CommomObj.$loading();
        this.$api.post(this.$interface.apiurl.userRegister, { 
          appid: this.$interface.$appid,
          loginKey: this.submitFrom.userName,
          bindPhone: this.submitFrom.phone,
          phoneCode: this.submitFrom.smsCode,
          validateCodeId: this.imgCode.id,
          validateCode: this.submitFrom.imgCode,
          loginPwd: CommomObj.$arsEncrypt(this.submitFrom.pwd),
          reLoginPwd: CommomObj.$arsEncrypt(this.submitFrom.rePwd),
        }, res => {
          CommomObj.$comfirm("注册成功,立刻前往登录!",function(){
            _this.$route.push({path: '/login'});
          });
        })
      }
    },
    mounted() {

    },
    activated() {
      this.getImgCode();
    },beforeRouteEnter (to, from, next) {
      if(from.name == "agreement"){
        next()
      }else{
        next(vm =>{
          vm.$vux.toast.show({text: '非法操作!'});
          vm.$router.back(-1);
        })
      }
    }

  }

</script>
<style lang="scss">
  @import '@/base/login.scss';

</style>
